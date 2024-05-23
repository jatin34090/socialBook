import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000/',
      //  '/api': 'https://jat-social-book.netlify.app/',
    }
  },
  plugins: [react()],
})
