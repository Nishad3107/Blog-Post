import { matchFallbackImage } from './imageFallback';

const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const WIKI_SEARCH = 'https://en.wikipedia.org/w/rest.php/v1/search/title';
const UNSPLASH_SEARCH = 'https://api.unsplash.com/search/photos';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWikipediaIntro(location) {
  const res = await fetch(`${WIKI_SUMMARY}${encodeURIComponent(location)}`);
  if (!res.ok) return { title: location, extract: '', thumbnail: '' };
  const data = await res.json();
  return {
    title: data.title || location,
    extract: data.extract || '',
    thumbnail: data.thumbnail?.source || '',
  };
}

export async function fetchTopPlaces(location) {
  const url = `${WIKI_SEARCH}?q=${encodeURIComponent(location)}&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.pages || [];
  return pages.map((p) => p.title).filter(Boolean).slice(0, 5);
}

export async function fetchUnsplashImages(location, count = 8, querySuffix = 'travel') {
  const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const res = await fetch(
    `${UNSPLASH_SEARCH}?query=${encodeURIComponent(`${location} ${querySuffix}`)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((img) => img.urls?.regular).filter(Boolean);
}

export async function fetchWeather(location) {
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!key) return null;
  const res = await fetch(`${WEATHER_URL}?q=${encodeURIComponent(location)}&appid=${key}&units=metric`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    temperature: data?.main?.temp,
    condition: data?.weather?.[0]?.main || 'Unavailable',
    humidity: data?.main?.humidity,
  };
}

export async function buildExploreData(location) {
  const [wiki, places, weather] = await Promise.all([
    fetchWikipediaIntro(location),
    fetchTopPlaces(location),
    fetchWeather(location),
  ]);

  let images = await fetchUnsplashImages(location, 8, 'travel');
  if (!images.length) {
    images = await fetchUnsplashImages(location, 8, 'landscape');
  }

  const fallback = matchFallbackImage(location);
  if (!images.length) images = [fallback];

  return {
    location: wiki.title || location,
    intro: wiki.extract,
    thumbnail: wiki.thumbnail,
    topPlaces: places,
    weather,
    images,
  };
}
