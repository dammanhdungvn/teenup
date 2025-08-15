/**
 * Parents API Service Tests
 * 
 * Test các methods trong parents.api.js để đảm bảo kết nối với backend API
 */

import { parentsApi } from '../parents.api.js';

// Mock apiClient
jest.mock('../api.js', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from '../api.js';

describe('Parents API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getParentsList', () => {
    it('should call GET /parents/list', async () => {
      const mockResponse = { data: [] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await parentsApi.getParentsList();

      expect(apiClient.get).toHaveBeenCalledWith('/parents/list');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getParentById', () => {
    it('should call GET /parents/{id}', async () => {
      const mockResponse = { data: { id: 1, name: 'Test Parent' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await parentsApi.getParentById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/parents/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createParent', () => {
    it('should call POST /parents with parent data', async () => {
      const parentData = { name: 'Test Parent', phone: '1234567890', email: 'test@example.com' };
      const mockResponse = { data: { id: 1, ...parentData } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await parentsApi.createParent(parentData);

      expect(apiClient.post).toHaveBeenCalledWith('/parents', parentData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateParent', () => {
    it('should call PATCH /parents/{id} with update data', async () => {
      const updateData = { name: 'Updated Parent' };
      const mockResponse = { data: { id: 1, name: 'Updated Parent' } };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await parentsApi.updateParent(1, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/parents/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteParent', () => {
    it('should call DELETE /parents/{id}', async () => {
      const mockResponse = { status: 204 };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await parentsApi.deleteParent(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/parents/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reassignStudents', () => {
    it('should call PATCH /parents/{sourceId}/reassign with targetParentId only', async () => {
      const mockResponse = { data: { movedCount: 2, remainingAtSource: 0 } };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await parentsApi.reassignStudents(1, 2);

      expect(apiClient.patch).toHaveBeenCalledWith('/parents/1/reassign', { targetParentId: 2 });
      expect(result).toEqual(mockResponse);
    });

    it('should call PATCH /parents/{sourceId}/reassign with targetParentId and studentIds', async () => {
      const mockResponse = { data: { movedCount: 1, remainingAtSource: 1 } };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await parentsApi.reassignStudents(1, 2, [3, 4]);

      expect(apiClient.patch).toHaveBeenCalledWith('/parents/1/reassign', { 
        targetParentId: 2, 
        studentIds: [3, 4] 
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
