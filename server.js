import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const assetsPath = path.join(__dirname, 'src', 'assets');
const rootPath = __dirname;
const filePath = path.join(__dirname, 'savedContent.json');

function loadData() {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return [];
}

app.post('/save-content', (req, res) => {
    const contentData = req.body;
    fs.writeFile(filePath, JSON.stringify(contentData, null, 2), (err) => {
        if (err) {
            console.error('Ошибка при сохранении данных:', err);
            return res.status(500).json({ message: 'Ошибка при сохранении данных' });
        }

        res.json({ message: 'Данные успешно сохранены' });
    });
});

app.get('/load-content', (req, res) => {
    console.log('Маршрут /load-content вызван');
    console.log('Путь к файлу:', filePath);

    try {
        const parsedData = loadData();
        console.log('Данные успешно считаны:', parsedData);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(parsedData);
    } catch (parseError) {
        console.error('Ошибка при чтении или парсинге файла:', parseError);
        res.status(500).json({ message: 'Ошибка при загрузке данных' });
    }
});

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

app.use('/assets', express.static(assetsPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use(express.static(rootPath));

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
