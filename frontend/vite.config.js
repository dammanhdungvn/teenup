import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve';
  
  return {
    plugins: [react()],
    server: isDev ? {
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
          timeout: 10000,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('Vite Proxy Error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Vite Proxy Request:', req.method, req.url, '→', 'http://localhost:8081' + req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Vite Proxy Response:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    } : undefined,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            antd: ['antd'],
          }
        }
      }
    }
  }
})
