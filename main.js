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

import { database } from "./database.js";

const listContainer = document.querySelector(".main__list");
const allButton = document.getElementById("all");
const backButton = document.getElementById("back");
const forwardButton = document.getElementById("forward");

let currentPage = 0;
const itemsPerPage = 5;

function displayFunds(first, last) {
    listContainer.innerHTML = "";
    const itemsToShow = database.slice(first, last);

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
      <form class="list-item__block2" action="${item.link}">
        <p class="block2__text">Подробнее о фонде</p>
        <button type="submit" class="block2__button"></button>
      </form>
    `;
        listContainer.appendChild(listItem);
    });
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
