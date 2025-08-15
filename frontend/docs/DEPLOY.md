# Hướng dẫn Deploy Frontend

## Cấu hình API cho các môi trường

### 1. Development (localhost)
```bash
npm run dev
```
- Sử dụng Vite proxy: `/api` → `http://localhost:8081`
- Không cần thay đổi gì

### 2. Production Deploy

#### Bước 1: Cập nhật API config
Sửa file `src/config/api.config.js`:
```javascript
production: {
  baseURL: 'https://your-actual-domain.com', // Thay đổi domain thực
  useProxy: false,
},
```

#### Bước 2: Build và Deploy
```bash
npm run build
```
- Build sẽ tạo ra thư mục `dist/`
- Deploy thư mục `dist/` lên server

### 3. Staging/Testing
```javascript
staging: {
  baseURL: 'https://staging.your-domain.com',
  useProxy: false,
}
```

### 4. Environment Variables (Tùy chọn)
Có thể tạo file `.env.production`:
```bash
VITE_API_BASE_URL=https://your-domain.com
```

## Lưu ý quan trọng

1. **Không commit** file `.env.local` vào git
2. **Thay đổi domain** trong `api.config.js` trước khi deploy
3. **Vite proxy** chỉ hoạt động trong development
4. **Production** sẽ gọi trực tiếp đến backend domain

## Ví dụ thay đổi khi deploy

```javascript
// Trước khi deploy (development)
baseURL: 'http://localhost:8081'

// Sau khi deploy (production)  
baseURL: 'https://api.teenup-contest.com'
// hoặc
baseURL: 'https://backend.teenup-contest.com'
```
