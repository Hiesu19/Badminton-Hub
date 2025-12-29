import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Đọc các file .env* từ thư mục frontend (nơi đang đặt file .env)
  envDir: '../../',
  envPrefix: ['VITE_', 'BACKEND_'],
  server: {
    port: 7001,
  },
});
