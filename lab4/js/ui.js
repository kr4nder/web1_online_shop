// отображение текстового статуса
function showStatus(text) {
    const status = document.getElementById("status");
    status.textContent = text;
  }
  
  // очистка текстового статуса
  function clearStatus() {
    const status = document.getElementById("status");
    status.textContent = "";
  }
  
  // отрисовка прогноза погоды на 3 дня
  function renderWeather(container, weather) {
    // очищаем контейнер
    container.textContent = "";
  
    // цикл по дням прогноза
    for (let i = 0; i < 3; i++) {
      // карточка погоды
      const card = document.createElement("div");
      card.classList.add("weather-card");
  
      // дата
      const date = document.createElement("strong");
      date.textContent = weather.daily.time[i];
  
      // температура
      const temp = document.createElement("div");
      temp.textContent =
        weather.daily.temperature_2m_min[i] +
        "° / " +
        weather.daily.temperature_2m_max[i] +
        "°";
  
      // собираем карточку
      card.appendChild(date);
      card.appendChild(temp);
  
      // добавляем карточку в контейнер
      container.appendChild(card);
    }
  }
  