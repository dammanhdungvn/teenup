// API Configuration
// Có thể thay đổi dễ dàng khi deploy

const API_CONFIG = {
  // Development (Local)
  development: {
    baseURL: 'http://localhost:8081',
    useProxy: true, // Sử dụng Vite proxy trong development
  },
  
  // Docker Development
  docker: {
    baseURL: 'http://localhost:8081',
    useProxy: false, // Không dùng proxy trong Docker
  },
  
  // Production
  production: {
    baseURL: 'http://localhost:8081', // Sử dụng localhost cho production test
    useProxy: false, // Không dùng proxy trong production
  },
  
  // Staging/Testing
  staging: {
    baseURL: 'http://localhost:8081', // Sử dụng localhost cho staging test
    useProxy: false,
  }
};

// Tự động detect environment
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const isStaging = import.meta.env.MODE === 'staging';
const isDocker = import.meta.env.VITE_DOCKER === 'true';

// Chọn config phù hợp
let currentConfig;
if (isDocker) {
  currentConfig = API_CONFIG.docker;
} else if (isStaging) {
  currentConfig = API_CONFIG.staging;
} else if (isProd) {
  currentConfig = API_CONFIG.production;
} else {
  currentConfig = API_CONFIG.development;
}

export const API_BASE_URL = currentConfig.baseURL;
export const USE_PROXY = currentConfig.useProxy;

// Log config để debug
console.log('API Config:', {
  environment: isDev ? 'development' : isProd ? 'production' : 'staging',
  baseURL: API_BASE_URL,
  useProxy: USE_PROXY
});
