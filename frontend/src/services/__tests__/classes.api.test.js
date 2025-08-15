/**
 * Classes API Service Tests
 * 
 * Test các methods trong classes.api.js để đảm bảo kết nối với backend API
 */

import { classesApi } from '../classes.api.js';

// Mock apiClient
jest.mock('../api.js', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from '../api.js';

describe('Classes API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClasses', () => {
    it('should call GET /classes without params', async () => {
      const mockResponse = { data: [] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClasses();

      expect(apiClient.get).toHaveBeenCalledWith('/classes', { params: {} });
      expect(result).toEqual(mockResponse);
    });

    it('should call GET /classes with params', async () => {
      const mockResponse = { data: [] };
      const params = { day: 'MONDAY', expand: 'registrations' };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClasses(params);

      expect(apiClient.get).toHaveBeenCalledWith('/classes', { params });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getClassById', () => {
    it('should call GET /classes/{id}', async () => {
      const mockResponse = { data: { id: 1, name: 'Test Class' } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClassById(1);

      expect(apiClient.get).toHaveBeenCalledWith('/classes/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createClass', () => {
    it('should call POST /classes with class data', async () => {
      const classData = { 
        name: 'Test Class', 
        subject: 'MATH', 
        dayOfWeek: 'MONDAY',
        startTime: '08:00',
        endTime: '09:00',
        maxStudents: 20
      };
      const mockResponse = { data: { id: 1, ...classData } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await classesApi.createClass(classData);

      expect(apiClient.post).toHaveBeenCalledWith('/classes', classData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateClass', () => {
    it('should call PATCH /classes/{id} with update data', async () => {
      const updateData = { name: 'Updated Class' };
      const mockResponse = { data: { id: 1, name: 'Updated Class' } };
      apiClient.patch.mockResolvedValue(mockResponse);

      const result = await classesApi.updateClass(1, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith('/classes/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteClass', () => {
    it('should call DELETE /classes/{id}', async () => {
      const mockResponse = { status: 204 };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await classesApi.deleteClass(1);

      expect(apiClient.delete).toHaveBeenCalledWith('/classes/1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('registerStudent', () => {
    it('should call POST /classes/{id}/register with payload', async () => {
      const payload = { studentId: 1 };
      const mockResponse = { data: { success: true } };
      apiClient.post.mockResolvedValue(mockResponse);

      const result = await classesApi.registerStudent(1, payload);

      expect(apiClient.post).toHaveBeenCalledWith('/classes/1/register', payload);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('unregisterStudent', () => {
    it('should call DELETE /classes/{id}/register/{studentId}', async () => {
      const mockResponse = { status: 204 };
      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await classesApi.unregisterStudent(1, 2);

      expect(apiClient.delete).toHaveBeenCalledWith('/classes/1/register/2');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRegistrations', () => {
    it('should call GET /classes/{id}/registrations', async () => {
      const mockResponse = { data: [] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getRegistrations(1);

      expect(apiClient.get).toHaveBeenCalledWith('/classes/1/registrations');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getClassStudents', () => {
    it('should call GET /classes/{id}/students', async () => {
      const mockResponse = { data: [] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClassStudents(1);

      expect(apiClient.get).toHaveBeenCalledWith('/classes/1/students');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getClassesByDay', () => {
    it('should call GET /classes/schedule with day param', async () => {
      const mockResponse = { data: [] };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClassesByDay('MONDAY');

      expect(apiClient.get).toHaveBeenCalledWith('/classes/schedule', { params: { day: 'MONDAY' } });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getClassStats', () => {
    it('should call GET /classes/{id}/stats', async () => {
      const mockResponse = { data: { totalStudents: 15, availableSlots: 5 } };
      apiClient.get.mockResolvedValue(mockResponse);

      const result = await classesApi.getClassStats(1);

      expect(apiClient.get).toHaveBeenCalledWith('/classes/1/stats');
      expect(result).toEqual(mockResponse);
    });
  });
});
