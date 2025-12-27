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
function init() {
    if (appState.main) {
      loadMainWeather();
      renderCities();
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

// обработка добавления города
cityForm.addEventListener("submit", async e => {
  e.preventDefault();
  cityError.textContent = "";

  try {
    const city = await getCoordsByCity(cityInput.value);

    appState.cities.push({
      name: city.name,
      lat: city.latitude,
      lon: city.longitude
    });

    saveState(appState);
    renderCities();
    cityInput.value = "";
  } catch (error) {
    cityError.textContent = error.message;
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
