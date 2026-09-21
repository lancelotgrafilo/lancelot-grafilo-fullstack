
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [/* leave what Vite generated here */],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})


