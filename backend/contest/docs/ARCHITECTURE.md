# Backend Architecture

## **🏗️ Tổng quan kiến trúc**

```mermaid
graph TB
    subgraph "Presentation Layer"
        C1[StudentController]
        C2[ParentController]
        C3[ClassController]
        C4[ClassReadController]
        C5[ClassRegistrationController]
        C6[SubscriptionController]
    end
    
    subgraph "Business Logic Layer"
        S1[StudentService]
        S2[ParentService]
        S3[ClassService]
        S4[ClassReadService]
        S5[ClassRegistrationService]
        S6[SubscriptionService]
    end
    
    subgraph "Data Access Layer"
        R1[StudentRepository]
        R2[ParentRepository]
        R3[ClassRepository]
        R4[ClassRegistrationRepository]
        R5[SubscriptionRepository]
    end
    
    subgraph "Data Transformation Layer"
        M1[StudentMapper]
        M2[ParentMapper]
        M3[ClassMapper]
        M4[ClassReadMapper]
        M5[SubscriptionMapper]
    end
    
    subgraph "Data Layer"
        E1[StudentsEntity]
        E2[ParentsEntity]
        E3[ClassesEntity]
        E4[ClassRegistrationEntity]
        E5[SubscriptionsEntity]
        DB[(MySQL Database)]
    end
    
    C1 --> S1
    C2 --> S2
    C3 --> S3
    C4 --> S4
    C5 --> S5
    C6 --> S6
    
    S1 --> R1
    S2 --> R2
    S3 --> R3
    S4 --> R3
    S5 --> R4
    S6 --> R5
    
    S1 --> M1
    S2 --> M2
    S3 --> M3
    S4 --> M4
    S6 --> M5
    
    R1 --> E1
    R2 --> E2
    R3 --> E3
    R4 --> E4
    R5 --> E5
    
    E1 --> DB
    E2 --> DB
    E3 --> DB
    E4 --> DB
    E5 --> DB
    
    style C1 fill:#e3f2fd
    style C2 fill:#e3f2fd
    style C3 fill:#e3f2fd
    style C4 fill:#e3f2fd
    style C5 fill:#e3f2fd
    style C6 fill:#e3f2fd
    style S1 fill:#e8f5e8
    style S2 fill:#e8f5e8
    style S3 fill:#e8f5e8
    style S4 fill:#e8f5e8
    style S5 fill:#e8f5e8
    style S6 fill:#e8f5e8
    style R1 fill:#fff3e0
    style R2 fill:#fff3e0
    style R3 fill:#fff3e0
    style R4 fill:#fff3e0
    style R5 fill:#fff3e0
    style M1 fill:#f3e5f5
    style M2 fill:#f3e5f5
    style M3 fill:#f3e5f5
    style M4 fill:#f3e5f5
    style M5 fill:#f3e5f5
    style E1 fill:#e0f2f1
    style E2 fill:#e0f2f1
    style E3 fill:#e0f2f1
    style E4 fill:#e0f2f1
    style E5 fill:#e0f2f1
    style DB fill:#00758f,color:#fff
```

## **🔧 Technology Stack**

### **Core Framework:**
- **Spring Boot 3.5.4** - Main framework
- **Java 21** - Programming language
- **Spring Data JPA** - Data access layer
- **Spring Web** - REST API layer
- **Spring Validation** - Input validation

### **Database & ORM:**
- **MySQL 8** - Primary database
- **Hibernate** - JPA implementation
- **HikariCP** - Connection pooling

### **Development Tools:**
- **Lombok** - Code generation
- **MapStruct** - Object mapping
- **Maven** - Build tool

## **📁 Package Structure**

```
com.teenup.contest/
├── 📁 controller/           # REST API endpoints
│   ├── StudentController.java
│   ├── ParentController.java
│   ├── ClassController.java
│   ├── ClassReadController.java
│   ├── ClassRegistrationController.java
│   └── SubscriptionController.java
├── 📁 service/              # Business logic
│   ├── StudentService.java
│   ├── ParentService.java
│   ├── ClassService.java
│   ├── ClassReadService.java
│   ├── ClassRegistrationService.java
│   └── SubscriptionService.java
├── 📁 repository/           # Data access
│   ├── StudentsRepository.java
│   ├── ParentsRepository.java
│   ├── ClassesRepository.java
│   ├── ClassRegistrationsRepository.java
│   └── SubscriptionsRepository.java
├── 📁 entity/               # JPA entities
│   ├── StudentsEntity.java
│   ├── ParentsEntity.java
│   ├── ClassesEntity.java
│   ├── ClassRegistrationEntity.java
│   ├── SubscriptionsEntity.java
│   ├── BaseAuditableEntity.java
│   └── Gender.java
├── 📁 dto/                  # Data transfer objects
│   ├── 📁 request/          # Input DTOs
│   └── 📁 response/         # Output DTOs
├── 📁 mapper/               # Object mapping
│   ├── StudentMapper.java
│   ├── ParentMapper.java
│   ├── ClassMapper.java
│   ├── ClassReadMapper.java
│   └── SubscriptionMapper.java
├── 📁 exception/            # Error handling
│   ├── ErrorCode.java
│   ├── BaseException.java
│   ├── ApiExceptionHandler.java
│   └── Specific exceptions...
└── 📁 config/               # Configuration
    └── DevDataSeeder.java
```

