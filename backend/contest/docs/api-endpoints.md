
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
### 1.2 Parents — danh sách
**GET** `/api/parents/list`
```bash
curl "http://localhost:8081/api/parents/list"
```
**200 OK**
```JSON
[
  { "id": 1, "name": "Nguyen Van A" },
  { "id": 2, "name": "Tran Thi B" }
]
```

### 1.3 Parents — Cập nhật & Xoá

### Cập nhật phụ huynh (partial)
**PATCH** `/api/parents/{id}`
```bash
curl -X PATCH "http://localhost:8081/api/parents/1" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Nguyen Van A (updated)",
        "phone": "0909999999",
        "email": "a.updated@example.com"
      }'
```

**200 OK**

```JSON
{
  "id": 1,
  "name": "Nguyen Van A (updated)",
  "phone": "0909999999",
  "email": "a.updated@example.com",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 1.4 DELETE 
**DELETE** `/api/parents/{id}`
```bash
curl -i -X DELETE "http://localhost:8081/api/parents/1"
```
**204 No Content**

### 1.5 Lấy danh sách học sinh thuộc một phụ huynh

**GET** `/api/parents/{parentId}/students`
```bash
curl "http://localhost:8081/api/parents/1/students"
```
**200 OK**
```JSON
[
  { "id": 3, "name": "Lan", "dob": "2011-09-01", "gender": "F", "currentGrade": "Grade 8" }
]
```


### 1.5 Xoá học sinh theo ngữ cảnh phụ huynh (unassign)
**DELETE** `/api/parents/{parentId}/students/{studentId}`
```bash
curl -i -X DELETE "http://localhost:8081/api/parents/1/students/3"
```
**204 No Content**

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

### 2.2 Students — danh sách

```BASH
GET /api/students/list
```
**200 OK**
```JSON
[
  { "id": 1, "name": "Minh",  "currentGrade": "Grade 7" },
  { "id": 2, "name": "Lan",   "currentGrade": "Grade 8" },
  { "id": 3, "name": "Hoang", "currentGrade": "Grade 6" }
]
```

### 2.3 Xem chi tiết học sinh (kèm thông tin phụ huynh)

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

### 2.4 Xoá học sinh 

**DELETE** `/api/students/{id}`

```bash
DELETE "http://localhost:8081/api/students/3"
```
**204 No Content**

### 2.5 Cập nhật thông tin học sinh
**PATCH** `/api/students/{id}`
```bash
curl -X PATCH "http://localhost:8081/api/students/3" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Tran Thi B (updated)",
        "dob": "2010-09-02",
        "gender": "F",
        "currentGrade": "Grade 9",
        "parentId": 2
      }'
```
**200 OK**

```JSON
{
  "id": 3,
  "name": "Tran Thi B (updated)",
  "dob": "2010-09-02",
  "gender": "F",
  "currentGrade": "Grade 9",
  "parent": {
    "id": 2,
    "name": "Tran Thi B",
    "phone": "0902222222",
    "email": "b@example.com"
  }
}
```

### 2.6 Chuyển TẤT CẢ học sinh từ parent nguồn sang parent đích
**PATCH** `/api/parents/{sourceParentId}/reassign`
```bash
curl -X PATCH "http://localhost:8081/api/parents/1/reassign" \
  -H "Content-Type: application/json" \
  -d '{ "targetParentId": 2 }'
```
**200 OK**
```JSON
{
  "sourceParentId": 1,
  "targetParentId": 2,
  "movedCount": 2,
  "remainingAtSource": 0
}
```

### 2.7 Chuyển MỘT PHẦN học sinh (chỉ định danh sách)
**PATCH** `/api/parents/{sourceParentId}/reassign`
```bash
curl -X PATCH "http://localhost:8081/api/parents/1/reassign" \
  -H "Content-Type: application/json" \
  -d '{ "targetParentId": 2, "studentIds": [3,4] }'
```
**200 OK**
```JSON
{
  "sourceParentId": 1,
  "targetParentId": 2,
  "movedCount": 1,
  "remainingAtSource": 1
}

