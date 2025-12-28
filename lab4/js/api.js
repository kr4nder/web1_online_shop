// url для геокодинга
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

// url для прогноза погоды
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

// получение координат по названию города
async function getCoordsByCity(city) {
  const response = await fetch(`${GEO_API}?name=${city}&count=1`);
  const data = await response.json();

  // если город не найден, выбрасываем ошибку
  if (!data.results) {
    throw new Error("город не найден");
  }

  return data.results[0];
}

// получение прогноза погоды по координатам
async function getWeather(lat, lon) {
  const response = await fetch(
    `${WEATHER_API}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&timezone=auto`
  );

  return response.json();
}
