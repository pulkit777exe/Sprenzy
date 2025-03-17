import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'process.env.VITE_BACKEND_API_URL': JSON.stringify(env.VITE_BACKEND_API_URL),
      'process.env.VITE_GOOGLE_AUTH_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_AUTH_CLIENT_ID),
      'process.env.VITE_PAYONEER_MERCHANT_ID': JSON.stringify(env.VITE_PAYONEER_MERCHANT_ID)
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
