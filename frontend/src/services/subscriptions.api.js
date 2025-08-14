import apiClient from './api.js';

export const subscriptionsApi = {
  // Lấy danh sách tất cả gói học
  getSubscriptionsList: () => {
    return apiClient.get('/subscriptions');
  },

  // Lấy chi tiết gói học theo ID
  getSubscriptionById: (id) => {
    return apiClient.get(`/subscriptions/${id}`);
  },

  // Tạo gói học mới
  createSubscription: (subscriptionData) => {
    return apiClient.post('/subscriptions', subscriptionData);
  },

  // Cập nhật thông tin gói học
  updateSubscription: (id, subscriptionData) => {
    return apiClient.put(`/subscriptions/${id}`, subscriptionData);
  },

  // Xóa gói học
  deleteSubscription: (id) => {
    return apiClient.delete(`/subscriptions/${id}`);
  },

  // Dùng 1 buổi học
  useSession: (id) => {
    return apiClient.patch(`/subscriptions/${id}/use`);
  },

  // Lấy gói học theo học sinh
  getSubscriptionsByStudent: (studentId) => {
    return apiClient.get(`/students/${studentId}/subscriptions`);
  },
};

