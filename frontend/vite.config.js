import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
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
          target: env.VITE_BACKEND_API_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
