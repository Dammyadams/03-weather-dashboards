import { getForecast, searchCity } from "./api.js";
import { getWeatherCode } from "./weatherCodes.js";
import {
  clearError,
  renderForecast,
  renderFavourites,
  renderWeather,
  setFavouriteState,
  setLoading,
  showError
} from "./ui.js";

const form = document.querySelector("#search-form");
const input = document.querySelector("#city-input");
const favouriteButton = document.querySelector("#favourite-button");
let favourites = [];
let currentWeather;

function formatLocalTime(isoTime, timezone) {
  const date = new Date(`${isoTime}:00Z`);
  if (Number.isNaN(date.getTime())) return isoTime;

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone
  }).format(date);
}

async function loadWeather(cityName) {
  clearError();
  setLoading(true, "Loading…");

  try {
    const cities = await searchCity(cityName);

    if (!cities.length) {
      showError(`We couldn't find “${cityName}”. Try another city name.`);
      return;
    }

    const place = cities[0];
    let forecast;

    try {
      forecast = await getForecast(place.latitude, place.longitude);
    } catch (error) {
      showError(error.message);
      return;
    }

    const currentCode = getWeatherCode(forecast.current.weather_code);
    const timezone = forecast.timezone ?? place.timezone;
    currentWeather = {
      city: place.city,
      country: place.country,
      temperature: Math.round(forecast.current.temperature_2m),
      condition: currentCode.label,
      icon: currentCode.emoji,
      wind: Math.round(forecast.current.wind_speed_10m),
      time: formatLocalTime(forecast.current.time, timezone),
      forecast: forecast.daily.time.map((date, index) => {
        const day = new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: timezone })
          .format(new Date(`${date}T12:00:00Z`));
        const dailyCode = getWeatherCode(forecast.daily.weather_code[index]);
        return [
          day,
          dailyCode.emoji,
          Math.round(forecast.daily.temperature_2m_max[index]),
          Math.round(forecast.daily.temperature_2m_min[index])
        ];
      })
    };

    renderWeather(currentWeather);
    renderForecast(currentWeather.forecast);
    setFavouriteState(favourites.some(item => item.city === currentWeather.city), currentWeather.city);
  } catch (error) {
    showError(error.message || "Weather data could not be loaded.");
  } finally {
    setLoading(false);
  }
}

async function initialize() {
  favourites = [
    { city: "London", country: "United Kingdom", temperature: 17, icon: "🌦️" },
    { city: "Tokyo", country: "Japan", temperature: 29, icon: "🌤️" },
    { city: "Paris", country: "France", temperature: 20, icon: "☁️" }
  ];
  renderFavourites(favourites, loadWeather);

  try {
    await loadWeather("Lisbon");
  } catch (error) {
    showError(error.message || "Weather data could not be loaded.");
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const city = input.value.trim();

  if (!city) {
    showError("Enter a city name to search.");
    input.focus();
    return;
  }

  try {
    await loadWeather(city);
  } catch (error) {
    showError(error.message || "Weather data could not be loaded.");
  }
});

favouriteButton.addEventListener("click", () => {
  if (!currentWeather) return;

  const exists = favourites.some(item => item.city === currentWeather.city);
  favourites = exists
    ? favourites.filter(item => item.city !== currentWeather.city)
    : [...favourites, currentWeather];

  renderFavourites(favourites, loadWeather);
  setFavouriteState(!exists, currentWeather.city);
});

initialize();
