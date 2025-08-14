import apiClient from './api.js';

export const dashboardApi = {
  // Lấy danh sách học sinh và đếm
  getStudentsList: () => {
    return apiClient.get('/students/list');
  },

  // Lấy danh sách phụ huynh và đếm
  getParentsList: () => {
    return apiClient.get('/parents/list');
  },

  // Lấy danh sách lớp học và đếm
  getClassesList: () => {
    return apiClient.get('/classes');
  },

  // Lấy danh sách gói học và đếm
  getSubscriptionsList: () => {
    return apiClient.get('/subscriptions');
  },
};
