// ключ для хранения данных приложения
const STORAGE_KEY = "weatherAppState";

// сохранение состояния приложения
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// загрузка состояния приложения
function loadState() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}
