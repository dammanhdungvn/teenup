# 🏗️ System Architecture Overview

## **🎯 Tổng quan kiến trúc**

Hệ thống TeenUp Contest Management được xây dựng theo kiến trúc **3-tier** với separation of concerns rõ ràng:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│                    (React Frontend)                        │
│                    Port: 3000/5173                         │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP API
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│                   (Spring Boot Backend)                    │
│                      Port: 8081                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ JDBC
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                             │
│                    (MySQL Database)                        │
│                      Port: 3306                            │
└─────────────────────────────────────────────────────────────┘
```

## **🌐 Frontend Architecture**

### **Technology Stack:**
- **Framework:** React 18.2.0
- **UI Library:** Ant Design 5.27.0
- **Build Tool:** Vite 7.1.2
- **Routing:** React Router DOM 7.8.0
- **HTTP Client:** Axios 1.11.0
- **State Management:** React Hooks + Context

### **Component Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # App layout & navigation
│   ├── Common/         # Shared components
│   └── Forms/          # Form components
├── pages/              # Page components
│   ├── Home/           # Dashboard
│   ├── Students/       # Student management
│   ├── Parents/        # Parent management
│   ├── Classes/        # Class management
│   └── Subscriptions/  # Subscription management
├── services/           # API service layer
├── utils/              # Utility functions
├── config/             # Configuration files
└── styles/             # Global styles
```

## **🔧 Backend Architecture**

### **Technology Stack:**
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 21
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA + Hibernate
- **Build Tool:** Maven 3.8.7
- **Validation:** Jakarta Validation

### **Layer Structure:**
```
contest/
├── controller/         # REST API endpoints
├── service/            # Business logic layer
├── repository/         # Data access layer
├── entity/             # JPA entities
├── dto/                # Data transfer objects
├── mapper/             # MapStruct mappers
├── exception/          # Custom exceptions
└── config/             # Configuration classes
```

## **🗄️ Database Architecture**

### **Core Entities:**
- **Parent** - Thông tin phụ huynh
- **Student** - Thông tin học sinh
- **Class** - Thông tin lớp học
- **ClassRegistration** - Đăng ký lớp học
- **Subscription** - Gói học

### **Relationships:**
```
Parent (1) ←→ (N) Student
Student (N) ←→ (M) Class (via ClassRegistration)
Student (1) ←→ (N) Subscription
```

### **Key Constraints:**
- Student phải thuộc về một Parent
- ClassRegistration unique per (class, student)
- Class.maxStudents ≥ số đăng ký hiện tại
- Subscription.endDate ≥ startDate

## **🐳 Deployment Architecture**

### **Docker Services:**
```yaml
services:
  db:          # MySQL 8.0 (Port: 3306)
  backend:     # Spring Boot (Port: 8081)
  frontend:    # React + Nginx (Port: 3000)
```

### **Network Configuration:**
- **Custom network:** `teenup_network`
- **Health checks** cho tất cả services
- **Volume persistence** cho database
- **Environment variables** cho configuration

## **🔌 API Architecture**

### **RESTful Design:**
- **Base path:** `/api`
- **HTTP methods:** GET, POST, PATCH, DELETE
- **Status codes:** 200, 201, 204, 400, 404, 409, 422
- **Error format:** Standardized error envelope

### **Authentication & Security:**
- **CORS configuration** cho development
- **Input validation** ở DTO level
- **Business rule validation** ở service level
- **Optimistic locking** với @Version

## **📊 Performance Considerations**

### **Database Optimization:**
- **Indexes** trên foreign keys và search fields
- **JPQL queries** thay vì Java filtering
- **Fetch joins** để tránh N+1 queries
- **Connection pooling** với HikariCP

### **Frontend Optimization:**
- **Code splitting** với React.lazy()
- **Memoization** với React.memo()
- **Debounced search** cho API calls
- **Pagination** cho large datasets

## **🔍 Monitoring & Logging**

### **Application Monitoring:**
- **Spring Boot Actuator** endpoints
- **Health checks** cho database và services
- **Metrics** cho performance monitoring
- **Structured logging** với SLF4J

### **Error Handling:**
- **Global exception handler** với @ControllerAdvice
- **Custom error codes** cho business logic
- **Detailed error messages** cho development
- **User-friendly messages** cho production

---

**📅 Last Updated:** December 2024  
**🔄 Version:** 1.0.0  
**👥 Maintainer:** Development Team
