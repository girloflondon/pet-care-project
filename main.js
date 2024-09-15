function loadContentOnIndexPage() {
    fetch('/load-content')
        .then(response => {
            console.log('Статус ответа:', response.status);
            console.log('Тип контента:', response.headers.get('Content-Type'));

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            // Проверяем, что это JSON
            if (response.headers.get('Content-Type').includes('application/json')) {
                return response.json();
            } else {
                throw new Error('Ожидался JSON, но был получен другой формат данных');
            }
        })
        .then(data => {
            console.log('Полученные данные:', data); // Проверьте, что это именно JSON
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