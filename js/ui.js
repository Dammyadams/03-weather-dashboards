export function renderWeather(weather) {
  document.querySelector("#weather-location").textContent = `${weather.city}, ${weather.country}`;
  document.querySelector("#current-temperature").textContent = `${weather.temperature}°`;
  document.querySelector("#current-condition").textContent = weather.condition;
  document.querySelector("#current-icon").textContent = weather.icon;
  document.querySelector("#wind-speed").textContent = `${weather.wind} km/h`;
  document.querySelector("#local-time").textContent = weather.time;

  const favouriteButton = document.querySelector("#favourite-button");
  favouriteButton.setAttribute("aria-label", `Add ${weather.city} to favourites`);
}

export function renderForecast(forecast) {
  const grid = document.querySelector("#forecast-grid");
  grid.replaceChildren(...forecast.map(([day, icon, high, low]) => {
    const card = document.createElement("article");
    card.className = "forecast-card";

    const dayElement = document.createElement("strong");
    dayElement.textContent = day;

    const iconElement = document.createElement("span");
    iconElement.className = "forecast-icon";
    iconElement.setAttribute("aria-hidden", "true");
    iconElement.textContent = icon;

    const temperature = document.createElement("span");
    temperature.textContent = `${high}° / ${low}°`;

    card.append(dayElement, iconElement, temperature);
    return card;
  }));
}

export function renderFavourites(favourites, onSelect) {
  const list = document.querySelector("#favourites-list");
  const count = document.querySelector("#favourites-count");
  count.textContent = favourites.length;

  list.replaceChildren(...favourites.map(weather => {
    const item = document.createElement("li");
    item.className = "favourite-item";

    const button = document.createElement("button");
    button.type = "button";
    button.addEventListener("click", () => onSelect(weather.city));

    const icon = document.createElement("span");
    icon.className = "favourite-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = weather.icon;

    const name = document.createElement("span");
    name.className = "favourite-name";
    const city = document.createElement("strong");
    city.textContent = weather.city;
    const country = document.createElement("span");
    country.textContent = weather.country;
    name.append(city, country);

    const temperature = document.createElement("span");
    temperature.className = "favourite-temperature";
    temperature.textContent = `${weather.temperature}°`;

    button.append(icon, name, temperature);
    item.append(button);
    return item;
  }));
}

export function setLoading(isLoading, message = "Loading weather…") {
  const status = document.querySelector("#loading-status");
  status.hidden = !isLoading;
  status.textContent = isLoading ? message : "";
}

export function showError(message = "Something went wrong.") {
  const status = document.querySelector("#error-status");
  status.textContent = message;
  status.hidden = false;
}

export function clearError() {
  const status = document.querySelector("#error-status");
  status.textContent = "";
  status.hidden = true;
}

export function setFavouriteState(isFavourite, city) {
  const button = document.querySelector("#favourite-button");
  button.setAttribute("aria-pressed", String(isFavourite));
  button.setAttribute("aria-label", `${isFavourite ? "Remove" : "Add"} ${city} ${isFavourite ? "from" : "to"} favourites`);
  button.querySelector("span").textContent = isFavourite ? "★" : "☆";
}
