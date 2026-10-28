export async function fetchJson(url) {
  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error("Could not connect to Open-Meteo. Check your internet connection.");
  }

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status} ${response.statusText}).`);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error("Open-Meteo returned an unreadable response.");
  }
}

export async function searchCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5`;
  const data = await fetchJson(url);

  return (data.results ?? []).map(result => ({
    city: result.name,
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone ?? "Local time",
    admin1: result.admin1 ?? ""
  }));
}

export async function getForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto"
  });

  return fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
}
