import apiClient from './api.js';

export const parentsApi = {
  // Lấy danh sách tất cả phụ huynh
  getParentsList: () => {
    return apiClient.get('/parents/list');
  },

  // Lấy chi tiết phụ huynh theo ID
  getParentById: (id) => {
    return apiClient.get(`/parents/${id}`);
  },

  // Tạo phụ huynh mới
  createParent: (parentData) => {
    return apiClient.post('/parents', parentData);
  },

  // Cập nhật thông tin phụ huynh (nếu có)
  updateParent: (id, parentData) => {
    return apiClient.put(`/parents/${id}`, parentData);
  },

  // Xóa phụ huynh (nếu có)
  deleteParent: (id) => {
    return apiClient.delete(`/parents/${id}`);
  },
};
