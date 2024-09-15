/* логика модального окна начало */
// document.addEventListener("DOMContentLoaded", function () {
//   document.body.classList.add("modal-active");

//   function checkLogin() {
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;

//     if (username === "admin" && password === "password") {
//       document.getElementById("loginModal").style.display = "none";
//       document.body.classList.remove("modal-active");
//     } else {
//       alert("Неправильный логин или пароль");
//     }
//   }

//   window.checkLogin = checkLogin;
// });

function saveContent() {
    const title = document.getElementById('admin-title').innerText;
    const content = document.getElementById('admin-content').innerText;



    fetch('/save-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    })
        .then(response => response.json())
        .then(data => {
            alert('Контент сохранён!');
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

/* логика модального окна конец */

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
      <div class="list-item__block2">
        <p class="block2__text">Подробнее о фонде</p>
        <button class="block2__button"></button>
      </div>
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
