import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src', // Le dice a Vite que use el index.html de adentro de src
  build: {
    outDir: '../dist',
  }
})