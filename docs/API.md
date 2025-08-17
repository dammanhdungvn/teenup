# 📡 **TeenUp API Reference**

**REST API** cho hệ thống quản lý cuộc thi TeenUp  
**Backend:** Spring Boot 3 + MySQL 8 + JSON over HTTP  
**Base URL:** `http://localhost:8081/api`

---

## 🌐 **GLOBAL CONVENTIONS**

### **Data Types:**
- **gender:** `M` (Nam), `F` (Nữ), `O` (Khác)
- **dayOfWeek:** `1-7` tương ứng `Monday-Sunday`
- **timeSlot:** Format `HH:mm-HH:mm` (ví dụ: `09:00-10:30`)
- **dates:** ISO format `yyyy-MM-dd` (`dob`, `startDate`, `endDate`)

### **Response Format:**
Tất cả response lỗi tuân theo dạng:
```json
{
  "timestamp": "2025-08-17T10:00:00Z",
  "status": 409,
  "code": "SCHEDULE_CONFLICT", 
  "message": "Học sinh 3 trùng lịch với lớp khác vào day=2, time=14:00-15:30",
  "path": "/api/classes/1/register"
}
```

---

## 👨‍👩‍👧‍👦 **PARENTS API**

### **Tạo phụ huynh**
```http
POST /api/parents
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "phone": "0901234567", 
  "email": "a@example.com"
}
```
**201 Created**
```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "phone": "0901234567",
  "email": "a@example.com",
  "createdAt": "2025-08-17T09:00:00Z",
  "updatedAt": null
}
```

### **Danh sách phụ huynh**
```http
GET /api/parents/list
```
**200 OK**
```json
[
  { "id": 1, "name": "Nguyen Van A" },
  { "id": 2, "name": "Tran Thi B" }
]
```

### **Chi tiết phụ huynh**
```http
GET /api/parents/{id}
```
**200 OK**
```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "phone": "0901234567",
  "email": "a@example.com",
  "createdAt": "2025-08-17T09:00:00Z",
  "updatedAt": null
}
```

### **Cập nhật phụ huynh (Partial)**
```http
PATCH /api/parents/{id}
Content-Type: application/json

{
  "name": "Nguyen Van A (updated)",
  "phone": "0909999999",
  "email": "a.updated@example.com"
}
```
**200 OK**

### **Xóa phụ huynh**
```http
DELETE /api/parents/{id}
```
**204 No Content**

### **Lấy học sinh của phụ huynh**
```http
GET /api/parents/{parentId}/students
```
**200 OK**
```json
[
  { 
    "id": 3, 
    "name": "Lan", 
    "dob": "2011-09-01", 
    "gender": "F", 
    "currentGrade": "Grade 8" 
  }
]
```

### **Xóa học sinh khỏi phụ huynh**
```http
DELETE /api/parents/{parentId}/students/{studentId}
```
**204 No Content**

### **Chuyển học sinh sang phụ huynh khác**
```http
PATCH /api/parents/{sourceParentId}/reassign
Content-Type: application/json

# Chuyển TẤT CẢ học sinh
{
  "targetParentId": 2
}

# Chuyển MỘT PHẦN học sinh
{
  "targetParentId": 2,
  "studentIds": [3, 4]
}
```
**200 OK**
```json
{
  "sourceParentId": 1,
  "targetParentId": 2,
  "movedCount": 2,
  "remainingAtSource": 0
}
```

---

## 👨‍🎓 **STUDENTS API**

### **Tạo học sinh**
```http
POST /api/students
Content-Type: application/json

{
  "name": "Tran Thi B",
  "dob": "2010-09-01",
  "gender": "F", 
  "currentGrade": "Grade 8",
  "parentId": 1
}
```
**201 Created**
```json
{
  "id": 3,
  "name": "Tran Thi B",
  "dob": "2010-09-01",
  "gender": "F",
  "currentGrade": "Grade 8",
  "parent": {
    "id": 1,
    "name": "Nguyen Van A",
    "phone": "0901234567",
    "email": "a@example.com"
  }
}
```

