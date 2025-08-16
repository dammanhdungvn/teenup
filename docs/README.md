# 📚 TeenUp Contest Management System - Documentation Index

## 🎯 Overview

TeenUp Contest Management System là một hệ thống quản lý cuộc thi hoàn chỉnh với:
- **Frontend**: React + Vite + Ant Design + Nginx
- **Backend**: Spring Boot + JPA + MySQL
- **Deployment**: Docker + Docker Compose
- **Features**: CRUD operations, Admin functions, Responsive UI/UX

---

## 🚀 Quick Start

### **Prerequisites**
- Docker Engine 20.10+
- Docker Compose v2.0+
- 4GB RAM minimum

### **One-Command Setup**
```bash
# Linux/macOS
./start.sh

# Windows Native
start.bat

# Windows + WSL2
start-wsl2.bat
```

### **Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api
- **API Docs**: http://localhost:8081/api-docs

---

## 📋 Documentation Sections

### **🐳 Docker & Deployment**
- **[Docker Setup Guide](DOCKER.md)** - Complete Docker deployment guide
- **Features**: Auto .env creation, CORS support, Windows WSL2, Cross-platform

### **🔧 Backend & API**
- **[API Endpoints](backend/contest/docs/api-endpoints.md)** - Complete API documentation
- **Features**: RESTful APIs, JPA repositories, Data validation, Error handling

### **🌐 Frontend & UI**
- **[Frontend Features](frontend/docs/README.md)** - React app documentation
- **Features**: Responsive design, Ant Design components, API integration

---

## 🆕 Latest Features

### **🚀 Auto .env Creation**
- Scripts tự động tạo file `.env` nếu không tồn tại
- Zero configuration setup
- Cross-platform compatibility

### **🌐 Enhanced CORS Support**
- Backend CORS configuration
- Frontend Nginx proxy với CORS headers
- Double protection cho cross-origin requests

### **🖥️ Windows WSL2 Support**
- Native Windows scripts
- WSL2 environment scripts
- Platform detection và auto-selection

### **🔧 Enhanced Health Checks**
- Database connection testing
- API endpoint availability
- Smart service startup sequencing

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React)       │◄──►│  (Spring Boot)  │◄──►│    (MySQL)      │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   JPA/Hibernate │    │   Data Volume   │
│  (API Proxy)    │    │  (ORM Layer)    │    │  (Persistence)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔌 Core APIs

### **Students Management**
- `GET/POST/PUT/DELETE /api/students/*`
- Student CRUD operations
- Parent association
- Grade management

### **Parents Management**
- `GET/POST/PUT/DELETE /api/parents/*`
- Parent CRUD operations
- Student reassignment
- Contact information

### **Classes Management**
- `GET/POST/PUT/DELETE /api/classes/*`
- Class scheduling
- Student registration
- Schedule conflict detection

### **Subscriptions Management**
- `GET/POST/PUT/DELETE /api/subscriptions/*`
- Package management
- Session tracking
- Admin functions (Reset, Extend)

---

## 🎨 UI/UX Features

### **Responsive Design**
- Mobile-first approach
- Ant Design components
- CSS media queries
- Touch-friendly interfaces

### **Modern Components**
- Data tables với sorting/filtering
- Modal forms với validation
- Interactive charts và statistics
- Professional color schemes

### **User Experience**
- Intuitive navigation
- Quick actions
- Bulk operations
- Real-time feedback

---

## 🛠️ Development Workflow

### **Local Development**
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend/contest
./mvnw spring-boot:run
```

### **Docker Development**
```bash
# Start all services
./start.sh          # Linux/Mac
start.bat           # Windows
start-wsl2.bat      # WSL2

# View logs
docker compose logs -f

# Rebuild services
docker compose build --no-cache
```

### **Testing & Debugging**
```bash
# Health checks
./check-docker.sh   # Linux/Mac
check-docker.bat    # Windows

# Service status
docker compose ps

# Container access
docker compose exec service_name sh
```

---

## 🚨 Troubleshooting

### **Common Issues**
1. **Missing .env**: Scripts tự động tạo
2. **Port conflicts**: Thay đổi trong .env
3. **CORS issues**: Backend + Frontend CORS
4. **Docker issues**: Health checks và logs

### **Debug Commands**
```bash
# View logs
docker compose logs -f

# Check status
docker compose ps

# Restart services
docker compose restart

# Clean rebuild
docker compose build --no-cache
```

---

## 📚 Additional Resources

### **Official Documentation**
- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Guide](https://spring.io/guides)
- [React Documentation](https://reactjs.org/docs/)
- [Ant Design](https://ant.design/docs/react/introduce)

### **Project Documentation**
- [Docker Setup](DOCKER.md) - Complete deployment guide
- [API Reference](backend/contest/docs/api-endpoints.md) - Backend APIs
- [Frontend Guide](frontend/docs/README.md) - React app features

---

## 🆘 Support

### **Getting Help**
1. **Check logs**: `docker compose logs -f`
2. **Verify configuration**: Health check scripts
3. **Rebuild services**: `docker compose build --no-cache`
4. **Check documentation**: This index và related guides

### **Platform Support**
- **Linux/Mac**: `start.sh`, `stop.sh`, `check-docker.sh`
- **Windows Native**: `start.bat`, `stop.bat`, `check-docker.bat`
- **Windows + WSL2**: `start-wsl2.bat`, `stop-wsl2.bat`, `check-docker.bat`

---

## 🎯 Key Benefits

- **🚀 Zero Configuration**: Auto .env creation và setup
- **🌍 Cross-Platform**: Hoạt động trên mọi OS
- **🔒 Secure**: CORS protection và environment isolation
- **📱 Responsive**: Modern UI/UX với Ant Design
- **🔧 Robust**: Health checks và error handling
- **📚 Well-Documented**: Complete guides cho mọi platform

---

*Last updated: August 16, 2025*
*Version: 3.0*
*Features: Auto .env creation, Enhanced CORS, Windows WSL2, Cross-platform support*
