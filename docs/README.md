# 📚 Tài Liệu TeenUp Contest Management System

**Hệ thống quản lý cuộc thi** với React + Spring Boot + MySQL.

## 🚀 **BẮT ĐẦU NHANH**

### **1. Cài đặt Docker**
```bash
# Windows: Tải Docker Desktop từ docker.com
# Linux: 
sudo apt update && curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && sudo systemctl start docker

# macOS: Tải Docker Desktop từ docker.com
```

### **2. Khởi động hệ thống**
```bash
# Linux/macOS/WSL
./teenup.sh start

# Windows  
teenup.bat start
```

### **3. Truy cập ứng dụng**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8081/api
- 🗄️ **Database:** localhost:3306

---

## 💻 **HƯỚNG DẪN SỬ DỤNG**

### **Các lệnh cơ bản:**
```bash
# Khởi động
./teenup.sh start        # Linux/macOS/WSL
teenup.bat start         # Windows

# Dừng hệ thống
./teenup.sh stop         # Linux/macOS/WSL  
teenup.bat stop          # Windows

# Kiểm tra trạng thái
./teenup.sh status       # Linux/macOS/WSL
teenup.bat status        # Windows

# Kiểm tra sức khỏe hệ thống
./teenup.sh health       # Linux/macOS/WSL
teenup.bat health        # Windows
```

### **Xem logs:**
```bash
docker compose logs -f            # Tất cả services
docker compose logs -f backend    # Chỉ backend
docker compose logs -f frontend   # Chỉ frontend
docker compose logs -f db         # Chỉ database
```

### **Quản lý containers:**
```bash
docker compose ps                 # Xem trạng thái
docker compose restart backend    # Restart backend
docker compose down -v            # Dừng + xóa dữ liệu
```

---

## 🔧 **TROUBLESHOOTING**

### **Port bị chiếm:**
```bash
# Linux/macOS
sudo lsof -i :3000 && sudo kill -9 <PID>

# Windows
netstat -ano | findstr ":3000" && taskkill /PID <PID> /F
```

### **Docker không chạy:**
```bash
# Linux
sudo systemctl start docker

# Windows/macOS: Khởi động Docker Desktop
```

### **Reset toàn bộ:**
```bash
docker compose down -v
docker system prune -a
./teenup.sh start    # hoặc teenup.bat start
```

### **Backend không kết nối:**
```bash
# Kiểm tra backend logs
docker compose logs backend

# Kiểm tra database
docker compose exec db mysqladmin ping -h localhost -u root -prootpass
```

---

## 🛠️ **PHÁT TRIỂN**

### **Local Development:**

