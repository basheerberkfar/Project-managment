import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),          // ⬅️ هذا السطر ضروري لمشروع React
    tailwindcss(),
  ],
  server: {
    port: 3000,       // المنفذ الذي يعمل عليه التطبيق
    open: true        // يفتح المتصفح تلقائياً
  }
})