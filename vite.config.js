import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from the custom domain root: https://password.devfazla.com/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
