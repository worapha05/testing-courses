import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Production optimization ตัวอย่าง:
 * - manualChunks แยก vendor
 * - sourcemap สำหรับ debug + coverage mapping
 */
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
