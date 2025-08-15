@echo off
chcp 65001 >nul
echo 🚀 TeenUp Contest - Starting System...
echo ======================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if ports are available
echo 🔍 Checking port availability...

netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ Port 3000 is already in use. Please free up the port.
    pause
    exit /b 1
)

netstat -an | findstr ":8081" >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ Port 8081 is already in use. Please free up the port.
    pause
    exit /b 1
)

netstat -an | findstr ":3306" >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ Port 3306 is already in use. Please free up the port.
    pause
    exit /b 1
)

echo ✅ All ports are available.

REM Create logs directory
if not exist "logs\backend" mkdir "logs\backend"
if not exist "logs\frontend" mkdir "logs\frontend"

REM Copy env.example to .env if .env doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file from env.example...
    copy "env.example" ".env"
)

REM Start services
echo 🐳 Starting Docker services...
docker-compose up -d

echo.
echo ⏳ Waiting for services to start...
echo This may take 2-3 minutes on first run...

REM Wait for database to be ready
echo 🗄️  Waiting for database...
:wait_db
docker-compose exec -T db mysqladmin ping -h localhost -u root -prootpass --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo    Database not ready yet...
    timeout /t 5 /nobreak >nul
    goto wait_db
)
echo ✅ Database is ready!

REM Wait for backend to be ready
echo 🔧 Waiting for backend...
:wait_backend
curl -f http://localhost:8081/actuator/health >nul 2>&1
if %errorlevel% neq 0 (
    echo    Backend not ready yet...
    timeout /t 10 /nobreak >nul
    goto wait_backend
)
echo ✅ Backend is ready!

REM Wait for frontend to be ready
echo 🌐 Waiting for frontend...
:wait_frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo    Frontend not ready yet...
    timeout /t 5 /nobreak >nul
    goto wait_frontend
)
echo ✅ Frontend is ready!

echo.
echo 🎉 TeenUp Contest System is ready!
echo ======================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8081
echo 🗄️  Database: localhost:3306
echo.
echo 📊 Data Seeding:
echo    - 2 Parents (Nguyen Van A, Tran Thi B)
echo    - 3 Students (Minh, Lan, Hoang)
echo    - 3 Classes (Toán, Tiếng Anh, Khoa học)
echo    - Subscriptions and Registrations
echo.
echo 🔍 Check logs: docker-compose logs -f
echo 🛑 Stop system: docker-compose down
echo 🔄 Restart: docker-compose restart
echo.
pause
