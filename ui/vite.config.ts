import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

const serverEnv = dotenv.config({ processEnv: {}, path: '../api/.env' }).parsed;
const serverHost = serverEnv?.['HOST'] ?? 'localhost';
const serverPort = parseInt(serverEnv?.['PORT']! ?? 3000);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://${serverHost}:${serverPort}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
