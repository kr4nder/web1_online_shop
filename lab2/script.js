// создание основных элементов интерфейса
const app = document.createElement('main');
app.className = 'app';

// заголовок
const title = document.createElement('h1');
title.textContent = 'To-Do List';
app.append(title);

// форма для добавления задач
const form = document.createElement('form');
form.className = 'task-form';

const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Введите задачу...';
input.className = 'task-input';
form.append(input);

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.className = 'task-date';
form.append(dateInput);

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.textContent = 'Добавить';
addButton.className = 'add-btn';
form.append(addButton);

app.append(form);

// секция фильтров и поиска
const controls = document.createElement('section');
controls.className = 'controls';

const search = document.createElement('input');
search.type = 'text';
search.placeholder = 'Поиск по названию...';
search.className = 'search';
controls.append(search);

const filter = document.createElement('select');
filter.className = 'filter';
['Все', 'Выполненные', 'Невыполненные'].forEach(optText => {
    const option = document.createElement('option');
    option.textContent = optText;
    filter.append(option);
});
controls.append(filter);

app.append(controls);

// список задач
const list = document.createElement('ul');
list.className = 'task-list';
app.append(list);

document.body.append(app);
