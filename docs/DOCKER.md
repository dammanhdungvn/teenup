# 🐳 Docker Documentation - TeenUp Contest Management System

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Services](#services)
- [Data Management](#data-management)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Platform Specific](#platform-specific)
- [CORS Configuration](#cors-configuration)

---

## 🎯 Overview

TeenUp Contest Management System sử dụng Docker để containerize toàn bộ stack:
- **Frontend**: React + Vite + Ant Design + Nginx
- **Backend**: Spring Boot + JPA + MySQL
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx với API proxy và CORS support

---

## ⚠️ Prerequisites

### **System Requirements**
- Docker Engine 20.10+
- Docker Compose v2.0+
- 4GB RAM tối thiểu
- 10GB disk space

### **Check Docker Installation**
```bash
# Kiểm tra Docker version
docker --version
docker compose version

# Kiểm tra Docker daemon
docker info
```

### **Port Requirements**
- **3000**: Frontend (http://localhost:3000)
- **8081**: Backend API (http://localhost:8081)
- **3306**: MySQL Database
- **33060**: MySQL X Protocol

---

## 🚀 Quick Start

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd Contest

# Kiểm tra Docker status
./check-docker.sh  # Linux/Mac
# hoặc
check-docker.bat   # Windows Native
# hoặc
check-docker.bat   # Windows + WSL2
```

### **2. Start All Services**

#### **Linux/macOS:**
```bash
./start.sh
```

#### **Windows Native (Docker Desktop):**
```bash
start.bat
```

#### **Windows + WSL2:**
```bash
start-wsl2.bat
```

### **3. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api
- **API Documentation**: http://localhost:8081/api-docs

---

## 🏗️ Project Structure

```
Contest/
├── docker-compose.yml          # Main orchestration
├── start.sh                    # Linux/Mac startup script
├── start.bat                   # Windows Native startup script
├── start-wsl2.bat             # Windows + WSL2 startup script
├── stop.sh                     # Linux/Mac stop script
├── stop.bat                    # Windows Native stop script
├── stop-wsl2.bat              # Windows + WSL2 stop script
├── check-docker.sh             # Linux/Mac pre-flight checks
├── check-docker.bat            # Windows pre-flight checks
├── .env                        # Environment variables
├── frontend/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx configuration với API proxy
│   └── env.docker             # Docker environment config
└── backend/
    └── contest/
        ├── Dockerfile         # Backend container
        └── src/main/java/com/teenup/contest/config/
            └── CorsConfig.java # CORS configuration
```

---

## ⚙️ Configuration

### **Environment Variables (.env)**
```bash
# Database
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=teenup_contest
MYSQL_USER=contest_user
MYSQL_PASSWORD=contest_pass

# Backend
SPRING_PROFILES_ACTIVE=docker
SERVER_PORT=8081

# Frontend
VITE_DOCKER=true
VITE_API_BASE_URL=http://localhost:8081
VITE_USE_PROXY=false
```

### **Docker Compose Configuration**
```yaml
services:
  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysql", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}", "-e", "SELECT 1"]
      interval: 10s
      timeout: 5s
      retries: 30

  backend:
    build: ./backend/contest
    ports:
      - "8081:8081"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/api/parents/list"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
```

---

## 🔧 Services

### **1. Database (MySQL)**
```bash
# Service name: db
# Image: mysql:8.0
# Port: 3306
# Health check: mysql -e "SELECT 1"

# Connect to database
docker compose exec db mysql -u root -p${MYSQL_ROOT_PASSWORD} teenup_contest

# View logs
docker compose logs db

# Backup database
docker compose exec db mysqldump -u root -p${MYSQL_ROOT_PASSWORD} teenup_contest > backup.sql
```

### **2. Backend (Spring Boot)**
```bash
# Service name: backend
# Port: 8081
# Health check: /api/parents/list
# Build context: ./backend/contest

# View logs
docker compose logs backend

# Rebuild backend
docker compose build backend

# Restart backend
docker compose restart backend
```

### **3. Frontend (React + Nginx)**
```bash
# Service name: frontend
# Port: 3000 (mapped to 80)
# Build context: ./frontend
# Features: API proxy, CORS support, SPA routing

# View logs
docker compose logs frontend

# Rebuild frontend
docker compose build frontend

# Access container
docker compose exec frontend sh
```

---

## 🌐 CORS Configuration

### **Backend CORS (Spring Boot)**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### **Frontend Nginx CORS Proxy**
```nginx
# API Proxy - Forward /api requests to backend
location /api/ {
    proxy_pass http://backend:8081/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # CORS headers
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    add_header Access-Control-Expose-Headers "Content-Length,Content-Range" always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Max-Age 1728000 always;
        add_header Content-Type 'text/plain; charset=utf-8' always;
        add_header Content-Length 0 always;
        return 204;
    }
}
```

### **CORS Flow**
1. **Frontend** (localhost:3000) → **Nginx Proxy** → **Backend** (localhost:8081)
2. **API calls** được proxy qua nginx với CORS headers
3. **Backend** cũng có CORS configuration riêng
4. **Double CORS protection** đảm bảo compatibility

---

## 💾 Data Management

### **Database Initialization**
```bash
# Database được tự động tạo với:
# - Schema: teenup_contest
# - User: contest_user
# - Sample data: parents, students, classes, subscriptions

# Reset database
docker compose down -v
docker compose up -d
```

### **Data Persistence**
```bash
# MySQL data được lưu trong volume:
# - mysql_data:/var/lib/mysql

# Backup volume
docker run --rm -v teenup_mysql_data:/data -v $(pwd):/backup alpine tar czf /backup/mysql_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v teenup_mysql_data:/data -v $(pwd):/backup alpine tar xzf /backup/mysql_backup.tar.gz -C /data
```

---

## 🔄 Development Workflow

### **1. Development Mode**
```bash
# Start services
./start.sh          # Linux/Mac
start.bat           # Windows Native
start-wsl2.bat      # Windows + WSL2

# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### **2. Code Changes**
```bash
# Backend changes require rebuild
docker compose build backend
docker compose up -d backend

# Frontend changes require rebuild
docker compose build frontend
docker compose up -d frontend
```

### **3. Hot Reload (Development)**
```bash
# Frontend development với Vite
cd frontend
npm run dev

# Backend development với Spring Boot DevTools
# (cần mount source code vào container)
```

---

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Linux/Mac
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8081
sudo netstat -tulpn | grep :3306

# Windows
netstat -an | findstr ":3000"
netstat -an | findstr ":8081"
netstat -an | findstr ":3306"

# Stop conflicting services
sudo systemctl stop mysql  # Linux
sudo systemctl stop nginx  # Linux
net stop mysql             # Windows
```

#### **2. Permission Denied (Linux)**
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
sudo chmod 666 /var/run/docker.sock

# Logout và login lại
# hoặc
newgrp docker
```

#### **3. Container Health Issues**
```bash
# Kiểm tra health status
docker compose ps

# View detailed logs
docker compose logs service_name

# Restart specific service
docker compose restart service_name
```

#### **4. Build Failures**
```bash
# Clean build
docker compose build --no-cache

# Clean Docker system
docker system prune -a

# Check disk space
df -h
```

#### **5. CORS Issues**
```bash
# Kiểm tra CORS configuration
curl -H "Origin: http://localhost:3000" http://localhost:8081/api/parents/list -v

# Kiểm tra nginx proxy
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/parents/list -v

# Rebuild frontend nếu cần
docker compose build frontend --no-cache
```

### **Debug Commands**
```bash
# Inspect container
docker compose exec service_name sh

# Check network
docker network ls
docker network inspect contest_default

# Check volumes
docker volume ls
docker volume inspect contest_mysql_data
```

---

## 🖥️ Platform Specific

### **Linux (Ubuntu/Debian)**
```bash
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose-plugin

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Logout và login lại
```

### **macOS**
```bash
# Install Docker Desktop
# Download từ: https://www.docker.com/products/docker-desktop

# Start Docker Desktop
open /Applications/Docker.app

# Verify installation
docker --version
docker compose version
```

### **Windows Native (Docker Desktop)**
```bash
# Install Docker Desktop
# Download từ: https://www.docker.com/products/docker-desktop

# Start Docker Desktop
# Run as Administrator

# Verify installation
docker --version
docker compose version

# Use startup script
start.bat
```

### **Windows + WSL2**
```bash
# Install WSL2
# PowerShell as Administrator: wsl --install

# Install Docker in WSL2
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt update
sudo apt install docker-compose-plugin

# Use startup script
start-wsl2.bat
```

---

## 📊 Monitoring & Maintenance

### **Resource Usage**
```bash
# View container stats
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### **Log Management**
```bash
# View real-time logs
docker compose logs -f

# Export logs
docker compose logs > logs.txt

# Rotate logs (nếu cần)
# Thêm logrotate configuration
```

---

## 🔒 Security Considerations

### **Production Deployment**
```bash
# Thay đổi default passwords
# Sử dụng secrets management
# Enable SSL/TLS
# Restrict network access
# Regular security updates
```

### **Development Security**
```bash
# Không expose ports ra internet
# Sử dụng strong passwords
# Regular Docker updates
# Scan images for vulnerabilities
```

---

## 📚 Additional Resources

- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [WSL2 Docker Setup](https://docs.docker.com/desktop/windows/wsl/)
- [Nginx CORS Configuration](https://enable-cors.org/server_nginx.html)

---

## 🆘 Support

Nếu gặp vấn đề:

1. **Kiểm tra logs**: `docker compose logs -f`
2. **Restart services**: `docker compose restart`
3. **Rebuild containers**: `docker compose build --no-cache`
4. **Check health status**: `docker compose ps`
5. **Verify configuration**: 
   - Linux/Mac: `./check-docker.sh`
   - Windows: `check-docker.bat`

### **Platform-Specific Support**
- **Linux/Mac**: Sử dụng `start.sh`, `stop.sh`, `check-docker.sh`
- **Windows Native**: Sử dụng `start.bat`, `stop.bat`, `check-docker.bat`
- **Windows + WSL2**: Sử dụng `start-wsl2.bat`, `stop-wsl2.bat`, `check-docker.bat`

---

*Last updated: August 16, 2025*
*Version: 3.0*
*Features: CORS Support, Windows WSL2, Enhanced Troubleshooting*
