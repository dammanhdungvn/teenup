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

  // Cập nhật thông tin phụ huynh (partial update)
  updateParent: (id, parentData) => {
    return apiClient.patch(`/parents/${id}`, parentData);
  },

  // Xóa phụ huynh
  deleteParent: (id) => {
    return apiClient.delete(`/parents/${id}`);
  },

  // Reassign students sang parent khác
  reassignStudents: (sourceParentId, targetParentId, studentIds = null) => {
    const requestBody = { targetParentId };
    if (studentIds && studentIds.length > 0) {
      requestBody.studentIds = studentIds;
    }
    return apiClient.patch(`/parents/${sourceParentId}/reassign`, requestBody);
  },
};
