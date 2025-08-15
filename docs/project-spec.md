# 🎯 Mini LMS — Project Specification

## **📋 Tổng quan**

**Mini LMS (Learning Management System)** cho hệ thống quản lý học tập TeenUp Contest với các chức năng chính:

1. **Quản lý Parents/Students** - Quản lý thông tin phụ huynh và học sinh
2. **Quản lý Classes** - Quản lý lớp học và đăng ký lớp
3. **Quản lý Subscriptions** - Quản lý gói học với số buổi và thời hạn

## **🎯 Mục tiêu & phạm vi**

- ✅ **Tính đúng nghiệp vụ** - Business logic chính xác
- ✅ **API RESTful rõ ràng** - Chuẩn hóa endpoints
- ✅ **Codebase sạch** - DTO-Mapper-Service-Repository pattern
- ✅ **CI/CD Docker** - Containerization hoàn chỉnh
- ✅ **Frontend-Backend đồng bộ** - React + Spring Boot

---

## **🏗️ Mô hình dữ liệu (Domain Model)**

### **1.1 Entities (bắt buộc)**

| Entity | Fields | Mô tả |
|--------|--------|-------|
| **Parent** | `id, name, phone, email, createdAt, updatedAt` | Thông tin phụ huynh |
| **Student** | `id, name, dob(LocalDate), gender(M/F/O), currentGrade, parent(FK), createdAt, updatedAt, version` | Thông tin học sinh |
| **Class** | `id, name, subject, dayOfWeek(1..7), timeSlot("HH:mm-HH:mm"), teacherName, maxStudents, createdAt, updatedAt, version` | Thông tin lớp học |
| **ClassRegistration** | `class(FK), student(FK)` | Đăng ký lớp học (unique `(class_id, student_id)`) |
| **Subscription** | `id, student(FK), packageName, startDate, endDate, totalSessions, usedSessions, createdAt, updatedAt, version` | Gói học |

### **1.2 Ràng buộc & tính toàn vẹn**

- **Student.belongsTo Parent** (bắt buộc)
- **ClassRegistration unique** per (class, student)
- **Class.maxStudents ≥ 1**; không cho < số đăng ký hiện tại
- **Subscription**: `endDate >= startDate`, `totalSessions >= usedSessions`

---

## **🔌 Chuẩn API & xử lý lỗi**

### **2.1 Chuẩn chung**
- **JSON over HTTP**; base path `/api`
- **Mọi lỗi chuẩn hóa** theo envelope:

```json
{
  "timestamp": "2024-12-14T10:30:00Z",
  "status": 409,
  "code": "SCHEDULE_CONFLICT",
  "message": "Lịch học bị trùng",
  "path": "/api/classes/123"
}
```

### **2.2 Error Codes**
Sử dụng `ErrorCode` đã thống nhất:

| Code | HTTP Status | Mô tả |
|------|-------------|-------|
| `*_NOT_FOUND` | 404 | Resource không tồn tại |
| `VALIDATION_FAILED` | 422 | Dữ liệu không hợp lệ |
| `INVALID_DAY` | 400 | Ngày không hợp lệ |
| `ALREADY_REGISTERED` | 409 | Đã đăng ký rồi |
| `CLASS_FULL` | 409 | Lớp đã đầy |
| `SCHEDULE_CONFLICT` | 409 | Lịch học bị trùng |
| `CLASS_HAS_REGISTRATIONS` | 409 | Lớp còn học sinh đăng ký |
| `CLASS_CAPACITY_TOO_SMALL` | 409 | Sức chứa quá nhỏ |
| `PARENT_HAS_STUDENTS` | 409 | Phụ huynh còn học sinh |
| `STUDENT_HAS_REGISTRATIONS` | 409 | Học sinh còn đăng ký lớp |
| `STUDENT_HAS_ACTIVE_SUBS` | 409 | Học sinh còn gói học hiệu lực |
| `SUBSCRIPTION_INACTIVE` | 409 | Gói học không còn hiệu lực |
| `NO_REMAINING_SESSIONS` | 409 | Hết buổi học |
| `SUBSCRIPTION_IN_USE` | 409 | Gói học đang được sử dụng |
| `SUBSCRIPTION_TOTAL_LT_USED` | 409 | Tổng buổi < đã dùng |
| `SUBSCRIPTION_INVALID_DATES` | 409 | Ngày không hợp lệ |
| `SUBSCRIPTION_EXTEND_NO_PARAM` | 400 | Thiếu tham số gia hạn |
| `SAME_PARENT_TARGET` | 400 | Cùng phụ huynh |
| `STUDENT_NOT_BELONG_TO_PARENT` | 400 | Học sinh không thuộc phụ huynh |
| `REGISTRATION_NOT_FOUND` | 404 | Đăng ký không tồn tại |
| `SAME_CLASS_TARGET` | 400 | Cùng lớp học |

