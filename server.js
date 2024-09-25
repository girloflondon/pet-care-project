import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';  // Для обработки POST-запросов
import fs from 'fs';  // Для работы с файловой системой

const app = express();
const PORT = 3000;

app.use(express.json());
// Включаем CORS для всех запросов
app.use(cors());
// Для обработки JSON-запросов
app.use(bodyParser.json());

// Получаем путь к файлу и директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Пути к папкам с файлами
const assetsPath = path.join(__dirname, 'src', 'assets');
const rootPath = __dirname;
const databasePath = path.join(__dirname, 'database.json');

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
// контент
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

// Обработка GET-запроса для загрузки полей
app.get('/load-content', (req, res) => {
    console.log('Маршрут /load-content вызван');
    console.log('Путь к файлу:', filePath);

    try {
        const parsedData = loadData();
        console.log('Данные успешно считаны:', parsedData);  // Лог для проверки JSON
        res.setHeader('Content-Type', 'application/json');  // заголовок
        res.status(200).json(parsedData);
    } catch (parseError) {
        console.error('Ошибка при чтении или парсинге файла:', parseError);
        res.status(500).json({ message: 'Ошибка при загрузке данных' });
    }
});

// фонды

// Маршрут для получения фондов (GET)
app.get('/get-funds', (req, res) => {
    console.log('Маршрут /get-funds вызван');
    console.log('Путь к файлу фондов:', databasePath);

    // существование файла
    if (fs.existsSync(databasePath)) {
        console.log('Файл найден, начинаем чтение...');

        fs.readFile(databasePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка при чтении файла фондов:', err);
                return res.status(500).json({ message: 'Ошибка при загрузке данных фондов' });
            }

            try {
                const parsedData = JSON.parse(data);
                console.log('Отправляемые данные:', parsedData);
                res.status(200).json(parsedData); // Отправляем данные
            } catch (parseError) {
                console.error('Ошибка при парсинге файла фондов:', parseError);
                res.status(500).json({ message: 'Ошибка при парсинге данных фондов' });
            }
        });
    } else {
        console.error('Файл не найден');
        res.status(404).json({ message: 'Файл фондов не найден' });
    }
});

app.post('/delete-fund', (req, res) => {
    const { index } = req.body;

    // Чтение базы данных фондов
    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла фондов:', err);
            return res.status(500).json({ message: 'Ошибка при удалении фонда' });
        }

        let database = [];
        try {
            database = JSON.parse(data); // Парсим JSON данные
        } catch (parseError) {
            console.error('Ошибка при парсинге файла фондов:', parseError);
            return res.status(500).json({ message: 'Ошибка при удалении фонда' });
        }

        // Удаление фонда по индексу
        if (index >= 0 && index < database.length) {
            database.splice(index, 1);
        } else {
            return res.status(400).json({ message: 'Некорректный индекс фонда' });
        }

        // Запись обновлённых данных обратно в файл
        fs.writeFile(databasePath, JSON.stringify(database, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при сохранении файла фондов:', err);
                return res.status(500).json({ message: 'Ошибка при сохранении файла после удаления' });
            }

            res.json({ message: 'Фонд успешно удалён' });
        });
    });
});
app.post('/save-fund', (req, res) => {
    const newFund = req.body; // Получаем данные фонда для сохранения
    const isRestoring = req.body.isRestoring || false; // Флаг для восстановления фонда!!!

    // Чтение текущей базы данных фондов
    fs.readFile(databasePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла фондов:', err);
            return res.status(500).json({ message: 'Ошибка при сохранении фонда' });
        }

        let database = [];
        try {
            database = JSON.parse(data);
        } catch (parseError) {
            console.error('Ошибка при парсинге файла фондов:', parseError);
            return res.status(500).json({ message: 'Ошибка при парсинге данных' });
        }

        if (isRestoring) {
            // Восстанавливаем удалённый фонд в определённое место
            const index = req.body.index !== undefined ? req.body.index : 0;
            database.splice(index, 0, newFund);
        } else {
            // Добавляем новый фонд в начало массива
            database.unshift(newFund);
        }

        // Запись обновлённых данных обратно в файл
        fs.writeFile(databasePath, JSON.stringify(database, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при сохранении файла фондов:', err);
                return res.status(500).json({ message: 'Ошибка при сохранении фонда' });
            }

            res.json({ message: 'Фонд успешно сохранён', fund: newFund });
        });
    });
});
//ссылки
app.post('/save-link', (req, res) => {
    const { platform, link } = req.body;

    if (!platform || !link) {
        return res.status(400).json({ message: 'Некорректные данные' });
    }

    const filePath = path.join(__dirname, 'savedLinks.json');  // Путь к файлу с сохранёнными ссылками

    // Загружаем ссылки
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка при чтении файла ссылок:', err);
            return res.status(500).json({ message: 'Ошибка при чтении файла ссылок' });
        }

        let links = [];
        try {
            links = JSON.parse(data);  // Парсим 
        } catch (parseError) {
            console.error('Ошибка при парсинге файла ссылок:', parseError);
        }

        // Обновляем или добавляем новую ссылку
        links = links.filter(l => l.platform !== platform);  // Удаляем предыдущую ссылку 
        links.push({ platform, link });  // Добавляем новую ссылку

        // Сохраняем в файл
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

                // это тоже JSON
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

// Обслуживание всех остальных файлов (корневые файлы, стили, скрипты картинки)
app.use(express.static(rootPath));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});