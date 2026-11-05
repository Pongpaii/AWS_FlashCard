import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: client-only SPA served on the default port 5173.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    // Keep the AWS service icons as separate files so the 128 SVGs are fetched
    // on demand instead of being base64-inlined into the main bundle.
    assetsInlineLimit: (filePath) => (/[\\/]aws-icons[\\/]/.test(filePath) ? false : undefined),
  },
})