---

## **🎯 Yêu cầu chức năng (Functional Requirements)**

### **3.1 Parents Management**

#### **Use Cases:**
1. ✅ **Tạo Parent** - `POST /api/parents`
2. ✅ **Xem chi tiết Parent** - `GET /api/parents/{id}`
3. ✅ **Danh sách rút gọn** - `GET /api/parents/list`
4. ✅ **Cập nhật Parent** - `PATCH /api/parents/{id}`
5. ✅ **Xoá Parent** - `DELETE /api/parents/{id}`
6. ✅ **Reassign Students** - `PATCH /api/parents/{sourceId}/reassign`

#### **Business Rules:**
- **Xoá**: nếu còn `Students` → `409 PARENT_HAS_STUDENTS`
- **Reassign**: `targetParentId != sourceParentId` (`SAME_PARENT_TARGET`)
- **Validation**: nếu chỉ định `studentIds`, tất cả phải thuộc source (`STUDENT_NOT_BELONG_TO_PARENT`)

#### **Implementation:**
- **DTO**: `UpdateParentRequest { name?, phone?, email? }`
- **DTO**: `ReassignStudentsRequest { targetParentId, studentIds? }`
- **Response**: `ReassignResultResponse { sourceParentId, targetParentId, movedCount, remainingAtSource }`
- **Mapper**: `ParentMapper.updateEntityFromDto()` (MapStruct, IGNORE null)
- **Repo**: `StudentsRepository.countByParentId()`, `findIdsNotBelongToParent()`, `reassignAll()/reassignSome()`

---

### **3.2 Students Management**

#### **Use Cases:**
1. ✅ **Tạo Student** - `POST /api/students`
2. ✅ **Xem chi tiết Student** - `GET /api/students/{id}`
3. ✅ **Danh sách rút gọn** - `GET /api/students/list`
4. ✅ **Cập nhật Student** - `PATCH /api/students/{id}`
5. ✅ **Xoá Student** - `DELETE /api/students/{id}`

#### **Business Rules:**
- **Validation**: `dob` là quá khứ; `gender ∈ {M,F,O}`
- **Xoá**: 
  - Không có đăng ký lớp (`STUDENT_HAS_REGISTRATIONS`)
  - Không có gói còn hiệu lực hoặc còn buổi (`STUDENT_HAS_ACTIVE_SUBS`)

#### **Implementation:**
- **DTO**: `CreateStudentRequest`, `UpdateStudentRequest { name?, dob?, gender?, currentGrade?, parentId? }`
- **Mapper**: `StudentMapper` (toEntity, toResponse, updateEntityFromDto IGNORE null)
- **Repo**: `ClassRegistrationsRepository.countByStudentId(studentId)`, `SubscriptionsRepository.existsActiveByStudent(studentId)`

---

### **3.3 Classes Management**

#### **Use Cases:**
1. ✅ **Tạo Class** - `POST /api/classes`
2. ✅ **Danh sách Class** - `GET /api/classes[?day=1..7][&expand=registrations]`
3. ✅ **Chi tiết Class** - `GET /api/classes/{id}`
4. ✅ **Cập nhật Class** - `PATCH /api/classes/{id}`
5. ✅ **Xoá Class** - `DELETE /api/classes/{id}`

