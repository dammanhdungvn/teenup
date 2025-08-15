# 🐳 Docker Guide

Hướng dẫn sử dụng **Docker** cho **React Frontend** TeenUp Contest Management System.

## **🚀 Quick Start**

### **Chạy toàn bộ hệ thống (Recommended):**
```bash
# Từ root directory
./start.sh
```

**Kết quả:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend:** http://localhost:8081
- 🗄️ **Database:** localhost:3306

### **Chạy chỉ frontend:**
```bash
# Build image
docker build -t teenup-frontend .

# Run container
docker run -p 3000:80 teenup-frontend
```

## **🏗️ Docker Architecture**

### **Multi-stage Build:**
```
Stage 1: Node.js Build
├── Install dependencies
├── Build React app
└── Output: dist/ folder

Stage 2: Nginx Runtime
├── Copy built files
├── Configure nginx
└── Serve static files
```

### **Image Layers:**
```
teenup-frontend:latest
├── nginx:alpine (base)
├── Static files (dist/)
├── Nginx config
└── Environment files
```

## **📁 Docker Files**

### **Dockerfile:**
```dockerfile
# ========= STAGE 1: BUILD =========
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# ========= STAGE 2: RUNTIME =========
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY env.docker /usr/share/nginx/html/.env
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Nginx Configuration:**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### **Docker Ignore:**
```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
dist
coverage
.vscode
.idea
*.log
```

## **🔧 Docker Commands**

### **Build Commands:**
```bash
# Build frontend image
docker build -t teenup-frontend .

# Build with specific tag
docker build -t teenup-frontend:v1.0.0 .

# Build without cache
docker build --no-cache -t teenup-frontend .

# Build with build args
docker build --build-arg NODE_ENV=production -t teenup-frontend .
```

### **Run Commands:**
```bash
# Run container
docker run -d -p 3000:80 --name frontend teenup-frontend

# Run with environment variables
docker run -d -p 3000:80 \
  -e VITE_API_BASE_URL=http://localhost:8081 \
  --name frontend teenup-frontend

# Run with volume mount
docker run -d -p 3000:80 \
  -v $(pwd)/logs:/var/log/nginx \
  --name frontend teenup-frontend
```

### **Management Commands:**
```bash
# List containers
docker ps -a

# View logs
docker logs frontend
docker logs -f frontend

# Stop container
docker stop frontend

# Remove container
docker rm frontend

# Remove image
docker rmi teenup-frontend
```

## **🌐 Docker Compose**

### **Frontend Service:**
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  container_name: teenup_frontend
  restart: unless-stopped
  depends_on:
    backend:
      condition: service_started
  ports:
    - "3000:80"
  volumes:
    - ./logs/frontend:/var/log/nginx
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:80"]
    interval: 30s
    timeout: 10s
    retries: 5
    start_period: 30s
  networks:
    - teenup_network
```

### **Complete Stack:**
```yaml
version: "3.9"

services:
  db:
    image: mysql:8.0
    # ... database config

  backend:
    build: ./backend/contest
    # ... backend config

  frontend:
    build: ./frontend
    # ... frontend config

volumes:
  mysql_data:

networks:
  teenup_network:
    driver: bridge
```

## **🔍 Troubleshooting**

### **Build Issues:**
```bash
# Check Docker daemon
docker info

# Clear Docker cache
docker system prune -a

# Check disk space
df -h

# View build logs
docker build -t teenup-frontend . 2>&1 | tee build.log
```

### **Runtime Issues:**
```bash
# Check container status
docker ps -a

# View container logs
docker logs teenup_frontend

# Execute commands in container
docker exec -it teenup_frontend sh

# Check nginx configuration
docker exec teenup_frontend nginx -t
```

### **Network Issues:**
```bash
# Check network connectivity
docker network ls
docker network inspect teenup_network

# Test API connection
docker exec teenup_frontend curl http://backend:8081/actuator/health

# Check port binding
netstat -tulpn | grep :3000
```

## **⚡ Performance Optimization**

### **Image Size Optimization:**
```dockerfile
# Use multi-stage build
FROM node:18-alpine AS build
# ... build stage

FROM nginx:alpine
# ... runtime stage

# Result: Smaller final image
```

### **Build Optimization:**
```dockerfile
# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build
```

### **Runtime Optimization:**
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript;

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## **🔒 Security Considerations**

### **Security Headers:**
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### **Container Security:**
```yaml
# docker-compose.yml
frontend:
  # ... other config
  security_opt:
    - no-new-privileges:true
  read_only: true
  tmpfs:
    - /tmp
    - /var/cache/nginx
    - /var/run
```

## **📊 Monitoring & Logging**

### **Health Checks:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:80"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 30s
```

### **Log Management:**
```yaml
volumes:
  - ./logs/frontend:/var/log/nginx

# View logs
docker-compose logs -f frontend
tail -f logs/frontend/access.log
tail -f logs/frontend/error.log
```

### **Resource Monitoring:**
```bash
# Container stats
docker stats teenup_frontend

# Resource usage
docker exec teenup_frontend top

# Disk usage
docker exec teenup_frontend df -h
```

## **🚀 Production Deployment**

### **Environment Configuration:**
```bash
# Production environment
cp env.example .env.prod

# Edit .env.prod
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DOCKER=true
```

### **Production Build:**
```bash
# Build production image
docker build --build-arg NODE_ENV=production -t teenup-frontend:prod .

# Run production container
docker run -d -p 80:80 \
  -e NODE_ENV=production \
  --name frontend-prod teenup-frontend:prod
```

### **Load Balancer:**
```nginx
# nginx.conf for load balancer
upstream frontend {
    server frontend1:80;
    server frontend2:80;
    server frontend3:80;
}

server {
    listen 80;
    location / {
        proxy_pass http://frontend;
    }
}
```

---

## **🔗 Related Documentation**

- 📖 **[Setup Guide](SETUP.md)** - Cài đặt và chạy
- 🏗️ **[Project Structure](STRUCTURE.md)** - Cấu trúc code
- 🐳 **[Main Docker Setup](../../docker-compose.yml)** - Complete system
- 🚀 **[Deployment Guide](DEPLOYMENT.md)** - Production deployment
