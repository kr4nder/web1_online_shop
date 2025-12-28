// контейнер основной погоды
const weatherContainer = document.getElementById("weather-container");

// состояние приложения
let appState = loadState() || {
  main: null,
  cities: []
};

// запуск приложения
init();

// инициализация приложения
async function init() {
    if (appState.main) {
      await loadMainWeather();
      await renderCities();
    } else {
      requestGeolocation();
    }
  }

// запрос геолокации пользователя
function requestGeolocation() {
  navigator.geolocation.getCurrentPosition(
    position => {
      // сохраняем координаты пользователя
      appState.main = {
        type: "geo",
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };

      saveState(appState);
      loadMainWeather();
    },
    () => {
      // отказ от геолокации
      showStatus("введите город вручную");
    }
  );
}

// загрузка погоды для основной локации
async function loadMainWeather() {
  showStatus("загрузка погоды...");
  const weather = await getWeather(appState.main.lat, appState.main.lon);
  renderWeather(weatherContainer, weather);
  clearStatus();
}

// элементы формы города
const cityForm = document.getElementById("city-form");
const cityInput = document.getElementById("city-input");
const cityError = document.getElementById("city-error");
const citiesList = document.getElementById("cities-list");

// список доступных городов для выпадающего списка
const CITY_SUGGESTIONS = [
    "Москва",
    "Санкт-Петербург",
    "Казань",
    "Новосибирск",
    "Екатеринбург",
    "Нижний Новгород",
    "Самара",
    "Ростов-на-Дону",
    "Краснодар",
    "Сочи",
    "Уфа",
    "Пермь",
    "Челябинск",
    "Омск",
    "Воронеж"
  ];  

// список для выпадающих подсказок городов
const suggestionsList = document.getElementById("city-suggestions");

// обработка добавления города
cityForm.addEventListener("submit", async e => {
    e.preventDefault();
  
    // очищаем ошибку и подсказки
    cityError.textContent = "";
    suggestionsList.textContent = "";
    suggestionsList.style.display = "none";
  
    const cityName = cityInput.value.trim();
  
    // проверяем, что город есть в списке
    if (!CITY_SUGGESTIONS.includes(cityName)) {
      cityError.textContent = "выберите город из выпадающего списка";
      return;
    }
  
    try {
      const city = await getCoordsByCity(cityName);
  
      appState.cities.push({
        name: city.name,
        lat: city.latitude,
        lon: city.longitude
      });
  
      saveState(appState);
      renderCities();
  
      cityInput.value = "";
    } catch {
      cityError.textContent = "не удалось получить данные города";
    }
  });
  

// отрисовка списка городов
async function renderCities() {
  // очищаем список городов
  citiesList.textContent = "";

  for (const city of appState.cities) {
    // контейнер города
    const cityBlock = document.createElement("div");

    // заголовок города
    const title = document.createElement("h3");
    title.textContent = city.name;

    // контейнер погоды города
    const weatherBlock = document.createElement("div");
    weatherBlock.classList.add("city-weather");

    cityBlock.appendChild(title);
    cityBlock.appendChild(weatherBlock);
    citiesList.appendChild(cityBlock);

    const weather = await getWeather(city.lat, city.lon);
    renderWeather(weatherBlock, weather);
  }
}

// кнопка обновления
const refreshBtn = document.getElementById("refreshBtn");

// повторная загрузка погоды
refreshBtn.addEventListener("click", () => {
  if (appState.main) {
    loadMainWeather();
  }
  renderCities();
});

// обработка ввода текста в поле города
cityInput.addEventListener("input", () => {
    const value = cityInput.value.trim().toLowerCase();
  
    // очищаем ошибки и список подсказок
    cityError.textContent = "";
    suggestionsList.textContent = "";
    suggestionsList.style.display = "none";
  
    // если поле пустое — ничего не показываем
    if (!value) return;
  
    // фильтруем города по введённому тексту
    const matches = CITY_SUGGESTIONS.filter(city =>
      city.toLowerCase().startsWith(value)
    );
  
    // если совпадений нет — список не показываем
    if (matches.length === 0) return;
  
    // показываем список
    suggestionsList.style.display = "block";
  
    // создаём элементы выпадающего списка
    for (const city of matches) {
      const li = document.createElement("li");
      li.textContent = city;
  
      // при клике подставляем город в инпут
      li.addEventListener("click", e => {
        e.preventDefault(); // важно
        cityInput.value = city;
        suggestionsList.textContent = "";
        suggestionsList.style.display = "none";
      });
      
      suggestionsList.appendChild(li);
    }
  });