#### **Business Rules:**
- **Validation**: `dayOfWeek ∈ [1..7]`, `timeSlot` chuẩn `HH:mm-HH:mm`
- **Cập nhật**:
  - Giảm `maxStudents` không được < số đăng ký hiện tại (`CLASS_CAPACITY_TOO_SMALL`)
  - Đổi `dayOfWeek`/`timeSlot` không được gây trùng lịch (`SCHEDULE_CONFLICT`)
- **Xoá**: nếu còn registrations → `CLASS_HAS_REGISTRATIONS`

#### **Implementation:**
- **DTO**: `CreateClassRequest`, `UpdateClassRequest { name?, subject?, dayOfWeek?, timeSlot?, teacherName?, maxStudents? }`
- **Mapper**: `ClassMapper.updateEntityFromDto()` (IGNORE null)
- **Repo**: `ClassRegistrationsRepository.countByClassId(classId)`, `existsConflictWhenReschedule(classId, dayOfWeek, start, end)`

---

### **3.4 Class Registrations Management**

#### **Use Cases:**
1. ✅ **Đăng ký Student vào Class** - `POST /api/classes/{classId}/register`
2. ✅ **Xem danh sách học sinh của Class** - `GET /api/classes/{classId}/registrations`
3. ✅ **Xem danh sách lớp của Student** - `GET /api/students/{studentId}/classes`
4. ✅ **Huỷ đăng ký khỏi Class** - `DELETE /api/classes/{classId}/registrations/{studentId}`
5. ✅ **Chuyển lớp** - `PATCH /api/classes/{classId}/registrations/{studentId}`

#### **Business Rules:**
- **Register**:
  - Không trùng (đã đăng ký) → `ALREADY_REGISTERED`
  - Không vượt `maxStudents` → `CLASS_FULL`
  - Không trùng lịch với classes khác của student → `SCHEDULE_CONFLICT`
- **Unregister**: bản ghi phải tồn tại (`REGISTRATION_NOT_FOUND`)
- **Move**: validate đầy đủ các ràng buộc

---

### **3.5 Subscriptions Management**

#### **Use Cases:**
1. ✅ **Tạo gói học** - `POST /api/subscriptions`
2. ✅ **Xem chi tiết gói** - `GET /api/subscriptions/{id}`
3. ✅ **Danh sách gói** - `GET /api/subscriptions[?studentId=]`
4. ✅ **Dùng 1 buổi** - `PATCH /api/subscriptions/{id}/use`
5. ✅ **Cập nhật gói** - `PATCH /api/subscriptions/{id}`
6. ✅ **Xoá gói** - `DELETE /api/subscriptions/{id}`
7. ✅ **Admin: Reset used** - `PATCH /api/subscriptions/{id}/reset-used`
8. ✅ **Admin: Extend** - `PATCH /api/subscriptions/{id}/extend`

#### **Business Rules:**
- **Tạo**: `endDate >= startDate`
- **Use**: ngày hiện tại nằm trong `[startDate, endDate]` và `usedSessions < totalSessions`
- **Update**: `totalSessions` mới không được `< usedSessions`
- **Delete**: `usedSessions == 0` mới được xoá
- **Extend**: phải có `addSessions` và/hoặc `endDate` hợp lệ

---

## **⚙️ Thiết kế kỹ thuật (Technical Design)**

### **4.1 Kiến trúc & conventions**

#### **Layers:**
```
Controller → Service (transactional) → Repository (Spring Data JPA)
```

#### **DTO/Mapper:**
- **Input/Output DTO** tách entity
- **MapStruct** với `NullValuePropertyMappingStrategy.IGNORE` cho PATCH
- **Validation**: `jakarta.validation` trên DTO + kiểm tra nghiệp vụ ở Service

#### **Transactions:**
- **Read**: `@Transactional(readOnly=true)`
- **Write**: `@Transactional` (mặc định)
- **Optimistic locking**: Entity có `@Version`

