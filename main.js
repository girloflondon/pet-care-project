import { database } from "./database";
console.log(database);

const allBtn = document.getElementById("all");
const backBtn = document.getElementById("back");
const forwardBtn = document.getElementById("forward");

//const listContainer = document.querySelector("main__list");

//function showAll() {
//  for (let item of Database) {
//    listContainer.append = `<div class="main__list-item">
//    <div class="list-item__header">
//      <img
//        class="list-item__header-image"
//        src="./src/assets/images/icons/dog-cat-icon.svg"
//        alt="Фонд"
//      />
//      <h4 class="list-item__header-title">${item.name}</h4>
//    </div>
//    <div class="list-item__block1">
//      <p class="block1__text1">
//       <span class="block1__text1-subheader">Тип: </span> ${item.type}
//      </p>
//      <p class="block1__text2">
//        <span class="block1__text2-subheader">Год: </span> ${item.year}
//      </p>
//      <span class="block1__element"></span>
//      <p class="block1__text3">
//      ${item.description}
//      </p>
//    </div>
//    <div class="list-item__block2">
//      <p class="block2__text">Подробнее о фонде</p>
//     <button class="block2__button"></button>
//    </div>
//  </div>`;
//  }
//}
//window.addEventListener("load", showAll());

// NUMBER OF PAGES - function
function numberOfPages() {
  let totalPages = Math.trunc(database.length / 5);
  if (database.length % 5 > 0) {
    totalPages = ++totalPages;
  }
  return totalPages;
}

// SHOW LIST ITEMS - function that loads all pages
function showListItems() {
  for (let item of database) {
    const listContainer = document.createElement("div");
    listContainer.classList.add("main__list-item");
    listContainer.innerHTML = `
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
    document.querySelector(".main__list").append(listContainer);
  }
}

let currentPage = 1;

// f -> button Back
function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage = --currentPage;
  } else {
    currentPage = numberOfPages();
    console.log(`Номер последней страницы: ${currentPage}`);
  }
  console.log(`А тут у нас номер нынешней страницы: ${currentPage}`);
}

// f -> button Forward
function goToNextPage() {
  if (currentPage < numberOfPages()) {
    currentPage = ++currentPage;
  } else {
    currentPage = 1;
    console.log(`Сейчас мы откатились на одну страницу: ${currentPage}`);
  }
}

//document.getElementById("counter").textContent = `${currentPage} / ${numberOfPages()}`;

document.addEventListener("DOMContentLoaded", showListItems);
allBtn.addEventListener("click", showListItems);
backBtn.addEventListener("click", goToPreviousPage);
forwardBtn.addEventListener("click", goToNextPage);
