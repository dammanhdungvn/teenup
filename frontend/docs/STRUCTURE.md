# 🏗️ Project Structure

Cấu trúc thư mục và files của **React Frontend** TeenUp Contest Management System.

## **📁 Cấu trúc thư mục**

```
frontend/
├── 📁 src/                          # Source code chính
│   ├── 📁 components/               # Reusable components
│   │   ├── 📁 Layout/              # Layout components
│   │   │   ├── AppLayout.jsx       # Main layout với navigation
│   │   │   └── index.js            # Layout exports
│   │   └── index.js                 # Component exports
│   ├── 📁 pages/                    # Page components
│   │   ├── 📁 Dashboard/           # Dashboard pages
│   │   │   └── DashboardPage.jsx   # Main dashboard
│   │   ├── 📁 Students/            # Student management
│   │   │   ├── StudentsListPage.jsx
│   │   │   ├── CreateStudentPage.jsx
│   │   │   └── StudentDetailPage.jsx
│   │   ├── 📁 Parents/             # Parent management
│   │   │   ├── ParentsListPage.jsx
│   │   │   ├── CreateParentPage.jsx
│   │   │   └── ParentDetailPage.jsx
│   │   ├── 📁 Classes/             # Class management
│   │   │   ├── ClassesSchedulePage.jsx
│   │   │   ├── CreateClassPage.jsx
│   │   │   └── ClassDetailPage.jsx
│   │   └── 📁 Subscriptions/       # Subscription management
│   │       ├── SubscriptionsListPage.jsx
│   │       └── CreateSubscriptionPage.jsx
│   ├── 📁 services/                 # API services
│   │   ├── api.js                   # Axios client configuration
│   │   ├── students.api.js          # Student API calls
│   │   ├── parents.api.js           # Parent API calls
│   │   ├── classes.api.js           # Class API calls
│   │   ├── subscriptions.api.js     # Subscription API calls
│   │   └── dashboard.api.js         # Dashboard API calls
│   ├── 📁 utils/                    # Utility functions
│   │   ├── validation.js            # Validation helpers
│   │   └── constants.js             # App constants
│   ├── 📁 config/                   # Configuration files
│   │   └── api.config.js            # API configuration
│   ├── 📁 styles/                   # Global styles
│   │   └── index.css                # Main CSS file
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # App entry point
│   └── index.html                   # HTML template
├── 📁 public/                       # Static assets
│   ├── favicon.ico                  # Favicon
│   └── vite.svg                     # Vite logo
├── 📁 docs/                         # Documentation
│   ├── README.md                    # Frontend docs index
│   ├── SETUP.md                     # Setup guide
│   ├── STRUCTURE.md                 # This file
│   ├── DEVELOPMENT.md               # Development guide
│   ├── API-INTEGRATION.md           # API integration
│   ├── CONFIGURATION.md             # Configuration guide
│   ├── DESIGN-SYSTEM.md             # Design system
│   ├── STYLING.md                   # Styling guide
│   ├── DOCKER.md                    # Docker guide
│   └── DEPLOYMENT.md                # Deployment guide
├── 📁 logs/                         # Application logs (Docker)
├── 📁 dist/                         # Build output
├── 📁 node_modules/                 # Dependencies
├── 📄 package.json                  # Project dependencies
├── 📄 package-lock.json             # Locked dependencies
├── 📄 vite.config.js                # Vite configuration
├── 📄 nginx.conf                    # Nginx config (Docker)
├── 📄 Dockerfile                    # Docker image
├── 📄 .dockerignore                 # Docker ignore
├── 📄 .env.docker                   # Docker environment
├── 📄 .gitignore                    # Git ignore
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
└── 📄 README.md                     # Project overview
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
```
components/
├── 📁 Layout/           # Layout & navigation
├── 📁 Common/           # Shared components
├── 📁 Forms/            # Form components
└── 📁 Tables/           # Table components
```

### **📁 Page Organization:**
```
pages/
├── 📁 Dashboard/        # Dashboard & overview
├── 📁 Students/         # Student management
├── 📁 Parents/          # Parent management
├── 📁 Classes/          # Class management
└── 📁 Subscriptions/    # Subscription management
```

### **📁 Service Organization:**
```
services/
├── api.js               # Base API client
├── [entity].api.js      # Entity-specific API calls
└── dashboard.api.js     # Dashboard data
```

## **🔌 Data Flow**

### **📊 State Management:**
```
User Action → Component → Service → API → Backend → Database
     ↓
Response ← Service ← Component ← UI Update
```

### **📡 API Integration:**
```
Component → Service → api.js → Backend API
     ↓
Response → Service → Component → State Update
```

## **🎨 Styling Architecture**

### **📁 CSS Organization:**
```
styles/
├── index.css            # Global styles
├── components/          # Component-specific styles
├── layouts/             # Layout styles
└── themes/              # Theme variations
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
