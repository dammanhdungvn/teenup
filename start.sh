#!/bin/bash

echo "🚀 TeenUp Contest - Starting System..."
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if ports are available
echo "🔍 Checking port availability..."

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port 3000 is already in use. Please free up the port."
    exit 1
fi

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port 8081 is already in use. Please free up the port."
    exit 1
fi

if lsof -Pi :3306 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port 3306 is already in use. Please free up the port."
    exit 1
fi

echo "✅ All ports are available."

# Create logs directory
mkdir -p logs/backend logs/frontend

# Copy env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from env.example..."
    cp env.example .env
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
echo "This may take 2-3 minutes on first run..."

# Wait for database to be ready
echo "🗄️  Waiting for database..."
until docker-compose exec -T db mysqladmin ping -h localhost -u root -prootpass --silent; do
    echo "   Database not ready yet..."
    sleep 5
done
echo "✅ Database is ready!"

# Wait for backend to be ready
echo "🔧 Waiting for backend..."
until curl -f http://localhost:8081/actuator/health > /dev/null 2>&1; do
    echo "   Backend not ready yet..."
    sleep 10
done
echo "✅ Backend is ready!"

# Wait for frontend to be ready
echo "🌐 Waiting for frontend..."
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    echo "   Frontend not ready yet..."
    sleep 5
done
echo "✅ Frontend is ready!"

echo ""
echo "🎉 TeenUp Contest System is ready!"
echo "======================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8081"
echo "🗄️  Database: localhost:3306"
echo ""
echo "📊 Data Seeding:"
echo "   - 2 Parents (Nguyen Van A, Tran Thi B)"
echo "   - 3 Students (Minh, Lan, Hoang)"
echo "   - 3 Classes (Toán, Tiếng Anh, Khoa học)"
echo "   - Subscriptions and Registrations"
echo ""
echo "🔍 Check logs: docker-compose logs -f"
echo "🛑 Stop system: docker-compose down"
echo "🔄 Restart: docker-compose restart"
