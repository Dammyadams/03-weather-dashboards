const cities = {
  lisbon: {
    city: "Lisbon",
    country: "Portugal",
    temperature: 24,
    condition: "Clear sky",
    icon: "☀️",
    wind: 14,
    time: "10:42",
    forecast: [
      ["Mon", "☀️", 25, 18], ["Tue", "🌤️", 24, 17], ["Wed", "⛅", 22, 16],
      ["Thu", "🌦️", 21, 15], ["Fri", "🌤️", 23, 16], ["Sat", "☀️", 26, 18], ["Sun", "☀️", 27, 19]
    ]
  },
  london: {
    city: "London",
    country: "United Kingdom",
    temperature: 17,
    condition: "Light rain",
    icon: "🌦️",
    wind: 21,
    time: "09:42",
    forecast: [
      ["Mon", "🌦️", 17, 11], ["Tue", "🌧️", 16, 10], ["Wed", "⛅", 18, 12],
      ["Thu", "🌤️", 19, 13], ["Fri", "☁️", 17, 11], ["Sat", "🌦️", 16, 10], ["Sun", "⛅", 18, 12]
    ]
  },
  tokyo: {
    city: "Tokyo",
    country: "Japan",
    temperature: 29,
    condition: "Partly cloudy",
    icon: "🌤️",
    wind: 9,
    time: "18:42",
    forecast: [
      ["Mon", "🌤️", 29, 22], ["Tue", "☀️", 31, 23], ["Wed", "🌦️", 27, 21],
      ["Thu", "⛅", 28, 22], ["Fri", "☀️", 30, 23], ["Sat", "🌤️", 29, 22], ["Sun", "🌦️", 26, 20]
    ]
  },
  paris: {
    city: "Paris",
    country: "France",
    temperature: 20,
    condition: "Cloudy",
    icon: "☁️",
    wind: 12,
    time: "10:42",
    forecast: [
      ["Mon", "☁️", 20, 14], ["Tue", "🌦️", 19, 13], ["Wed", "⛅", 21, 14],
      ["Thu", "☀️", 23, 15], ["Fri", "🌤️", 22, 15], ["Sat", "☁️", 20, 14], ["Sun", "🌦️", 18, 13]
    ]
  },
  "new york": {
    city: "New York",
    country: "United States",
    temperature: 22,
    condition: "Partly cloudy",
    icon: "⛅",
    wind: 16,
    time: "04:42",
    forecast: [
      ["Mon", "⛅", 22, 16], ["Tue", "☀️", 25, 17], ["Wed", "🌦️", 21, 15],
      ["Thu", "☁️", 19, 14], ["Fri", "🌤️", 23, 16], ["Sat", "☀️", 26, 18], ["Sun", "⛅", 24, 17]
    ]
  }
};

function wait(milliseconds = 350) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

export async function getWeather(city = "Lisbon") {
  await wait();
  const key = city.trim().toLowerCase();
  const weather = cities[key] || cities[Object.keys(cities).find(name => cities[name].city.toLowerCase() === key)];

  if (!weather) {
    throw new Error(`Weather data is not available for “${city}” yet.`);
  }

  return structuredClone(weather);
}

export async function getFavourites() {
  await wait(200);
  return [cities.lisbon, cities.london, cities.tokyo];
}
