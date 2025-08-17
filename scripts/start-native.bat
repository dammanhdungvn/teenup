@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    🚀 TeenUp Contest Management System
echo    🪟 Windows Native Edition
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
    echo.
    echo 📝 Tạo file .env từ template...
    
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Đã tạo .env từ .env.example
    ) else (
        echo 📝 Tạo file .env thủ công...
        (
            echo # ========= DATABASE CONFIGURATION =========
            echo MYSQL_ROOT_PASSWORD=rootpass
            echo MYSQL_DATABASE=teenup
            echo MYSQL_USER=teenup
            echo MYSQL_PASSWORD=teenup123
            echo.
            echo # ========= APPLICATION PORTS =========
            echo FRONTEND_PORT=3000
            echo BACKEND_PORT=8081
            echo DATABASE_PORT=3306
            echo.
            echo # ========= SPRING BOOT CONFIG =========
            echo SPRING_PROFILES_ACTIVE=dev
            echo SPRING_JPA_HIBERNATE_DDL_AUTO=update
            echo.
            echo # ========= TIMEZONE =========
            echo TZ=Asia/Bangkok
        ) > .env
        echo ✅ Đã tạo file .env với giá trị mặc định
    )
    
    echo.
    echo ⚠️  Vui lòng kiểm tra và chỉnh sửa file .env nếu cần thiết
    echo    Sau đó chạy lại script này
    echo.
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
set MAX_ATTEMPTS=30
set ATTEMPT=1

:wait_backend
echo    Kiểm tra backend... (lần %ATTEMPT%/%MAX_ATTEMPTS%)

:: Kiểm tra curl có sẵn không
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    :: Dùng curl nếu có sẵn
    curl -f -s http://localhost:8081/api/parents/list >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Backend đã sẵn sàng
        goto backend_ready
    )
) else (
    :: Dùng PowerShell nếu không có curl
    powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8081/api/parents/list' -UseBasicParsing -TimeoutSec 5 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Backend đã sẵn sàng
        goto backend_ready
    )
)

set /a ATTEMPT+=1
if %ATTEMPT% gtr %MAX_ATTEMPTS% (
    echo ❌ Backend không khởi động được sau %MAX_ATTEMPTS% lần thử
    echo 💡 Kiểm tra logs: docker compose logs backend
    pause
    exit /b 1
)

timeout /t 5 >nul
goto wait_backend

:backend_ready

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
set MAX_ATTEMPTS_FE=20
set ATTEMPT_FE=1

:wait_frontend
echo    Kiểm tra frontend... (lần %ATTEMPT_FE%/%MAX_ATTEMPTS_FE%)

:: Kiểm tra curl có sẵn không
curl --version >nul 2>&1
if %errorlevel% equ 0 (
    :: Dùng curl nếu có sẵn
    curl -f -s http://localhost:3000 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Frontend đã sẵn sàng
        goto frontend_ready
    )
) else (
    :: Dùng PowerShell nếu không có curl
    powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Frontend đã sẵn sàng
        goto frontend_ready
    )
)

set /a ATTEMPT_FE+=1
if %ATTEMPT_FE% gtr %MAX_ATTEMPTS_FE% (
    echo ❌ Frontend không khởi động được sau %MAX_ATTEMPTS_FE% lần thử
    echo 💡 Kiểm tra logs: docker compose logs frontend
    pause
    exit /b 1
)

timeout /t 3 >nul
goto wait_frontend

:frontend_ready

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
echo    - Dừng: docker compose down (hoặc stop.bat)
echo    - Restart: docker compose restart
echo    - Xem status: docker compose ps
echo.
echo 💡 Troubleshooting:
echo    - Logs backend: docker compose logs backend
echo    - Logs frontend: docker compose logs frontend
echo    - Logs database: docker compose logs db
echo.
echo Nhấn phím bất kỳ để mở trình duyệt...
pause >nul

:: Mở trình duyệt
start http://localhost:3000

echo.
echo 🚀 Đã mở trình duyệt với ứng dụng!
echo.
pause