#### **Date/Time:**
- **LocalDate** cho ngày
- **Instant** cho audit
- **Asia/Bangkok** TZ runtime

### **4.2 Kiểm tra trùng lịch (Schedule Conflict)**

#### **Logic overlap:**
```
timeSlot: "HH:mm-HH:mm"
Overlap nếu: aStart < bEnd && bStart < aEnd
```

#### **Kiểm tra conflict:**
- **Khi đăng ký/move**: check conflict với tất cả lớp của học sinh
- **Khi PATCH Class đổi lịch**: native query kiểm tra conflict giữa lịch mới và các lớp khác của mọi học sinh đang học lớp này

### **4.3 Truy vấn hiệu năng**

- **JPQL/native** thay vì load list và filter trên Java
- **Fetch join** khi cần mở rộng (`expand=registrations`) để tránh N+1
- **Optimized queries** cho các business checks

---

## **🐳 DevOps & môi trường**

### **5.1 Docker Setup**

#### **Backend Dockerfile:**
- **Multi-stage Maven build** (3.8.7, Temurin 21)
- **Runtime JRE 21**
- **SPRING_PROFILES_ACTIVE=dev**
- **EXPOSE 8081**

#### **Docker Compose:**
```yaml
services:
  db: mysql:8 (3306)
  backend: Spring Boot (8081)
  frontend: React/Nginx (3000)
```

#### **Environment:**
- **DB URL**: `jdbc:mysql://db:3306/teenup?...`
- **Healthcheck** MySQL
- **depends_on** backend→db(healthy)

### **5.2 Data Seeding (profile `dev`)**

- **2 parents** mẫu
- **3 students** mẫu  
- **2–3 classes** mẫu
- **Registrations/subscriptions** mẫu

---

## **🧪 Testing & Acceptance**

### **6.1 Unit/Integration Tests**

#### **Service-level tests:**
- ✅ **Register/Move/Unregister** (đủ case FULL/ALREADY/CONFLICT)
- ✅ **Delete student** (blocked by regs/subs)
- ✅ **Patch class** (capacity & conflict)
- ✅ **Subscriptions** (use/inactive/no remaining/update/extend/reset/delete)

### **6.2 API Testing**

- **cURL scripts** cho tất cả endpoints
- **Postman Collection** bám sát API spec
- **Error scenarios** testing

### **6.3 Acceptance Testing (E2E)**

#### **Test scenarios:**
1. **Tạo student** → xem detail (kèm parent)
2. **Tạo class** → weekly view FE hiển thị đúng
3. **Đăng ký** → xem học sinh của class; move; unregister
4. **Khởi tạo gói** → use → extend → reset → delete

---

## **🌐 Frontend Integration**

### **7.1 Component Mapping**

| Feature | Components | API Integration |
|---------|------------|-----------------|
| **Parents** | Form create, detail, dropdown list, reassign modal | `parents.api.js` |
| **Students** | Form create, detail, delete/update | `students.api.js` |
| **Classes** | Weekly grid, class detail, CRUD operations | `classes.api.js` |
| **Subscriptions** | Create/detail/list, use, patch, delete | `subscriptions.api.js` |

### **7.2 Technical Stack**

- **API Client**: Axios instance + interceptors map `ApiError`
- **Form Validation**: Mirror backend validation rules
- **State Management**: React Query cache danh sách lớp, dropdowns
- **UI Library**: Ant Design components

---

## **📚 Tài liệu liên quan**

### **Backend Documentation:**
- 📋 **[API Endpoints](backend/contest/docs/api-endpoints.md)** - Hợp đồng API + ví dụ success & error
- 🏗️ **[Architecture](backend/contest/docs/ARCHITECTURE.md)** - Kiến trúc hệ thống
- 🎯 **[Business Logic](backend/contest/docs/BUSINESS-LOGIC.md)** - Business rules chi tiết
- 💻 **[Development Guide](backend/contest/docs/DEVELOPMENT.md)** - Hướng dẫn phát triển

