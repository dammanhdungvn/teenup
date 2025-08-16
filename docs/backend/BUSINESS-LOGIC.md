# Business Logic & Rules

## **🎯 Tổng quan Business Logic**

Backend TeenUp Contest System được thiết kế với các business rules nghiêm ngặt để đảm bảo tính nhất quán và hợp lý của dữ liệu. Tài liệu này mô tả chi tiết các quy tắc nghiệp vụ được implement.

## **👨‍👩‍👧‍👦 Parent Management**

### **1. Parent Creation Rules:**
```mermaid
flowchart TD
    Start([Create Parent Request]) --> Validate[Validate Input]
    Validate --> CheckEmail[Check Email Uniqueness]
    CheckEmail --> ValidEmail{Email Valid?}
    ValidEmail -->|No| Error[Return Validation Error]
    ValidEmail -->|Yes| Save[Save Parent]
    Save --> Success[Return 201 Created]
    
    style Start fill:#e3f2fd
    style Validate fill:#e8f5e8
    style CheckEmail fill:#fff3e0
    style ValidEmail fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Save fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Email uniqueness:** Mỗi email chỉ được sử dụng cho 1 phụ huynh
- **Required fields:** `name`, `phone`, `email` là bắt buộc
- **Phone format:** Số điện thoại tối đa 20 ký tự
- **Email format:** Phải đúng định dạng email

### **2. Parent Deletion Rules:**
```mermaid
flowchart TD
    Start([Delete Parent Request]) --> CheckStudents[Check if Parent has Students]
    CheckStudents --> HasStudents{Has Students?}
    HasStudents -->|Yes| Block[Block Deletion - Return 409]
    HasStudents -->|No| Delete[Delete Parent]
    Delete --> Success[Return 204 No Content]
    
    style Start fill:#e3f2fd
    style CheckStudents fill:#e8f5e8
    style HasStudents fill:#ff9800,color:#fff
    style Block fill:#f44336,color:#fff
    style Delete fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Cannot delete if has students:** Phụ huynh đang có học sinh không thể bị xóa
- **Cascade delete:** Nếu xóa phụ huynh, tất cả học sinh liên quan cũng bị xóa

## **👨‍🎓 Student Management**

### **1. Student Creation Rules:**
```mermaid
flowchart TD
    Start([Create Student Request]) --> Validate[Validate Input]
    Validate --> CheckParent[Check Parent Exists]
    CheckParent --> ParentExists{Parent Found?}
    ParentExists -->|No| Error[Return 404 Parent Not Found]
    ParentExists -->|Yes| ValidateAge[Validate Age]
    ValidateAge --> ValidAge{Age Valid?}
    ValidAge -->|No| Error[Return Validation Error]
    ValidAge -->|Yes| Save[Save Student]
    Save --> Success[Return 201 Created]
    
    style Start fill:#e3f2fd
    style Validate fill:#e8f5e8
    style CheckParent fill:#fff3e0
    style ParentExists fill:#ff9800,color:#fff
    style ValidateAge fill:#f3e5f5
    style ValidAge fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Save fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Parent must exist:** `parentId` phải trỏ đến phụ huynh tồn tại
- **Age validation:** Ngày sinh phải trước ngày hiện tại
- **Gender validation:** Giới tính phải là `M`, `F`, hoặc `O`
- **Grade validation:** Khối lớp không được để trống

### **2. Student Deletion Rules:**
```mermaid
flowchart TD
    Start([Delete Student Request]) --> CheckRegistrations[Check Class Registrations]
    CheckRegistrations --> HasRegistrations{Has Registrations?}
    HasRegistrations -->|Yes| Block[Block Deletion - Return 409]
    HasRegistrations -->|No| CheckSubscriptions[Check Active Subscriptions]
    CheckSubscriptions --> HasSubscriptions{Has Active Subs?}
    HasSubscriptions -->|Yes| Block[Block Deletion - Return 409]
    HasSubscriptions -->|No| Delete[Delete Student]
    Delete --> Success[Return 204 No Content]
    
    style Start fill:#e3f2fd
    style CheckRegistrations fill:#e8f5e8
    style HasRegistrations fill:#ff9800,color:#fff
    style CheckSubscriptions fill:#fff3e0
    style HasSubscriptions fill:#ff9800,color:#fff
    style Block fill:#f44336,color:#fff
    style Delete fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Cannot delete if registered:** Học sinh đang đăng ký lớp không thể bị xóa
