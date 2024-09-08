import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// без этой ебалы не будет ничего работать
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Включаем CORS для всех запросов
app.use(cors());

// Пути к корню и нашей папке с файлами
const rootPath = __dirname;
const assetsPath = path.join(__dirname, 'src', 'assets');

// Обслуживание файлов
app.use(express.static(rootPath)); // из корня
app.use(express.static(assetsPath)); // из assets

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});