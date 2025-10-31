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

  // фильтруем задачи по поиску и фильтру
  const filtered = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(search.value.toLowerCase());
    const matchesFilter =
      filter.value === 'Все' ||
      (filter.value === 'Выполненные' && task.completed) ||
      (filter.value === 'Невыполненные' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  // сортируем по дате
  sortTasks();

  // создаём элементы для отфильтрованных задач
  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.draggable = true; // чтобы можно было перетаскивать

    if (task.completed) li.classList.add('completed');

    // текст задачи
    const span = document.createElement('span');
    const formattedDate = task.date
      ? task.date.split('-').reverse().join('.') // день-месяц-год
      : 'без даты';
    span.textContent = `${task.text} (${formattedDate})`;

    // кнопка "выполнено/не выполнено"
    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? '↩' : '✔';
    completeBtn.addEventListener('click', () => toggleComplete(index));

    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => {
      // заменяем span на инпуты для редактирования
      const textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.value = task.text;
      textInput.className = 'task-input';

      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.value = task.date;
      dateInput.className = 'task-date';

      const saveBtn = document.createElement('button');
      saveBtn.textContent = '💾';
      saveBtn.addEventListener('click', () => {
        task.text = textInput.value.trim() || task.text;
        task.date = dateInput.value;
        saveTasks();
        renderTasks();
      });

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '✖';
      cancelBtn.addEventListener('click', () => renderTasks());

      li.textContent = ''; // очищаем старый li
      li.append(textInput, dateInput, saveBtn, cancelBtn);
    });

    // кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    // собираем элемент задачи
    li.append(span, completeBtn, editBtn, deleteBtn);
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

  sortTasks();
  saveTasks();
  renderTasks();

  form.reset(); // очищаем форму
});

// удаление задачи по индексу
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// отметка задачи как выполненной/невыполненной
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// сохранение всех задач в localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// загрузка задач из localStorage при открытии страницы
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) tasks = JSON.parse(saved);
}

// загружаем сохранённые задачи при старте
loadTasks();
renderTasks();

// поиск и фильтрация

// перерисовываем задачи при вводе текста в поиск
search.addEventListener('input', () => renderTasks());

// изменяем фильтр - тоже перерисовываем
filter.addEventListener('change', () => renderTasks());

// сортировка
function sortTasks() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// drag & drop
let draggedIndex = null;

// когда пользователь начинает перетаскивать элемент
list.addEventListener('dragstart', e => {
  draggedIndex = [...list.children].indexOf(e.target);
});

// разрешаем вбрасывание элемента
list.addEventListener('dragover', e => e.preventDefault());

// при отпускании элемента
list.addEventListener('drop', e => {
  const droppedIndex = [...list.children].indexOf(e.target);
  const [moved] = tasks.splice(draggedIndex, 1);
  tasks.splice(droppedIndex, 0, moved);
  saveTasks();
  renderTasks();
});