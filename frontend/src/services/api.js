import axios from 'axios';
import { API_BASE_URL, USE_PROXY } from '../config/api.config.js';

// Tạo axios instance với config linh hoạt
const baseURL = USE_PROXY ? '/api' : API_BASE_URL + '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây timeout
});



// Interceptor để xử lý request
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và error
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
