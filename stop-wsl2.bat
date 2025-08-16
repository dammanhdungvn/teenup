@echo off
chcp 65001 >nul

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

:: Dừng tất cả services trong WSL2
echo 🛑 Dừng tất cả services trong WSL2...
wsl docker compose down

echo.
echo 🧹 Dọn dẹp containers và networks trong WSL2...
wsl docker compose down --remove-orphans

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
echo 💡 Truy cập WSL2:
echo    - Mở terminal: wsl
echo    - Chuyển thư mục: cd /mnt/c/Users/%USERNAME%/Downloads/Contest
echo.
pause
