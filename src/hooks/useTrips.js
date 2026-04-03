import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const normalizeTrip = (trip = {}, index = 0) => {
  const title = trip.title || trip.location || `Trip ${index + 1}`;
  const location = trip.location || trip.title || 'Unknown destination';
  const description =
    trip.description ||
    trip.excerpt ||
    `Discover highlights and travel tips for ${location}.`;
  const content =
    trip.content ||
    trip.story ||
    `${description} This story captures the atmosphere, people, and moments that made the journey memorable.`;
  const tags = Array.isArray(trip.tags) ? trip.tags : [];
  return {
    ...trip,
    id: trip.id ?? `${index + 1}`,
    title,
    location,
    description,
    content,
    image_url: trip.image_url || trip.image || null,
    tags,
    status: trip.status || 'published',
    author: trip.author || 'Anonymous',
    created_at: trip.created_at || new Date().toISOString(),
  };
};

const sampleTrips = [
  {
    id: '1',
    title: 'Bali, Indonesia',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.',
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
    region: 'Southeast Asia',
    season: 'Spring',
    budget: 'Mid',
    tags: ['Beaches', 'Culture', 'Wellness'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Santorini, Greece',
    location: 'Santorini, Greece',
    description: 'White-washed buildings, crystal-clear waters, and world-famous sunsets.',
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    region: 'Europe',
    season: 'Summer',
    budget: 'Mid',
    tags: ['Beaches', 'Romance', 'Food'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Kyoto, Japan',
    location: 'Kyoto, Japan',
    description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
    image_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    region: 'East Asia',
    season: 'Autumn',
    budget: 'Mid',
    tags: ['Culture', 'City', 'Food'],
    created_at: new Date().toISOString(),
  },
];

const withTimeout = (promise, ms = 12000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
  ]);

const CACHE_KEY = 'travelblog_trips_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 10;

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.ts) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // ignore
  }
};

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      if (!supabase) {
        setTrips(sampleTrips.map(normalizeTrip));
        setLoading(false);
        return;
      }
      const cached = readCache();
      if (cached?.length) {
        setTrips(cached.map(normalizeTrip));
      }
      try {
        const fetchOnce = () =>
          withTimeout(
            supabase.from('trips').select('*').order('created_at', { ascending: false })
          );
        let response = await fetchOnce();
        if (response.error && response.error.message?.includes('timed out')) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          response = await fetchOnce();
        }

        const { data, error: fetchError } = response;

        if (fetchError) {
          console.error('Error loading trips:', fetchError);
          setTrips(sampleTrips.map(normalizeTrip));
          setError(fetchError.message || 'Failed to load trips.');
          return;
        }

        const normalized = (data || []).map(normalizeTrip).filter((t) => t.status !== 'draft');
        setTrips(normalized);
        writeCache(normalized);
      } catch (err) {
        const isTimeout = err?.message === 'Request timed out';
        if (!isTimeout) {
          console.error('Error loading trips:', err);
          setError(err.message);
        } else {
          setError('Using sample data (network timeout).');
        }
        const cachedFallback = readCache();
        if (cachedFallback?.length) {
          setTrips(cachedFallback.map(normalizeTrip));
        } else {
          setTrips(sampleTrips.map(normalizeTrip));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return { trips, loading, error };
}

export function useTrip(id) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      if (!id) return;
      const isUuid =
        typeof id === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (!supabase) {
        const fallback = sampleTrips.find((t) => t.id === id) || null;
        setTrip(fallback ? normalizeTrip(fallback) : null);
        setLoading(false);
        return;
      }
      if (!isUuid) {
        const fallback = sampleTrips.find((t) => t.id === id) || null;
        setTrip(fallback ? normalizeTrip(fallback) : null);
        setLoading(false);
        return;
      }
      
      try {
        const { data, error: fetchError } = await withTimeout(
          supabase.from('trips').select('*').eq('id', id).single()
        );

        if (fetchError) {
          console.error('Error loading trip:', fetchError);
          setTrip(null);
          setError(fetchError.message || 'Failed to load trip.');
          return;
        }

        setTrip(data ? normalizeTrip(data) : null);
      } catch (err) {
        console.error('Error loading trip:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [id]);

  return { trip, loading, error };
}
