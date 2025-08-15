# 🚀 Development Guide

Hướng dẫn phát triển **React Frontend** TeenUp Contest Management System.

## **🛠️ Development Environment**

### **Prerequisites:**
- **Node.js:** 18.x+
- **npm:** 9.x+
- **Git:** Latest version
- **VS Code:** Recommended editor

### **VS Code Extensions:**
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## **📁 Project Structure**

### **Component Organization:**
```
src/
├── components/           # Reusable components
│   ├── Layout/         # Layout components
│   ├── Common/         # Shared components
│   └── Forms/          # Form components
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
├── config/             # Configuration
└── styles/             # Global styles
```

### **Naming Conventions:**
- **Components:** PascalCase (e.g., `StudentCard.jsx`)
- **Files:** PascalCase for components, camelCase for utilities
- **Functions:** camelCase (e.g., `getStudentById`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_STUDENTS`)

## **🔧 Development Workflow**

### **1. Feature Development:**
```bash
# Create feature branch
git checkout -b feature/student-management

# Make changes
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "feat: add student management features"

# Push and create PR
git push origin feature/student-management
```

### **2. Component Development:**
```javascript
// 1. Create component file
// src/components/StudentCard/StudentCard.jsx

// 2. Add PropTypes or TypeScript
import PropTypes from 'prop-types';

const StudentCard = ({ student, onEdit, onDelete }) => {
  // Component logic
};

StudentCard.propTypes = {
  student: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default StudentCard;
```

### **3. Testing:**
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- StudentCard.test.jsx
```

## **🎯 Component Patterns**

### **Functional Components with Hooks:**
```javascript
import React, { useState, useEffect } from 'react';
import { message } from 'antd';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getStudentsList();
      setStudents(data);
    } catch (error) {
      message.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### **Custom Hooks:**
```javascript
// src/hooks/useApi.js
import { useState, useEffect } from 'react';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Usage
const { data: students, loading, error } = useApi(studentsApi.getStudentsList, []);
```

## **🎨 Styling Guidelines**

### **CSS Organization:**
```css
/* Global styles */
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
}

/* Component-specific styles */
.student-card {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.student-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### **Ant Design Integration:**
```javascript
import { Card, Button, Space } from 'antd';

const StudentCard = ({ student }) => (
  <Card
    title={student.name}
    extra={
      <Space>
        <Button type="primary" size="small">
          Edit
        </Button>
        <Button danger size="small">
          Delete
        </Button>
      </Space>
    }
  >
    {/* Card content */}
  </Card>
);
```

## **🔌 API Integration**

### **Service Layer Pattern:**
```javascript
// src/services/students.api.js
import apiClient from './api.js';

export const studentsApi = {
  getStudentsList: async (params = {}) => {
    const response = await apiClient.get('/students/list', { params });
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await apiClient.post('/students', studentData);
    return response.data;
  },
};
```

### **Error Handling:**
```javascript
const handleApiCall = async () => {
  try {
    setLoading(true);
    const result = await apiCall();
    setData(result);
    message.success('Operation successful');
  } catch (error) {
    if (error.response?.status === 422) {
      message.error('Validation failed');
    } else {
      message.error('An error occurred');
    }
  } finally {
    setLoading(false);
  }
};
```

## **📱 Responsive Design**

### **Breakpoint System:**
```javascript
import { useMediaQuery } from 'react-responsive';

const StudentList = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  return (
    <div>
      {isMobile ? (
        <MobileStudentList />
      ) : isTablet ? (
        <TabletStudentList />
      ) : (
        <DesktopStudentList />
      )}
    </div>
  );
};
```

### **Ant Design Responsive:**
```javascript
import { Row, Col } from 'antd';

const StudentGrid = () => (
  <Row gutter={[16, 16]}>
    <Col xs={24} sm={12} md={8} lg={6}>
      <StudentCard />
    </Col>
  </Row>
);
```

## **🧪 Testing**

### **Unit Testing:**
```javascript
// src/components/StudentCard/StudentCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import StudentCard from './StudentCard';

describe('StudentCard', () => {
  const mockStudent = {
    id: 1,
    name: 'Minh',
    grade: 'Grade 7',
  };

  it('renders student information', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('Minh')).toBeInTheDocument();
    expect(screen.getByText('Grade 7')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<StudentCard student={mockStudent} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockStudent.id);
  });
});
```

### **Integration Testing:**
```javascript
// Test API integration
describe('Student API Integration', () => {
  it('fetches students successfully', async () => {
    const mockStudents = [
      { id: 1, name: 'Minh', grade: 'Grade 7' },
    ];

    // Mock API response
    jest.spyOn(studentsApi, 'getStudentsList').mockResolvedValue(mockStudents);

    render(<StudentList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Minh')).toBeInTheDocument();
    });
  });
});
```

## **📦 Build & Optimization**

### **Build Process:**
```bash
# Development build
npm run build

# Production build with optimization
npm run build -- --mode production

# Analyze bundle
npm run build -- --analyze
```

### **Code Splitting:**
```javascript
// Lazy load components
import { lazy, Suspense } from 'react';

const StudentDetail = lazy(() => import('./StudentDetail'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <StudentDetail />
  </Suspense>
);
```

## **🔍 Debugging**

### **React DevTools:**
- Install React Developer Tools extension
- Use Components tab to inspect component tree
- Use Profiler tab to analyze performance

### **Console Logging:**
```javascript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Student data:', student);
  console.log('API response:', response);
}
```

### **Error Boundaries:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## **📋 Code Quality**

### **ESLint Rules:**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react/prop-types': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

### **Prettier Configuration:**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

## **🔗 Related Documentation**

📚 **[Xem tất cả tài liệu →](INDEX.md)**

- 📖 **[Setup Guide](SETUP.md)** - Cài đặt và chạy
- 🏗️ **[Project Structure](STRUCTURE.md)** - Cấu trúc code
- 🔌 **[API Integration](API-INTEGRATION.md)** - Kết nối backend
- 🐳 **[Docker Guide](DOCKER.md)** - Containerization
