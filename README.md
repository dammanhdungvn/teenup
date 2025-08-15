# 🎓 TeenUp Contest Management System

Hệ thống quản lý cuộc thi với **Spring Boot Backend** + **React Frontend** + **MySQL Database**.

## 📚 **Documentation**

- 🌐 **[Frontend Documentation](frontend/docs/)** - React app setup, development, API integration
- 🔧 **[Backend Documentation](backend/contest/docs/)** - API endpoints, database schema, Spring Boot
- 🐳 **[Docker Setup](docker-compose.yml)** - Complete system deployment
- 🚀 **[Docker Installation Guide](DOCKER-SETUP.md)** - Cài đặt Docker cho từng hệ điều hành

## 🚀 **QUICK START - ONE COMMAND**

### **Yêu cầu:**
- Docker & Docker Compose
- Ports: 3000, 8081, 3306 (available)

> 📖 **Chưa có Docker?** Xem [Docker Installation Guide](DOCKER-SETUP.md)

### **Khởi động toàn bộ hệ thống:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Chạy startup script
chmod +x start.sh
./start.sh
```

#### **🪟 Windows:**
```cmd
# Chạy startup script
start.bat
```

**Hoặc chạy trực tiếp (cả hai OS):**
```bash
docker-compose up -d
```

### **Truy cập hệ thống:**
- 🌐 **Frontend:** http://localhost:3000 (Docker) / http://localhost:5173 (Local Dev)
- 🔧 **Backend API:** http://localhost:8081
- 🗄️ **Database:** localhost:3306

---

## 📊 **Data Seeding Tự Động**

Khi khởi động, hệ thống sẽ tự động tạo:

### **👨‍👩‍👧‍👦 Parents (2):**
- Nguyen Van A (0901111111, a@example.com)
- Tran Thi B (0902222222, b@example.com)

### **👨‍🎓 Students (3):**
- **Minh** - Grade 7, Parent: Nguyen Van A
- **Lan** - Grade 8, Parent: Nguyen Van A  
- **Hoang** - Grade 6, Parent: Tran Thi B

### **📚 Classes (3):**
- **Toán Nâng Cao** - Thứ 3, 14:00-15:30
- **Tiếng Anh A2** - Thứ 5, 08:00-09:30
- **Khoa học Vui** - Thứ 7, 09:00-10:30

### **🎁 Subscriptions:**
- Basic-12 (Minh): 12 buổi, 0 đã dùng
- Basic-08 (Lan): 8 buổi, 1 đã dùng

---

## 🛠️ **Quản Lý Hệ Thống**

### **Khởi động:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
./start.sh                    # Startup script với health checks
docker-compose up -d         # Docker Compose trực tiếp
```

#### **🪟 Windows:**
```cmd
start.bat                     # Startup script với health checks
docker-compose up -d         # Docker Compose trực tiếp
```

### **Dừng:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
./stop.sh                     # Stop script
docker-compose down          # Docker Compose trực tiếp
```

#### **🪟 Windows:**
```cmd
stop.bat                      # Stop script
docker-compose down          # Docker Compose trực tiếp
```

### **Xem logs:**
```bash
docker-compose logs -f       # Tất cả services
docker-compose logs -f backend    # Chỉ backend
docker-compose logs -f frontend   # Chỉ frontend
docker-compose logs -f db         # Chỉ database
```

### **Restart service:**
```bash
docker-compose restart backend    # Restart backend
docker-compose restart frontend   # Restart frontend
docker-compose restart db         # Restart database
```

### **Xóa dữ liệu:**
```bash
docker-compose down -v       # Xóa volumes (database data)
```

---

## 🏗️ **Kiến Trúc Hệ Thống**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL      │
│   (React)       │    │ (Spring Boot)   │    │   Database     │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 3306   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    └─────────────┴─────────────┐
                                               │
                                    ┌─────────────────┐
                                    │ Docker Network  │
                                    │ teenup_network  │
                                    └─────────────────┘
```

---

## 🗄️ **Database Schema**

### **Core Entities:**
- **Students** - Thông tin học sinh (name, dob, gender, grade, parent)
- **Parents** - Thông tin phụ huynh (name, phone, email)
- **Classes** - Lớp học (name, subject, schedule, teacher)
- **Subscriptions** - Gói học (package, sessions, student)
- **ClassRegistrations** - Đăng ký lớp học

### **Relationships:**
- Student ↔ Parent (Many-to-One)
- Student ↔ Classes (Many-to-Many via ClassRegistration)
- Student ↔ Subscriptions (One-to-Many)

### **Key Fields:**
- **Students:** `currentGrade` (Grade 6, Grade 7, Grade 8)
- **Classes:** `dayOfWeek` (1-7), `timeSlot` (HH:mm-HH:mm)
- **Subscriptions:** `totalSessions`, `usedSessions`

> 📖 **Xem chi tiết:** [Backend Database Schema](backend/contest/docs/database-schema.md)

---

## 🔌 **API Endpoints**

### **Core APIs:**
- **Students:** `GET/POST/PUT/DELETE /api/students/*`
- **Parents:** `GET/POST/PUT/DELETE /api/parents/*`
- **Classes:** `GET/POST/PUT/DELETE /api/classes/*`
- **Subscriptions:** `GET/POST/PUT/DELETE /api/subscriptions/*`
- **Dashboard:** `GET /api/dashboard/*`

