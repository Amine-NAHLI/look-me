import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = loadEnv(mode, process.cwd(), '').VITE_API_PROXY_TARGET
  return {
    plugins: [react()],
    server: proxyTarget ? {
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
        '/uploads': { target: proxyTarget, changeOrigin: true },
      },
    } : undefined,
  }
})
