#!/bin/bash

echo "🔍 Docker Status Check"
echo "======================"

# Check Docker daemon
echo "🐳 Docker Daemon:"
if docker info > /dev/null 2>&1; then
    echo "   ✅ Docker is running"
    docker --version
    docker compose version
else
    echo "   ❌ Docker is not running"
    echo "   💡 Start Docker: sudo systemctl start docker"
    exit 1
fi

echo ""

# Check ports
echo "🔌 Port Availability:"
ports=(3000 8081 3306)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "   ❌ Port $port is in use"
    else
        echo "   ✅ Port $port is available"
    fi
done

echo ""

# Check Docker Compose
echo "📋 Docker Compose:"
if command -v docker-compose >/dev/null 2>&1; then
    echo "   ℹ️  docker-compose v1 found (legacy)"
    docker-compose --version
fi

if docker compose version >/dev/null 2>&1; then
    echo "   ✅ docker compose v2 found (recommended)"
    docker compose version
fi

echo ""

# Check .env file
echo "📝 Environment:"
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    echo "   📋 Contents:"
    cat .env | sed 's/^/      /'
else
    echo "   ❌ .env file not found"
    echo "   💡 Copy from env.example: cp env.example .env"
fi

echo ""
echo "🚀 Ready to start: ./teenup.sh start"
