@echo off
chcp 65001 >nul
echo 🛑 TeenUp Contest - Stopping System...
echo ======================================

REM Stop all services
echo 🐳 Stopping Docker services...
docker-compose down

echo.
echo ✅ All services stopped.
echo.
echo 💡 To start again: start.bat
echo 🗑️  To remove data: docker-compose down -v
echo.
pause
