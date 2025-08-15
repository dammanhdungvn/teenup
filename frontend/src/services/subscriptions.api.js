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

  // Cập nhật thông tin gói học (partial update)
  updateSubscription: (id, subscriptionData) => {
    return apiClient.patch(`/subscriptions/${id}`, subscriptionData);
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

  // Reset used sessions về 0 (admin function)
  resetUsedSessions: (id) => {
    return apiClient.patch(`/subscriptions/${id}/reset-used`);
  },

  // Extend subscription (admin function)
  extendSubscription: (id, data) => {
    return apiClient.patch(`/subscriptions/${id}/extend`, data);
  },
};

