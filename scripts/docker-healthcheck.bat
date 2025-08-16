@echo off
chcp 65001 >nul

echo.
echo ========================================
echo    🔍 TeenUp Contest Management System
echo    ✅ Pre-flight Check for Windows
echo ========================================
echo.

:: Kiểm tra Docker Desktop
echo 🔍 Kiểm tra Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không được cài đặt hoặc không chạy!
    echo    Vui lòng cài đặt Docker Desktop và khởi động lại.
    echo    Download: https://www.docker.com/products/docker-desktop
    echo.
    echo 💡 Hướng dẫn cài đặt:
    echo    1. Download Docker Desktop từ link trên
    echo    2. Cài đặt với quyền Administrator
    echo    3. Restart máy tính
    echo    4. Khởi động Docker Desktop
    echo    5. Đợi đến khi status "Running"
    echo.
    pause
    exit /b 1
)

for /f "tokens=3" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo ✅ Docker đã được cài đặt: %DOCKER_VERSION%

:: Kiểm tra Docker Compose
echo.
echo 🔍 Kiểm tra Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose không được cài đặt!
    echo    Vui lòng cài đặt Docker Compose hoặc cập nhật Docker Desktop.
    echo.
    echo 💡 Hướng dẫn cài đặt:
    echo    1. Cập nhật Docker Desktop lên phiên bản mới nhất
    echo    2. Hoặc cài đặt Docker Compose riêng biệt
    pause
    exit /b 1
)

for /f "tokens=3" %%i in ('docker compose version') do set COMPOSE_VERSION=%%i
echo ✅ Docker Compose đã được cài đặt: %COMPOSE_VERSION%

:: Kiểm tra Docker daemon
echo.
echo 🔍 Kiểm tra Docker daemon...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker daemon không chạy!
    echo    Vui lòng khởi động Docker Desktop và đợi đến khi status "Running"
    echo.
    echo 💡 Khắc phục:
    echo    1. Mở Docker Desktop
    echo    2. Đợi đến khi status hiển thị "Running"
    echo    3. Kiểm tra icon Docker trong system tray
    pause
    exit /b 1
)

echo ✅ Docker daemon đang chạy

:: Kiểm tra ports
echo.
echo 🔍 Kiểm tra ports...
echo    Port 3000 (Frontend)...
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠️  Port 3000 đang được sử dụng
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        echo       Process ID: %%a
    )
) else (
    echo    ✅ Port 3000 sẵn sàng
)

echo    Port 8081 (Backend)...
netstat -an | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠️  Port 8081 đang được sử dụng
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do (
        echo       Process ID: %%a
    )
) else (
    echo    ✅ Port 8081 sẵn sàng
)

echo    Port 3306 (Database)...
netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ⚠️  Port 3306 đang được sử dụng
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3306"') do (
        echo       Process ID: %%a
    )
) else (
    echo    ✅ Port 3306 sẵn sàng
)

:: Kiểm tra .env file
echo.
echo 🔍 Kiểm tra file .env...
if not exist ".env" (
    echo ❌ File .env không tồn tại!
    echo    Vui lòng tạo file .env với cấu hình phù hợp.
    echo.
    echo 💡 Tạo file .env:
    echo    1. Copy từ env.example: copy env.example .env
    echo    2. Hoặc tạo mới với nội dung cơ bản
    pause
    exit /b 1
)

echo ✅ File .env đã tồn tại

:: Kiểm tra Docker resources
echo.
echo 🔍 Kiểm tra Docker resources...
docker system df

echo.
echo ========================================
echo    ✅ Pre-flight Check hoàn thành!
echo ========================================
echo.
echo 🚀 Bạn có thể khởi động hệ thống:
echo    - Windows Native: start.bat
echo    - Windows + WSL2: start-wsl2.bat
echo.
echo 💡 Nếu có vấn đề với ports:
echo    - Dừng services local: net stop mysql, net stop nginx
echo    - Hoặc kill process: taskkill /PID <PID> /F
echo.
pause
