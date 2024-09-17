import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/load-content': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/save-content': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/load-links': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            '/save-link': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});