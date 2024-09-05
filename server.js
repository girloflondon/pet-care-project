import express from 'express';

const app = express();
const PORT = 3000;

// Middleware для обработки статических файлов я пока не знаю зачем, но говорят надо
app.use(express.static('public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.send('Сервер работает! Добро пожаловать на главную страницу.');
});

// Запуск
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});