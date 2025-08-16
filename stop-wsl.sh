#!/bin/bash

# ========================================
# TeenUp Contest Management System  
# WSL Docker Stop Script for Windows
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

# Function to check if running in WSL
check_wsl() {
    if ! grep -q Microsoft /proc/version; then
        print_error "Đây không phải là WSL environment!"
        print_error "Vui lòng sử dụng script phù hợp:"
        echo "  - Linux/macOS native: ./stop.sh"
        echo "  - Windows native: stop.bat"
        echo "  - Windows WSL2: stop-wsl2.bat"
        exit 1
    fi
    
    print_success "Đang chạy trong WSL environment"
}

# Function to check Docker
check_docker() {
    print_status "Kiểm tra Docker trong WSL..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker không được cài đặt trong WSL"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_warning "Docker daemon không chạy. Services có thể đã được dừng."
        echo
    else
        print_success "Docker daemon đang chạy trong WSL"
    fi
}

# Function to stop services
stop_services() {
    print_status "Dừng tất cả services trong WSL..."
    
    if docker compose ps --quiet | grep -q .; then
        if ! docker compose down; then
            print_warning "Có lỗi khi dừng containers, nhưng tiếp tục dọn dẹp..."
        fi
    else
        print_status "Không có containers nào đang chạy"
    fi
    
    print_status "Dọn dẹp containers và networks..."
    docker compose down --remove-orphans 2>/dev/null || print_warning "Có lỗi khi dọn dẹp, nhưng tiếp tục..."
}

# Function to clean up volumes and images
cleanup_deep() {
    echo
    echo -n "🤔 Bạn có muốn dọn dẹp volumes và images không? (y/N): "
    read -r CLEAN_ALL
    
    if [[ "$CLEAN_ALL" =~ ^[Yy]$ ]]; then
        print_status "Dọn dẹp volumes..."
        docker compose down -v 2>/dev/null || true
        
        print_status "Dọn dẹp images không sử dụng..."
        docker image prune -f 2>/dev/null || true
        
        print_success "Đã dọn dẹp hoàn toàn"
    else
        print_status "Bỏ qua dọn dẹp volumes và images"
    fi
}

# Function to show final status
show_status() {
    echo
    print_status "Kiểm tra trạng thái cuối cùng..."
    docker compose ps 2>/dev/null || true
}

# Function to show useful info
show_info() {
    echo
    print_success "✅ Đã dừng tất cả services trong WSL!"
    echo
    echo -e "${BLUE}💡 Để khởi động lại:${NC}"
    echo "  - WSL script: ./start-wsl.sh"
    echo "  - Windows WSL2 batch: start-wsl2.bat"
    echo "  - Windows native: start.bat"
    echo "  - Linux/macOS: ./start.sh"
    echo
    echo -e "${BLUE}💡 Lệnh hữu ích (trong WSL):${NC}"
    echo "  - Kiểm tra containers: docker compose ps"
    echo "  - Xem logs cũ: docker compose logs"
    echo "  - Dọn dẹp thêm: docker system prune"
    echo "  - Khởi động Docker: sudo service docker start"
    echo
    echo -e "${BLUE}💡 WSL Notes:${NC}"
    echo "  - Services đã dừng trong WSL environment"
    echo "  - Windows ports đã được giải phóng"
    echo "  - Data được giữ lại (trừ khi bạn chọn xóa)"
    echo
}

# Main execution
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  🛑 TeenUp Contest Management System${NC}"
    echo -e "${BLUE}  🪟 Windows WSL Edition${NC}"
    echo -e "${BLUE}  ⏹️  Dừng tất cả services${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo
    
    # Check WSL and Docker
    check_wsl
    check_docker
    
    # Stop services
    stop_services
    
    # Cleanup option
    cleanup_deep
    
    # Show status
    show_status
    
    # Show info
    show_info
}

# Run main function
main "$@"
