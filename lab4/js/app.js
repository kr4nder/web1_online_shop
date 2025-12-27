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
