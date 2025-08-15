# 🏗️ Project Structure

Cấu trúc thư mục và files của **React Frontend** TeenUp Contest Management System.

## **📁 Cấu trúc thư mục**

```mermaid
graph TD
    subgraph "Frontend Project Structure"
        subgraph "📁 src/ - Source Code"
            subgraph "📁 components/"
                C1[Layout/]
                C2[index.js]
            end
            
            subgraph "📁 pages/"
                P1[Dashboard/]
                P2[Students/]
                P3[Parents/]
                P4[Classes/]
                P5[Subscriptions/]
            end
            
            subgraph "📁 services/"
                S1[api.js]
                S2[students.api.js]
                S3[parents.api.js]
                S4[classes.api.js]
                S5[subscriptions.api.js]
                S6[dashboard.api.js]
            end
            
            subgraph "📁 utils/"
                U1[validation.js]
                U2[constants.js]
            end
            
            subgraph "📁 config/"
                CF1[api.config.js]
            end
            
            subgraph "📁 styles/"
                ST1[index.css]
            end
            
            M1[App.jsx]
            M2[main.jsx]
            M3[index.html]
        end
        
        subgraph "📁 public/ - Static Assets"
            PA1[favicon.ico]
            PA2[vite.svg]
        end
        
        subgraph "📁 docs/ - Documentation"
            D1[README.md]
            D2[SETUP.md]
            D3[STRUCTURE.md]
            D4[DEVELOPMENT.md]
            D5[API-INTEGRATION.md]
            D6[CONFIGURATION.md]
            D7[DESIGN-SYSTEM.md]
            D8[STYLING.md]
            D9[DOCKER.md]
            D10[DEPLOYMENT.md]
        end
        
        subgraph "📁 Build & Config"
            BC1[dist/]
            BC2[node_modules/]
            BC3[package.json]
            BC4[vite.config.js]
            BC5[nginx.conf]
            BC6[Dockerfile]
            BC7[.dockerignore]
            BC8[.env.docker]
        end
    end
    
    style C1 fill:#e1f5fe
    style C2 fill:#e1f5fe
    style P1 fill:#f3e5f5
    style P2 fill:#f3e5f5
    style P3 fill:#f3e5f5
    style P4 fill:#f3e5f5
    style P5 fill:#f3e5f5
    style S1 fill:#e8f5e8
    style S2 fill:#e8f5e8
    style S3 fill:#e8f5e8
    style S4 fill:#e8f5e8
    style S5 fill:#e8f5e8
    style S6 fill:#e8f5e8
    style U1 fill:#fff3e0
    style U2 fill:#fff3e0
    style CF1 fill:#fff3e0
    style ST1 fill:#fff3e0
    style M1 fill:#fce4ec
    style M2 fill:#fce4ec
    style M3 fill:#fce4ec
    style PA1 fill:#f1f8e9
    style PA2 fill:#f1f8e9
    style D1 fill:#e0f2f1
    style D2 fill:#e0f2f1
    style D3 fill:#e0f2f1
    style D4 fill:#e0f2f1
    style D5 fill:#e0f2f1
    style D6 fill:#e0f2f1
    style D7 fill:#e0f2f1
    style D8 fill:#e0f2f1
    style D9 fill:#e0f2f1
    style D10 fill:#e0f2f1
    style BC1 fill:#ffebee
    style BC2 fill:#ffebee
    style BC3 fill:#ffebee
    style BC4 fill:#ffebee
    style BC5 fill:#ffebee
    style BC6 fill:#ffebee
    style BC7 fill:#ffebee
    style BC8 fill:#ffebee
```

## **🔧 Key Files**

### **📄 Configuration Files:**
- **`vite.config.js`** - Vite build tool configuration
- **`package.json`** - Dependencies và scripts
- **`api.config.js`** - API configuration cho các môi trường
- **`nginx.conf`** - Nginx configuration cho Docker

### **📄 Entry Points:**
- **`main.jsx`** - React app entry point
- **`App.jsx`** - Main app component với routing
- **`index.html`** - HTML template

### **📄 Core Components:**
- **`AppLayout.jsx`** - Main layout với navigation menu
- **`DashboardPage.jsx`** - Dashboard chính
- **`StudentsListPage.jsx`** - Danh sách học sinh
- **`ClassesSchedulePage.jsx`** - Lịch học tuần

## **🏗️ Architecture Patterns**

### **📁 Component Organization:**
```mermaid
graph TD
    subgraph "Component Structure"
        subgraph "📁 Layout/"
            L1[AppLayout.jsx]
            L2[Navigation]
            L3[Sidebar]
        end
        
        subgraph "📁 Common/"
            C1[Buttons]
            C2[Modals]
            C3[Loading]
            C4[ErrorBoundary]
        end
        
        subgraph "📁 Forms/"
            F1[Input Fields]
            F2[Select Dropdowns]
            F3[Date Pickers]
            F4[Validation]
        end
        
        subgraph "📁 Tables/"
            T1[Data Tables]
            T2[Pagination]
            T3[Sorting]
            T4[Filtering]
        end
    end
    
    style L1 fill:#e3f2fd
    style L2 fill:#e3f2fd
    style L3 fill:#e3f2fd
    style C1 fill:#f1f8e9
    style C2 fill:#f1f8e9
    style C3 fill:#f1f8e9
    style C4 fill:#f1f8e9
    style F1 fill:#fff3e0
    style F2 fill:#fff3e0
    style F3 fill:#fff3e0
    style F4 fill:#fff3e0
    style T1 fill:#fce4ec
    style T2 fill:#fce4ec
    style T3 fill:#fce4ec
    style T4 fill:#fce4ec
```