- **Cannot delete if has subscriptions:** Học sinh có gói học còn hiệu lực không thể bị xóa

## **🏫 Class Management**

### **1. Class Creation Rules:**
```mermaid
flowchart TD
    Start([Create Class Request]) --> Validate[Validate Input]
    Validate --> CheckDay[Validate Day of Week]
    CheckDay --> ValidDay{Day 1-7?}
    ValidDay -->|No| Error[Return 400 Invalid Day]
    ValidDay -->|Yes| CheckTimeSlot[Validate Time Slot Format]
    CheckTimeSlot --> ValidTime{Format HH:mm-HH:mm?}
    ValidTime -->|No| Error[Return 400 Invalid Time Format]
    ValidTime -->|Yes| CheckCapacity[Validate Max Students]
    CheckCapacity --> ValidCapacity{Max Students > 0?}
    ValidCapacity -->|No| Error[Return 400 Invalid Capacity]
    ValidCapacity -->|Yes| Save[Save Class]
    Save --> Success[Return 201 Created]
    
    style Start fill:#e3f2fd
    style Validate fill:#e8f5e8
    style CheckDay fill:#fff3e0
    style ValidDay fill:#ff9800,color:#fff
    style CheckTimeSlot fill:#f3e5f5
    style ValidTime fill:#ff9800,color:#fff
    style CheckCapacity fill:#e0f2f1
    style ValidCapacity fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Save fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Day validation:** `dayOfWeek` phải từ 1-7 (Thứ 2 = 1, Chủ nhật = 7)
- **Time slot format:** Phải đúng định dạng `HH:mm-HH:mm`
- **Capacity validation:** `maxStudents` phải > 0
- **Required fields:** `name`, `subject`, `teacherName` là bắt buộc

### **2. Class Deletion Rules:**
```mermaid
flowchart TD
    Start([Delete Class Request]) --> CheckRegistrations[Check if Class has Students]
    CheckRegistrations --> HasStudents{Has Students?}
    HasStudents -->|Yes| Block[Block Deletion - Return 409]
    HasStudents -->|No| Delete[Delete Class]
    Delete --> Success[Return 204 No Content]
    
    style Start fill:#e3f2fd
    style CheckRegistrations fill:#e8f5e8
    style HasStudents fill:#ff9800,color:#fff
    style Block fill:#f44336,color:#fff
    style Delete fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Cannot delete if has students:** Lớp đang có học sinh đăng ký không thể bị xóa

## **📚 Class Registration Management**

