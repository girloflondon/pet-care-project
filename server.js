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

// Путь к файлу сохраненных данных
const filePath = path.join(__dirname, 'savedContent.json');

// Загружаем данные из файла
function loadData() {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
}

// ===================== API Роуты =====================

// Обработка POST-запроса на сохранение данных
app.post('/save-content', (req, res) => {
    const contentData = req.body;

    // Сохраняем данные в файл
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
    console.log('Путь к файлу:', filePath);

    try {
        const parsedData = loadData();
        console.log('Данные успешно считаны:', parsedData);  // Лог для проверки JSON
        res.setHeader('Content-Type', 'application/json');  // Установим правильный заголовок
        res.status(200).json(parsedData);
    } catch (parseError) {
        console.error('Ошибка при чтении или парсинге файла:', parseError);
        res.status(500).json({ message: 'Ошибка при загрузке данных' });
    }
});

// Удаление фонда
app.post('/delete-fund', (req, res) => {
    const { index } = req.body;

    try {
        const savedContent = loadData();

        if (index >= 0 && index < savedContent.length) {
            savedContent.splice(index, 1);

            fs.writeFile(filePath, JSON.stringify(savedContent, null, 2), (err) => {
                if (err) {
                    console.error('Ошибка при сохранении данных:', err);
                    return res.status(500).json({ message: 'Ошибка при удалении фонда' });
                }

                res.json({ message: 'Фонд успешно удалён' });
            });
        } else {
            res.status(400).json({ message: 'Некорректный индекс фонда' });
        }
    } catch (error) {
        console.error('Ошибка при удалении фонда:', error);
        res.status(500).json({ message: 'Ошибка при удалении фонда' });
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