### **📁 Page Organization:**
```mermaid
graph TD
    subgraph "Page Structure"
        subgraph "📁 Dashboard/"
            D1[DashboardPage.jsx]
            D2[Statistics]
            D3[Charts]
        end
        
        subgraph "📁 Students/"
            S1[StudentsListPage.jsx]
            S2[CreateStudentPage.jsx]
            S3[StudentDetailPage.jsx]
        end
        
        subgraph "📁 Parents/"
            P1[ParentsListPage.jsx]
            P2[CreateParentPage.jsx]
            P3[ParentDetailPage.jsx]
        end
        
        subgraph "📁 Classes/"
            CL1[ClassesSchedulePage.jsx]
            CL2[CreateClassPage.jsx]
            CL3[ClassDetailPage.jsx]
        end
        
        subgraph "📁 Subscriptions/"
            SU1[SubscriptionsListPage.jsx]
            SU2[CreateSubscriptionPage.jsx]
        end
    end
    
    style D1 fill:#e8f5e8
    style D2 fill:#e8f5e8
    style D3 fill:#e8f5e8
    style S1 fill:#e3f2fd
    style S2 fill:#e3f2fd
    style S3 fill:#e3f2fd
    style P1 fill:#f3e5f5
    style P2 fill:#f3e5f5
    style P3 fill:#f3e5f5
    style CL1 fill:#fff3e0
    style CL2 fill:#fff3e0
    style CL3 fill:#fff3e0
    style SU1 fill:#fce4ec
    style SU2 fill:#fce4ec
```

### **📁 Service Organization:**
```mermaid
graph TD
    subgraph "Service Architecture"
        subgraph "📁 services/"
            API[api.js<br/>Base Axios Client]
            
            subgraph "Entity APIs"
                SA[students.api.js]
                PA[parents.api.js]
                CA[classes.api.js]
                SUA[subscriptions.api.js]
            end
            
            DA[dashboard.api.js<br/>Dashboard Data]
        end
        
        API --> SA
        API --> PA
        API --> CA
        API --> SUA
        API --> DA
    end
    
    style API fill:#6db33f,stroke:#333,stroke-width:2px,color:#fff
    style SA fill:#e8f5e8
    style PA fill:#f3e5f5
    style CA fill:#fff3e0
    style SUA fill:#fce4ec
    style DA fill:#e0f2f1
```

## **🔌 Data Flow**

### **📊 State Management:**
```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Service
    participant A as API
    participant B as Backend
    participant D as Database
    
    U->>C: User Action
    C->>S: Call Service
    S->>A: HTTP Request
    A->>B: API Call
    B->>D: Database Query
    D-->>B: Data Response
    B-->>A: API Response
    A-->>S: HTTP Response
    S-->>C: Service Response
    C-->>U: UI Update
```

### **📡 API Integration:**
```mermaid
flowchart LR
    subgraph "Frontend Layer"
        C[Component]
        S[Service]
        A[api.js]
    end
    
    subgraph "Backend Layer"
        B[Backend API]
        DB[(Database)]
    end
    
    C -->|1. Call| S
    S -->|2. HTTP Request| A
    A -->|3. API Call| B
    B -->|4. Query| DB
    DB -->|5. Response| B
    B -->|6. API Response| A
    A -->|7. HTTP Response| S
    S -->|8. Service Response| C
    
    style C fill:#e3f2fd
    style S fill:#e8f5e8
    style A fill:#6db33f,color:#fff
    style B fill:#ff9800,color:#fff
    style DB fill:#00758f,color:#fff
```

## **🎨 Styling Architecture**

### **📁 CSS Organization:**
```mermaid
graph TD
    subgraph "CSS Architecture"
        subgraph "📁 styles/"
            G[index.css<br/>Global Styles]
            
            subgraph "Component Styles"
                CS[components/<br/>Component-specific]
                LS[layouts/<br/>Layout Styles]
                TS[themes/<br/>Theme Variations]
            end
        end
        
        subgraph "CSS Framework"
            AD[Ant Design<br/>UI Components]
            V[Vite<br/>Build Tool]
            P[PostCSS<br/>CSS Processing]
        end
        
        G --> CS
        G --> LS
        G --> TS
        AD --> CS
        V --> G
        P --> G
    end
    
    style G fill:#e8f5e8,stroke:#333,stroke-width:2px
    style CS fill:#e3f2fd
    style LS fill:#f3e5f5
    style TS fill:#fff3e0
    style AD fill:#1890ff,color:#fff
    style V fill:#646cff,color:#fff
    style P fill:#dd3a0a,color:#fff
```

### **🎯 CSS Framework:**
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Component-specific styling

## **📱 Responsive Design**

### **📐 Breakpoints:**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **🔧 Responsive Features:**
- **Flexible layouts** với Ant Design Grid
- **Mobile-first** approach
- **Touch-friendly** interactions

## **🔒 Security & Best Practices**

### **🛡️ Security Measures:**
- **Input validation** trong forms
- **XSS prevention** với React
- **CORS handling** qua Vite proxy

### **📝 Code Quality:**
- **ESLint** configuration
- **Component composition** patterns
- **Service layer** abstraction
- **Error handling** strategies

## **🚀 Build & Deployment**

### **📦 Build Process:**
```
Source Code → Vite Build → Optimized Bundle → Nginx Serve
```

### **🐳 Docker Support:**
- **Multi-stage build** (Node.js + Nginx)
- **Production optimization**
- **Environment configuration**

---

## **🔗 Related Documentation**

- 📖 **[Setup Guide](SETUP.md)** - Cài đặt và chạy
- 🚀 **[Development Guide](DEVELOPMENT.md)** - Phát triển
- 🔌 **[API Integration](API-INTEGRATION.md)** - Kết nối backend
- 🎨 **[Design System](DESIGN-SYSTEM.md)** - UI/UX guidelines
