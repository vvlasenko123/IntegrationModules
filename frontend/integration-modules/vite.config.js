import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // перенаправляем импорты @xyflow/react на наш mock при локальном запуске
            '@xyflow/react': path.resolve(__dirname, 'src/libs/xyflow-mock.jsx'),
        },
    },
    server: { port: 5173 },
})