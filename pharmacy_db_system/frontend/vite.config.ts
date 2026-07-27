import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate', // تحديث التطبيق تلقائياً لما ترفع نسخة جديدة
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], // الأيقونات الأساسية
      manifest: {
        name: 'Medispond AI', // اسم التطبيق الكامل
        short_name: 'PharmAssist', // الاسم القصير اللي بيظهر تحت الأيقونة في الموبايل
        description: 'نظام الرد الآلي الذكي لعملاء الصيدلية',
        theme_color: '#ffffff', // لون شريط الإشعارات في الموبايل
        background_color: '#ffffff',
        display: 'standalone', // عشان يفتح كتطبيق مستقل بدون شريط المتصفح
        icons: [
          {
            src: './public/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './public/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: './public/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // مهم جداً عشان الأيقونة تظهر بشكل مظبوط على أندرويد
          }
        ]
      }
    })],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; worker-src 'self' blob:; frame-src https://accounts.google.com https://www.gstatic.com; connect-src 'self' https://accounts.google.com https://www.googleapis.com https://www.gstatic.com https://n8n.srv1133301.hstgr.cloud http://localhost:5173 http://localhost:5000 http://localhost:3000 https://jypewluarjjsrkpicipv.supabase.co wss://jypewluarjjsrkpicipv.supabase.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https: https://jypewluarjjsrkpicipv.supabase.co;"
    }
  }
})