#!/bin/bash

# ========================================
# TeenUp Contest Management System
# Docker Stop Script for Linux/macOS
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}� [INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [ERROR]${NC} $1"
}

echo -e "${PURPLE}========================================${NC}"
echo -e "${PURPLE}  �🛑 TeenUp Contest Management System${NC}"
echo -e "${PURPLE}  ⏹️  Linux/macOS Edition${NC}"
echo -e "${PURPLE}  🐧 Dừng tất cả services${NC}"
echo -e "${PURPLE}========================================${NC}"
echo

# Check if Docker is running
print_status "Kiểm tra Docker..."
if ! docker info &> /dev/null; then
    print_warning "Docker daemon không chạy hoặc không có quyền truy cập"
    print_status "Services có thể đã được dừng"
else
    print_success "Docker daemon đang chạy"
fi

# Stop all services
print_status "Dừng tất cả services..."
if docker compose down; then
    print_success "Đã dừng containers"
else
    print_warning "Có lỗi khi dừng containers, nhưng tiếp tục dọn dẹp..."
fi

echo
print_status "Dọn dẹp containers và networks..."
if docker compose down --remove-orphans; then
    print_success "Đã dọn dẹp containers và networks"
else
    print_warning "Có lỗi khi dọn dẹp, kiểm tra thủ công nếu cần..."
fi

# Option for deep cleanup
echo
echo -e "${YELLOW}🤔 Bạn có muốn dọn dẹp volumes và images không? (y/N)${NC}"
read -r CLEAN_ALL

if [[ "$CLEAN_ALL" =~ ^[Yy]$ ]]; then
    print_status "Dọn dẹp volumes..."
    docker compose down -v
    print_status "Dọn dẹp images không sử dụng..."
    docker image prune -f
    print_success "Đã dọn dẹp hoàn toàn"
else
    print_status "Bỏ qua dọn dẹp volumes và images"
fi

echo
print_status "Kiểm tra trạng thái..."
docker compose ps

echo
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Đã dừng tất cả services!${NC}"
echo -e "${GREEN}========================================${NC}"
echo
echo -e "${BLUE}� Để khởi động lại:${NC}"
echo "  - Linux/macOS: ./start.sh"
echo "  - Windows Native: start.bat"
echo "  - Windows + WSL2: start-wsl2.bat"
echo
echo -e "${BLUE}� Lệnh hữu ích:${NC}"
echo "  - Kiểm tra containers: docker compose ps"
echo "  - Xem logs cũ: docker compose logs"
echo "  - Dọn dẹp thêm: docker system prune"
echo "  - Khởi động Docker: sudo systemctl start docker"
echo
