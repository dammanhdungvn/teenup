# 📡 API Documentation - TeenUp Contest Management

**REST API** cho hệ thống quản lý cuộc thi TeenUp.

## 🌐 **BASE URL**
```
http://localhost:8081/api
```

---

## 👨‍👩‍👧‍👦 **PARENTS API**

### **Lấy danh sách phụ huynh**
```http
GET /api/parents/list
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Nguyen Van A",
    "phone": "0901111111", 
    "email": "a@example.com",
    "createdAt": "2025-08-16T15:27:27.537465Z",
    "updatedAt": "2025-08-16T15:27:27.537465Z"
  }
]
```

### **Lấy chi tiết phụ huynh**
```http
GET /api/parents/{id}
```

### **Tạo phụ huynh mới**
```http
POST /api/parents
Content-Type: application/json

{
  "name": "Tran Van B",
  "phone": "0902222222",
  "email": "b@example.com"
}
```

### **Cập nhật phụ huynh**
```http
PATCH /api/parents/{id}
Content-Type: application/json

{
  "name": "New Name",
  "phone": "0903333333"
}
```

### **Xóa phụ huynh**
```http
DELETE /api/parents/{id}
```

---

## 👨‍🎓 **STUDENTS API**

### **Lấy danh sách học sinh**
```http
GET /api/students/list
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Minh",
    "dob": "2012-05-10",
    "gender": "M",
    "currentGrade": "Grade 7",
    "parent": {
      "id": 1,
      "name": "Nguyen Van A",
      "phone": "0901111111",
      "email": "a@example.com"
    },
    "createdAt": "2025-08-16T15:27:27.633465Z",
    "updatedAt": "2025-08-16T15:27:27.633465Z"
  }
]
```

### **Lấy chi tiết học sinh**
```http
GET /api/students/{id}
```

### **Tạo học sinh mới**
```http
POST /api/students
Content-Type: application/json

{
  "name": "Le Thi C",
  "dob": "2013-03-15",
  "gender": "F",
  "currentGrade": "Grade 6",
  "parentId": 1
}
```

### **Cập nhật học sinh**
```http
PATCH /api/students/{id}
Content-Type: application/json

{
  "name": "New Name",
  "currentGrade": "Grade 8"
}
```

### **Xóa học sinh**
```http
DELETE /api/students/{id}
```

---

## 📚 **CLASSES API**

### **Lấy danh sách lớp học**
```http
GET /api/classes
```

**Query Parameters:**
- `dayOfWeek` (optional): Lọc theo thứ (1-7)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Toán Nâng Cao",
    "subject": "Math",
    "dayOfWeek": 2,
    "timeSlot": "14:00-15:30",
    "teacherName": "Thầy A",
    "maxStudents": 20,
    "createdAt": "2025-08-16T15:27:27.650667Z",
    "updatedAt": "2025-08-16T15:27:27.650667Z"
  }
]
```

### **Lấy chi tiết lớp học**
```http
GET /api/classes/{id}
```

### **Tạo lớp học mới**
```http
POST /api/classes
Content-Type: application/json

{
  "name": "Văn Nâng Cao",
  "subject": "Literature", 
  "dayOfWeek": 3,
  "timeSlot": "16:00-17:30",
  "teacherName": "Cô D",
  "maxStudents": 15
}
```

### **Cập nhật lớp học**
```http
PATCH /api/classes/{id}
Content-Type: application/json

{
  "maxStudents": 25,
  "timeSlot": "15:00-16:30"
}
```

### **Xóa lớp học**
```http
DELETE /api/classes/{id}
```

---

## 🎁 **SUBSCRIPTIONS API**

### **Lấy danh sách gói học**
```http
GET /api/subscriptions
```

**Query Parameters:**
- `studentId` (optional): Lọc theo học sinh

**Response:**
```json
[
  {
    "id": 1,
    "studentId": 1,
    "packageName": "Basic-12",
    "startDate": "2025-08-01",
    "endDate": "2025-10-31",
    "totalSessions": 12,
    "usedSessions": 0,
    "createdAt": "2025-08-16T15:27:27.670Z",
    "updatedAt": "2025-08-16T15:27:27.670Z"
  }
]
```

### **Tạo gói học mới**
```http
POST /api/subscriptions
Content-Type: application/json

{
  "studentId": 1,
  "packageName": "Premium-20",
  "startDate": "2025-09-01",
  "endDate": "2025-12-31", 
  "totalSessions": 20
}
```

### **Cập nhật gói học**
```http
PATCH /api/subscriptions/{id}
Content-Type: application/json

{
  "endDate": "2026-01-31",
  "totalSessions": 25
}
```

### **Xóa gói học**
```http
DELETE /api/subscriptions/{id}
```

---

## 📝 **REGISTRATIONS API**

### **Đăng ký học sinh vào lớp**
```http
POST /api/registrations
Content-Type: application/json

{
  "classId": 1,
  "studentId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công"
}
```

### **Hủy đăng ký**
```http
DELETE /api/registrations
Content-Type: application/json

{
  "classId": 1,
  "studentId": 1
}
```

---

## 📊 **DASHBOARD API**

### **Lấy tổng quan hệ thống**
```http
GET /api/dashboard/overview
```

**Response:**
```json
{
  "totalParents": 2,
  "totalStudents": 3,
  "totalClasses": 3,
  "totalSubscriptions": 2,
  "totalRegistrations": 1
}
```

---

## ⚠️ **ERROR HANDLING**

### **Error Response Format:**
```json
{
  "timestamp": "2025-08-16T15:30:40.550+00:00",
  "status": 400,
  "error": "Bad Request", 
  "message": "Validation failed",
  "details": {
    "field": "name",
    "message": "Name cannot be empty"
  }
}
```

### **HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (business rule violations)
- `422` - Unprocessable Entity

### **Common Errors:**

**Validation Error (400):**
```json
{
  "status": 400,
  "error": "Validation failed",
  "message": "Name cannot be empty"
}
```

**Not Found (404):**
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Student with id 999 not found"
}
```

**Business Rule Violation (409):**
```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Class is full (20/20 students)"
}
```

---

## 🧪 **TESTING API**

### **Sử dụng curl:**
```bash
# Lấy danh sách học sinh
curl http://localhost:8081/api/students/list

# Tạo phụ huynh mới  
curl -X POST http://localhost:8081/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Parent","phone":"0904444444","email":"test@example.com"}'

# Cập nhật học sinh
curl -X PATCH http://localhost:8081/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"currentGrade":"Grade 8"}'
```

### **Sử dụng Postman:**
1. Import collection từ file `postman_collection.json` (nếu có)
2. Set base URL: `http://localhost:8081/api`
3. Add header: `Content-Type: application/json`

---

## 🔐 **AUTHENTICATION**

Hiện tại API **không yêu cầu authentication**. Trong production cần thêm:
- JWT tokens
- Role-based access control
- Rate limiting
- API keys

---

## 📈 **RATE LIMITING**

Hiện tại **không có rate limiting**. Khuyến nghị production:
- 100 requests/minute per IP
- 1000 requests/hour per API key
- Burst limit: 10 requests/second

---

**📅 Cập nhật:** Tháng 8 2025  
**🔧 Version:** 1.0.0
