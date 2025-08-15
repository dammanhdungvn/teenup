# 📚 TeenUp Contest - Technical Documentation

## **🎯 Tổng quan**

Thư mục này chứa **tài liệu kỹ thuật chính** cho hệ thống TeenUp Contest Management, được tổ chức theo chuẩn chuyên nghiệp với cấu trúc rõ ràng và không trùng lặp.

## **📁 Cấu trúc tài liệu**

### **🎯 [Project Specification](project-spec.md)**
**Mô tả:** Đặc tả kỹ thuật chi tiết cho toàn bộ hệ thống
**Nội dung:**
- Domain model và business rules
- API specifications và error codes  
- Functional requirements cho tất cả modules
- Technical design và implementation details
- Data contracts (JSON schemas)
- Testing strategy và acceptance criteria

**Phù hợp cho:** Project Managers, Architects, Development Team, QA Engineers

---

### **🏗️ [System Architecture](ARCHITECTURE.md)**
**Mô tả:** Tổng quan kiến trúc hệ thống
**Nội dung:**
- System architecture overview
- Technology stack cho từng layer
- Database design và relationships
- Deployment architecture
- Performance considerations
- Monitoring và logging

**Phù hợp cho:** Architects, DevOps Engineers, Development Team

---

### **🌐 Frontend Documentation**
**Vị trí:** `frontend/docs/`
**Entry Point:** [Frontend Index](frontend/docs/INDEX.md)

**Tài liệu chính:**
- [Setup & Installation](frontend/docs/SETUP.md) - Cài đặt và chạy
- [Project Structure](frontend/docs/STRUCTURE.md) - Cấu trúc code
- [API Integration](frontend/docs/API-INTEGRATION.md) - Kết nối backend
- [Development Guide](frontend/docs/DEVELOPMENT.md) - Hướng dẫn phát triển
- [Docker Guide](frontend/docs/DOCKER.md) - Containerization

---

### **🔧 Backend Documentation**
**Vị trí:** `backend/contest/docs/`
**Entry Point:** [Backend Index](backend/contest/docs/INDEX.md)

**Tài liệu chính:**
- [Architecture](backend/contest/docs/ARCHITECTURE.md) - Kiến trúc hệ thống
- [Business Logic](backend/contest/docs/BUSINESS-LOGIC.md) - Business rules
- [API Endpoints](backend/contest/docs/api-endpoints.md) - API documentation
- [Development Guide](backend/contest/docs/DEVELOPMENT.md) - Hướng dẫn phát triển

---

### **🐳 System Documentation**
**Vị trí:** Root directory
**Tài liệu chính:**
- [Main README](../../README.md) - Tổng quan toàn bộ hệ thống
- [Docker Setup](../../docker-compose.yml) - Cấu hình Docker
- [Docker Installation Guide](../../DOCKER-SETUP.md) - Hướng dẫn cài đặt Docker

## **🔍 Hướng dẫn sử dụng**

### **Cho Project Managers:**
1. Bắt đầu với **[Project Specification](project-spec.md)** để hiểu yêu cầu
2. Xem **[Main README](../../README.md)** để hiểu tổng quan
3. Sử dụng **[Frontend Index](frontend/docs/INDEX.md)** và **[Backend Index](backend/contest/docs/INDEX.md)** để navigate

### **Cho Development Team:**
1. **Frontend Developers**: Sử dụng [Frontend Index](frontend/docs/INDEX.md)
2. **Backend Developers**: Sử dụng [Backend Index](backend/contest/docs/INDEX.md)
3. **Full-stack Developers**: Sử dụng cả hai và [Project Specification](project-spec.md)

### **Cho DevOps Engineers:**
1. Xem **[Docker Setup](../../docker-compose.yml)** và **[Docker Guide](../../DOCKER-SETUP.md)**
2. Tham khảo **[Backend Index](backend/contest/docs/INDEX.md)** cho deployment
3. Sử dụng **[Frontend Index](frontend/docs/INDEX.md)** cho frontend deployment

## **📊 Trạng thái tài liệu**

| Tài liệu | Trạng thái | Cập nhật cuối | Người phụ trách |
|----------|------------|----------------|-----------------|
| [Project Specification](project-spec.md) | ✅ Hoàn thành | Dec 2024 | Development Team |
| [Frontend Docs](frontend/docs/INDEX.md) | ✅ Hoàn thành | Dec 2024 | Frontend Team |
| [Backend Docs](backend/contest/docs/INDEX.md) | ✅ Hoàn thành | Dec 2024 | Backend Team |
| [System Docs](../../README.md) | ✅ Hoàn thành | Dec 2024 | DevOps Team |

## **🔗 Liên kết ngoài**

### **Development Resources:**
- [React Documentation](https://react.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Docker Documentation](https://docs.docker.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### **Project Resources:**
- [GitHub Repository](https://github.com/your-org/teenup-contest)
- [Issue Tracker](https://github.com/your-org/teenup-contest/issues)
- [Project Wiki](https://github.com/your-org/teenup-contest/wiki)

---

**📅 Last Updated:** December 2024  
**🔄 Version:** 1.0.0  
**👥 Maintainer:** Development Team
