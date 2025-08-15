# Frontend Documentation

## 🚀 Overview
React-based frontend application with Ant Design components, built with Vite.

## 📁 Project Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home/           # Dashboard & navigation
│   │   ├── Parents/        # Parent management
│   │   ├── Students/       # Student management  
│   │   ├── Classes/        # Class management
│   │   └── Subscriptions/  # Subscription management
│   ├── services/           # API services
│   ├── components/         # Reusable components
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json
```

## 🎯 Key Features

### 1. **Dashboard (HomePage)**
- **Statistics Cards**: Total students, parents, classes, subscriptions
- **Quick Actions**: Navigation to main features
- **Responsive Design**: Professional UI with gradient backgrounds

### 2. **Parent Management**
- **List View**: Table with search, pagination, CRUD operations
- **Detail View**: Parent information + student list
- **Reassign Students**: Move students between parents
  - Dropdown selection for target parent
  - Checkbox list for student selection
  - "Move All" and "Move Selected" options

### 3. **Student Management**
- **List View**: Table with search, pagination, CRUD operations
- **Detail View**: Student information + class registrations
- **Class Registration**: Enroll/unenroll from classes

### 4. **Class Management**
- **Schedule View**: Weekly schedule with class blocks
- **Management Modal**: Quick actions for each class
  - Edit class information
  - View student list
  - Delete class
- **CRUD Operations**: Create, edit, delete classes
- **Conflict Detection**: Prevents schedule conflicts

### 5. **Subscription Management**
- **List View**: Table with subscription details
- **Admin Functions**:
  - **Reset Used Sessions**: Reset session count to 0
  - **Extend Subscription**: Add sessions and extend end date
- **CRUD Operations**: Create, edit, delete subscriptions

## 🔧 Technical Implementation

### **State Management**
- React hooks (`useState`, `useEffect`, `useCallback`)
- Local state for modals, forms, and data
- Optimized re-renders with dependency arrays

### **API Integration**
- Axios-based HTTP client
- Centralized error handling (`errorHandler.js`)
- Request/response interceptors
- Proxy configuration for development

### **UI/UX Features**
- **Responsive Design**: Mobile-first approach
- **Professional Styling**: Gradient backgrounds, hover effects
- **Modal Forms**: Consistent CRUD interfaces
- **Loading States**: User feedback during operations
- **Error Handling**: Detailed backend error messages

### **Form Validation**
- Ant Design Form validation
- Custom validation rules
- Real-time feedback
- Partial update support (PATCH operations)

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: `< 768px` - Stacked layout, full-width buttons
- **Tablet**: `768px - 1024px` - Side-by-side layout
- **Desktop**: `> 1024px` - Multi-column layout

### **CSS Strategy**
- Dedicated CSS files for each page
- CSS Modules for component-specific styles
- Media queries for fine-grained control
- Flexbox and Grid for layouts

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- npm or yarn

### **Installation**
```bash
cd frontend
npm install
```

### **Development**
```bash
npm run dev
```

### **Build**
```bash
npm run build
```

## 🔗 API Integration

### **Base Configuration**
- Development: `http://localhost:8081` (with proxy)
- Production: Environment-based configuration

### **Key Endpoints**
- **Parents**: `/api/parents/*`
- **Students**: `/api/students/*`
- **Classes**: `/api/classes/*`
- **Subscriptions**: `/api/subscriptions/*`

### **Error Handling**
- Centralized error processing
- User-friendly error messages
- Backend error code mapping
- Network error fallbacks

## 🎨 UI Components

### **Ant Design Usage**
- **Tables**: Data display with sorting, filtering
- **Forms**: Validation, dynamic fields
- **Modals**: CRUD operations, confirmations
- **Buttons**: Consistent styling, loading states
- **Layout**: Responsive grid system

### **Custom Styling**
- Gradient backgrounds
- Hover effects and transitions
- Professional color scheme
- Consistent spacing and typography

## 📊 Data Flow

### **CRUD Operations**
1. **Create**: Form input → API call → Success feedback → Refresh data
2. **Read**: Component mount → API call → State update → UI render
3. **Update**: Form input → PATCH API → Success feedback → Refresh data
4. **Delete**: Confirmation → DELETE API → Success feedback → Refresh data

### **State Updates**
- Optimistic updates where possible
- Real-time data synchronization
- Error state management
- Loading state indicators

## 🔒 Security & Validation

### **Input Validation**
- Frontend form validation
- Backend API validation
- XSS prevention
- SQL injection protection

### **Error Handling**
- Graceful degradation
- User-friendly error messages
- Logging for debugging
- Fallback mechanisms

## 🚀 Performance Optimization

### **Code Splitting**
- Route-based code splitting
- Lazy loading of components
- Bundle size optimization

### **State Management**
- Memoized callbacks
- Optimized re-renders
- Efficient data fetching
- Cache strategies

## 📝 Development Guidelines

### **Code Style**
- ESLint + Prettier configuration
- Consistent naming conventions
- Component composition patterns
- Error boundary usage

### **Testing Strategy**
- Component testing
- Integration testing
- API mocking
- User interaction testing

## 🔄 Deployment

### **Build Process**
- Vite build optimization
- Asset optimization
- Environment configuration
- Bundle analysis

### **Docker Support**
- Multi-stage builds
- Nginx serving
- Environment variables
- Health checks