## **🔄 Data Flow**

### **1. Request Flow:**
```mermaid
sequenceDiagram
    participant C as Client
    participant CT as Controller
    participant S as Service
    participant M as Mapper
    participant R as Repository
    participant E as Entity
    participant DB as Database
    
    C->>CT: HTTP Request
    CT->>S: Call Service Method
    S->>M: Transform Request DTO
    S->>R: Call Repository
    R->>E: JPA Operations
    E->>DB: SQL Query
    DB-->>E: Result Set
    E-->>R: Entity Object
    R-->>S: Repository Result
    S->>M: Transform to Response DTO
    S-->>CT: Service Result
    CT-->>C: HTTP Response
```

### **2. Entity Relationships:**
```mermaid
erDiagram
    PARENTS ||--o{ STUDENTS : "1:N"
    STUDENTS ||--o{ CLASS_REGISTRATIONS : "1:N"
    CLASSES ||--o{ CLASS_REGISTRATIONS : "1:N"
    STUDENTS ||--o{ SUBSCRIPTIONS : "1:N"
    
    PARENTS {
        bigint id PK
        varchar name
        varchar phone
        varchar email
        timestamp created_at
        timestamp updated_at
        bigint version
    }
    
    STUDENTS {
        bigint id PK
        varchar name
        date dob
        enum gender
        varchar current_grade
        bigint parent_id FK
        timestamp created_at
        timestamp updated_at
        bigint version
    }
    
    CLASSES {
        bigint id PK
        varchar name
        varchar subject
        int day_of_week
        varchar time_slot
        varchar teacher_name
        int max_students
        timestamp created_at
        timestamp updated_at
        bigint version
    }
    
    CLASS_REGISTRATIONS {
        bigint id PK
        bigint class_id FK
        bigint student_id FK
        timestamp created_at
        timestamp updated_at
        bigint version
    }
    
    SUBSCRIPTIONS {
        bigint id PK
        bigint student_id FK
        varchar package_name
        date start_date
        date end_date
        int total_sessions
        int used_sessions
        timestamp created_at
        timestamp updated_at
        bigint version
    }
```

## **🛡️ Security & Validation**

### **Input Validation:**
- **Bean Validation** với annotations: `@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@Pattern`
- **Custom validation** cho business rules (schedule conflict, capacity check)
- **Request DTOs** với validation constraints

### **Error Handling:**
- **Global exception handler** (`ApiExceptionHandler`)
- **Structured error responses** với `ErrorCode`, HTTP status, message
- **Business logic exceptions** cho các trường hợp đặc biệt

### **Data Integrity:**
- **JPA constraints** (unique constraints, foreign keys)
- **Optimistic locking** với `@Version`
- **Transaction management** với `@Transactional`

## **🚀 Performance & Optimization**

### **Database Optimization:**
- **JPA fetch joins** để tránh N+1 queries
- **Custom queries** cho complex operations
- **Indexes** trên foreign keys và search fields

### **Caching Strategy:**
- **Entity caching** với Hibernate second-level cache
- **Query result caching** cho read operations
- **Connection pooling** với HikariCP

### **Transaction Management:**
- **Read-only transactions** cho queries
- **Optimistic locking** cho concurrent updates
- **Proper transaction boundaries** cho business operations

## **🔧 Configuration & Environment**

### **Application Properties:**
```properties
# Server Configuration
server.port=8081
spring.application.name=contest

# Database Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Development Profile
spring.profiles.active=dev
```

### **Environment-specific Config:**
- **Development:** Local MySQL, detailed logging, data seeding
- **Production:** Production database, minimal logging, no seeding
- **Docker:** Containerized database, optimized settings

## **📊 Monitoring & Logging**

### **Logging Strategy:**
- **Structured logging** với SLF4J + Logback
- **SQL logging** trong development mode
- **Business operation logging** cho audit trail

### **Health Checks:**
- **Database connectivity** checks
- **Application health** endpoints
- **Custom health indicators** cho business metrics

---

## **🔗 Related Documentation**

- 📖 **[API Endpoints](api-endpoints.md)** - REST API documentation
- 🗄️ **[Database Schema](database-schema.md)** - Database structure
- 🚀 **[Development Guide](../README.md)** - Setup and development
