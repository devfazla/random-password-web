import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://devfazla.github.io/random-password-web/
export default defineConfig({
  base: '/random-password-web/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
});
