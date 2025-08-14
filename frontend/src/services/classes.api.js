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

  // Đăng ký học sinh vào lớp
  registerStudent: (classId, payload) => {
    return apiClient.post(`/classes/${classId}/register`, payload);
  },

  // Lấy registrations của 1 lớp
  getRegistrations: (classId) => {
    return apiClient.get(`/classes/${classId}/registrations`);
  },
};