### **Frontend Documentation:**
- 🌐 **[Frontend Index](frontend/docs/INDEX.md)** - Tất cả frontend docs
- 🔌 **[API Integration](frontend/docs/API-INTEGRATION.md)** - Kết nối backend
- 🏗️ **[Project Structure](frontend/docs/STRUCTURE.md)** - Cấu trúc frontend
- 🐳 **[Docker Guide](frontend/docs/DOCKER.md)** - Containerization

### **System Documentation:**
- 🐳 **[Docker Setup](docker-compose.yml)** - Cấu hình Docker
- 📖 **[Main README](README.md)** - Tổng quan toàn bộ hệ thống

---

## **🔄 Quy trình cập nhật**

### **Khi thay đổi model:**
1. **Entity** + **Repository queries** + **Business rules** + **Documentation**
2. **API endpoints** + **DTOs** + **Validation**
3. **Frontend components** + **API integration**

### **Khi mở rộng tìm kiếm/lọc/phân trang:**
- Thêm `GET /list` phiên bản có `page,size,sort,q`
- Cập nhật frontend filters và pagination

---

## **📋 Data Contracts (JSON Schema)**

### **Parent DTOs:**
```json
// CreateParentRequest
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (required, email format)"
}

// UpdateParentRequest  
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional, email format)"
}

// ReassignStudentsRequest
{
  "targetParentId": "long (required)",
  "studentIds": "array of long (optional)"
}
```

### **Student DTOs:**
```json
// CreateStudentRequest
{
  "name": "string (required)",
  "dob": "LocalDate (required, past date)",
  "gender": "enum (M/F/O) (required)",
  "currentGrade": "string (required)",
  "parentId": "long (required)"
}

// UpdateStudentRequest
{
  "name": "string (optional)",
  "dob": "LocalDate (optional, past date)",
  "gender": "enum (M/F/O) (optional)",
  "currentGrade": "string (optional)",
  "parentId": "long (optional)"
}
```

### **Class DTOs:**
```json
// CreateClassRequest
{
  "name": "string (required)",
  "subject": "string (required)",
  "dayOfWeek": "integer (1-7) (required)",
  "timeSlot": "string (HH:mm-HH:mm) (required)",
  "teacherName": "string (required)",
  "maxStudents": "integer (>=1) (required)"
}

// UpdateClassRequest
{
  "name": "string (optional)",
  "subject": "string (optional)",
  "dayOfWeek": "integer (1-7) (optional)",
  "timeSlot": "string (HH:mm-HH:mm) (optional)",
  "teacherName": "string (optional)",
  "maxStudents": "integer (>=1) (optional)"
}
```

### **Subscription DTOs:**
```json
// CreateSubscriptionRequest
{
  "studentId": "long (required)",
  "packageName": "string (required)",
  "startDate": "LocalDate (required)",
  "endDate": "LocalDate (required, >= startDate)",
  "totalSessions": "integer (>=1) (required)"
}

// ExtendSubscriptionRequest
{
  "addSessions": "integer (>=1) (optional)",
  "endDate": "LocalDate (optional, >= current endDate)"
}
```

---

## **🎯 Kết luận**

Tài liệu này cung cấp **đặc tả chi tiết** (functional + technical) đủ để development team dựa vào và implement. Tất cả các chức năng đã được **implement hoàn chỉnh** và **tested** theo yêu cầu.

### **Trạng thái hiện tại:**
- ✅ **Backend**: Hoàn thành 100% theo spec
- ✅ **Frontend**: Hoàn thành 100% theo spec  
- ✅ **Docker**: Setup hoàn chỉnh
- ✅ **Documentation**: Đầy đủ và đồng bộ

### **Next Steps:**
1. **Review** tài liệu này với team
2. **Validate** business requirements
3. **Plan** testing strategy
4. **Deploy** to staging/production

---

**📅 Last Updated:** December 2024  
**🔄 Version:** 1.0.0  
**👥 Maintainer:** Development Team  
**📧 Contact:** [your.email@company.com]