**Frontend (React):**
```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

**Backend (Spring Boot):**
```bash
cd backend/contest
./mvnw spring-boot:run   # http://localhost:8081
```

**Database (MySQL):**
```bash
docker compose up -d db  # localhost:3306
```

### **Environment Variables:**
Hệ thống tự tạo file `.env` với cấu hình:
```bash
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=teenup
MYSQL_USER=teenup
MYSQL_PASSWORD=teenup123
FRONTEND_PORT=3000
BACKEND_PORT=8081
DATABASE_PORT=3306
SPRING_PROFILES_ACTIVE=dev
TZ=Asia/Bangkok
```

### **Build Production:**
```bash
docker compose build --no-cache
docker compose up -d
```

---

## 📊 **DỮ LIỆU MẪU**

Hệ thống tự động tạo dữ liệu mẫu khi khởi động:

### **👨‍👩‍👧‍👦 Phụ huynh (2):**
- **Nguyen Van A** - 📞 0901111111, 📧 a@example.com
- **Tran Thi B** - 📞 0902222222, 📧 b@example.com

### **👨‍🎓 Học sinh (3):**
- **Minh** (Lớp 7) - Phụ huynh: Nguyen Van A
- **Lan** (Lớp 8) - Phụ huynh: Nguyen Van A  
- **Hoang** (Lớp 6) - Phụ huynh: Tran Thi B

### **📚 Lớp học (3):**
- **Toán Nâng Cao** - Thứ 3, 14:00-15:30, Thầy A
- **Tiếng Anh A2** - Thứ 5, 08:00-09:30, Cô B
- **Khoa học Vui** - Thứ 7, 09:00-10:30, Thầy C

### **🎁 Gói học:**
- **Basic-12** (Minh): 12 buổi, 0 đã sử dụng
- **Basic-08** (Lan): 8 buổi, 1 đã sử dụng

---

## 📡 **API REFERENCE**

### **Endpoints chính:**

**Parents (Phụ huynh):**
```bash
GET    /api/parents/list              # Danh sách
GET    /api/parents/{id}              # Chi tiết
POST   /api/parents                   # Tạo mới
PATCH  /api/parents/{id}              # Cập nhật
DELETE /api/parents/{id}              # Xóa
```

**Students (Học sinh):**
```bash
GET    /api/students/list             # Danh sách
GET    /api/students/{id}             # Chi tiết
POST   /api/students                  # Tạo mới
PATCH  /api/students/{id}             # Cập nhật
DELETE /api/students/{id}             # Xóa
```

**Classes (Lớp học):**
```bash
GET    /api/classes                   # Danh sách lớp
GET    /api/classes/{id}              # Chi tiết lớp
POST   /api/classes                   # Tạo lớp mới
PATCH  /api/classes/{id}              # Cập nhật lớp
DELETE /api/classes/{id}              # Xóa lớp
```

**Subscriptions (Gói học):**
```bash
GET    /api/subscriptions             # Danh sách gói
POST   /api/subscriptions             # Tạo gói mới
PATCH  /api/subscriptions/{id}        # Cập nhật gói
DELETE /api/subscriptions/{id}        # Xóa gói
```

**Registrations (Đăng ký lớp):**
```bash
POST   /api/registrations             # Đăng ký lớp
DELETE /api/registrations             # Hủy đăng ký
```

### **Ví dụ API calls:**
```bash
# Lấy danh sách học sinh
curl http://localhost:8081/api/students/list

# Tạo phụ huynh mới
curl -X POST http://localhost:8081/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Nguyen Van C","phone":"0903333333","email":"c@example.com"}'

# Đăng ký học sinh vào lớp
curl -X POST http://localhost:8081/api/registrations \
  -H "Content-Type: application/json" \
  -d '{"classId":1,"studentId":1}'
```

---

## 🏗️ **KIẾN TRÚC HỆ THỐNG**

### **Technology Stack:**
- **Frontend:** React 18 + Vite + Ant Design + Axios
- **Backend:** Spring Boot 3 + Java 21 + MySQL 8 + JPA
- **Container:** Docker + Docker Compose
- **Scripts:** Cross-platform shell scripts

### **Database Schema:**
```
Parents (1) ←→ (N) Students
Students (N) ←→ (M) Classes (via ClassRegistrations)
Students (1) ←→ (N) Subscriptions
```

### **Business Rules:**
- Học sinh phải thuộc về một phụ huynh
- Sức chứa lớp không được vượt quá maxStudents
- Số buổi học sử dụng không được vượt quá tổng buổi
- Không được trùng lịch học cho cùng một học sinh

---

## 📞 **HỖ TRỢ**

### **Kiểm tra nhanh:**
```bash
./teenup.sh health      # Health check
./teenup.sh status      # Trạng thái services  
./teenup.sh info        # Thông tin hệ thống
```

### **Liên hệ hỗ trợ:**
- 📖 **Tài liệu:** File này
- 🐛 **Báo lỗi:** Kiểm tra logs + restart services
- 💡 **Đề xuất:** Tạo issue trong repository

---

**📅 Cập nhật:** Tháng 8 2025  
**✨ Trạng thái:** Production Ready
