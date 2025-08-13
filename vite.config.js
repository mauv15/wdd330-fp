import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Tu backend Express
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // elimina el prefijo /api
      }
    }
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html')
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});
