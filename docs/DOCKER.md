# Docker Setup & Deployment

## 🐳 Overview
Complete Docker setup for the Contest Management System with Frontend, Backend, and MySQL database.

## 📁 Project Structure
```
Contest/
├── frontend/           # React frontend
├── backend/           # Spring Boot backend
├── docker-compose.yml # Main orchestration
├── .env              # Environment variables
└── docs/             # Documentation
```

## 🚀 Quick Start (ONE COMMAND)

### **Ubuntu/Linux:**
```bash
# Clone & setup
git clone <repository>
cd Contest
chmod +x start.sh
./start.sh

# Or manual start
docker-compose up -d
```

### **Windows:**
```bash
# Clone & setup
git clone <repository>
cd Contest
start.bat

# Or manual start
docker-compose up -d
```

## 🔧 Docker Configuration

### **1. Frontend Dockerfile**
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### **2. Backend Dockerfile**
```dockerfile
# Multi-stage build for production
FROM maven:3.9-openjdk-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Production runtime
FROM openjdk:21-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
CMD ["java", "-jar", "app.jar"]
```

### **3. Docker Compose**
```yaml
version: '3.8'
services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: contest_db
      MYSQL_USER: contest_user
      MYSQL_PASSWORD: contest_pass
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/contest/src/main/resources/db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Spring Boot Backend
  backend:
    build: ./backend/contest
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/contest_db
      SPRING_DATASOURCE_USERNAME: contest_user
      SPRING_DATASOURCE_PASSWORD: contest_pass
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8081/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # React Frontend
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mysql_data:
```

## 🌍 Environment Variables

### **Frontend (.env)**
```bash
VITE_API_BASE_URL=http://localhost:8081
VITE_USE_PROXY=false
```

### **Backend (application.yml)**
```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/contest_db
    username: contest_user
    password: contest_pass
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
```

## 📊 Data Seeding

### **Initial Data Setup**
```sql
-- Database initialization
CREATE DATABASE IF NOT EXISTS contest_db;
USE contest_db;

-- Sample data insertion
INSERT INTO parents (name, phone, email) VALUES 
('Nguyen Van A', '0901234567', 'a@example.com'),
('Tran Thi B', '0901234568', 'b@example.com');

INSERT INTO students (name, dob, gender, parent_id) VALUES 
('Nguyen Van C', '2010-01-01', 'M', 1),
('Tran Thi D', '2010-02-02', 'F', 2);
```

## 🚀 Deployment Commands

### **Development Mode**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### **Production Mode**
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Scale backend
docker-compose up -d --scale backend=3

# Update services
docker-compose pull
docker-compose up -d
```

## 🔍 Monitoring & Health Checks

### **Service Status**
```bash
# Check all services
docker-compose ps

# Health check
curl http://localhost:8081/actuator/health
curl http://localhost:80

# Database connection
docker exec -it contest_mysql_1 mysql -u contest_user -p contest_db
```

### **Logs & Debugging**
```bash
# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Follow logs in real-time
docker-compose logs -f backend
```

## 🛠️ Troubleshooting

### **Common Issues**

#### **1. Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep :8081
netstat -tulpn | grep :80

# Kill process using port
sudo kill -9 <PID>
```

#### **2. Database Connection Issues**
```bash
# Check MySQL status
docker-compose exec mysql mysqladmin ping

# Reset database
docker-compose down -v
docker-compose up -d
```

#### **3. Build Failures**
```bash
# Clean build
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### **Performance Optimization**
```bash
# Resource limits
docker-compose up -d --scale backend=2

# Memory optimization
docker run -m 512m --memory-swap 1g
```

## 🔒 Security Considerations

### **Production Security**
```yaml
# docker-compose.prod.yml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      # Remove init.sql in production
```

### **Environment Variables**
```bash
# .env.production
MYSQL_ROOT_PASSWORD=secure_password_123
MYSQL_DATABASE=contest_prod
MYSQL_USER=contest_prod_user
MYSQL_PASSWORD=secure_user_pass_456
```

## 📱 Platform-Specific Instructions

### **Ubuntu/Linux**
```bash
# Install Docker
sudo apt update
sudo apt install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Run application
cd Contest
docker-compose up -d
```

### **Windows**
```bash
# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Start Docker Desktop
# Run as Administrator

# Open PowerShell/CMD
cd Contest
docker-compose up -d
```

### **macOS**
```bash
# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app

# Run application
cd Contest
docker-compose up -d
```

## 🔄 CI/CD Integration

### **GitHub Actions**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to server
        run: |
          ssh user@server "cd /opt/contest && git pull && docker-compose up -d --build"
```

## 📊 Performance Metrics

### **Resource Usage**
```bash
# Monitor containers
docker stats

# Resource limits
docker-compose exec backend java -XX:+PrintFlagsFinal -version | grep MaxHeapSize
```

### **Database Performance**
```sql
-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Optimize tables
OPTIMIZE TABLE parents, students, classes;
```

## 🎯 Best Practices

### **Development**
- Use `.env.local` for local development
- Enable hot reload with volume mounts
- Use health checks for service dependencies

### **Production**
- Use specific image tags (not `latest`)
- Implement proper logging and monitoring
- Set resource limits and constraints
- Use secrets management for sensitive data

### **Maintenance**
- Regular security updates
- Database backups
- Log rotation
- Performance monitoring
