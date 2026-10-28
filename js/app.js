import { getFavourites, getWeather } from "./api.js";
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

async function loadWeather(city = "Lisbon") {
  clearError();
  setLoading(true);

  try {
    const weather = await getWeather(city);
    currentWeather = weather;
    renderWeather(weather);
    renderForecast(weather.forecast);
    setFavouriteState(favourites.some(item => item.city === weather.city), weather.city);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

async function initialize() {
  try {
    favourites = await getFavourites();
    renderFavourites(favourites, loadWeather);
    await loadWeather();
  } catch (error) {
    showError(error.message);
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const city = input.value.trim();

  if (!city) {
    showError("Enter a city name to search.");
    input.focus();
    return;
  }

  clearError();
  loadWeather(city);
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
