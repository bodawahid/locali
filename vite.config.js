import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    logLevel: 'info',
    plugins: [
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    query: ['@tanstack/react-query'],
                    ai: ['@google/generative-ai'],
                    markdown: ['react-markdown'],
                    loki: [
                        '@/lib/loki/contextBuilder',
                        '@/lib/loki/systemPrompt',
                        '@/components/loki/LokiChat',
                        '@/components/loki/LokiFloatingWidget',
                    ],
                },
            },
        },
        chunkSizeWarningLimit: 600,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        cssCodeSplit: true,
        sourcemap: false,
    },
    resolve: {
        alias: {
            '@': path.resolve(process.cwd(), './src'),
        },
    },
    optimizeDeps: {
        include: [
            '@google/generative-ai',
            'react-markdown',
            '@tanstack/react-query',
        ],
    },
    server: {
        middlewareMode: false,
        headers: {
            'Cache-Control': 'max-age=3600',
        },
    },
});