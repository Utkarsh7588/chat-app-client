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
        target: "https://webchat.zapto.org",
        changeOrigin: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      'sockjs-client': 'sockjs-client/dist/sockjs.min.js'
    }
  }
})