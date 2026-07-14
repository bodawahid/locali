/**
 * Vite Configuration Optimizations
 * Add this to vite.config.js for production build optimizations
 */

export const viteOptimizations = {
    build: {
        // Code splitting optimization
        rollupOptions: {
            output: {
                manualChunks: {
                    'gemini': ['@google/generative-ai'],
                    'markdown': ['react-markdown'],
                    'loki': [
                        '@/lib/loki/contextBuilder',
                        '@/lib/loki/systemPrompt',
                        '@/components/loki/LokiChat',
                        '@/components/loki/LokiFloatingWidget',
                    ],
                },
            },
        },
        // Compression
        minify: 'terser',
        terserOptions: {
            compress: { drop_console: true },
        },
        // Source maps
        sourcemap: false,
        // CSS optimization
        cssCodeSplit: true,
    },

    // Server optimizations
    server: {
        middlewareMode: false,
    },

    // Optimizations
    optimizeDeps: {
        include: ['@google/generative-ai', 'react-markdown'],
    },
};

/**
 * Tailwind CSS Configuration for Better Performance
 * Add to tailwind.config.js
 */
export const tailwindOptimizations = {
    // Content should be set in your actual config
    theme: {
        extend: {
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};