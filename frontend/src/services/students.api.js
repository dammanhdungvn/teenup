import apiClient from './api.js';

export const studentsApi = {
  // Tạo học sinh mới
  createStudent: (studentData) => {
    return apiClient.post('/students', studentData);
  },

  // Lấy danh sách học sinh
  getStudentsList: () => {
    return apiClient.get('/students/list');
  },

  // Lấy chi tiết học sinh
  getStudentById: (id) => {
    return apiClient.get(`/students/${id}`);
  },

  // Lấy danh sách lớp của học sinh
  getStudentClasses: (studentId) => {
    return apiClient.get(`/students/${studentId}/classes`);
  },
};
