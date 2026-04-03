import { matchFallbackImage } from './imageFallback';

const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const WIKI_SEARCH = 'https://en.wikipedia.org/w/rest.php/v1/search/title';
const UNSPLASH_SEARCH = 'https://api.unsplash.com/search/photos';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const WIKIDATA_SEARCH = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&origin=*';
const WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql';

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
  const banned = [
    'language',
    'dialect',
    'grammar',
    'phonology',
    'alphabet',
    'script',
    'team',
    'football',
    'forces',
    'airlines',
    'army',
    'navy',
    'government',
    'ministry',
    'bank',
    'university',
    'list of',
    'flag of',
    'ISO',
    'disambiguation',
    'economy',
  ];

  const wikidataPlaces = await fetchWikidataPlaces(location);
  if (wikidataPlaces.length) return wikidataPlaces.slice(0, 5);

  const queries = [
    `${location} tourist attractions`,
    `${location} landmarks`,
    `${location} places to visit`,
  ];
  const results = await Promise.all(
    queries.map(async (q) => {
      const url = `${WIKI_SEARCH}?q=${encodeURIComponent(q)}&limit=8`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data?.pages || []).map((p) => p.title).filter(Boolean);
    })
  );

  const titles = results
    .flat()
    .filter((title) => !banned.some((term) => title.toLowerCase().includes(term.toLowerCase())))
    .filter((title) => !/\\(language\\)$/i.test(title))
    .filter((title, index, self) => self.indexOf(title) === index);

  return titles.slice(0, 5);
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

  const filledPlaces = places && places.length ? places : [];
  const bestTime = bestTimeForLocation(location);

  return {
    location: wiki.title || location,
    intro: wiki.extract,
    thumbnail: wiki.thumbnail,
    topPlaces: filledPlaces,
    weather,
    images,
    bestTime,
  };
}

function bestTimeForLocation(location = '') {
  const text = location.toLowerCase();
  if (text.includes('bali') || text.includes('thailand') || text.includes('vietnam')) {
    return 'Dry season (April to October) is ideal for beaches and island hopping.';
  }
  if (text.includes('japan') || text.includes('kyoto') || text.includes('tokyo')) {
    return 'Spring (March–May) and autumn (September–November) offer the best weather and scenery.';
  }
  if (text.includes('iceland') || text.includes('norway') || text.includes('sweden')) {
    return 'Summer (June–August) for long days; winter for northern lights.';
  }
  if (text.includes('morocco') || text.includes('sahara')) {
    return 'Autumn (September–November) and spring (March–May) are most comfortable.';
  }
  return 'Spring and early autumn offer the most pleasant weather for exploring.';
}

async function fetchWikidataPlaces(location) {
  try {
    const searchRes = await fetch(`${WIKIDATA_SEARCH}&search=${encodeURIComponent(location)}&limit=1`);
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const id = searchData?.search?.[0]?.id;
    if (!id) return [];

    const sparql = `
      SELECT ?placeLabel WHERE {
        VALUES ?type { wd:Q570116 wd:Q33506 wd:Q22698 wd:Q23413 wd:Q1248784 }
        ?place wdt:P31/wdt:P279* ?type .
        ?place wdt:P131* wd:${id} .
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      }
      LIMIT 8
    `;
    const url = `${WIKIDATA_SPARQL}?format=json&query=${encodeURIComponent(sparql)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/sparql-results+json' },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const labels = data?.results?.bindings?.map((b) => b.placeLabel?.value).filter(Boolean) || [];
    return labels;
  } catch {
    return [];
  }
}
