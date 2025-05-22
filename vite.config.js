import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    allowedHosts: true,
    host: true,
    strictPort: true,
    port: 5173,
    hmr: {
      // Remove host to allow connections from any origin
      port: 5173,
      // Use secure WebSocket for HTTPS clients
      protocol: 'wss',
      // Use 443 for HTTPS clients
      clientPort: 443,
      overlay: true,
      timeout: 30000,
      path: '/@vite/client',
      autoConnect: true
    }
  }
})