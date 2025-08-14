import axios from 'axios';
import { API_BASE_URL, USE_PROXY } from '../config/api.config.js';

// Tạo axios instance với config linh hoạt
const apiClient = axios.create({
  baseURL: USE_PROXY ? '/api' : API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý response và error
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
