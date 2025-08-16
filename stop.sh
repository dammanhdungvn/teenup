#!/bin/bash

echo "🛑 TeenUp Contest - Stopping System..."
echo "======================================"

# Stop and remove containers
docker compose down

echo "✅ System stopped successfully!"
echo ""
echo "🔍 To start again: ./start.sh"
echo "🗑️  To remove volumes: docker compose down -v"
