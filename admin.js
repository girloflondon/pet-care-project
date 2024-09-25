
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

    // это надо
    const loginButton = document.querySelector('.loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', checkLogin);
    }
});
// window.checkLogin = checkLogin;
/* логика модального окна конец */


// Логика кнопки сохранения
document.getElementById('saveBtn').addEventListener('click', () => {

    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    const contentData = {};

    editableElements.forEach((element, index) => {
        contentData[`field_${index}`] = element.innerText.trim();
    });

    console.log('Отправляемые данные:', contentData);

    // данные на сервер
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

        })
        .catch(error => {
            console.error('Ошибка при сохранении данных:', error);
        });
});

// Фонды
const listContainer = document.querySelector(".main__list");
const allButton = document.getElementById("all");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");
const addFundBtn = document.getElementById('add-fund-btn');

let database = []; // массив для серверных данных 
let currentPage = 0;
const itemsPerPage = 5;

// етображение фондов 
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

        // событие удаления элемента
        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteFund(index + first, listItem);
        });

        listContainer.appendChild(listItem);
    });
}

// загрузка базы данных с сервера
function loadDatabase() {
    fetch('http://localhost:3000/get-funds')  // тут тоже будет другое
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных');
            }
            return response.json();
        })
        .then(data => {
            database = data;
            displayFunds(0, itemsPerPage);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

// загрузка страницы с фондами
loadDatabase();

let lastDeletedFund = null; // последний удаленный фонд
let lastDeletedIndex = null; //индекс удаленного фонда

// Функция удаления фонда
function deleteFund(index, listItem) {
    lastDeletedFund = database[index];
    lastDeletedIndex = index;

    // Удаление фонда из базы
    database.splice(index, 1);

    // сервер удаление
    fetch('/delete-fund', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Фонд успешно удалён') {
                console.log('Фонд удалён на сервере');
            } else {
                console.error('Ошибка при удалении фонда на сервере:', data.message);
            }
        })
        .catch(error => {
            console.error('Ошибка при запросе на удаление фонда:', error);
        });

    // "Отмена" на месте удалённого фонда
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Отмена';
    undoButton.classList.add('undo-btn');

    // обработчик
    undoButton.addEventListener('click', () => {
        undoDelete(listItem, undoButton);
    });

    // "Отмена" на месте содержимого
    listItem.innerHTML = '';
    listItem.appendChild(undoButton);
}

// Функция отмены удаления фонда
function undoDelete(listItem, undoButton) {
    if (lastDeletedFund !== null && lastDeletedIndex !== null) {
        // Восстанавление
        database.splice(lastDeletedIndex, 0, lastDeletedFund);

        // запрос на сервер для восстановления фонда
        fetch('/save-fund', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...lastDeletedFund, isRestoring: true, index: lastDeletedIndex }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Фонд успешно сохранён') {
                    console.log('Фонд восстановлен на сервере');
                } else {
                    console.error('Ошибка при восстановлении фонда на сервере:', data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка при запросе на восстановление фонда:', error);
            });

        //отображение после восстановления
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, database.length);
        displayFunds(start, end);

        // Удаляем "Отмена"
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

    // в начало списка
    listContainer.insertBefore(newFundForm, listContainer.firstChild);

    // Обработчик 
    const saveNewFundBtn = document.getElementById('save-new-fund-btn');
    saveNewFundBtn.addEventListener('click', () => {
        const name = document.getElementById('newFundName').value.trim();
        const type = document.getElementById('newFundType').value.trim();
        const year = document.getElementById('newFundYear').value.trim();
        const description = document.getElementById('newFundDescription').value.trim();

        if (name && type && year && description) {
            const newFund = {
                name,
                type,
                year: parseInt(year), // не понятно, надо потестить
                description
            };

            // Проверка на дубликаты
            const isDuplicate = database.some(fund => fund.name === newFund.name && fund.year === newFund.year);
            if (!isDuplicate) {

                fetch('/save-fund', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newFund),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.message === 'Фонд успешно сохранён') {
                            console.log('Новый фонд сохранен на сервере:', data.fund);

                            database.unshift(newFund);

                            displayFunds(0, itemsPerPage);
                        } else {
                            console.error('Ошибка при сохранении фонда на сервере:', data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Ошибка при запросе на сохранение фонда:', error);
                    });

                // Удалить форму
                newFundForm.remove();
            } else {
                alert('Фонд с таким названием и годом уже существует!');
            }
        }
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
        displayFunds(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    }
});

// Кнопка "Назад"
backButton.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        displayFunds(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    }
});
// Изначальные ссылки
let socialLinks = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com'
};

// кнопки чтоб работали
document.getElementById('facebook-btn').addEventListener('click', function () {
    window.open(socialLinks.facebook, '_blank');
});

document.getElementById('instagram-btn').addEventListener('click', function () {
    window.open(socialLinks.instagram, '_blank');
});

// Логика новой ссылки
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
        body: JSON.stringify({ platform, link }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при сохранении ссылки');
            }
            return response.json();
        })
        .then(data => {
            console.log('Ссылка сохранена:', data.message);
        })
        .catch(error => {
            console.error('Ошибка при сохранении ссылки:', error);
        });
}