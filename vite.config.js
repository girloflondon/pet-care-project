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
            // Новый маршрут для загрузки фондов
            '/get-funds': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            // Новый маршрут для сохранения фонда
            '/save-fund': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
            // Новый маршрут для удаления фонда
            '/delete-fund': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});