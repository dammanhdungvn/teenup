#!/bin/bash

# ========================================
# TeenUp Contest Management System
# Docker Startup Script for Linux/macOS
# ========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_error "File .env không tồn tại!"
        echo
        print_status "Tạo file .env từ template..."
        
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Đã tạo .env từ .env.example"
        else
            print_status "Tạo file .env thủ công..."
            cat > .env << 'EOF'
# ========= DATABASE CONFIGURATION =========
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=teenup
MYSQL_USER=teenup
MYSQL_PASSWORD=teenup123

# ========= APPLICATION PORTS =========
FRONTEND_PORT=3000
BACKEND_PORT=8081
DATABASE_PORT=3306

# ========= SPRING BOOT CONFIG =========
SPRING_PROFILES_ACTIVE=dev
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# ========= TIMEZONE =========
TZ=Asia/Bangkok
EOF
            print_success "Đã tạo file .env với giá trị mặc định"
        fi
        
        echo
        print_warning "Vui lòng kiểm tra và chỉnh sửa file .env nếu cần thiết"
        echo "Sau đó chạy lại script này"
        echo
        exit 1
    fi
    
    print_success "File .env đã tồn tại"
}

# Function to check Docker
check_docker() {
    print_status "Kiểm tra Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker không được cài đặt hoặc không có trong PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon không chạy. Vui lòng khởi động Docker"
        exit 1
    fi
    
    print_success "Docker đã sẵn sàng"
}

# Function to check Docker Compose
check_docker_compose() {
    print_status "Kiểm tra Docker Compose..."
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose không khả dụng"
        exit 1
    fi
    
    print_success "Docker Compose đã sẵn sàng"
}

# Function to check ports
check_ports() {
    print_status "Kiểm tra ports..."
    
    local ports=("3000" "8081" "3306")
    local conflicts=()
    
    for port in "${ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            conflicts+=("$port")
        fi
    done
    
    if [ ${#conflicts[@]} -gt 0 ]; then
        print_warning "Các ports sau đang được sử dụng: ${conflicts[*]}"
        print_status "Bạn có thể thay đổi ports trong file .env"
        echo "FRONTEND_PORT=3001"
        echo "BACKEND_PORT=8082"
        echo "MYSQL_PORT=3307"
        echo
    else
        print_success "Tất cả ports đều khả dụng"
    fi
}

# Function to stop existing containers
stop_existing() {
    print_status "Dừng các containers hiện có..."
    
    if docker compose ps --quiet | grep -q .; then
        docker compose down
        print_success "Đã dừng các containers"
    else
        print_status "Không có containers nào đang chạy"
    fi
}

# Function to retry command with exponential backoff
retry_command() {
    local command="$1"
    local max_attempts="${2:-3}"
    local base_delay="${3:-2}"
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Thử lần $attempt/$max_attempts: $command"
        
        if eval "$command"; then
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Lệnh thất bại sau $max_attempts lần thử: $command"
            return 1
        fi
        
        local delay=$((base_delay * attempt))
        print_warning "Lệnh thất bại, thử lại sau ${delay}s..."
        sleep $delay
        ((attempt++))
    done
}

# Function to start services
start_services() {
    print_status "Khởi động các services..."
    
    # Start database first with retry
    print_status "Khởi động database..."
    if ! retry_command "docker compose up -d db" 3 3; then
        print_error "Không thể khởi động database sau nhiều lần thử"
        exit 1
    fi
    
    # Wait for database to be ready
    print_status "Chờ database khởi động..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose exec -T db mysql -u root -prootpass -e "SELECT 1" &> /dev/null; then
            print_success "Database đã sẵn sàng"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Database không khởi động được sau $max_attempts lần thử"
            exit 1
        fi
        
        print_status "Chờ database... (lần thử $attempt/$max_attempts)"
        sleep 2
        ((attempt++))
    done
    
    # Start backend with retry
    print_status "Khởi động backend..."
    if ! retry_command "docker compose up -d backend" 3 5; then
        print_error "Không thể khởi động backend sau nhiều lần thử"
        print_status "Hiển thị logs để debug:"
        docker compose logs backend
        exit 1
    fi
    
    # Wait for backend to be ready
    print_status "Chờ backend khởi động..."
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f http://localhost:8081/api/parents/list &> /dev/null; then
            print_success "Backend đã sẵn sàng"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Backend không khởi động được sau $max_attempts lần thử"
            exit 1
        fi
        
        print_status "Chờ backend... (lần thử $attempt/$max_attempts)"
        sleep 3
        ((attempt++))
    done
    
    # Start frontend with retry
    print_status "Khởi động frontend..."
    if ! retry_command "docker compose up -d frontend" 3 3; then
        print_error "Không thể khởi động frontend sau nhiều lần thử"
        print_status "Hiển thị logs để debug:"
        docker compose logs frontend
        exit 1
    fi
    
    print_success "Tất cả services đã khởi động thành công!"
}

# Function to show status
show_status() {
    echo
    print_status "Trạng thái các services:"
    docker compose ps
    
    echo
    print_status "Logs của các services:"
    docker compose logs --tail=10
}

# Function to show access info
show_access_info() {
    echo
    print_success "🎉 TeenUp Contest Management System đã khởi động thành công!"
    echo
    echo -e "${GREEN}📱 Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}🔧 Backend API:${NC} http://localhost:8081/api"
    echo -e "${GREEN}📋 API Examples:${NC}"
    echo "     Parents: http://localhost:8081/api/parents/list"
    echo "     Students: http://localhost:8081/api/students/list"
    echo "     Classes: http://localhost:8081/api/classes"
    echo -e "${GREEN}🗄️  Database:${NC} localhost:3306"
    echo
    echo -e "${BLUE}📋 Các lệnh hữu ích:${NC}"
    echo "  Xem logs: docker compose logs -f"
    echo "  Dừng services: ./stop.sh"
    echo "  Restart: docker compose restart"
    echo "  Xem status: docker compose ps"
    echo
    echo -e "${BLUE}🔧 Troubleshooting:${NC}"
    echo "  Logs backend: docker compose logs backend"
    echo "  Logs frontend: docker compose logs frontend"
    echo "  Logs database: docker compose logs db"
    echo "  Reset data: docker compose down -v && ./start.sh"
    echo
}

# Main execution
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  🚀 TeenUp Contest Management System${NC}"
    echo -e "${BLUE}  🐧 Linux/macOS Edition${NC}"
    echo -e "${BLUE}  Docker Startup Script${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo
    
    # Check prerequisites
    check_env_file
    check_docker
    check_docker_compose
    check_ports
    
    # Stop existing containers
    stop_existing
    
    # Start services
    start_services
    
    # Show status and access info
    show_status
    show_access_info
}

# Run main function
main "$@"
