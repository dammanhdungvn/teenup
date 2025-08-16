@echo off
chcp 65001 >nul
echo 🔍 Docker Status Check
echo ======================

REM Check Docker daemon
echo 🐳 Docker Daemon:
docker info >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Docker is running
    docker --version
    docker compose version
) else (
    echo    ❌ Docker is not running
    echo    💡 Start Docker Desktop first
    pause
    exit /b 1
)

echo.

REM Check ports
echo 🔌 Port Availability:
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ❌ Port 3000 is in use
) else (
    echo    ✅ Port 3000 is available
)

netstat -an | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ❌ Port 8081 is in use
) else (
    echo    ✅ Port 8081 is available
)

netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% equ 0 (
    echo    ❌ Port 3306 is in use
) else (
    echo    ✅ Port 3306 is available
)

echo.

REM Check Docker Compose
echo 📋 Docker Compose:
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ docker compose v2 found (recommended)
    docker compose version
) else (
    echo    ❌ docker compose v2 not found
)

echo.

REM Check .env file
echo 📝 Environment:
if exist ".env" (
    echo    ✅ .env file exists
    echo    📋 Contents:
    type .env | findstr /v "^#" | findstr /v "^$"
) else (
    echo    ❌ .env file not found
    echo    💡 Copy from env.example: copy env.example .env
)

echo.
echo 🚀 Ready to start: start.bat
echo.
pause