### **Example Queries:**
```bash
# Get all students
curl http://localhost:8081/api/students/list

# Get student by ID
curl http://localhost:8081/api/students/1

# Create new student
curl -X POST http://localhost:8081/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Minh","currentGrade":"Grade 7"}'

# Get class schedule
curl http://localhost:8081/api/classes
```

> 📖 **Xem chi tiết:** [Backend API Endpoints](backend/contest/docs/api-endpoints.md)

---

## 🔧 **Cấu Hình Môi Trường**

### **File .env:**
```bash
# Copy từ env.example
cp env.example .env

# Chỉnh sửa nếu cần
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=teenup
MYSQL_USER=teenup
MYSQL_PASSWORD=teenup123
```

### **Ports:**

#### **🐳 Docker Environment:**
- **Frontend:** 3000 (Nginx serve static files)
- **Backend:** 8081 (Spring Boot)
- **Database:** 3306 (MySQL)

#### **💻 Local Development:**
- **Frontend:** 5173 (Vite dev server)
- **Backend:** 8081 (Spring Boot)
- **Database:** 3306 (MySQL hoặc Docker)

---

## 📁 **Cấu Trúc Project**

```
Contest/
├── docker-compose.yml          # Docker orchestration
├── start.sh                    # Startup script (Linux/macOS)
├── start.bat                   # Startup script (Windows)
├── stop.sh                     # Stop script (Linux/macOS)
├── stop.bat                    # Stop script (Windows)
├── env.example                 # Environment template
├── backend/contest/            # Spring Boot backend
│   ├── Dockerfile             # Backend container
│   └── .dockerignore          # Backend ignore
├── frontend/                   # React frontend
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx configuration
│   └── .dockerignore          # Frontend ignore
└── logs/                       # Application logs
    ├── backend/               # Backend logs
    └── frontend/              # Frontend logs
```

---

## 🚀 **Development & Deployment**

### **Local Development:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Frontend (React)
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (Spring Boot)
cd backend/contest
./mvnw spring-boot:run  # http://localhost:8081

# Database (MySQL)
# Sử dụng Docker hoặc local MySQL
```

#### **🪟 Windows:**
```cmd
# Frontend (React)
cd frontend
npm install
npm run dev          # http://localhost:5173

# Backend (Spring Boot)
cd backend\contest
mvnw.cmd spring-boot:run  # http://localhost:8081

# Database (MySQL)
# Sử dụng Docker hoặc local MySQL
```

> 📖 **Xem chi tiết:** [Frontend Setup Guide](frontend/docs/SETUP.md)

### **Docker Development:**
```bash
# Chạy toàn bộ hệ thống
./start.sh                    # Linux/macOS
start.bat                     # Windows

# Hoặc từng service
docker-compose up -d db
docker-compose up -d backend
docker-compose up -d frontend
```

> 📖 **Xem chi tiết:** [Frontend Docker Guide](frontend/docs/DOCKER.md)

### **Production Deployment:**
```bash
# Build và deploy
docker-compose build --no-cache
docker-compose up -d

# Environment variables
cp env.example .env
# Chỉnh sửa .env cho production
```

---

## 🐛 **Troubleshooting**

### **Port đã được sử dụng:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Kiểm tra port nào đang sử dụng
lsof -i :3000    # Docker frontend
lsof -i :5173    # Local frontend (Vite)
lsof -i :8081    # Backend API
lsof -i :3306    # Database

# Kill process nếu cần
kill -9 <PID>
```

#### **🪟 Windows:**
```cmd
# Kiểm tra port nào đang sử dụng
netstat -an | findstr ":3000"    # Docker frontend
netstat -an | findstr ":5173"    # Local frontend (Vite)
netstat -an | findstr ":8081"    # Backend API
netstat -an | findstr ":3306"    # Database

# Kill process nếu cần
taskkill /PID <PID> /F
```

### **Database connection error:**
```bash
# Kiểm tra database container
docker-compose logs db

# Restart database
docker-compose restart db
```

### **Backend không start:**
```bash
# Kiểm tra backend logs
docker-compose logs backend

# Kiểm tra database health
docker-compose exec db mysqladmin ping -h localhost -u root -prootpass
```

### **Frontend không load:**
```bash
# Kiểm tra frontend logs
docker-compose logs frontend

# Kiểm tra backend API
curl http://localhost:8081/actuator/health
```

---

## 📞 **Hỗ Trợ**

Nếu gặp vấn đề:
1. **Kiểm tra logs:** `docker-compose logs -f`
2. **Restart services:** `docker-compose restart`
3. **Rebuild images:** `docker-compose build --no-cache`
4. **Xóa và tạo lại:** `docker-compose down -v && ./start.sh`

### **Documentation chi tiết:**
- 🌐 **[Frontend Docs](frontend/docs/)** - Setup, development, API integration
- 🔧 **[Backend Docs](backend/contest/docs/)** - API, database, Spring Boot
- 🐳 **[Docker Setup](DOCKER-SETUP.md)** - Cài đặt Docker cho từng OS

---

**🎉 Chúc bạn sử dụng hệ thống thành công!**
