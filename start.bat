@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    🚀 TeenUp Contest Management System
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

echo ✅ Docker đã được cài đặt

:: Kiểm tra Docker Compose
echo 🔍 Kiểm tra Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose không được cài đặt!
    echo    Vui lòng cài đặt Docker Compose hoặc cập nhật Docker Desktop.
    pause
    exit /b 1
)

echo ✅ Docker Compose đã được cài đặt

:: Kiểm tra Docker daemon
echo 🔍 Kiểm tra Docker daemon...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker daemon không chạy!
    echo    Vui lòng khởi động Docker Desktop và đợi đến khi status "Running"
    pause
    exit /b 1
)

echo ✅ Docker daemon đang chạy

:: Kiểm tra ports
echo 🔍 Kiểm tra ports...
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 đang được sử dụng
    echo    Đang dừng process sử dụng port 3000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

netstat -an | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 8081 đang được sử dụng
    echo    Đang dừng process sử dụng port 8081...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8081"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3306 đang được sử dụng
    echo    Đang dừng process sử dụng port 3306...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3306"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

echo ✅ Ports đã sẵn sàng

:: Kiểm tra .env file
echo 🔍 Kiểm tra file .env...
if not exist ".env" (
    echo ❌ File .env không tồn tại!
    echo    Vui lòng tạo file .env với cấu hình phù hợp.
    pause
    exit /b 1
)

echo ✅ File .env đã tồn tại

:: Dừng containers cũ nếu có
echo 🛑 Dừng containers cũ...
docker compose down >nul 2>&1

:: Xóa containers và networks cũ
echo 🧹 Dọn dẹp containers cũ...
docker compose down --remove-orphans >nul 2>&1

:: Build và khởi động services
echo 🏗️  Build và khởi động services...

echo.
echo 📦 Khởi động MySQL Database...
docker compose up -d db
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động MySQL!
    pause
    exit /b 1
)

:: Đợi MySQL khởi động
echo ⏳ Đợi MySQL khởi động...
:wait_mysql
docker compose exec -T db mysqladmin ping -h localhost -u root -prootpass >nul 2>&1
if %errorlevel% neq 0 (
    echo    MySQL chưa sẵn sàng, đợi thêm...
    timeout /t 5 >nul
    goto wait_mysql
)
echo ✅ MySQL đã sẵn sàng

echo.
echo 🚀 Khởi động Backend...
docker compose up -d backend
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động Backend!
    pause
    exit /b 1
)

:: Đợi Backend khởi động
echo ⏳ Đợi Backend khởi động...
:wait_backend
curl -f http://localhost:8081/api/parents/list >nul 2>&1
if %errorlevel% neq 0 (
    echo    Backend chưa sẵn sàng, đợi thêm...
    timeout /t 10 >nul
    goto wait_backend
)
echo ✅ Backend đã sẵn sàng

echo.
echo 🌐 Khởi động Frontend...
docker compose up -d frontend
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động Frontend!
    pause
    exit /b 1
)

:: Đợi Frontend khởi động
echo ⏳ Đợi Frontend khởi động...
:wait_frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo    Frontend chưa sẵn sàng, đợi thêm...
    timeout /t 5 >nul
    goto wait_frontend
)
echo ✅ Frontend đã sẵn sàng

:: Kiểm tra trạng thái cuối cùng
echo.
echo 📊 Kiểm tra trạng thái services...
docker compose ps

echo.
echo ========================================
echo    🎉 Khởi động thành công!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8081/api
echo 🗄️  Database: localhost:3306
echo.
echo 💡 Lệnh hữu ích:
echo    - Xem logs: docker compose logs -f
echo    - Dừng: docker compose down
echo    - Restart: docker compose restart
echo.
echo Nhấn phím bất kỳ để mở trình duyệt...
pause >nul

:: Mở trình duyệt
start http://localhost:3000

echo.
echo 🚀 Đã mở trình duyệt với ứng dụng!
echo.
pause
