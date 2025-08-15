# 🔌 API Integration

Hướng dẫn tích hợp **Frontend React** với **Backend Spring Boot API** của TeenUp Contest Management System.

## **🌐 API Overview**

### **Base URL:**
- **Development:** `http://localhost:8081`
- **Docker:** `http://localhost:8081`
- **Production:** `https://your-domain.com`

### **API Endpoints:**
```mermaid
graph TD
    subgraph "API Endpoints Structure"
        subgraph "Student Management"
            S1[GET /api/students/list]
            S2[GET /api/students/&#123;id&#125;]
            S3[POST /api/students]
            S4[PUT /api/students/&#123;id&#125;]
            S5[DELETE /api/students/&#123;id&#125;]
        end
        
        subgraph "Parent Management"
            P1[GET /api/parents/list]
            P2[GET /api/parents/&#123;id&#125;]
            P3[POST /api/parents]
            P4[PUT /api/parents/&#123;id&#125;]
            P5[DELETE /api/parents/&#123;id&#125;]
        end
        
        subgraph "Class Management"
            C1[GET /api/classes]
            C2[GET /api/classes/&#123;id&#125;]
            C3[POST /api/classes]
            C4[PUT /api/classes/&#123;id&#125;]
            C5[DELETE /api/classes/&#123;id&#125;]
            C6[POST /api/classes/&#123;id&#125;/register]
        end
        
        subgraph "Subscription Management"
            SU1[GET /api/subscriptions]
            SU2[GET /api/subscriptions/&#123;id&#125;]
            SU3[POST /api/subscriptions]
            SU4[PUT /api/subscriptions/&#123;id&#125;]
            SU5[DELETE /api/subscriptions/&#123;id&#125;]
            SU6[POST /api/subscriptions/&#123;id&#125;/use-session]
        end
        
        subgraph "Dashboard"
            D1[GET /api/dashboard/statistics]
        end
    end
    
    style S1 fill:#e8f5e8
    style S2 fill:#e8f5e8
    style S3 fill:#e8f5e8
    style S4 fill:#e8f5e8
    style S5 fill:#e8f5e8
    style P1 fill:#f3e5f5
    style P2 fill:#f3e5f5
    style P3 fill:#f3e5f5
    style P4 fill:#f3e5f5
    style P5 fill:#f3e5f5
    style C1 fill:#fff3e0
    style C2 fill:#fff3e0
    style C3 fill:#fff3e0
    style C4 fill:#fff3e0
    style C5 fill:#fff3e0
    style C6 fill:#fff3e0
    style SU1 fill:#fce4ec
    style SU2 fill:#fce4ec
    style SU3 fill:#fce4ec
    style SU4 fill:#fce4ec
    style SU5 fill:#fce4ec
    style SU6 fill:#fce4ec
    style D1 fill:#e0f2f1
```

## **🔧 Configuration**

### **API Config File:**
```javascript
// src/config/api.config.js
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:8081',
    useProxy: true,      // Vite proxy
  },
  docker: {
    baseURL: 'http://localhost:8081',
    useProxy: false,     // Direct calls
  },
  production: {
    baseURL: 'https://your-domain.com',
    useProxy: false,
  }
};
```

### **Environment Variables:**
```bash
# .env
VITE_API_BASE_URL=http://localhost:8081
VITE_DOCKER=false
```

## **📡 HTTP Client Setup**

### **Axios Configuration:**
```javascript
// src/services/api.js
import axios from 'axios';
import { API_BASE_URL, USE_PROXY } from '../config/api.config.js';

const baseURL = USE_PROXY ? '/api' : API_BASE_URL + '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token, logging, etc.
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    return Promise.reject(error);
  }
);
```

## **🎯 Service Layer Pattern**

### **Entity Service Structure:**
```javascript
// src/services/students.api.js
import apiClient from './api.js';

export const studentsApi = {
  // Get all students
  getStudentsList: async (params = {}) => {
    const response = await apiClient.get('/students/list', { params });
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await apiClient.get(`/students/${id}`);
    return response.data;
  },

  // Create new student
  createStudent: async (studentData) => {
    const response = await apiClient.post('/students', studentData);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await apiClient.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  }
};
```

## **📊 Data Flow Examples**

### **🔄 Complete Data Flow Diagram:**
```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Service
    participant A as API Client
    participant B as Backend
    participant D as Database
    
    Note over U,D: Fetch Students List Flow
    U->>C: Click "Load Students"
    C->>S: studentsApi.getStudentsList()
    S->>A: GET api/students/list
    A->>B: HTTP Request
    B->>D: SELECT * FROM students
    D-->>B: Students Data
    B-->>A: JSON Response
    A-->>S: Response Data
    S-->>C: Students Array
    C-->>U: Display Table
    
    Note over U,D: Create Student Flow
    U->>C: Fill Form & Submit
    C->>S: studentsApi.createStudent(data)
    S->>A: POST api/students
    A->>B: HTTP Request + JSON Body
    B->>D: INSERT INTO students
    D-->>B: Success Response
    B-->>A: Created Student Data
    A-->>S: Response Data
    S-->>C: Success Message
    C-->>U: Navigate to List
```

