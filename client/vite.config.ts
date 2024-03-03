// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Import dotenv for environment variable configuration
import dotenv from 'dotenv';
dotenv.config();

const { PORT = 3000 } = process.env;

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 10000,
    proxy: {
      '/api': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/app',
  },
});