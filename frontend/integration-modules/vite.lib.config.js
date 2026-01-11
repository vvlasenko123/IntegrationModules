import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            // eslint-disable-next-line no-undef
            entry: path.resolve(__dirname, 'src/index.js'),
            name: 'IntegrationModules',
            fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
            formats: ['es', 'cjs'],
            cssCodeSplit: false,

        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '@xyflow/react'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@xyflow/react': 'ReactFlow'
                }
            }
        },
        target: 'esnext',
        sourcemap: true,
        minify: 'esbuild',
        emptyOutDir: true
    }
})