### **1. Fetch Students List:**
```javascript
// In component
import { studentsApi } from '../services/students.api.js';

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getStudentsList();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
};
```

### **2. Create New Student:**
```javascript
const CreateStudentPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await studentsApi.createStudent(values);
      message.success('Tạo học sinh thành công!');
      navigate('/students/list');
    } catch (error) {
      console.error('Error creating student:', error);
      message.error('Không thể tạo học sinh');
    }
  };
};
```

### **3. Update Student:**
```javascript
const StudentDetailPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  const updateStudent = async (values) => {
    try {
      await studentsApi.updateStudent(id, values);
      message.success('Cập nhật thành công!');
      fetchStudent(); // Refresh data
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };
};
```

## **🔍 Error Handling**

### **Global Error Interceptor:**
```javascript
// src/services/api.js
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Server responded with error status
      switch (response.status) {
        case 400:
          message.error('Dữ liệu không hợp lệ');
          break;
        case 401:
          message.error('Không có quyền truy cập');
          break;
        case 404:
          message.error('Không tìm thấy dữ liệu');
          break;
        case 500:
          message.error('Lỗi server');
          break;
        default:
          message.error('Có lỗi xảy ra');
      }
    } else {
      // Network error
      message.error('Không thể kết nối server');
    }
    
    return Promise.reject(error);
  }
);
```

### **Component-Level Error Handling:**
```javascript
const handleApiCall = async () => {
  try {
    setLoading(true);
    const result = await apiCall();
    setData(result);
  } catch (error) {
    // Specific error handling
    if (error.response?.status === 422) {
      message.error('Dữ liệu không hợp lệ');
    } else {
      message.error('Có lỗi xảy ra');
    }
  } finally {
    setLoading(false);
  }
};
```

## **🔄 Data Synchronization**

### **🔄 Data Flow Patterns:**
```mermaid
graph TD
    subgraph "Optimistic Updates"
        OU1[User Action]
        OU2[Update UI Immediately]
        OU3[Send API Request]
        OU4[Success?]
        OU5[Keep Changes]
        OU6[Revert Changes]
        
        OU1 --> OU2
        OU2 --> OU3
        OU3 --> OU4
        OU4 -->|Yes| OU5
        OU4 -->|No| OU6
    end
    
    subgraph "Real-time Updates"
        RT1[Component Mount]
        RT2[Start Polling]
        RT3[Fetch Data]
        RT4[Update UI]
        RT5[Wait Interval]
        
        RT1 --> RT2
        RT2 --> RT3
        RT3 --> RT4
        RT4 --> RT5
        RT5 --> RT3
    end
    
    style OU1 fill:#e8f5e8
    style OU2 fill:#e8f5e8
    style OU3 fill:#e8f5e8
    style OU4 fill:#ff9800,color:#fff
    style OU5 fill:#4caf50,color:#fff
    style OU6 fill:#f44336,color:#fff
    style RT1 fill:#e3f2fd
    style RT2 fill:#e3f2fd
    style RT3 fill:#e3f2fd
    style RT4 fill:#e3f2fd
    style RT5 fill:#e3f2fd
```

### **Optimistic Updates:**
```javascript
const updateStudentOptimistic = async (id, updates) => {
  // Update UI immediately
  setStudents(prev => 
    prev.map(s => s.id === id ? { ...s, ...updates } : s)
  );

  try {
    // Send update to server
    await studentsApi.updateStudent(id, updates);
    message.success('Cập nhật thành công!');
  } catch (error) {
    // Revert on error
    setStudents(prev => 
      prev.map(s => s.id === id ? { ...s, ...updates } : s)
    );
    message.error('Cập nhật thất bại');
  }
};
```

### **Real-time Updates:**
```javascript
// Polling for updates
useEffect(() => {
  const interval = setInterval(fetchStudents, 30000); // 30s
  return () => clearInterval(interval);
}, []);
```

## **📱 Response Data Mapping**

### **Data Transformation:**
```javascript
// Transform API response to UI format
const transformStudentData = (apiData) => ({
  id: apiData.id,
  name: apiData.name,
  grade: getGradeLabel(apiData.currentGrade), // Vietnamese label
  parent: apiData.parent?.name || 'N/A',
  age: calculateAge(apiData.dob),
  status: apiData.status || 'active'
});

// Usage
const fetchStudents = async () => {
  const data = await studentsApi.getStudentsList();
  const transformed = data.map(transformStudentData);
  setStudents(transformed);
};
```

