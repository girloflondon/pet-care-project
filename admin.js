document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('modal-active');

    function checkLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'password') {
            document.getElementById('loginModal').style.display = 'none';
            document.body.classList.remove('modal-active');
        } else {
            alert('Неправильный логин или пароль');
        }
    }

    window.checkLogin = checkLogin;
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    const contentData = {};

    editableElements.forEach((element, index) => {
        contentData[`field_${index}`] = element.innerText.trim();
    });

    console.log('Отправляемые данные:', contentData);

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

import { database } from "./database.js";

const listContainer = document.querySelector(".main__list");
const allButton = document.getElementById("all");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");

let currentPage = 0;
const itemsPerPage = 5;
let lastDeletedFund = null;
let lastDeletedIndex = null;

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
      <button class="delete-btn">Удалить</button>
    `;

        const deleteButton = listItem.querySelector(".delete-btn");
        deleteButton.addEventListener("click", () => {
            deleteFund(index + first, listItem);
        });

        listContainer.appendChild(listItem);
    });
}

function deleteFund(index, listItem) {
    lastDeletedFund = database[index];
    lastDeletedIndex = index;

    database.splice(index, 1);
    
    const undoButton = document.createElement('button');
    undoButton.textContent = 'Отмена';
    undoButton.classList.add('undo-btn');

    undoButton.addEventListener('click', () => {
        undoDelete(listItem, undoButton);
    });
    listItem.innerHTML = '';
    listItem.appendChild(undoButton);
}

function undoDelete(listItem, undoButton) {
    if (lastDeletedFund !== null && lastDeletedIndex !== null) {
        database.splice(lastDeletedIndex, 0, lastDeletedFund);
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, database.length);
        displayFunds(start, end);
        undoButton.remove();
        lastDeletedFund = null;
        lastDeletedIndex = null;
    }
}

displayFunds(0, itemsPerPage);

allButton.addEventListener("click", () => {
    displayFunds(0, database.length);
});

forwardButton.addEventListener("click", () => {
    if ((currentPage + 1) * itemsPerPage < database.length) {
        currentPage++;
        const start = currentPage * itemsPerPage;
        const end = Math.min(start + itemsPerPage, database.length);
        displayFunds(start, end);
    }
});

backButton.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        displayFunds(start, end);
    }
});