### **Danh sách học sinh**
```http
GET /api/students/list
```
**200 OK**
```json
[
  { "id": 1, "name": "Minh", "currentGrade": "Grade 7" },
  { "id": 2, "name": "Lan", "currentGrade": "Grade 8" },
  { "id": 3, "name": "Hoang", "currentGrade": "Grade 6" }
]
```

### **Chi tiết học sinh**
```http
GET /api/students/{id}
```
**200 OK**
```json
{
  "id": 3,
  "name": "Tran Thi B",
  "dob": "2010-09-01",
  "gender": "F",
  "currentGrade": "Grade 8",
  "parent": {
    "id": 1,
    "name": "Nguyen Van A",
    "phone": "0901234567", 
    "email": "a@example.com"
  }
}
```

### **Cập nhật học sinh**
```http
PATCH /api/students/{id}
Content-Type: application/json

{
  "name": "Tran Thi B (updated)",
  "dob": "2010-09-02",
  "gender": "F",
  "currentGrade": "Grade 9",
  "parentId": 2
}
```
**200 OK**

### **Xóa học sinh**
```http
DELETE /api/students/{id}
```
**204 No Content**

### **Lấy lớp học của học sinh**
```http
GET /api/students/{studentId}/classes
```
**200 OK**
```json
[
  {
    "id": 1,
    "name": "Toán Nâng Cao",
    "subject": "Math",
    "dayOfWeek": 2,
    "timeSlot": "14:00-15:30",
    "teacherName": "Thầy A",
    "maxStudents": 20
  }
]
```

---

## 📚 **CLASSES API**

### **Tạo lớp học**
```http
POST /api/classes
Content-Type: application/json

{
  "name": "Toán Nâng Cao",
  "subject": "Math",
  "dayOfWeek": 2,
  "timeSlot": "14:00-15:30", 
  "teacherName": "Thầy A",
  "maxStudents": 20
}
```
**201 Created**
```json
{
  "id": 1,
  "name": "Toán Nâng Cao",
  "subject": "Math",
  "dayOfWeek": 2,
  "timeSlot": "14:00-15:30",
  "teacherName": "Thầy A", 
  "maxStudents": 20,
  "createdAt": "2025-08-17T09:00:00Z",
  "updatedAt": null
}
```

### **Danh sách lớp học**
```http
# Tất cả lớp
GET /api/classes

# Lọc theo ngày
GET /api/classes?day={1-7}

# Kèm danh sách học sinh đã đăng ký
GET /api/classes?expand=registrations
GET /api/classes?day={1-7}&expand=registrations
```
**200 OK**
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
    "students": [
      { "id": 3, "name": "Tran Thi B", "currentGrade": "Grade 8" }
    ],
    "createdAt": "2025-08-17T09:00:00Z",
    "updatedAt": null
  }
]
```

### **Chi tiết lớp học**
```http
GET /api/classes/{classId}
```
**200 OK** (Tương tự danh sách nhưng có thêm `students`)

### **Cập nhật lớp học**
```http
PATCH /api/classes/{id}
Content-Type: application/json

{
  "name": "Toán Nâng Cao (updated)",
  "timeSlot": "15:00-16:30",
  "maxStudents": 25
}
```
**200 OK**

### **Xóa lớp học**
```http
DELETE /api/classes/{id}
```
**204 No Content**

---

## 📝 **CLASS REGISTRATIONS API**

### **Đăng ký học sinh vào lớp**
```http
POST /api/classes/{classId}/register
Content-Type: application/json

{
  "studentId": 3
}
```
**204 No Content**

### **Lấy học sinh trong lớp**
```http
GET /api/classes/{classId}/registrations
```
**200 OK**
```json
[
  { "id": 3, "name": "Tran Thi B", "currentGrade": "Grade 8" },
  { "id": 4, "name": "Nguyen Van C", "currentGrade": "Grade 7" }
]
```

### **Hủy đăng ký học sinh khỏi lớp**
```http
DELETE /api/classes/{classId}/registrations/{studentId}
```
**204 No Content**

### **Chuyển lớp cho học sinh**
```http
PATCH /api/classes/{classId}/registrations/{studentId}
Content-Type: application/json

