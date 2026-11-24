// ============================================================
// Configuration Vite — client React du Collège Madeleine Daniélou
// Proxy dev : /api est renvoyé vers l'API Express locale (port 4000).
// Les assets (/documents, /audios) sont servis depuis client/public
// ou directement depuis l'URL de l'API (VITE_API_URL).
// ============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
      '/media/photos': 'http://localhost:4000',
    },
  },
})
