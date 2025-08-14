import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import AppLayout from './components/Layout/AppLayout';
import HomePage from './pages/Home/HomePage';
import StudentsListPage from './pages/Students/StudentsListPage';
import CreateStudentPage from './pages/Students/CreateStudentPage';
import StudentDetailPage from './pages/Students/StudentDetailPage';
import ClassesSchedulePage from './pages/Classes/ClassesSchedulePage';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    wireframe: false,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f7fa',
    colorBgElevated: '#ffffff',
    colorBorder: '#e8eaed',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    Table: {
      borderRadius: 8,
      headerBg: '#f8fafc',
      headerColor: '#374151',
      rowHoverBg: '#f9fafb',
    },
    Tag: {
      borderRadius: 6,
      fontWeight: 500,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentsListPage />} />
              <Route path="/students/list" element={<StudentsListPage />} />
              <Route path="/students/new" element={<CreateStudentPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="/classes" element={<ClassesSchedulePage />} />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