{
  "targetClassId": 2
}
```
**204 No Content**

---

## 🎁 **SUBSCRIPTIONS API**

### **Tạo gói học**
```http
POST /api/subscriptions
Content-Type: application/json

{
  "studentId": 3,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 12
}
```
**201 Created**
```json
{
  "id": 10,
  "studentId": 3,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 12,
  "usedSessions": 0,
  "remainingSessions": 12,
  "createdAt": "2025-08-17T09:00:00Z",
  "updatedAt": null
}
```

### **Danh sách gói học**
```http
GET /api/subscriptions
GET /api/subscriptions?studentId={id}
```
**200 OK**
```json
[
  {
    "id": 1,
    "studentId": 2,
    "packageName": "Math Premium",
    "startDate": "2025-08-01",
    "endDate": "2025-10-01",
    "totalSessions": 20,
    "usedSessions": 5,
    "remainingSessions": 15
  }
]
```

### **Chi tiết gói học**
```http
GET /api/subscriptions/{id}
```
**200 OK** (Tương tự item trong danh sách)

### **Cập nhật gói học**
```http
PATCH /api/subscriptions/{id}
Content-Type: application/json

{
  "packageName": "Basic-16",
  "endDate": "2025-12-31",
  "totalSessions": 16
}
```
**200 OK**

### **Xóa gói học**
```http
DELETE /api/subscriptions/{id}
```
**204 No Content**

### **Sử dụng 1 buổi học**
```http
PATCH /api/subscriptions/{id}/use
```
**200 OK**
```json
{
  "id": 10,
  "usedSessions": 1,
  "remainingSessions": 11
}
```

### **Reset số buổi đã sử dụng (Admin)**
```http
PATCH /api/subscriptions/{id}/reset-used
```
**200 OK**

### **Gia hạn gói học (Admin)**
```http
PATCH /api/subscriptions/{id}/extend
Content-Type: application/json

