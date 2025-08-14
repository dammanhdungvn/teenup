
# API Endpoints & Examples

Backend: Spring Boot 3 · JSON over HTTP  
Tất cả response lỗi tuân theo dạng:
```json
{
  "timestamp": "2025-08-13T10:00:00Z",
  "status": 409,
  "code": "SCHEDULE_CONFLICT",
  "message": "Học sinh 3 trùng lịch với lớp khác vào day=2, time=14:00-15:30",
  "path": "/api/classes/1/register"
}
```

## Quy ước chung
- `gender`: `M` (Nam), `F` (Nữ), `O` (Khác)
- `dayOfWeek`: `1..7` tương ứng `Mon..Sun`
- `timeSlot`: chuỗi `HH:mm-HH:mm` (vd: `09:00-10:30`)
- Ngày (`dob`, `startDate`, `endDate`) theo ISO `yyyy-MM-dd`

---

## 1) Parents

### 1.1 Tạo phụ huynh
**POST** `/api/parents`
```bash
curl -X POST http://localhost:8080/api/parents \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Nguyen Van A",
        "phone": "0901234567",
        "email": "a@example.com"
      }'

**201 Created**

```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "phone": "0901234567",
  "email": "a@example.com",
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": null
}
```

### 1.2 Xem chi tiết phụ huynh

**GET** `/api/parents/{id}`

```bash
curl http://localhost:8080/api/parents/1
```

**200 OK**

```json
{
  "id": 1,
  "name": "Nguyen Van A",
  "phone": "0901234567",
  "email": "a@example.com",
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": null
}
```

---

## 2) Students

### 2.1 Tạo học sinh (đính kèm `parentId`)

**POST** `/api/students`

```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Tran Thi B",
        "dob": "2010-09-01",
        "gender": "F",
        "currentGrade": "Grade 8",
        "parentId": 1
      }'
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

### 2.2 Xem chi tiết học sinh (kèm thông tin phụ huynh)

**GET** `/api/students/{id}`

```bash
curl http://localhost:8080/api/students/3
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

---

## 3) Classes

### 3.1 Tạo lớp mới

**POST** `/api/classes`

```bash
curl -X POST http://localhost:8080/api/classes \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Toán Nâng Cao",
        "subject": "Math",
        "dayOfWeek": 2,
        "timeSlot": "14:00-15:30",
        "teacherName": "Thầy A",
        "maxStudents": 20
      }'
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
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": null
}
```

### 3.2 Danh sách lớp theo ngày (không truyền `day` → trả tất cả)

**GET** `/api/classes?day={1..7}`

```bash
# theo thứ 2
curl "http://localhost:8080/api/classes?day=2"

# tất cả lớp
curl "http://localhost:8080/api/classes"
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
    "createdAt": "2025-08-13T09:00:00Z",
    "updatedAt": null
  }
]
```

### 3.3 Danh sách lớp **kèm học sinh** (mở rộng)

> Sử dụng endpoint tách riêng với `params = "expand=registrations"`

**GET** `/api/classes?expand=registrations`

**GET** `/api/classes?day={1..7}&expand=registrations`

```bash
# tất cả lớp + học sinh đã đăng ký
curl "http://localhost:8080/api/classes?expand=registrations"

# theo thứ 2 + học sinh đã đăng ký
curl "http://localhost:8080/api/classes?day=2&expand=registrations"
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
    "createdAt": "2025-08-13T09:00:00Z",
    "updatedAt": null
  }
]
```

### 3.4 Chi tiết 1 lớp **kèm học sinh**

**GET** `/api/classes/{classId}`

```bash
curl "http://localhost:8080/api/classes/1"
```

**200 OK**

```json
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
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": null
}
```

---

## 4) ClassRegistrations

### 4.1 Đăng ký học sinh vào lớp

**POST** `/api/classes/{classId}/register`

```bash
curl -X POST "http://localhost:8080/api/classes/1/register" \
  -H "Content-Type: application/json" \
  -d '{ "studentId": 3 }'
```

**204 No Content**

**Lỗi phổ biến**

* `404 CLASS_NOT_FOUND` — lớp không tồn tại
* `404 STUDENT_NOT_FOUND` — học sinh không tồn tại
* `409 ALREADY_REGISTERED` — đã đăng ký lớp này
* `409 CLASS_FULL` — lớp đã đủ số lượng
* `409 SCHEDULE_CONFLICT` — trùng `dayOfWeek` và chồng lấp `timeSlot`

### 4.2 Danh sách học sinh trong một lớp

**GET** `/api/classes/{classId}/registrations`

```bash
curl "http://localhost:8080/api/classes/1/registrations"
```

**200 OK**

```json
[
  { "id": 3, "name": "Tran Thi B", "currentGrade": "Grade 8" },
  { "id": 4, "name": "Nguyen Van C", "currentGrade": "Grade 7" }
]
```

### 4.3 Danh sách lớp của một học sinh

**GET** `/api/students/{studentId}/classes`

```bash
curl "http://localhost:8080/api/students/3/classes"
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
    "teacherName": "Thầy A"
  },
  {
    "id": 5,
    "name": "Tiếng Anh",
    "subject": "English",
    "dayOfWeek": 4,
    "timeSlot": "08:00-09:30",
    "teacherName": "Cô B"
  }
]
```

---

## 5) Subscriptions

### 5.1 Khởi tạo gói học

**POST** `/api/subscriptions`

```bash
curl -X POST http://localhost:8080/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
        "studentId": 3,
        "packageName": "Basic-12",
        "startDate": "2025-08-01",
        "endDate":   "2025-12-31",
        "totalSessions": 12
      }'
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
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": null
}
```

### 5.2 Đánh dấu đã dùng 1 buổi

**PATCH** `/api/subscriptions/{id}/use`

```bash
curl -X PATCH http://localhost:8080/api/subscriptions/10/use
```

**200 OK**

```json
{
  "id": 10,
  "studentId": 3,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 12,
  "usedSessions": 1,
  "remainingSessions": 11,
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": "2025-08-13T09:10:00Z"
}
```

**Lỗi phổ biến**

* `404 SUBSCRIPTION_NOT_FOUND` — gói không tồn tại
* `409 SUBSCRIPTION_INACTIVE` — chưa đến `startDate` hoặc đã quá `endDate`
* `409 NO_REMAINING_SESSIONS` — đã dùng hết số buổi

### 5.3 Xem trạng thái gói

**GET** `/api/subscriptions/{id}`

```bash
curl http://localhost:8080/api/subscriptions/10
```

**200 OK**

```json
{
  "id": 10,
  "studentId": 3,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 12,
  "usedSessions": 1,
  "remainingSessions": 11,
  "createdAt": "2025-08-13T09:00:00Z",
  "updatedAt": "2025-08-13T09:10:00Z"
}
```

---

