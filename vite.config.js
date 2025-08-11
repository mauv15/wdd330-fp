import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Make sure Vite starts from the project root
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Express backend
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      // Point to your HTML entry file
        input: path.resolve(__dirname, 'public/index.html')
    },
    outDir: 'dist', // Where to put built files
    emptyOutDir: true
  }
});
