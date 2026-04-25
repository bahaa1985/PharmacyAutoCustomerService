import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; frame-src https://accounts.google.com https://www.gstatic.com; connect-src 'self' https://accounts.google.com https://www.googleapis.com https://www.gstatic.com https://n8n.srv1133301.hstgr.cloud http://localhost:5000 http://localhost:3000; style-src 'self' 'unsafe-inline'; img-src 'self' data: https;"
    }
  }
})
