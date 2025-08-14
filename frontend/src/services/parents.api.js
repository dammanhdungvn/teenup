import apiClient from './api.js';

export const parentsApi = {
  // Lấy danh sách phụ huynh (cho dropdown)
  getParentsList: () => {
    return apiClient.get('/parents/list');
  },

  // Lấy chi tiết phụ huynh
  getParentById: (id) => {
    return apiClient.get(`/parents/${id}`);
  },

  // Tạo phụ huynh mới
  createParent: (parentData) => {
    return apiClient.post('/parents', parentData);
  },
};
