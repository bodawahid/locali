import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path' // 1. لازم تعمل import لموديول الـ path هنا

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info', 
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // 2. السطر ده بيعرف الـ compiler إن علامة @ بتشاور على فولدر src بالظبط
      '@': path.resolve(process.cwd(), './src'), 
    },
  },
});