{
  "addSessions": 4,
  "endDate": "2026-01-31"
}
```
**200 OK**
```json
{
  "id": 1,
  "totalSessions": 16,
  "endDate": "2026-01-31",
  "remainingSessions": 11
}
```

---

## 📊 **DASHBOARD API**

### **Tổng quan hệ thống**
```http
GET /api/dashboard/overview
```
**200 OK**
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

## ⚠️ **ERROR CODES REFERENCE**

| **Code** | **HTTP Status** | **Message** | **Affected Endpoints** |
|----------|-----------------|-------------|------------------------|
| `PARENT_NOT_FOUND` | 404 | Không tìm thấy phụ huynh | `GET,PATCH,DELETE /api/parents/{id}` |
| `PARENT_HAS_STUDENTS` | 409 | Phụ huynh đang có học sinh, không thể xóa | `DELETE /api/parents/{id}` |
| `SAME_PARENT_TARGET` | 409 | Parent đích trùng với parent nguồn | `PATCH /api/parents/{id}/reassign` |
| `STUDENT_NOT_FOUND` | 404 | Không tìm thấy học sinh | `GET,PATCH,DELETE /api/students/{id}` |
| `STUDENT_NOT_BELONG_TO_PARENT` | 422 | Một số học sinh không thuộc parent nguồn | `PATCH /api/parents/{id}/reassign` |
| `STUDENT_HAS_REGISTRATIONS` | 409 | Học sinh đang có đăng ký lớp, không thể xóa | `DELETE /api/students/{id}` |
| `STUDENT_HAS_ACTIVE_SUBS` | 409 | Học sinh đang có gói học còn hiệu lực | `DELETE /api/students/{id}` |
| `CLASS_NOT_FOUND` | 404 | Không tìm thấy lớp học | `GET,PATCH,DELETE /api/classes/{id}` |
| `INVALID_DAY` | 400 | Giá trị dayOfWeek không hợp lệ (1-7) | `POST,PATCH /api/classes` |
| `CLASS_CONFLICT` | 409 | Lớp học trùng lịch hoặc vi phạm ràng buộc | `POST,PATCH /api/classes` |
| `CLASS_HAS_REGISTRATIONS` | 409 | Lớp đang có học sinh đăng ký, không thể xóa | `DELETE /api/classes/{id}` |
| `CLASS_CAPACITY_TOO_SMALL` | 409 | maxStudents nhỏ hơn số học sinh đã đăng ký | `PATCH /api/classes/{id}` |
| `ALREADY_REGISTERED` | 409 | Học sinh đã đăng ký lớp này | `POST /api/classes/{id}/register` |
| `CLASS_FULL` | 409 | Lớp đã đủ số lượng | `POST /api/classes/{id}/register` |
| `SCHEDULE_CONFLICT` | 409 | Trùng lịch với lớp khác | `POST /api/classes/{id}/register` |
| `REGISTRATION_NOT_FOUND` | 404 | Không tìm thấy đăng ký lớp | `DELETE,PATCH /api/classes/{id}/registrations/{studentId}` |
| `SAME_CLASS_TARGET` | 409 | Lớp đích trùng với lớp hiện tại | `PATCH /api/classes/{id}/registrations/{studentId}` |
| `SUBSCRIPTION_NOT_FOUND` | 404 | Không tìm thấy gói học | `GET,PATCH,DELETE /api/subscriptions/{id}` |
| `SUBSCRIPTION_INACTIVE` | 409 | Gói học chưa hiệu lực hoặc đã hết hạn | `PATCH /api/subscriptions/{id}/use` |
| `NO_REMAINING_SESSIONS` | 409 | Gói học đã dùng hết số buổi | `PATCH /api/subscriptions/{id}/use` |
| `SUBSCRIPTION_IN_USE` | 409 | Gói đã phát sinh buổi, không thể xóa | `DELETE /api/subscriptions/{id}` |
| `SUBSCRIPTION_INVALID_DATES` | 422 | endDate phải >= startDate | `POST,PATCH /api/subscriptions` |
| `SUBSCRIPTION_TOTAL_LT_USED` | 409 | totalSessions < usedSessions hiện tại | `PATCH /api/subscriptions/{id}` |
| `SUBSCRIPTION_EXTEND_NO_PARAM` | 422 | Cần cung cấp addSessions hoặc endDate | `PATCH /api/subscriptions/{id}/extend` |
| `VALIDATION_FAILED` | 422 | Dữ liệu không hợp lệ | **All POST/PATCH endpoints** |
| `CONFLICT` | 409 | Dữ liệu xung đột/vi phạm ràng buộc | **Various endpoints** |
| `INTERNAL_ERROR` | 500 | Lỗi hệ thống không mong muốn | **All endpoints** |

---

## 🧪 **TESTING EXAMPLES**

### **Sử dụng curl:**
```bash
# Lấy danh sách học sinh
curl http://localhost:8081/api/students/list

# Tạo phụ huynh mới
curl -X POST http://localhost:8081/api/parents \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Parent","phone":"0904444444","email":"test@example.com"}'

# Đăng ký học sinh vào lớp
curl -X POST http://localhost:8081/api/classes/1/register \
  -H "Content-Type: application/json" \
  -d '{"studentId": 3}'

# Sử dụng 1 buổi học
curl -X PATCH http://localhost:8081/api/subscriptions/1/use
```

### **Sử dụng Postman:**
1. Set **Base URL:** `http://localhost:8081/api`
2. Add **Header:** `Content-Type: application/json`
3. Import collection từ repository (nếu có)

---

## 🔐 **SECURITY & LIMITATIONS**

### **Authentication:**
- Hiện tại **không yêu cầu authentication**
- Production cần bổ sung: JWT tokens, Role-based access, API keys

### **Rate Limiting:**
- Hiện tại **không có rate limiting**  
- Khuyến nghị production:
  - 100 requests/minute per IP
  - 1000 requests/hour per API key
  - Burst limit: 10 requests/second

---

**📅 Cập nhật:** Tháng 8 2025  
**🔧 Version:** 1.0.0  
**✨ Status:** Production Ready