@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    🚀 TeenUp Contest Management System
echo    🐧 Windows + WSL2 Edition
echo ========================================
echo.

:: Kiểm tra WSL2
echo 🔍 Kiểm tra WSL2...
wsl --status >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ WSL2 không được cài đặt hoặc không chạy!
    echo    Vui lòng cài đặt WSL2 trước:
    echo    1. Mở PowerShell với quyền Administrator
    echo    2. Chạy: wsl --install
    echo    3. Restart máy tính
    echo    4. Chạy: wsl --set-default-version 2
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
        echo    Docker có thể hoạt động với distribution này.
        echo    Tiếp tục thử khởi động services...
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
        echo 🔧 Hướng dẫn cài đặt:
        echo    1. Mở Microsoft Store
        echo    2. Tìm một trong các phiên bản Ubuntu trên
        echo    3. Cài đặt phiên bản bạn muốn
        echo    4. Chạy Ubuntu lần đầu để setup user/password
        echo.
        echo 💡 Khuyến nghị: Ubuntu 22.04 LTS hoặc Ubuntu 24.04 LTS
        echo.
        echo 🤔 Bạn có muốn tiếp tục với distribution hiện có không? (y/N)
        set /p CONTINUE=
        if /I not "%CONTINUE%"=="y" (
            pause
            exit /b 1
        )
    )
) else (
    echo ✅ Ubuntu distribution đã được cài đặt
)

:: Kiểm tra Docker trong WSL2
echo 🔍 Kiểm tra Docker trong WSL2...
wsl docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không được cài đặt trong WSL2!
    echo    Vui lòng cài đặt Docker trong WSL2:
    echo    1. Mở WSL2 terminal
    echo    2. Chạy: curl -fsSL https://get.docker.com -o get-docker.sh
    echo    3. Chạy: sudo sh get-docker.sh
    echo    4. Chạy: sudo usermod -aG docker $USER
    echo    5. Logout và login lại WSL2
    pause
    exit /b 1
)

echo ✅ Docker đã được cài đặt trong WSL2

:: Kiểm tra Docker Compose trong WSL2
echo 🔍 Kiểm tra Docker Compose trong WSL2...
wsl docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose không được cài đặt trong WSL2!
    echo    Vui lòng cài đặt Docker Compose:
    echo    1. Mở WSL2 terminal
    echo    2. Chạy: sudo apt update
    echo    3. Chạy: sudo apt install docker-compose-plugin
    pause
    exit /b 1
)

echo ✅ Docker Compose đã được cài đặt trong WSL2

:: Kiểm tra Docker daemon trong WSL2
echo 🔍 Kiểm tra Docker daemon trong WSL2...
wsl docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker daemon không chạy trong WSL2!
    echo    Vui lòng khởi động Docker daemon:
    echo    1. Mở WSL2 terminal
    echo    2. Chạy: sudo service docker start
    echo    3. Chạy: sudo chmod 666 /var/run/docker.sock
    pause
    exit /b 1
)

echo ✅ Docker daemon đang chạy trong WSL2

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
            echo # ========================================
            echo # TeenUp Contest Management System
            echo # Environment Variables
            echo # ========================================
            echo.
            echo # Database Configuration
            echo MYSQL_ROOT_PASSWORD=rootpass
            echo MYSQL_DATABASE=teenup_contest
            echo MYSQL_USER=contest_user
            echo MYSQL_PASSWORD=contest_pass
            echo.
            echo # Backend Configuration
            echo SPRING_PROFILES_ACTIVE=docker
            echo SERVER_PORT=8081
            echo.
            echo # Frontend Configuration
            echo VITE_DOCKER=true
            echo VITE_API_BASE_URL=http://localhost:8081
            echo VITE_USE_PROXY=false
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
wsl docker compose down >nul 2>&1

:: Xóa containers và networks cũ
echo 🧹 Dọn dẹp containers cũ...
wsl docker compose down --remove-orphans >nul 2>&1

:: Build và khởi động services trong WSL2
echo 🏗️  Build và khởi động services trong WSL2...

echo.
echo 📦 Khởi động MySQL Database...
wsl docker compose up -d db
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động MySQL!
    pause
    exit /b 1
)

:: Đợi MySQL khởi động
echo ⏳ Đợi MySQL khởi động...
:wait_mysql
wsl docker compose exec -T db mysqladmin ping -h localhost -u root -prootpass >nul 2>&1
if %errorlevel% neq 0 (
    echo    MySQL chưa sẵn sàng, đợi thêm...
    timeout /t 5 >nul
    goto wait_mysql
)
echo ✅ MySQL đã sẵn sàng

echo.
echo 🚀 Khởi động Backend...
wsl docker compose up -d backend
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động Backend!
    pause
    exit /b 1
)

:: Đợi Backend khởi động
echo ⏳ Đợi Backend khởi động...
:wait_backend
wsl curl -f http://localhost:8081/api/parents/list >nul 2>&1
if %errorlevel% neq 0 (
    echo    Backend chưa sẵn sàng, đợi thêm...
    timeout /t 10 >nul
    goto wait_backend
)
echo ✅ Backend đã sẵn sàng

echo.
echo 🌐 Khởi động Frontend...
wsl docker compose up -d frontend
if %errorlevel% neq 0 (
    echo ❌ Không thể khởi động Frontend!
    pause
    exit /b 1
)

:: Đợi Frontend khởi động
echo ⏳ Đợi Frontend khởi động...
:wait_frontend
wsl curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo    Frontend chưa sẵn sàng, đợi thêm...
    timeout /t 5 >nul
    goto wait_frontend
)
echo ✅ Frontend đã sẵn sàng

:: Kiểm tra trạng thái cuối cùng
echo.
echo 📊 Kiểm tra trạng thái services...
wsl docker compose ps

echo.
echo ========================================
echo    🎉 Khởi động thành công trong WSL2!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8081/api
echo � API Docs: http://localhost:8081/api-docs
echo �🗄️  Database: localhost:3306
echo.
echo 💡 Lệnh hữu ích (trong WSL2):
echo    - Xem logs: docker compose logs -f
echo    - Dừng: stop-wsl2.bat
echo    - Restart: docker compose restart
echo    - Xem status: docker compose ps
echo.
echo 💡 Truy cập WSL2:
echo    - Mở terminal: wsl
echo    - Chuyển thư mục: cd /mnt/c/path/to/your/teenup/project
echo    - Hoặc: cd "$(wslpath 'C:\path\to\your\project')"
echo.
echo Nhấn phím bất kỳ để mở trình duyệt...
pause >nul

:: Mở trình duyệt
start http://localhost:3000

echo.
echo 🚀 Đã mở trình duyệt với ứng dụng!
echo.
echo 💡 Lưu ý WSL2:
echo    - Services chạy trong WSL2 environment
echo    - Ports được forward từ WSL2 đến Windows
echo    - Performance tốt hơn so với Docker Desktop
echo.
pause
