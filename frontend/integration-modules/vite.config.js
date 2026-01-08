import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

export default defineConfig({
    plugins: [svgr(), react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://158.160.190.17:8000',
                changeOrigin: true,
            }
        }
    }
})