## **🔒 Security & Authentication**

### **CORS Handling:**
```javascript
// Vite proxy configuration
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
```

### **Request Headers:**
```javascript
// Add authentication headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## **📊 API Testing**

### **🔍 API Testing Workflow:**
```mermaid
graph TD
    subgraph "Testing Phases"
        T1[Unit Testing<br/>Individual Functions]
        T2[Integration Testing<br/>API Endpoints]
        T3[E2E Testing<br/>Full User Flows]
        T4[Performance Testing<br/>Load & Stress]
    end
    
    subgraph "Testing Tools"
        TT1[Postman Insomnia<br/>API Testing]
        TT2[cURL<br/>Command Line]
        TT3[Jest Testing Library<br/>Unit Tests]
        TT4[Cypress Playwright<br/>E2E Tests]
    end
    
    subgraph "Test Data"
        TD1[Sample Data<br/>Test Database]
        TD2[Mock Responses<br/>Development]
        TD3[Real Data<br/>Staging]
    end
    
    T1 --> T2
    T2 --> T3
    T3 --> T4
    T1 --> TT3
    T2 --> TT1
    T2 --> TT2
    T3 --> TT4
    T1 --> TD2
    T2 --> TD1
    T3 --> TD3
    
    style T1 fill:#e8f5e8
    style T2 fill:#e3f2fd
    style T3 fill:#f3e5f5
    style T4 fill:#fff3e0
    style TT1 fill:#ff9800,color:#fff
    style TT2 fill:#ff9800,color:#fff
    style TT3 fill:#ff9800,color:#fff
    style TT4 fill:#ff9800,color:#fff
    style TD1 fill:#e0f2f1
    style TD2 fill:#e0f2f1
    style TD3 fill:#e0f2f1
```

### **Test API Endpoints:**
```bash
# Test backend health
curl http://localhost:8081/actuator/health

# Test students API
curl http://localhost:8081/api/students/list

# Test with parameters
curl "http://localhost:8081/api/students/list?page=0&size=10"
```

### **Browser DevTools:**
- **Network tab** - Monitor API calls
- **Console** - View errors and logs
- **Application** - Check localStorage/sessionStorage

## **🚀 Performance Optimization**

### **⚡ Performance Strategies:**
```mermaid
graph TD
    subgraph "Caching Strategies"
        C1[Browser Cache<br/>HTTP Headers]
        C2[Session Storage<br/>Temporary Data]
        C3[Local Storage<br/>Persistent Data]
        C4[Memory Cache<br/>React State]
    end
    
    subgraph "Request Optimization"
        R1[Debounced Search<br/>Reduce API Calls]
        R2[Batch Requests<br/>Multiple Data]
        R3[Pagination<br/>Limit Data Size]
        R4[Lazy Loading<br/>On-Demand Data]
    end
    
    subgraph "Data Management"
        D1[Optimistic Updates<br/>Immediate UI]
        D2[Data Normalization<br/>Efficient Storage]
        D3[Selective Re-renders<br/>React.memo]
        D4[Virtual Scrolling<br/>Large Lists]
    end
    
    C1 --> C4
    C2 --> C4
    C3 --> C4
    R1 --> R2
    R2 --> R3
    R3 --> R4
    D1 --> D2
    D2 --> D3
    D3 --> D4
    
    style C1 fill:#e8f5e8
    style C2 fill:#e8f5e8
    style C3 fill:#e8f5e8
    style C4 fill:#e8f5e8
    style R1 fill:#e3f2fd
    style R2 fill:#e3f2fd
    style R3 fill:#e3f2fd
    style R4 fill:#e3f2fd
    style D1 fill:#f3e5f5
    style D2 fill:#f3e5f5
    style D3 fill:#f3e5f5
    style D4 fill:#f3e5f5
```

### **Request Caching:**
```javascript
const useApiCache = (key, apiCall) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiCall();
        setData(result);
        sessionStorage.setItem(key, JSON.stringify(result));
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, apiCall]);

  return { data, loading };
};
```

### **Debounced Search:**
```javascript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  if (query.trim()) {
    const results = await studentsApi.searchStudents(query);
    setSearchResults(results);
  }
}, 300);
```

---

## **🔗 Related Documentation**

📚 **[Xem tất cả tài liệu →](INDEX.md)**

- 📖 **[Setup Guide](SETUP.md)** - Cài đặt và kết nối
- 🏗️ **[Project Structure](STRUCTURE.md)** - Cấu trúc code
- 🔧 **[Configuration](CONFIGURATION.md)** - Cấu hình API
- 🎨 **[Design System](DESIGN-SYSTEM.md)** - UI patterns
