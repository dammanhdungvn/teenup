@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    🛑 TeenUp Contest Management System
echo    ⏹️  Windows + WSL2 Edition
echo    🐧 Dừng tất cả services
echo ========================================
echo.

:: Kiểm tra WSL2
echo 🔍 Kiểm tra WSL2...
wsl --status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ WSL2 không được cài đặt hoặc không chạy!
    echo    Vui lòng cài đặt WSL2 trước.
    pause
    exit /b 1
)

echo ✅ WSL2 đã được cài đặt

:: Kiểm tra WSL2 distribution
echo 🔍 Kiểm tra WSL2 distribution...

:: Hiển thị tất cả distributions có sẵn
echo 📋 Danh sách WSL distributions hiện có:
wsl --list --verbose

:: Kiểm tra các phiên bản Ubuntu phổ biến
set UBUNTU_FOUND=0

:: Kiểm tra Ubuntu-24.04 (có thể có dấu * và khoảng trắng)
wsl --list --verbose | findstr "Ubuntu-24.04" >nul 2>&1
if %errorlevel% equ 0 set UBUNTU_FOUND=1

:: Kiểm tra Ubuntu-22.04 (có thể có dấu * và khoảng trắng)
wsl --list --verbose | findstr "Ubuntu-22.04" >nul 2>&1
if %errorlevel% equ 0 set UBUNTU_FOUND=1

:: Kiểm tra Ubuntu-20.04 (có thể có dấu * và khoảng trắng)
wsl --list --verbose | findstr "Ubuntu-20.04" >nul 2>&1
if %errorlevel% equ 0 set UBUNTU_FOUND=1

:: Kiểm tra Ubuntu-18.04 (có thể có dấu * và khoảng trắng)
wsl --list --verbose | findstr "Ubuntu-18.04" >nul 2>&1
if %errorlevel% equ 0 set UBUNTU_FOUND=1

:: Kiểm tra Ubuntu không có version suffix (có thể có dấu * và khoảng trắng)
wsl --list --verbose | findstr /R "Ubuntu[^-]" >nul 2>&1
if %errorlevel% equ 0 set UBUNTU_FOUND=1

:: Kiểm tra các distributions khác có thể chạy Docker
set LINUX_FOUND=0
wsl --list --verbose | findstr "Debian" >nul 2>&1
if %errorlevel% equ 0 set LINUX_FOUND=1

wsl --list --verbose | findstr "kali" >nul 2>&1
if %errorlevel% equ 0 set LINUX_FOUND=1

wsl --list --verbose | findstr "openSUSE" >nul 2>&1
if %errorlevel% equ 0 set LINUX_FOUND=1

wsl --list --verbose | findstr "Alpine" >nul 2>&1
if %errorlevel% equ 0 set LINUX_FOUND=1

if %UBUNTU_FOUND% equ 0 (
    if %LINUX_FOUND% equ 1 (
        echo ⚠️  Không tìm thấy Ubuntu, nhưng có Linux distribution khác!
        echo    Tiếp tục thử dừng Docker services...
        echo.
    ) else (
        echo ❌ Không tìm thấy Ubuntu hoặc Linux distribution khác trong WSL2!
        echo.
        echo 📋 Các phiên bản Ubuntu khả dụng:
        echo    - Ubuntu (phiên bản mới nhất)
        echo    - Ubuntu 24.04 LTS
        echo    - Ubuntu 22.04 LTS
        echo    - Ubuntu 20.04 LTS
        echo.
        echo 🔧 Để cài đặt Ubuntu:
        echo    1. Mở Microsoft Store
        echo    2. Tìm "Ubuntu" và cài đặt
        echo    3. Chạy Ubuntu lần đầu để setup
        echo.
        echo ℹ️  Hoặc tiếp tục nếu bạn dùng distribution khác...
        echo.
        echo 🤔 Bạn có muốn tiếp tục thử dừng services không? (y/N)
        set /p CONTINUE=
        if /I not "%CONTINUE%"=="y" (
            pause
            exit /b 1
        )
    )
) else (
    echo ✅ Ubuntu distribution đã được cài đặt
)

:: Kiểm tra Docker daemon trong WSL2
echo 🔍 Kiểm tra Docker daemon trong WSL2...
wsl docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker daemon không chạy trong WSL2!
    echo    Services có thể đã được dừng hoặc Docker chưa khởi động.
    echo.
) else (
    echo ✅ Docker daemon đang chạy trong WSL2
)

:: Dừng tất cả services trong WSL2
echo 🛑 Dừng tất cả services trong WSL2...
wsl docker compose down
if %errorlevel% neq 0 (
    echo ⚠️  Có lỗi khi dừng containers, nhưng tiếp tục dọn dẹp...
)

echo.
echo 🧹 Dọn dẹp containers và networks trong WSL2...
wsl docker compose down --remove-orphans
if %errorlevel% neq 0 (
    echo ⚠️  Có lỗi khi dọn dẹp, kiểm tra thủ công nếu cần...
)

:: Tùy chọn dọn dẹp sâu (volume và images)
echo.
echo 🤔 Bạn có muốn dọn dẹp volumes và images không? (y/N)
set /p CLEAN_ALL=
if /I "%CLEAN_ALL%"=="y" (
    echo 🗑️  Dọn dẹp volumes...
    wsl docker compose down -v
    echo 🗑️  Dọn dẹp images không sử dụng...
    wsl docker image prune -f
    echo ✅ Đã dọn dẹp hoàn toàn
) else (
    echo ℹ️  Bỏ qua dọn dẹp volumes và images
)

echo.
echo 📊 Kiểm tra trạng thái trong WSL2...
wsl docker compose ps

echo.
echo ========================================
echo    ✅ Đã dừng tất cả services trong WSL2!
echo ========================================
echo.
echo 💡 Để khởi động lại:
echo    - Windows Native: start.bat  
echo    - Windows + WSL2: start-wsl2.bat
echo.
echo 💡 Lệnh hữu ích (trong WSL2):
echo    - Kiểm tra containers: docker compose ps
echo    - Xem logs cũ: docker compose logs
echo    - Dọn dẹp thêm: docker system prune
echo    - Khởi động Docker: sudo service docker start
echo.
echo 💡 Truy cập WSL2:
echo    - Mở terminal: wsl
echo    - Chuyển thư mục: cd /mnt/c/path/to/your/teenup/project
echo    - Hoặc: cd "$(wslpath 'C:\path\to\your\project')"
echo.
pause
