import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';  // Для обработки POST-запросов
import fs from 'fs';  // Для работы с файловой системой

// const bodyParser = require('body-parser');

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
const databasePath = path.join(__dirname, 'database.js');

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

// фонды

// Чтение базы данных из файла
function readDatabase() {
    const content = fs.readFileSync(databasePath, 'utf8');
    const data = content.match(/export\s+const\s+database\s+=\s+(\[.*\]);/s);
    return JSON.parse(data[1]);
}

// Запись обновлённого состояния базы данных в файл
function writeDatabase(newData) {
    const content = `export const database = ${JSON.stringify(newData, null, 2)};`;
    fs.writeFileSync(databasePath, content, 'utf8');
}

// Маршрут для получения фондов
app.get('/get-funds', (req, res) => {
    try {
        const database = readDatabase();
        res.json(database);
    } catch (err) {
        console.error('Ошибка при чтении базы данных:', err);
        res.status(500).json({ message: 'Ошибка при получении данных' });
    }
});

// Обработчик POST-запроса для сохранения фондов
app.post('/save-fund', (req, res) => {
    const newFund = req.body; // Ожидаем объект фонда

    // Логируем полученные данные для отладки
    console.log('Полученные данные для сохранения фонда:', newFund);

    // Проверка на наличие необходимых полей
    if (!newFund.name || !newFund.type || !newFund.year || !newFund.description) {
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }

    try {
        // Читаем текущую базу данных
        let database = readDatabase();

        // Добавляем новый фонд в массив
        database.push(newFund);

        // Записываем обновлённый массив фондов в файл
        writeDatabase(database);

        // Успешный ответ
        res.json({ message: 'Фонд успешно сохранён', database });
    } catch (err) {
        console.error('Ошибка при сохранении фонда:', err);
        res.status(500).json({ message: 'Ошибка при сохранении фонда' });
    }
});

// Маршрут для удаления фонда
app.post('/delete-fund', (req, res) => {
    try {
        const { index } = req.body; // Получаем индекс из запроса
        let database = readDatabase(); // Читаем текущую базу данных

        // Проверяем корректность индекса
        if (index >= 0 && index < database.length) {
            // Удаляем фонд
            database.splice(index, 1);

            // Записываем обновлённый массив фондов в файл
            writeDatabase(database);

            res.json({ message: 'Фонд успешно удалён', database });
        } else {
            res.status(400).json({ message: 'Некорректный индекс фонда' });
        }
    } catch (err) {
        console.error('Ошибка при удалении фонда:', err);
        res.status(500).json({ message: 'Ошибка при удалении фонда' });
    }
});


//ссылки
app.post('/save-link', (req, res) => {
    const { platform, link } = req.body;

    if (!platform || !link) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    // Предположим, что вы храните ссылки в отдельном файле или объекте
    const filePath = path.join(__dirname, 'savedLinks.json');  // Путь к файлу с сохранёнными ссылками

    // Загружаем текущие сохранённые ссылки
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла ссылок:', err);
            return res.status(500).json({ message: 'Ошибка при чтении файла ссылок' });
        }

        let links = [];
        try {
            links = JSON.parse(data);  // Парсим существующие ссылки
        } catch (parseError) {
            console.error('Ошибка при парсинге файла ссылок:', parseError);
        }

        // Обновляем или добавляем новую ссылку
        links = links.filter(l => l.platform !== platform);  // Удаляем предыдущую ссылку для этой платформы
        links.push({ platform, link });  // Добавляем новую ссылку

        // Сохраняем обновлённые ссылки в файл
        fs.writeFile(filePath, JSON.stringify(links, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при сохранении файла ссылок:', err);
                return res.status(500).json({ message: 'Ошибка при сохранении ссылки' });
            }

            res.json({ message: 'Ссылка успешно сохранена' });
        });
    });
});
app.get('/load-links', (req, res) => {
    console.log('Маршрут /load-links вызван');
    const filePath = path.join(__dirname, 'savedLinks.json');

    console.log('Путь к файлу ссылок:', filePath);

    if (fs.existsSync(filePath)) {
        console.log('Файл найден, начинаем чтение...');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка при чтении файла ссылок:', err);
                return res.status(500).json({ message: 'Ошибка при загрузке ссылок' });
            }

            try {
                const parsedData = JSON.parse(data);
                console.log('Отправляемые данные:', parsedData);

                // Убедимся, что заголовок JSON
                res.setHeader('Content-Type', 'application/json');
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