import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy:{
      '/api':'https://link-tree-backend1.onrender.com',
    },
  },
  plugins: [react()], // Plugins should be inside the main object
})
