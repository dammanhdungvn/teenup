# 🚀 TeenUp Contest Management System - Scripts Guide

## 📋 Tổng quan Scripts

Dự án này cung cấp **4 scripts** để khởi động và dừng hệ thống trên các môi trường khác nhau:

### **🪟 Windows Native (Docker Desktop)**
```cmd
start.bat      # Khởi động system
stop.bat       # Dừng system (có tùy chọn xóa dữ liệu)
```

### **🐧 Linux/macOS Native**
```bash
./start.sh     # Khởi động system
./stop.sh      # Dừng system (có tùy chọn xóa dữ liệu)
```

### **🪟 Windows + WSL2**
```cmd
start-wsl2.bat # Chạy từ Windows, thực thi trong WSL2
stop-wsl2.bat  # Dừng từ Windows, thực thi trong WSL2
```

---

## 🎯 Chọn Script Phù Hợp

### **Môi trường Windows:**
- **Docker Desktop có sẵn** → `start.bat` / `stop.bat`
- **Muốn dùng WSL2** → `start-wsl2.bat` / `stop-wsl2.bat`
- **Đang trong WSL terminal** → `./start.sh` / `./stop.sh` (dùng Linux scripts)

### **Môi trường Linux/macOS:**
- **Docker Engine** → `./start.sh` / `./stop.sh`

---

## ⚡ Quick Start

### **Windows với Docker Desktop:**
```cmd
# Khởi động
start.bat

# Dừng (giữ dữ liệu)
stop.bat
> Nhấn N khi hỏi xóa volumes

# Dừng (xóa dữ liệu)
stop.bat
> Nhấn Y khi hỏi xóa volumes
```

### **Linux/macOS hoặc WSL terminal:**
```bash
# Khởi động
./start.sh

# Dừng (giữ dữ liệu)
./stop.sh
> Nhấn N khi hỏi xóa volumes

# Dừng (xóa dữ liệu)  
./stop.sh
> Nhấn Y khi hỏi xóa volumes
```

### **Windows với WSL2:**
```cmd
# Khởi động
start-wsl2.bat

# Dừng (giữ dữ liệu)
stop-wsl2.bat
> Nhấn N khi hỏi xóa volumes

# Dừng (xóa dữ liệu)
stop-wsl2.bat
> Nhấn Y khi hỏi xóa volumes
```

---

## 🔧 Tính Năng Chung

### **Tất cả 4 scripts đều có:**
✅ Kiểm tra môi trường tự động  
✅ Tạo file `.env` nếu thiếu  
✅ Kiểm tra Docker và Docker Compose  
✅ Khởi động services theo thứ tự đúng  
✅ Đợi services sẵn sàng  
✅ Hiển thị thông tin truy cập  
✅ Tùy chọn xóa/giữ dữ liệu khi dừng  
✅ Error handling và troubleshooting tips  

### **URLs sau khi khởi động:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081/api  
- **API Docs**: http://localhost:8081/api-docs
- **Database**: localhost:3306

---

## 🛠️ Troubleshooting

### **Lệnh debug chung:**
```bash
# Xem logs tất cả services
docker compose logs -f

# Xem logs từng service
docker compose logs backend
docker compose logs frontend  
docker compose logs db

# Xem trạng thái containers
docker compose ps

# Reset hoàn toàn (xóa dữ liệu)
docker compose down -v
```

### **Lỗi thường gặp:**

#### **Port đã được sử dụng:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
sudo lsof -i :3000
sudo kill -9 <PID>
```

#### **Docker không chạy:**
```bash
# Windows: Khởi động Docker Desktop
# Linux: sudo systemctl start docker
# macOS: Khởi động Docker Desktop
```

#### **WSL2 issues:**
```cmd
# Kiểm tra WSL2
wsl --status
wsl --list --verbose

# Khởi động Docker trong WSL2
wsl sudo service docker start
```

---

## 📚 Thêm Thông Tin

- **Repository**: https://github.com/dammanhdungvn/teenup
- **Documentation**: Xem thư mục `docs/`
- **API Documentation**: http://localhost:8081/api-docs (sau khi khởi động)

---

**💡 Tip**: Chọn 1 trong 4 scripts và sử dụng nhất quán để tránh conflicts!

### **📂 Script Files Summary:**
```
start.bat        - Windows + Docker Desktop
stop.bat         - Windows + Docker Desktop
start.sh         - Linux/macOS + WSL terminal  
stop.sh          - Linux/macOS + WSL terminal
start-wsl2.bat   - Windows → WSL2
stop-wsl2.bat    - Windows → WSL2
```
