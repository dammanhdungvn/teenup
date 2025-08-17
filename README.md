# 🎓 TeenUp Contest Management System

**Hệ thống quản lý cuộc thi** với React Frontend + Spring Boot Backend + MySQL Database.

## 🚀 **KHỞI ĐỘNG NHANH**

### **1️⃣ Cài đặt Docker** 
[Xem hướng dẫn chi tiết](docs/DOCKER-SETUP.md)

### **2️⃣ Chạy hệ thống**

**🐧 Linux/macOS/WSL:**
```bash
./teenup.sh start
```

**🪟 Windows:**  
```cmd
teenup.bat start
```

### **3️⃣ Truy cập ứng dụng**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8081/api
- 🗄️ **Database:** localhost:3306

**✅ Xong! Hệ thống đã sẵn sàng.**

---

## 📋 **LỆNH CƠ BẢN**

```bash
# Linux/macOS/WSL
./teenup.sh start     # Khởi động
./teenup.sh stop      # Dừng
./teenup.sh health    # Kiểm tra
./teenup.sh status    # Trạng thái
./teenup.sh info      # Thông tin

# Windows
teenup.bat start      # Khởi động  
teenup.bat stop       # Dừng
teenup.bat health     # Kiểm tra
```

## 🔧 **TROUBLESHOOTING**

### **Lỗi thường gặp:**

**Port bị chiếm:**
```bash
# Linux/macOS
sudo lsof -i :3000 && sudo kill -9 <PID>

# Windows  
netstat -ano | findstr ":3000" && taskkill /PID <PID> /F
```

**Docker không chạy:**
- **Windows:** Khởi động Docker Desktop
- **Linux:** `sudo systemctl start docker`
- **macOS:** Khởi động Docker Desktop

**Reset hoàn toàn:**
```bash
docker compose down -v && ./teenup.sh start  # Linux/macOS
docker compose down -v && teenup.bat start   # Windows
```

## 📊 **DỮ LIỆU MẪU**

Hệ thống tự động tạo:
- **2 Parents:** Nguyen Van A, Tran Thi B
- **3 Students:** Minh (Grade 7), Lan (Grade 8), Hoang (Grade 6)  
- **3 Classes:** Toán Nâng Cao, Tiếng Anh A2, Khoa học Vui
- **2 Subscriptions:** Basic-12, Basic-08

## 📚 **TÀI LIỆU CHI TIẾT**

- 📚 **[Hướng dẫn đầy đủ](docs/README.md)** - Tài liệu chi tiết bằng tiếng Việt
- 📡 **[API Documentation](docs/API.md)** - REST API reference chi tiết

## 🛠️ **DEVELOPMENT**

### **Local Development:**
```bash
# Frontend
cd frontend && npm install && npm run dev     # http://localhost:5173

# Backend  
cd backend/contest && ./mvnw spring-boot:run  # http://localhost:8081

# Database
docker compose up -d db                       # localhost:3306
```

### **Docker Development:**
```bash
./teenup.sh start                             # Toàn bộ hệ thống
docker compose up -d db                       # Chỉ database
docker compose up -d backend                  # + backend  
docker compose up -d frontend                 # + frontend
```

## 📁 **CẤU TRÚC DỰ ÁN**

```
teenup/
├── 🚀 teenup.sh/bat       # Universal control script
├── 📋 README.md           # File này
├── 🐳 docker-compose.yml  # Container config
├── 📁 scripts/            # Control scripts cho từng OS
├── 📁 docs/               # Tài liệu chi tiết
├── 📁 backend/contest/    # Spring Boot API
├── 📁 frontend/           # React UI
└── 📁 logs/               # Application logs
```

---

## 📞 **HỖ TRỢ**

🆘 **Gặp vấn đề?**
1. Chạy: `./teenup.sh health` hoặc `teenup.bat health`
2. Xem logs: `docker compose logs -f`
3. Đọc tài liệu: [docs/INDEX.md](docs/INDEX.md)

**🎉 Chúc bạn sử dụng thành công!**