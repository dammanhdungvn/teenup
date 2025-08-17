@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM 🚀 TeenUp Contest Management System
REM Universal Control Script for Windows
REM Auto-detects environment and runs appropriate scripts
REM ========================================

cls
echo.
echo ========================================
echo    🚀 TeenUp Contest Management System
echo    🪟 Windows Universal Control Script
echo ========================================
echo.

REM Function to detect environment
call :detect_environment

REM Handle command line arguments
if "%~1"=="start" goto execute_start
if "%~1"=="run" goto execute_start
if "%~1"=="stop" goto execute_stop
if "%~1"=="down" goto execute_stop
if "%~1"=="health" goto execute_health
if "%~1"=="check" goto execute_health
if "%~1"=="status" goto show_status
if "%~1"=="ps" goto show_status
if "%~1"=="info" goto show_info
if "%~1"=="help" goto show_info
if not "%~1"=="" (
    echo ❌ Unknown command: %~1
    goto show_info
)

REM Interactive mode
:main_menu
echo 📋 Available Actions:
echo   1^) 🚀 Start system
echo   2^) 🛑 Stop system  
echo   3^) 🔍 Health check
echo   4^) 📊 Show status
echo   5^) 📝 Show info
echo   6^) 🚪 Exit
echo.

set /p choice="Please select an option (1-6): "

if "%choice%"=="1" goto execute_start
if "%choice%"=="2" goto execute_stop
if "%choice%"=="3" goto execute_health
if "%choice%"=="4" goto show_status_interactive
if "%choice%"=="5" goto show_info_interactive
if "%choice%"=="6" goto exit_script

echo ❌ Invalid option. Please choose 1-6.
echo.
pause
goto main_menu

REM Environment detection
:detect_environment
echo 🔍 Detecting Windows environment...

REM Check if Docker is installed first
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không được cài đặt!
    echo    Vui lòng cài đặt Docker Desktop từ: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker is using WSL backend
echo    Kiểm tra Docker backend...
docker info 2>nul | findstr /i "wsl" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker đang dùng WSL backend
    REM Kiểm tra WSL có sẵn không
    wsl --status >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ WSL detected và sẵn sàng
        set "ENV_TYPE=WSL"
        set "ENV_DESC=Windows với Docker WSL backend"
        goto :eof
    ) else (
        echo ⚠️  Docker dùng WSL nhưng WSL không sẵn sàng
        echo    Chuyển sang Native Windows mode
    )
)

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker không chạy!
    echo    Vui lòng khởi động Docker Desktop
    pause
    exit /b 1
)

REM Check if WSL is available (fallback)
wsl --status >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ WSL có sẵn nhưng Docker dùng native
    echo    Ưu tiên Docker native mode
    set "ENV_TYPE=WINDOWS"
    set "ENV_DESC=Native Windows environment"
    goto :eof
)

REM Default to native Windows
echo ✅ Native Windows detected
set "ENV_TYPE=WINDOWS"
set "ENV_DESC=Native Windows environment"
goto :eof

REM Execution functions
:execute_start
echo.
echo 🚀 Starting TeenUp Contest Management System...
echo 📋 Environment: %ENV_DESC%
echo 📁 Current directory: %CD%
echo.

if "%ENV_TYPE%"=="WSL" (
    echo 🐧 Using WSL scripts...
    echo 🔍 Looking for: scripts\start-windows-wsl.bat
    if exist "scripts\start-windows-wsl.bat" (
        echo ✅ Found WSL script, executing...
        call "scripts\start-windows-wsl.bat"
    ) else (
        echo ❌ WSL start script not found: scripts\start-windows-wsl.bat
        echo 📋 Available scripts:
        dir /b scripts\*.bat scripts\*.sh 2>nul || echo    No scripts found
        pause
    )
) else (
    echo 🪟 Using native Windows scripts...
    echo 🔍 Looking for: scripts\start-native.bat
    if exist "scripts\start-native.bat" (
        echo ✅ Found native script, executing...
        call "scripts\start-native.bat"
    ) else (
        echo ❌ Native start script not found: scripts\start-native.bat
        echo 📋 Available scripts:
        dir /b scripts\*.bat scripts\*.sh 2>nul || echo    No scripts found
        pause
    )
)
goto :eof

:execute_stop
echo.
echo 🛑 Stopping TeenUp Contest Management System...
echo 📋 Environment: %ENV_DESC%
echo.

if "%ENV_TYPE%"=="WSL" (
    echo 🐧 Using WSL scripts...
    if exist "scripts\stop-windows-wsl.bat" (
        call "scripts\stop-windows-wsl.bat"
    ) else (
        echo ❌ WSL stop script not found: scripts\stop-windows-wsl.bat
        echo 📋 Available scripts:
        dir /b scripts\*.bat scripts\*.sh 2>nul || echo    No scripts found
        pause
    )
) else (
    echo 🪟 Using native Windows scripts...
    if exist "scripts\stop-native.bat" (
        call "scripts\stop-native.bat"
    ) else (
        echo ❌ Native stop script not found: scripts\stop-native.bat
        echo 📋 Available scripts:
        dir /b scripts\*.bat scripts\*.sh 2>nul || echo    No scripts found
        pause
    )
)
goto :eof

:execute_health
echo.
echo 🔍 Running health check...
echo.

if exist "scripts\docker-healthcheck.bat" (
    call "scripts\docker-healthcheck.bat"
) else (
    echo ❌ Health check script not found: scripts\docker-healthcheck.bat
    pause
)
goto :eof

:show_status
echo.
echo 📊 System Status:
echo.

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker is installed
    docker compose ps 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Docker Compose is working
    ) else (
        echo ⚠️  Docker Compose not running
    )
) else (
    echo ❌ Docker not found
)

echo.
echo 📁 Available scripts:
if exist "scripts" (
    dir /b scripts\*.bat scripts\*.sh 2>nul | findstr /v "^$"
) else (
    echo ❌ Scripts directory not found
)
goto :eof

:show_status_interactive
call :show_status
echo.
pause
goto main_menu

:show_info
echo.
echo 🔧 TeenUp Management System Info
echo.
echo 📱 URLs (when running):
echo   Frontend:    http://localhost:3000
echo   Backend API: http://localhost:8081/api  
echo   Database:    localhost:3306
echo.
echo 📋 Environment: %ENV_DESC%
echo.
echo 📚 Documentation:
echo   README.md       - Hướng dẫn nhanh
echo   docs\README.md  - Tài liệu đầy đủ
echo   docs\API.md     - API documentation
echo.
echo 📁 Structure:
echo   scripts\     - Control scripts
echo   frontend\    - React app
echo   backend\     - Spring Boot API
echo.
echo 💡 Manual Commands:

if "%ENV_TYPE%"=="WSL" (
    echo   Start:  scripts\start-windows-wsl.bat
    echo   Stop:   scripts\stop-windows-wsl.bat
) else (
    echo   Start:  scripts\start-native.bat
    echo   Stop:   scripts\stop-native.bat
)
echo   Health: scripts\docker-healthcheck.bat
echo.
echo 💡 Command Line Usage:
echo   teenup.bat start    - Start the system
echo   teenup.bat stop     - Stop the system
echo   teenup.bat health   - Run health check
echo   teenup.bat status   - Show status
echo   teenup.bat info     - Show this info
echo.
goto :eof

:show_info_interactive
call :show_info
pause
goto main_menu

:exit_script
echo.
echo ✅ Goodbye! 👋
echo.
pause
exit /b 0
