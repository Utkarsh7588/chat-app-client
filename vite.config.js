// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    global: 'window.global' // Better polyfill approach
  },
  server: {
    port: 8081,
    proxy: {
      '/api':{
        target: 'http://192.168.1.36:8080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws-chat/, '')
      },
      '/ws-chat': {
        target: 'ws://192.168.1.36:8080',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws-chat/, '')
      }
    }
  },
  resolve: {
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js'
    }
  }
})