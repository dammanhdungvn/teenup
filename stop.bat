@echo off
chcp 65001 >nul

echo.
echo ========================================
echo    🛑 TeenUp Contest Management System
echo    ⏹️  Dừng tất cả services
echo ========================================
echo.

:: Kiểm tra Docker
echo 🔍 Kiểm tra Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không được cài đặt hoặc không chạy!
    echo    Vui lòng cài đặt Docker Desktop và khởi động lại.
    pause
    exit /b 1
)

echo ✅ Docker đã được cài đặt

:: Dừng tất cả services
echo 🛑 Dừng tất cả services...
docker compose down

echo.
echo 🧹 Dọn dẹp containers và networks...
docker compose down --remove-orphans

echo.
echo 📊 Kiểm tra trạng thái...
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
pause
