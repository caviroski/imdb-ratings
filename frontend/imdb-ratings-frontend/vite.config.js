import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './src',
  publicDir: '../public',
  server: {
    port: 3000
  },
  build: {
    outDir: '../dist'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.js',
    server: {
        deps: {
            inline: ['@mui/x-data-grid']
        }
    }
  }
})
