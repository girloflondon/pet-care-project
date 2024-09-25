function loadContentOnIndexPage() {
    fetch('/load-content')
        .then(response => {
            console.log('Статус ответа:', response.status);
            console.log('Тип контента:', response.headers.get('Content-Type'));

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Ожидался JSON, но был получен другой формат данных');
            }
        })
        .then(data => {
            console.log('Полученные данные:', data);
            document.querySelectorAll('.editable').forEach((element, index) => {
                if (data[`field_${index}`]) {
                    element.innerText = data[`field_${index}`];
                }
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
        });
}
document.addEventListener('DOMContentLoaded', loadContentOnIndexPage);

/*бургер меню*/
// import { click } from "./src/assets/burger";
const burger = document.querySelector(".burger");
const headerNav = document.querySelector(".header-nav");
const body = document.querySelector(".body");
const dark = document.querySelector(".burger__dark");
const ul = document.getElementsByClassName("header__a");

function clickClose(e) {
    document.querySelector(".active").classList.remove("active");
    headerNav.classList.remove("header-nav__active");
    body.classList.remove("no_scroll");
    dark.classList.remove("dark");
}

function click(e) {
    e.preventDefault();
    this.classList.toggle("active");
    headerNav.classList.toggle("header-nav__active");
    body.classList.toggle("no_scroll");
    dark.classList.toggle("dark");
    if (burger.classList.contains("active")) {
        Array.from(ul).forEach((element) => {
            element.addEventListener("click", clickClose);
        });
        dark.addEventListener("click", clickClose);
    }
}

burger.addEventListener("click", click);

//фонды

const listContainer = document.querySelector(".main__list");
const allButton = document.getElementById("all");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const addFundBtn = document.getElementById('add-fund-btn');

let database = []; // Пустой массив для данных с сервера
let currentPage = 0;
const itemsPerPage = 5;

// Функция для отображения фондов
function displayFunds(first, last) {
    listContainer.innerHTML = ""; // Очищаем контейнер
    const itemsToShow = database.slice(first, last); // Получаем нужные элементы

    itemsToShow.forEach((item) => {
        const listItem = document.createElement("div");
        listItem.classList.add("main__list-item");

        listItem.innerHTML = `
            <div class="list-item__header">
                <img
                    class="list-item__header-image"
                    src="./src/assets/images/icons/dog-cat-icon.svg"
                    alt="${item.name}"
                />
                <h4 class="list-item__header-title">${item.name}</h4>
            </div>
            <div class="list-item__block1">
                <div class="block1__text-block">
                    <p class="block1__text1">
                        <span class="block1__text1-subheader">Тип: </span> ${item.type}
                    </p>
                    <p class="block1__text2">
                        <span class="block1__text2-subheader">Год: </span> ${item.year}
                    </p>
                </div>
                <span class="block1__element"></span>
                <p class="block1__text">
                    ${item.description}
                </p>
            </div>
            <div class="list-item__block2">
                <p class="block2__text">Подробнее о фонде</p>
                <button class="block2__button"></button>
            </div>
        `;
        listContainer.appendChild(listItem);
    });
}

// Функция для загрузки базы данных с сервера
function loadDatabase() {
    fetch('http://localhost:3000/get-funds')  // Заменить URL на реальный адрес API
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            return response.json();
        })
        .then(data => {
            database = data; // Записываем полученные данные в переменную
            displayFunds(0, itemsPerPage); // Отображаем первую страницу
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

// Кнопка "Показать все"
allButton.addEventListener("click", () => {
    displayFunds(0, database.length);
});

// Кнопка "Вперед"
forwardButton.addEventListener("click", () => {
    if ((currentPage + 1) * itemsPerPage < database.length) {
        currentPage++;
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, database.length);
        displayFunds(start, end);
    }
});

// Кнопка "Назад"
backButton.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        displayFunds(start, end);
    }
});

// Загружаем данные при загрузке страницы
loadDatabase();

//ссылки
let socialLinks = [];
function loadSocialLinks() {
    console.log('Начинаем загрузку ссылок...');

    fetch('/load-links')
        .then(response => {
            console.log('Ответ от сервера:', response);

            if (!response.ok) {
                console.error('Ответ не OK. Статус:', response.status);
                throw new Error('Ошибка загрузки ссылок: неверный ответ сервера.');
            }

            const contentType = response.headers.get('Content-Type');
            console.log('Content-Type заголовок:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Ожидался JSON, но получен ${contentType}`);
            }

            return response.json();
        })
        .then(socialLinks => {
            console.log('Полученные ссылки:', socialLinks);
            if (!Array.isArray(socialLinks)) {
                throw new Error('Неверный формат данных. Ожидался массив.');
            }

            displaySocialLinks(socialLinks);
        })
        .catch(error => {
            console.error('Ошибка при загрузке или отображении ссылок:', error);
        });
}

function displaySocialLinks(socialLinks) {
    socialLinks.forEach(link => {
        console.log(`Обработка ссылки для платформы: ${link.platform}`);

        const buttonId = link.platform === 'facebook' ? 'facebook-btn' : 'instagram-btn';
        const button = document.getElementById(buttonId);

        if (button) {
            button.addEventListener('click', () => {
                window.open(link.link, '_blank');
            });
            console.log(`Кнопка для ${link.platform} успешно настроена.`);
        } else {
            console.error(`Кнопка для ${link.platform} не найдена на странице.`);
        }
    });
}

loadSocialLinks();