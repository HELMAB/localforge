import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.join(__dirname, 'src/renderer'),
  plugins: [
    vue()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173
  },
  base: './'
})
