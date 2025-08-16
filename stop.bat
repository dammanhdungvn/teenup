@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    🛑 TeenUp Contest Management System
echo    🪟 Windows Native Edition
echo    ⏹️  Dừng tất cả services
echo ========================================
echo.

:: Kiểm tra Docker Desktop
echo 🔍 Kiểm tra Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không được cài đặt hoặc không chạy!
    echo    Vui lòng cài đặt Docker Desktop và khởi động lại.
    echo    Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker Desktop đã được cài đặt

:: Kiểm tra Docker daemon
echo 🔍 Kiểm tra Docker daemon...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker daemon không chạy!
    echo    Services có thể đã được dừng hoặc Docker chưa khởi động.
    echo.
) else (
    echo ✅ Docker daemon đang chạy
)

:: Dừng tất cả services
echo 🛑 Dừng tất cả services...
docker compose down
if %errorlevel% neq 0 (
    echo ⚠️  Có lỗi khi dừng containers, nhưng tiếp tục dọn dẹp...
)

echo.
echo 🧹 Dọn dẹp containers và networks...
docker compose down --remove-orphans
if %errorlevel% neq 0 (
    echo ⚠️  Có lỗi khi dọn dẹp, kiểm tra thủ công nếu cần...
)

:: Tùy chọn dọn dẹp sâu (volume và images)
echo.
echo 🤔 Bạn có muốn dọn dẹp volumes và images không? (y/N)
set /p CLEAN_ALL=
if /I "%CLEAN_ALL%"=="y" (
    echo 🗑️  Dọn dẹp volumes...
    docker compose down -v
    echo �️  Dọn dẹp images không sử dụng...
    docker image prune -f
    echo ✅ Đã dọn dẹp hoàn toàn
) else (
    echo ℹ️  Bỏ qua dọn dẹp volumes và images
)

echo.
echo �📊 Kiểm tra trạng thái...
docker compose ps

echo.
echo ========================================
echo    ✅ Đã dừng tất cả services!
echo ========================================
echo.
echo 💡 Để khởi động lại:
echo    - Windows Native: start.bat
echo    - Windows + WSL2: start-wsl2.bat
echo.
echo 💡 Lệnh hữu ích:
echo    - Kiểm tra containers: docker compose ps
echo    - Xem logs cũ: docker compose logs
echo    - Dọn dẹp thêm: docker system prune
echo    - Khởi động Docker Desktop: start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
echo.
pause
