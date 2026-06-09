import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  server: {
    port: 5173,
    host: true,
    open: true,
    hmr: true,
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})