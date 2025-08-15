# 🐳 Docker Setup Guide

Hướng dẫn cài đặt **Docker** và **Docker Compose** cho từng hệ điều hành.

## **🪟 Windows**

### **Yêu cầu:**
- Windows 10/11 (64-bit)
- WSL2 (Windows Subsystem for Linux 2)
- Virtualization enabled trong BIOS

### **Cài đặt Docker Desktop:**
1. **Tải Docker Desktop:**
   - Truy cập: https://www.docker.com/products/docker-desktop
   - Download "Docker Desktop for Windows"

2. **Cài đặt:**
   - Chạy file `.exe` đã tải
   - Chọn "Use WSL 2 instead of Hyper-V" (recommended)
   - Restart máy tính

3. **Khởi động Docker:**
   - Mở Docker Desktop từ Start Menu
   - Đợi Docker Engine khởi động hoàn tất
   - Kiểm tra: `docker --version`

### **Cài đặt WSL2 (nếu chưa có):**
```cmd
# Mở PowerShell as Administrator
wsl --install

# Restart máy tính
# WSL2 sẽ tự động cài đặt Ubuntu
```

### **Kiểm tra cài đặt:**
```cmd
docker --version
docker-compose --version
docker info
```

---

## **🐧 Ubuntu/Linux**

### **Ubuntu 20.04+ / Debian 11+:**
```bash
# Cập nhật package list
sudo apt update

# Cài đặt dependencies
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Thêm Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Thêm user vào docker group
sudo usermod -aG docker $USER

# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Logout và login lại để áp dụng group changes
```

### **CentOS 8+ / RHEL 8+:**
```bash
# Cài đặt dependencies
sudo yum install -y yum-utils

# Thêm Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Cài đặt Docker
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Thêm user vào docker group
sudo usermod -aG docker $USER
```

### **Kiểm tra cài đặt:**
```bash
docker --version
docker-compose --version
docker info

# Test Docker
sudo docker run hello-world
```

---

## **🍎 macOS**

### **Yêu cầu:**
- macOS 10.15+ (Catalina, Big Sur, Monterey, Ventura)
- Apple Silicon (M1/M2) hoặc Intel processor

### **Cài đặt Docker Desktop:**
1. **Tải Docker Desktop:**
   - Truy cập: https://www.docker.com/products/docker-desktop
   - Download "Docker Desktop for Mac"

2. **Cài đặt:**
   - Mở file `.dmg` đã tải
   - Kéo Docker app vào Applications folder
   - Mở Docker Desktop từ Applications

3. **Cấu hình:**
   - Chọn "Use the new Virtualization framework" (M1/M2)
   - Đợi Docker Engine khởi động

### **Cài đặt qua Homebrew:**
```bash
# Cài đặt Homebrew (nếu chưa có)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài đặt Docker
brew install --cask docker

# Khởi động Docker Desktop
open /Applications/Docker.app
```

### **Kiểm tra cài đặt:**
```bash
docker --version
docker-compose --version
docker info
```

---

## **🔧 Cài đặt Docker Compose (nếu cần)**

### **Windows/macOS:**
- Docker Compose đã được tích hợp trong Docker Desktop

### **Linux (nếu chưa có):**
```bash
# Cài đặt Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Hoặc cài đặt standalone
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## **✅ Kiểm tra cài đặt**

### **Test Docker:**
```bash
# Chạy container test
docker run hello-world

# Kiểm tra Docker Compose
docker-compose --version

# Kiểm tra Docker info
docker info
```

### **Test Docker Compose:**
```bash
# Tạo test docker-compose.yml
cat > test-compose.yml << EOF
version: '3.9'
services:
  test:
    image: hello-world
EOF

# Chạy test
docker-compose -f test-compose.yml up

# Dọn dẹp
docker-compose -f test-compose.yml down
rm test-compose.yml
```

---

## **🚀 Khởi động TeenUp Contest System**

### **Sau khi cài đặt Docker thành công:**

#### **🐧 Ubuntu/Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

#### **🪟 Windows:**
```cmd
start.bat
```

---

## **🔍 Troubleshooting**

### **Windows:**
- **Docker Desktop không khởi động:** Kiểm tra WSL2 và virtualization
- **Port conflicts:** Kiểm tra Windows Defender Firewall
- **Permission denied:** Chạy PowerShell as Administrator

### **Linux:**
- **Permission denied:** Thêm user vào docker group và logout/login
- **Service không start:** Kiểm tra `sudo systemctl status docker`
- **Port conflicts:** Kiểm tra `sudo netstat -tulpn`

### **macOS:**
- **Docker Desktop crash:** Kiểm tra system requirements
- **Port conflicts:** Kiểm tra macOS firewall
- **Performance issues:** Tăng memory allocation trong Docker Desktop

---

## **📚 Tài liệu tham khảo**

- **Docker Official Docs:** https://docs.docker.com/
- **Docker Desktop:** https://docs.docker.com/desktop/
- **Docker Compose:** https://docs.docker.com/compose/
- **WSL2 Setup:** https://docs.microsoft.com/en-us/windows/wsl/
