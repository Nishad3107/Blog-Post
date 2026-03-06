const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeather(lat, lon) {
  if (!API_KEY) {
    throw new Error('OpenWeather API key not configured');
  }

  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();
  
  return {
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    icon: data.weather[0].icon,
    windSpeed: Math.round(data.wind.speed),
    feelsLike: Math.round(data.main.feels_like),
  };
}

export function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
