import apiClient from './api.js';

export const classesApi = {
  // Lấy danh sách lớp; có thể truyền params: { day, expand }
  getClasses: (params = {}) => {
    return apiClient.get('/classes', { params });
  },

  // Lấy chi tiết lớp
  getClassById: (classId) => {
    return apiClient.get(`/classes/${classId}`);
  },

  // Tạo lớp mới
  createClass: (classData) => {
    return apiClient.post('/classes', classData);
  },

  // Cập nhật lớp (partial update)
  updateClass: (classId, classData) => {
    return apiClient.patch(`/classes/${classId}`, classData);
  },

  // Xóa lớp
  deleteClass: (classId) => {
    return apiClient.delete(`/classes/${classId}`);
  },

  // Đăng ký học sinh vào lớp
  registerStudent: (classId, payload) => {
    return apiClient.post(`/classes/${classId}/register`, payload);
  },

  // Hủy đăng ký học sinh khỏi lớp
  unregisterStudent: (classId, studentId) => {
    return apiClient.delete(`/classes/${classId}/registrations/${studentId}`);
  },

  // Lấy registrations của 1 lớp
  getRegistrations: (classId) => {
    return apiClient.get(`/classes/${classId}/registrations`);
  },

  // Lấy danh sách học sinh đã đăng ký lớp
  getClassStudents: (classId) => {
    return apiClient.get(`/classes/${classId}/students`);
  },

  // Lấy lịch học theo ngày
  getClassesByDay: (day) => {
    return apiClient.get('/classes/schedule', { params: { day } });
  },

  // Lấy thống kê lớp học
  getClassStats: (classId) => {
    return apiClient.get(`/classes/${classId}/stats`);
  },
};
