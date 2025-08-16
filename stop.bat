@echo off
chcp 65001 >nul
echo 🛑 TeenUp Contest - Stopping System...
echo ======================================

REM Stop and remove containers
docker compose down

echo ✅ System stopped successfully!
echo.
echo 🔍 To start again: start.bat
echo 🗑️  To remove volumes: docker compose down -v
echo.
pause
