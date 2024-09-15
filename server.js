import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';  // Для обработки POST-запросов
import fs from 'fs';  // Для работы с файловой системой

// Получаем путь к файлу и директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Включаем CORS для всех запросов
app.use(cors());
// Для обработки JSON-запросов
app.use(bodyParser.json());

// Пути к папкам с файлами
const assetsPath = path.join(__dirname, 'src', 'assets');
const rootPath = __dirname;

// ===================== API Роуты =====================

// Обработка POST-запроса на сохранение данных
app.post('/save-content', (req, res) => {
    const contentData = req.body;

    // Сохраняем данные в файл
    const filePath = path.join(__dirname, 'savedContent.json');  // Путь к файлу, куда будем сохранять данные

    fs.writeFile(filePath, JSON.stringify(contentData, null, 2), (err) => {
        if (err) {
            console.error('Ошибка при сохранении данных:', err);
            return res.status(500).json({ message: 'Ошибка при сохранении данных' });
        }

        res.json({ message: 'Данные успешно сохранены' });
    });
});

// Обработка GET-запроса для загрузки данных
app.get('/load-content', (req, res) => {
    console.log('Маршрут /load-content вызван');
    const filePath = path.join(__dirname, 'savedContent.json');
    console.log('Путь к файлу:', filePath);

    if (fs.existsSync(filePath)) {
        console.log('Файл найден, начинаем чтение...');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка при чтении файла:', err);
                return res.status(500).json({ message: 'Ошибка при загрузке данных' });
            }
            try {
                const parsedData = JSON.parse(data);
                console.log('Данные успешно считаны:', parsedData);  // Лог для проверки JSON
                res.setHeader('Content-Type', 'application/json');  // Установим правильный заголовок
                res.status(200).json(parsedData);
            } catch (parseError) {
                console.error('Ошибка при парсинге JSON:', parseError);
                res.status(500).json({ message: 'Ошибка при парсинге данных' });
            }
        });
    } else {
        console.error('Файл не найден');
        res.status(404).json({ message: 'Файл не найден' });
    }
});

// ===================== Обслуживание файлов =====================

// Статические файлы из assets
app.use('/assets', express.static(assetsPath));

// Основная страница (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Админская страница (admin.html)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Обслуживание всех остальных файлов (корневые файлы, например стили или скрипты)
app.use(express.static(rootPath));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});