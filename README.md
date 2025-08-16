# 🚀 TeenUp Contest Management System

## 📋 Quick Start

### **1. Prerequisites**
- Docker Engine 20.10+
- Docker Compose v2.0+
- 4GB RAM minimum

### **2. Setup & Run**

#### **Linux/macOS:**
```bash
git clone <repository-url>
cd Contest
./start.sh
```

#### **Windows Native:**
```bash
git clone <repository-url>
cd Contest
start.bat
```

#### **Windows + WSL2:**
```bash
git clone <repository-url>
cd Contest
start-wsl2.bat
```

### **3. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api
- **API Docs**: http://localhost:8081/api-docs

---

## ⚠️ Common Issues & Solutions

### **Missing .env File**
```bash
# Lỗi: "File .env không tồn tại!"

# ✅ GIẢI PHÁP: Scripts sẽ tự động tạo .env
# Không cần làm gì thêm - chỉ chạy startup script

# Hoặc tạo thủ công nếu muốn:
cat > .env << 'EOF'
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=teenup_contest
MYSQL_USER=contest_user
MYSQL_PASSWORD=contest_pass
SPRING_PROFILES_ACTIVE=docker
SERVER_PORT=8081
VITE_DOCKER=true
VITE_API_BASE_URL=http://localhost:8081
VITE_USE_PROXY=false
EOF
```

### **Port Conflicts**
```bash
# Thay đổi ports trong .env:
FRONTEND_PORT=3001
BACKEND_PORT=8082
MYSQL_PORT=3307
```

### **Docker Issues**
```bash
# Kiểm tra Docker
docker --version
docker compose version
docker info

# Restart services
docker compose restart
docker compose down && docker compose up -d
```

---

## 🆕 New Features

### **🚀 Auto .env Creation**
- **Không cần file .env**: Scripts tự động tạo với giá trị mặc định
- **Cross-platform**: Hoạt động trên Linux, macOS, Windows, WSL2
- **Smart detection**: Tự động phát hiện và tạo file cần thiết

### **🌐 Enhanced CORS Support**
- **Backend CORS**: Spring Boot configuration
- **Frontend Proxy**: Nginx với API proxy và CORS headers
- **Double protection**: Cả backend và frontend đều có CORS

### **🖥️ Windows WSL2 Support**
- **Native Windows**: `start.bat`, `stop.bat`
- **WSL2 Environment**: `start-wsl2.bat`, `stop-wsl2.bat`
- **Platform detection**: Tự động chọn script phù hợp

---

## 📚 Documentation

- **🐳 Docker Setup**: [docs/DOCKER.md](docs/DOCKER.md) - Complete Docker guide
- **🔧 API Endpoints**: [backend/contest/docs/api-endpoints.md](backend/contest/docs/api-endpoints.md)
- **🌐 Frontend Features**: [frontend/docs/README.md](frontend/docs/README.md)

---

## 🛠️ Development

### **Stop Services**
```bash
# Linux/Mac
./stop.sh

# Windows
stop.bat
# hoặc
stop-wsl2.bat
```

### **View Logs**
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### **Rebuild Services**
```bash
docker compose build --no-cache
docker compose up -d
```

### **Health Checks**
```bash
# Linux/Mac
./check-docker.sh

# Windows
check-docker.bat
```

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

## 🎯 Key Benefits

- **🚀 Zero Configuration**: Tự động tạo .env và setup
- **🌍 Cross-Platform**: Hoạt động trên mọi OS
- **🔒 Secure**: CORS protection và environment isolation
- **📱 Responsive**: Modern UI/UX với Ant Design
- **🔧 Robust**: Health checks và error handling
- **📚 Well-Documented**: Complete guides cho mọi platform

---

*Last updated: August 16, 2025*
*Version: 3.0*
*Features: Auto .env creation, Enhanced CORS, Windows WSL2, Cross-platform support*
