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

// function saveContent() {
//     const title = document.getElementById('admin-title').innerText;
//     const content = document.getElementById('admin-content').innerText;

//     fetch('/save-content', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ title, content }),
//     })
//         .then(response => response.json())
//         .then(data => {
//             alert('Контент сохранён!');
//         })
//         .catch(error => {
//             console.error('Ошибка:', error);
//         });
// }

/* логика модального окна конец */

/*бургер меню*/
// import { click } from "./src/assets/burger";
function click(e) {
  e.preventDefault();
  this.classList.toggle("active");
  document.querySelector(".header-list").classList.toggle("header-nav__active");
  document.querySelector(".body").classList.toggle("no_scroll");
  document.querySelector(".burger__dark").classList.toggle("dark");
}
document.querySelector(".burger").addEventListener("click", click);
