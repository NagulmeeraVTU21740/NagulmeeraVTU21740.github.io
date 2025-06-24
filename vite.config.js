import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Add this import:
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '2ff9-49-37-202-144.ngrok-free.app', // previous ngrok public URL
      'da48-49-37-202-144.ngrok-free.app', // new ngrok public URL
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
})