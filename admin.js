
/* логика модального окна начало */
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
/* логика модального окна конец */

/* логика кнопки сохранения */
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
            // window.location.href = '/'; // Если нужно перезагрузить страницу
        })
        .catch(error => {
            console.error('Ошибка при сохранении данных:', error);
        });
});