### **1. Student Registration Rules:**
```mermaid
flowchart TD
    Start([Register Student Request]) --> CheckClass[Check Class Exists]
    CheckClass --> ClassExists{Class Found?}
    ClassExists -->|No| Error[Return 404 Class Not Found]
    ClassExists -->|Yes| CheckStudent[Check Student Exists]
    CheckStudent --> StudentExists{Student Found?}
    StudentExists -->|No| Error[Return 404 Student Not Found]
    StudentExists -->|Yes| CheckDuplicate[Check Already Registered]
    CheckDuplicate --> IsDuplicate{Already Registered?}
    IsDuplicate -->|Yes| Error[Return 409 Already Registered]
    IsDuplicate -->|No| CheckCapacity[Check Class Capacity]
    CheckCapacity --> HasCapacity{Class Full?}
    HasCapacity -->|Yes| Error[Return 409 Class Full]
    HasCapacity -->|No| CheckSchedule[Check Schedule Conflict]
    CheckSchedule --> HasConflict{Schedule Conflict?}
    HasConflict -->|Yes| Error[Return 409 Schedule Conflict]
    HasConflict -->|No| Register[Register Student]
    Register --> Success[Return 204 No Content]
    
    style Start fill:#e3f2fd
    style CheckClass fill:#e8f5e8
    style ClassExists fill:#ff9800,color:#fff
    style CheckStudent fill:#fff3e0
    style StudentExists fill:#ff9800,color:#fff
    style CheckDuplicate fill:#f3e5f5
    style IsDuplicate fill:#ff9800,color:#fff
    style CheckCapacity fill:#e0f2f1
    style HasCapacity fill:#ff9800,color:#fff
    style CheckSchedule fill:#fce4ec
    style HasConflict fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Register fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **No duplicate registration:** Học sinh không thể đăng ký cùng một lớp nhiều lần
- **Capacity check:** Lớp phải còn chỗ trống
- **Schedule conflict prevention:** Không được trùng lịch với lớp khác

### **2. Schedule Conflict Detection:**
```mermaid
flowchart TD
    Start([Check Schedule Conflict]) --> GetExisting[Get Student's Existing Classes]
    GetExisting --> LoopClasses[Loop Through Each Class]
    LoopClasses --> CheckDay[Check Same Day of Week]
    CheckDay --> SameDay{Same Day?}
    SameDay -->|No| NextClass[Next Class]
    SameDay -->|Yes| CheckTimeOverlap[Check Time Overlap]
    CheckTimeOverlap --> HasOverlap{Time Overlap?}
    HasOverlap -->|Yes| Conflict[Return Conflict]
    HasOverlap -->|No| NextClass[Next Class]
    NextClass --> MoreClasses{More Classes?}
    MoreClasses -->|Yes| LoopClasses
    MoreClasses -->|No| NoConflict[Return No Conflict]
    
    style Start fill:#e3f2fd
    style GetExisting fill:#e8f5e8
    style LoopClasses fill:#fff3e0
    style CheckDay fill:#f3e5f5
    style SameDay fill:#ff9800,color:#fff
    style CheckTimeOverlap fill:#e0f2f1
    style HasOverlap fill:#ff9800,color:#fff
    style Conflict fill:#f44336,color:#fff
    style NextClass fill:#4caf50,color:#fff
    style MoreClasses fill:#ff9800,color:#fff
    style NoConflict fill:#4caf50,color:#fff
```

**Time Overlap Algorithm:**
```java
// timeSlot format: "HH:mm-HH:mm"
private boolean isOverlap(String slotA, String slotB) {
    var a = slotA.split("-");
    var b = slotB.split("-");
    LocalTime aStart = LocalTime.parse(a[0]);
    LocalTime aEnd   = LocalTime.parse(a[1]);
    LocalTime bStart = LocalTime.parse(b[0]);
    LocalTime bEnd   = LocalTime.parse(b[1]);

    return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
}
```

## **📦 Subscription Management**

### **1. Subscription Creation Rules:**
```mermaid
flowchart TD
    Start([Create Subscription Request]) --> Validate[Validate Input]
    Validate --> CheckStudent[Check Student Exists]
    CheckStudent --> StudentExists{Student Found?}
    StudentExists -->|No| Error[Return 404 Student Not Found]
    StudentExists -->|Yes| CheckDates[Validate Date Range]
    CheckDates --> ValidDates{End Date >= Start Date?}
    ValidDates -->|No| Error[Return 400 Invalid Date Range]
    ValidDates -->|Yes| CheckSessions[Validate Total Sessions]
    CheckSessions --> ValidSessions{Total Sessions >= 0?}
    ValidSessions -->|No| Error[Return 400 Invalid Sessions]
    ValidSessions -->|Yes| Save[Save Subscription]
    Save --> Success[Return 201 Created]
    
    style Start fill:#e3f2fd
    style Validate fill:#e8f5e8
    style CheckStudent fill:#fff3e0
    style StudentExists fill:#ff9800,color:#fff
    style CheckDates fill:#f3e5f5
    style ValidDates fill:#ff9800,color:#fff
    style CheckSessions fill:#e0f2f1
    style ValidSessions fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Save fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Student must exist:** `studentId` phải trỏ đến học sinh tồn tại
- **Date validation:** `endDate` phải >= `startDate`
- **Sessions validation:** `totalSessions` phải >= 0

### **2. Session Usage Rules:**
```mermaid
flowchart TD
    Start([Use Session Request]) --> CheckSubscription[Check Subscription Exists]
    CheckSubscription --> Exists{Subscription Found?}
    Exists -->|No| Error[Return 404 Not Found]
    Exists -->|Yes| CheckDate[Check Current Date]
    CheckDate --> ValidDate{Date in Range?}
    ValidDate -->|No| Error[Return 409 Inactive]
    ValidDate -->|Yes| CheckSessions[Check Remaining Sessions]
    CheckSessions --> HasSessions{Has Remaining?}
    HasSessions -->|No| Error[Return 409 No Remaining]
    HasSessions -->|Yes| UseSession[Use One Session]
    UseSession --> Update[Update Used Sessions]
    Update --> Success[Return 200 OK]
    
    style Start fill:#e3f2fd
    style CheckSubscription fill:#e8f5e8
    style Exists fill:#ff9800,color:#fff
    style CheckDate fill:#fff3e0
    style ValidDate fill:#ff9800,color:#fff
    style CheckSessions fill:#f3e5f5
    style HasSessions fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style UseSession fill:#4caf50,color:#fff
    style Update fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Date range check:** Chỉ có thể dùng buổi trong khoảng `startDate` - `endDate`
- **Session availability:** Phải còn buổi chưa sử dụng
- **Atomic operation:** Sử dụng buổi là atomic operation

### **3. Subscription Update Rules:**
```mermaid
flowchart TD
    Start([Update Subscription Request]) --> Validate[Validate Changes]
    Validate --> CheckDates[Validate New Date Range]
    CheckDates --> ValidDates{New Dates Valid?}
    ValidDates -->|No| Error[Return 400 Invalid Dates]
    ValidDates -->|Yes| CheckSessions[Validate New Total Sessions]
    CheckSessions --> ValidSessions{Total >= Used?}
    ValidSessions -->|No| Error[Return 400 Total < Used]
    ValidSessions -->|Yes| Update[Update Subscription]
    Update --> Success[Return 200 OK]
    
    style Start fill:#e3f2fd
    style Validate fill:#e8f5e8
    style CheckDates fill:#fff3e0
    style ValidDates fill:#ff9800,color:#fff
    style CheckSessions fill:#f3e5f5
    style ValidSessions fill:#ff9800,color:#fff
    style Error fill:#f44336,color:#fff
    style Update fill:#4caf50,color:#fff
    style Success fill:#4caf50,color:#fff
```

**Business Rules:**
- **Date consistency:** `endDate` phải >= `startDate`
- **Session consistency:** `totalSessions` mới phải >= `usedSessions` hiện tại

## **🔄 Data Consistency Rules**

### **1. Optimistic Locking:**
- **Version field:** Mỗi entity có field `version` để optimistic locking
- **Concurrent updates:** Ngăn chặn lost update problems
- **Version increment:** Tự động tăng version khi update

### **2. Transaction Management:**
```mermaid
flowchart TD
    Start([Business Operation]) --> Begin[Begin Transaction]
    Begin --> Validate[Validate Business Rules]
    Validate --> Valid{Valid?}
    Valid -->|No| Rollback[Rollback Transaction]
    Valid -->|Yes| Execute[Execute Business Logic]
    Execute --> Success{Success?}
    Success -->|No| Rollback[Rollback Transaction]
    Success -->|Yes| Commit[Commit Transaction]
    
    style Start fill:#e3f2fd
    style Begin fill:#e8f5e8
    style Validate fill:#fff3e0
    style Valid fill:#ff9800,color:#fff
    style Execute fill:#f3e5f5
    style Success fill:#ff9800,color:#fff
    style Rollback fill:#f44336,color:#fff
    style Commit fill:#4caf50,color:#fff
```

**Transaction Rules:**
- **Read operations:** Sử dụng `@Transactional(readOnly = true)`
- **Write operations:** Sử dụng `@Transactional`
- **Rollback on exception:** Tự động rollback khi có exception

### **3. Cascade Operations:**
- **Parent deletion:** Cascade delete tất cả students
- **Student deletion:** Cascade delete tất cả registrations và subscriptions
- **Class deletion:** Cascade delete tất cả registrations

## **📊 Error Handling Strategy**

### **1. Error Code Structure:**
```java
public enum ErrorCode {
    // Parent errors
    PARENT_NOT_FOUND("PARENT_NOT_FOUND", HttpStatus.NOT_FOUND, "Không tìm thấy phụ huynh"),
    PARENT_HAS_STUDENTS("PARENT_HAS_STUDENTS", HttpStatus.CONFLICT, "Phụ huynh đang có học sinh"),
    
    // Student errors
    STUDENT_NOT_FOUND("STUDENT_NOT_FOUND", HttpStatus.NOT_FOUND, "Không tìm thấy học sinh"),
    STUDENT_HAS_REGISTRATIONS("STUDENT_HAS_REGISTRATIONS", HttpStatus.CONFLICT, "Học sinh đang có đăng ký"),
    
    // Class errors
    CLASS_NOT_FOUND("CLASS_NOT_FOUND", HttpStatus.NOT_FOUND, "Không tìm thấy lớp học"),
    CLASS_FULL("CLASS_FULL", HttpStatus.CONFLICT, "Lớp đã đủ số lượng"),
    SCHEDULE_CONFLICT("SCHEDULE_CONFLICT", HttpStatus.CONFLICT, "Trùng lịch với lớp khác"),
    
    // Subscription errors
    SUBSCRIPTION_INACTIVE("SUBSCRIPTION_INACTIVE", HttpStatus.CONFLICT, "Gói học chưa hiệu lực"),
    NO_REMAINING_SESSIONS("NO_REMAINING_SESSIONS", HttpStatus.CONFLICT, "Đã dùng hết số buổi")
}
```

### **2. Error Response Format:**
```json
{
  "timestamp": "2025-08-13T10:00:00Z",
  "status": 409,
  "code": "SCHEDULE_CONFLICT",
  "message": "Học sinh 3 trùng lịch với lớp khác vào day=2, time=14:00-15:30",
  "path": "/api/classes/1/register"
}
```

## **🔍 Validation Rules Summary**

| Entity | Field | Validation Rule | Error Code |
|--------|-------|-----------------|------------|
| Parent | email | Unique, Email format | VALIDATION_FAILED |
| Parent | name | Not blank, Max 100 chars | VALIDATION_FAILED |
| Parent | phone | Not blank, Max 20 chars | VALIDATION_FAILED |
| Student | parentId | Must exist | STUDENT_NOT_FOUND |
| Student | dob | Past date | VALIDATION_FAILED |
| Student | gender | M/F/O | VALIDATION_FAILED |
| Class | dayOfWeek | 1-7 | INVALID_DAY |
| Class | timeSlot | HH:mm-HH:mm format | VALIDATION_FAILED |
| Class | maxStudents | > 0 | VALIDATION_FAILED |
| Subscription | dates | endDate >= startDate | SUBSCRIPTION_INVALID_DATES |
| Subscription | sessions | total >= used | SUBSCRIPTION_TOTAL_LT_USED |

---

## **🔗 Related Documentation**

📚 **[Xem tất cả tài liệu →](INDEX.md)**

- 🏗️ **[Architecture](ARCHITECTURE.md)** - System architecture overview
- 📖 **[API Endpoints](api-endpoints.md)** - REST API documentation
