#!/bin/bash

echo "🛑 TeenUp Contest - Stopping System..."
echo "======================================"

# Stop all services
echo "🐳 Stopping Docker services..."
docker-compose down

echo ""
echo "✅ All services stopped."
echo ""
echo "💡 To start again: ./start.sh"
echo "🗑️  To remove data: docker-compose down -v"
