const FALLBACKS = {
  beach: '/fallback-images/beach.svg',
  mountain: '/fallback-images/mountains.svg',
  mountains: '/fallback-images/mountains.svg',
  city: '/fallback-images/city.svg',
  road: '/fallback-images/roadtrip.svg',
  roadtrip: '/fallback-images/roadtrip.svg',
  nature: '/fallback-images/nature.svg',
  default: '/fallback-images/nature.svg',
};

const PLACEHOLDER = '/fallback-images/placeholder.svg';

export function matchFallbackImage(location = '') {
  const text = location.toLowerCase();
  if (text.includes('beach') || text.includes('island') || text.includes('coast')) return FALLBACKS.beach;
  if (text.includes('mountain') || text.includes('alps') || text.includes('himalaya')) return FALLBACKS.mountain;
  if (text.includes('city') || text.includes('town') || text.includes('urban')) return FALLBACKS.city;
  if (text.includes('road') || text.includes('route') || text.includes('highway')) return FALLBACKS.road;
  if (text.includes('forest') || text.includes('nature') || text.includes('park')) return FALLBACKS.nature;
  return FALLBACKS.default;
}

export async function fetchUnsplashImages(location, count = 6) {
  const key = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(`${location} travel`)}&per_page=${count}`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map((img) => img.urls?.regular).filter(Boolean);
}

export async function resolveImages(location, images = []) {
  if (images && images.length > 0) {
    return { hero: images[0], gallery: images };
  }
  const unsplashImages = await fetchUnsplashImages(location);
  if (unsplashImages.length > 0) {
    return { hero: unsplashImages[0], gallery: unsplashImages };
  }
  const fallback = matchFallbackImage(location);
  return { hero: fallback, gallery: [fallback] };
}

export function resolveSingleImage(location, imageUrl) {
  if (imageUrl) return imageUrl;
  return matchFallbackImage(location);
}

export function placeholderImage() {
  return PLACEHOLDER;
}
