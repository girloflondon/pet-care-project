
/* логика модального окна начало */
export function checkLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        document.getElementById('loginModal').style.display = 'none';
        document.body.classList.remove('modal-active');
    } else {
        alert('Неправильный логин или пароль');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('modal-active');

    // Назначаем обработчик клика на кнопку после загрузки DOM
    const loginButton = document.querySelector('.loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', checkLogin);
    }
});
// window.checkLogin = checkLogin;
/* логика модального окна конец */


// логика кнопки сохранения
document.getElementById('saveBtn').addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    const contentData = {};

    editableElements.forEach((element, index) => {
        contentData[`field_${index}`] = element.innerText.trim();
    });

    console.log('Отправляемые данные:', contentData);

    // Сохраняем контент
    fetch('/save-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contentData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при сохранении данных');
            }
            return response.json();
        })
        .then(data => {
            console.log('Данные успешно сохранены:', data);

            // Собираем данные о фондах
            const funds = [];
            const fundElements = document.querySelectorAll('.main__list-item');

            fundElements.forEach(item => {
                const fundName = item.querySelector('.fundName').innerText.trim();
                const fundType = item.querySelector('.fundType').nextSibling.nodeValue.trim(); // Используем `nextSibling` для получения значения
                const fundYear = item.querySelector('.fundYear').nextSibling.nodeValue.trim(); // Аналогично
                const fundDescription = item.querySelector('.fundDescription').innerText.trim();

                const newFund = {
                    name: fundName,
                    type: fundType,
                    year: fundYear,
                    description: fundDescription
                };

                funds.push(newFund);
            });

            // Сохраняем все фонды
            return fetch('/save-fund', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(funds)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при сохранении фонда');
            }
            return response.json();
        })
        .then(data => {
            console.log('Фонды успешно сохранены:', data);
            // window.location.href = '/'; // Если нужно перезагрузить страницу
        })
        .catch(error => {
            console.error('Ошибка при сохранении данных или фонда:', error);
        });
});

//фонды
import { database } from "./database.js";

const listContainer = document.querySelector(".main__list");
const allButton = document.getElementById("all");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const addFundBtn = document.getElementById('add-fund-btn');

let currentPage = 0;
const itemsPerPage = 5;
let lastDeletedFund = null; // Для хранения последнего удаленного фонда
let lastDeletedIndex = null; // Для хранения индекса удаленного фонда

// Функция отображения фондов на странице
function displayFunds(first, last) {
    listContainer.innerHTML = "";
    const itemsToShow = database.slice(first, last);

    itemsToShow.forEach((item, index) => {
        const listItem = document.createElement("div");
        listItem.classList.add("main__list-item");

        listItem.innerHTML = `
            <div class="list-item__header">
                <img
                    class="list-item__header-image"
                    src="./src/assets/images/icons/dog-cat-icon.svg"
                    alt="${item.name}"
                />
                <h4 class="list-item__header-title fundName">${item.name}</h4>
            </div>
            <div class="list-item__block1">
                <div class="block1__text-block">
                    <p class="block1__text1">
                        <span class="block1__text1-subheader fundType">Тип: </span> ${item.type}
                    </p>
                    <p class="block1__text2">
                        <span class="block1__text2-subheader fundYear">Год: </span> ${item.year}
                    </p>
                </div>
                <span class="block1__element"></span>
                <p class="block1__text fundDescription">
                    ${item.description}
                </p>
            </div>
            <div class="list-item__block2">
                <p class="block2__text">Подробнее о фонде</p>
                <button class="block2__button"></button>
            </div>
            <button class="delete-btn">Удалить</button>
        `;


        // Добавляем кнопку удаления и событие удаления элемента
        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteFund(index + first, listItem); // Удаление фонда
        });

        listContainer.appendChild(listItem);
    });
}

