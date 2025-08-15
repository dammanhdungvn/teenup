# Contest Management System - Documentation Index

## 📚 Overview
Complete documentation for the Contest Management System including Frontend, Backend, Docker setup, and API specifications.

## 🗂️ Documentation Structure

### **1. Frontend Documentation**
- **File**: `frontend/docs/README.md`
- **Content**: React components, features, responsive design, API integration
- **Key Topics**:
  - Dashboard & navigation
  - Parent/Student/Class/Subscription management
  - Reassign students functionality
  - Admin functions (reset sessions, extend subscription)
  - Responsive UI/UX design
  - Technical implementation details

### **2. Backend Documentation**
- **File**: `backend/contest/docs/api-endpoints.md`
- **Content**: Complete API specification with examples
- **Key Topics**:
  - RESTful API endpoints
  - Request/response formats
  - Error handling
  - Business logic examples
  - New endpoints: reassignStudents, resetUsedSessions, extendSubscription

### **3. Docker & Deployment**
- **File**: `docs/DOCKER.md`
- **Content**: Complete Docker setup and deployment guide
- **Key Topics**:
  - Multi-stage builds
  - Docker Compose orchestration
  - Environment configuration
  - Platform-specific instructions (Ubuntu/Windows)
  - Health checks and monitoring
  - Production deployment

### **4. Project Specification**
- **File**: `docs/project-spec.md`
- **Content**: System architecture and business requirements
- **Key Topics**:
  - Entity relationships
  - Business rules
  - API contracts
  - Data flow diagrams

## 🚀 Quick Navigation

### **For Developers**
1. **Start Here**: `docs/DOCKER.md` - Quick setup guide
2. **API Reference**: `backend/contest/docs/api-endpoints.md`
3. **Frontend Guide**: `frontend/docs/README.md`

### **For DevOps**
1. **Deployment**: `docs/DOCKER.md` - Production setup
2. **Monitoring**: `docs/DOCKER.md` - Health checks & troubleshooting

### **For Business Users**
1. **Features**: `frontend/docs/README.md` - System capabilities
2. **API Examples**: `backend/contest/docs/api-endpoints.md` - Integration guide

## 🔄 Recent Updates

### **Frontend Features Added**
- ✅ **Reassign Students**: Move students between parents
- ✅ **Admin Functions**: Reset used sessions, extend subscriptions
- ✅ **Class Management**: Quick actions modal, schedule view
- ✅ **Responsive Design**: Professional UI/UX across all pages

### **Backend Improvements**
- ✅ **Conflict Detection**: Enhanced schedule conflict logic
- ✅ **API Endpoints**: New reassign, reset, extend functions
- ✅ **Error Handling**: Improved validation and error messages

### **Documentation Updates**
- ✅ **API Documentation**: Complete endpoint coverage
- ✅ **Docker Guide**: Platform-specific instructions
- ✅ **Frontend Guide**: Feature documentation
- ✅ **Index**: Centralized documentation hub

## 📱 System Features

### **Core Management**
- **Parents**: CRUD operations, student reassignment
- **Students**: Registration, class enrollment
- **Classes**: Schedule management, conflict detection
- **Subscriptions**: Session tracking, admin functions

### **Advanced Features**
- **Schedule Conflict Prevention**: Business rule enforcement
- **Student Reassignment**: Flexible parent management
- **Subscription Administration**: Session reset, extension
- **Responsive Design**: Mobile-first approach

## 🔧 Technical Stack

### **Frontend**
- React 18 + Vite
- Ant Design components
- CSS Modules + dedicated CSS files
- Axios for API calls
- Responsive design with media queries

### **Backend**
- Spring Boot 3 + Java 21
- Spring Data JPA + MySQL 8
- MapStruct for object mapping
- Jakarta Validation
- RESTful API design

### **Infrastructure**
- Docker + Docker Compose
- Multi-stage builds
- Health checks
- Environment-based configuration
- Platform-specific deployment

## 🎯 Getting Started

### **1. Quick Setup**
```bash
# Clone repository
git clone <repository>
cd Contest

# Start with Docker (Ubuntu/Linux)
chmod +x start.sh
./start.sh

# Start with Docker (Windows)
start.bat

# Manual start
docker-compose up -d
```

### **2. Development Mode**
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend/contest
mvn spring-boot:run
```

### **3. API Testing**
```bash
# Test endpoints
curl http://localhost:8081/api/parents/list
curl http://localhost:8081/api/classes/schedule
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     MySQL       │
│   (React)       │◄──►│  (Spring Boot)  │◄──►│   Database      │
│   Port 80       │    │   Port 8081     │    │   Port 3306     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   JPA/Hibernate │    │   Data          │
│   (Static)      │    │   (ORM)         │    │   Seeding       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔍 Troubleshooting

### **Common Issues**
1. **Port Conflicts**: Check port usage with `netstat`
2. **Database Connection**: Verify MySQL service status
3. **Build Failures**: Clean Docker cache and rebuild

### **Support Resources**
- **Docker Issues**: `docs/DOCKER.md` - Troubleshooting section
- **API Problems**: `backend/contest/docs/api-endpoints.md`
- **Frontend Issues**: `frontend/docs/README.md`

## 📈 Performance & Monitoring

### **Health Checks**
- **Frontend**: `http://localhost:80`
- **Backend**: `http://localhost:8081/actuator/health`
- **Database**: MySQL connection test

### **Monitoring Commands**
```bash
# Service status
docker-compose ps

# Resource usage
docker stats

# Logs
docker-compose logs -f
```

## 🔒 Security & Best Practices

### **Development**
- Environment-based configuration
- Input validation
- Error handling
- Secure API design

### **Production**
- Secrets management
- Resource limits
- Health monitoring
- Regular updates

## 📝 Contributing

### **Documentation Updates**
1. Update relevant documentation files
2. Update this index file
3. Commit changes with descriptive messages
4. Update feature list in this index

### **Code Changes**
1. Follow existing patterns
2. Update related documentation
3. Test thoroughly
4. Update this index if new features added

---

## 📞 Support & Contact

For technical support or questions:
- **Documentation**: Check relevant sections above
- **Issues**: Review troubleshooting guides
- **Development**: Follow getting started guides

---

**Last Updated**: August 2025  
**Version**: 1.0.0  
**Status**: Active Development
