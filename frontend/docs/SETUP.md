# 🚀 Setup & Installation

Hướng dẫn cài đặt và chạy **React Frontend** của TeenUp Contest Management System.

## **📋 Yêu cầu hệ thống**

### **Prerequisites:**
- **Node.js:** Version 18.x hoặc cao hơn
- **npm:** Version 9.x hoặc cao hơn
- **Git:** Để clone repository

### **Kiểm tra phiên bản:**
```bash
node --version    # >= 18.0.0
npm --version     # >= 9.0.0
git --version     # >= 2.0.0
```

## **🔧 Cài đặt**

### **1. Clone project:**
```bash
git clone <repository-url>
cd Contest/frontend
```

### **2. Cài đặt dependencies:**
```bash
npm install
```

### **3. Tạo file môi trường:**
```bash
# Copy từ template
cp .env.example .env

# Chỉnh sửa nếu cần
VITE_API_BASE_URL=http://localhost:8081
```

## **🏃‍♂️ Chạy ứng dụng**

### **Development Mode:**
```bash
npm run dev
```

**Kết quả:**
- 🌐 **Local URL:** http://localhost:5173 (Vite dev server)
- 🔄 **Hot Reload:** Tự động refresh khi thay đổi code
- 📱 **Responsive:** Test trên các kích thước màn hình khác nhau

### **Production Build:**
```bash
npm run build
npm run preview
```

**Kết quả:**
- 📦 **Build folder:** `dist/`
- 🌐 **Preview URL:** http://localhost:4173
- ⚡ **Optimized:** Code đã được tối ưu hóa

## **🔌 Kết nối Backend**

### **Ports Configuration:**

#### **🐳 Docker Environment:**
- **Frontend:** Port 3000 (Nginx serve static files)
- **Backend:** Port 8081 (Spring Boot)
- **Database:** Port 3306 (MySQL)

#### **💻 Local Development:**
- **Frontend:** Port 5173 (Vite dev server)
- **Backend:** Port 8081 (Spring Boot)
- **Database:** Port 3306 (MySQL hoặc Docker)

### **Yêu cầu:**
- Backend Spring Boot đang chạy trên port 8081
- Database MySQL đang hoạt động

### **Kiểm tra kết nối:**
```bash
# Test backend API
curl http://localhost:8081/actuator/health

# Test database
curl http://localhost:8081/api/students/list
```

## **🐳 Chạy với Docker**

### **Option 1: Chạy toàn bộ hệ thống (Recommended)**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Từ root directory
cd ..
./start.sh
```

#### **🪟 Windows:**
```cmd
# Từ root directory
cd ..
start.bat
```

### **Option 2: Chỉ chạy frontend**
```bash
# Build image
docker build -t teenup-frontend .

# Run container
docker run -p 3000:80 teenup-frontend
```

## **🔍 Troubleshooting**

### **Port conflicts:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Kiểm tra port đang sử dụng
lsof -i :5173    # Vite dev server (Local)
lsof -i :3000    # Docker frontend
lsof -i :8081    # Backend API

# Kill process nếu cần
kill -9 <PID>
```

#### **🪟 Windows:**
```cmd
# Kiểm tra port đang sử dụng
netstat -an | findstr ":5173"    # Vite dev server (Local)
netstat -an | findstr ":3000"    # Docker frontend
netstat -an | findstr ":8081"    # Backend API

# Kill process nếu cần
taskkill /PID <PID> /F
```

### **Dependencies issues:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

#### **🪟 Windows:**
```cmd
# Xóa node_modules và cài lại
rmdir /s /q node_modules
del package-lock.json
npm install
```

### **Build errors:**
```bash
# Clear cache
npm run build -- --force

# Check Node.js version
node --version
```

### **API connection errors:**
```bash
# Kiểm tra backend status
curl http://localhost:8081/actuator/health

# Kiểm tra CORS configuration
# Xem logs backend
```

## **📱 Testing**

### **Browser Testing:**
- ✅ **Chrome/Edge:** Latest version
- ✅ **Firefox:** Latest version  
- ✅ **Safari:** Latest version
- ✅ **Mobile browsers:** iOS Safari, Chrome Mobile

### **Responsive Testing:**
- 📱 **Mobile:** 320px - 768px
- 💻 **Tablet:** 768px - 1024px
- 🖥️ **Desktop:** 1024px+

### **Feature Testing:**
- 🎓 **Student CRUD:** Create, Read, Update, Delete
- 👨‍👩‍👧‍👦 **Parent CRUD:** Create, Read, Update, Delete
- 📚 **Class Management:** Schedule, registration
- 🎁 **Subscription:** Package management
- 📊 **Dashboard:** Statistics display

## **🚀 Next Steps**

Sau khi setup thành công:

1. **📖 Đọc [Development Guide](DEVELOPMENT.md)** - Hướng dẫn phát triển
2. **🏗️ Xem [Project Structure](STRUCTURE.md)** - Hiểu cấu trúc code
3. **🔌 Kiểm tra [API Integration](API-INTEGRATION.md)** - Kết nối backend
4. **🎨 Khám phá [Design System](DESIGN-SYSTEM.md)** - UI/UX guidelines

---

**🎉 Chúc bạn setup thành công!**