// Функция удаления фонда
function deleteFund(index, listItem) {
    // Сохраняем удаленный фонд и его индекс
    lastDeletedFund = database[index];
    lastDeletedIndex = index;

    database.splice(index, 1); // Удаление фонда из массива

    // Создаём кнопку "Отмена" на месте удалённого фонда
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Отмена';
    undoButton.classList.add('undo-btn');

    // Добавляем обработчик для кнопки "Отмена"
    undoButton.addEventListener('click', () => {
        undoDelete(listItem, undoButton);
    });

    // Заменяем содержимое удалённого фонда на кнопку "Отмена"
    listItem.innerHTML = '';
    listItem.appendChild(undoButton);
}

// Функция отмены удаления фонда
function undoDelete(listItem, undoButton) {
    if (lastDeletedFund !== null && lastDeletedIndex !== null) {
        // Восстанавливаем удаленный фонд на его прежнее место
        database.splice(lastDeletedIndex, 0, lastDeletedFund);
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, database.length);
        displayFunds(start, end); // Обновляем отображение после восстановления

        // Удаляем кнопку "Отмена" после восстановления фонда
        undoButton.remove();
        lastDeletedFund = null;
        lastDeletedIndex = null;
    }
}

// Изначальное отображение фондов
displayFunds(0, itemsPerPage);

// Добавление нового фонда
function addNewFund() {
    const newFundForm = document.createElement('div');
    newFundForm.classList.add('new-fund-form');

    newFundForm.innerHTML = `
        <div>
            <input type="text" placeholder="Название фонда" id="newFundName">
        </div>
        <div>
            <input type="text" placeholder="Тип" id="newFundType">
        </div>
        <div>
            <input type="number" placeholder="Год" id="newFundYear">
        </div>
        <div>
            <textarea placeholder="Описание" id="newFundDescription"></textarea>
        </div>
        <button id="save-new-fund-btn">OK</button>
    `;

    listContainer.insertBefore(newFundForm, listContainer.firstChild);

    const saveNewFundBtn = document.getElementById('save-new-fund-btn');
    saveNewFundBtn.addEventListener('click', () => {
        const name = document.getElementById('newFundName').value;
        const type = document.getElementById('newFundType').value;
        const year = document.getElementById('newFundYear').value;
        const description = document.getElementById('newFundDescription').value;

        if (name && type && year && description) {
            const newFund = {
                name,
                type,
                year,
                description
            };

            database.unshift(newFund); // Добавляем новый фонд в начало массива
            displayFunds(0, itemsPerPage); // Обновляем отображение
        }

        // Удаляем форму после добавления фонда
        newFundForm.remove();
    });
}

// Кнопка "Добавить фонд"
addFundBtn.addEventListener('click', () => {
    addNewFund();
});

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

// Изначальные ссылки
let socialLinks = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
};

// Привязка действий к кнопкам
document.getElementById('facebook-btn').addEventListener('click', function () {
    window.open(socialLinks.facebook, '_blank');
});

document.getElementById('instagram-btn').addEventListener('click', function () {
    window.open(socialLinks.instagram, '_blank');
});

// Логика для добавления новой ссылки
document.getElementById('add-facebook-link').addEventListener('click', function () {
    addLinkInput('facebook');
});

document.getElementById('add-instagram-link').addEventListener('click', function () {
    addLinkInput('instagram');
});

function addLinkInput(platform) {
    const linkDiv = document.getElementById('social-links');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Введите ссылку на ${platform}`;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';

    saveButton.addEventListener('click', function () {
        const newLink = input.value;
        if (newLink) {
            saveLink(platform, newLink);
        }
    });

    linkDiv.appendChild(input);
    linkDiv.appendChild(saveButton);
}

function saveLink(platform, link) {
    fetch('/save-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, link }),  // Убедитесь, что передаются обе переменные
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при сохранении ссылки');
            }
            return response.json();  // Ожидаем корректный JSON ответ от сервера
        })
        .then(data => {
            console.log('Ссылка сохранена:', data.message);
        })
        .catch(error => {
            console.error('Ошибка при сохранении ссылки:', error);
        });
}