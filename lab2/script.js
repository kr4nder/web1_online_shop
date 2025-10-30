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

//  добавление задач

// массив для задач
let tasks = [];

// функция отрисовки всех задач на экране
function renderTasks() {
  // очищаем текущий список перед рендером
  list.textContent = '';

  // перебираем массив задач и создаём элементы
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    // текст задачи
    const span = document.createElement('span');
    span.textContent = `${task.text} (${task.date})`;

    // кнопка "выполнено/не выполнено"
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '↩' : '✔';
    completeBtn.className = 'complete-btn';
    completeBtn.addEventListener('click', () => toggleComplete(index));

    // кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    // собираем элемент задачи
    li.append(span, completeBtn, deleteBtn);
    list.append(li);
  });
}

// обработчик формы (добавление задачи)
form.addEventListener('submit', event => {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const text = input.value.trim();
  const date = dateInput.value;

  // проверяем, чтобы поле не было пустым
  if (!text) return;

  // добавляем новую задачу в массив
  tasks.push({
    text,
    date,
    completed: false
  });

  saveTasks();
  renderTasks();

  form.reset(); // очищаем форму
});
