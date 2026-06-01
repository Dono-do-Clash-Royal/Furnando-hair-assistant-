import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // O proxy redireciona /api/* para o Spring Boot
    // Assim o React faz fetch('/api/analyze') em vez de
    // fetch('http://localhost:8080/api/analyze') - mais simples!
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