```

### 2.8 Danh sách lớp của một học sinh
**GET** `/api/students/{studentId}/classes`
```bash
curl "http://localhost:8081/api/students/3/classes"
```
**200 OK**

```JSON
[
  { 
    "id": 1, 
    "name": "Toán Nâng Cao", 
    "subject": "Math", 
    "dayOfWeek": 2, 
    "timeSlot": "14:00-15:30", 
    "teacherName": "Thầy A", 
    "maxStudents": 20 }
]
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

### 3.5 Cập nhật lớp (partial)
**PATCH** `/api/classes/{id}`
```bash
curl -X PATCH "http://localhost:8081/api/classes/1" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Toán Nâng Cao (updated)",
        "subject": "Math",
        "dayOfWeek": 2,
        "timeSlot": "15:00-16:30",
        "teacherName": "Thầy A",
        "maxStudents": 25
      }'
```

**200 OK**
```JSON
{
  "id": 1,
  "name": "Toán Nâng Cao (updated)",
  "subject": "Math",
  "dayOfWeek": 2,
  "timeSlot": "15:00-16:30",
  "teacherName": "Thầy A",
  "maxStudents": 25,
  "createdAt": "...",
  "updatedAt": "..."
}
```
## 3.6 Xóa lớp 
**DELETE** `/api/classes/{id}`

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

### 4.4 Huỷ đăng ký học sinh khỏi lớp
**DELETE** `/api/classes/{classId}/registrations/{studentId}`
```bash
curl -i -X DELETE "http://localhost:8081/api/classes/1/registrations/3"
```
**204 No Content**

### 4.5 Chuyển lớp cho học sinh

**PATCH** `/api/classes/{classId}/registrations/{studentId}`

```bash
curl -i -X PATCH "http://localhost:8081/api/classes/1/registrations/3" \
  -H "Content-Type: application/json" \
  -d '{ "targetClassId": 2 }'
```
**204 No Content**


### 4.6 Reset used sessions (admin)
**PATCH** `/api/subscriptions/{id}/reset-used`
```bash
curl -X PATCH "http://localhost:8081/api/subscriptions/1/reset-used"
```

**200 OK**
```JSON
{
  "id": 1,
  "studentId": 2,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 12,
  "usedSessions": 0,
  "remainingSessions": 12
}
```

### 4.7 Extend gói học (tăng buổi và/hoặc gia hạn)

**PATCH** `/api/subscriptions/{id}/extend`

```bash
curl -X PATCH "http://localhost:8081/api/subscriptions/1/extend" \
  -H "Content-Type: application/json" \
  -d '{ "addSessions": 4, "endDate": "2026-01-31" }'
```

**200 OK**
```JSON
{
  "id": 1,
  "studentId": 2,
  "packageName": "Basic-12",
  "startDate": "2025-08-01",
  "endDate": "2026-01-31",
  "totalSessions": 16,
  "usedSessions": 5,
  "remainingSessions": 11
}
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

### 5.4 Lấy tất cả subscriptions

```bash
GET /api/subscriptions
```
**200 OK**
```JSON
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
  },
  {
    "id": 2,
    "studentId": 3,
    "packageName": "English Basic",
    "startDate": "2025-08-05",
    "endDate": "2025-09-05",
    "totalSessions": 10,
    "usedSessions": 3,
    "remainingSessions": 7
  }
]
```

### 5.5 Cập nhật gói học (partial)
**PATCH** `/api/subscriptions/{id}`
```bash
curl -X PATCH "http://localhost:8081/api/subscriptions/1" \
  -H "Content-Type: application/json" \
  -d '{
        "packageName": "Basic-16",
        "startDate": "2025-08-01",
        "endDate": "2025-12-31",
        "totalSessions": 16
      }'
```
**200 OK**

```JSON
{
  "id": 1,
  "studentId": 2,
  "packageName": "Basic-16",
  "startDate": "2025-08-01",
  "endDate": "2025-12-31",
  "totalSessions": 16,
  "usedSessions": 5,
  "remainingSessions": 11
}
```

### 5.6 Xoá gói học
**DELETE** `/api/subscriptions/{id}`

```bash
curl -i -X DELETE "http://localhost:8081/api/subscriptions/1"
```

**204 No Content**

---

