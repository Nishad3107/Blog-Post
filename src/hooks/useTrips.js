import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const sampleTrips = [
  {
    id: '1',
    title: 'Bali, Indonesia',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.',
    image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Santorini, Greece',
    location: 'Santorini, Greece',
    description: 'White-washed buildings, crystal-clear waters, and world-famous sunsets.',
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Kyoto, Japan',
    location: 'Kyoto, Japan',
    description: 'Ancient temples, traditional gardens, and authentic Japanese culture.',
    image_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    created_at: new Date().toISOString(),
  },
];

const withTimeout = (promise, ms = 7000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms)),
  ]);

export function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrips() {
      if (!supabase) {
        setTrips(sampleTrips);
        setLoading(false);
        return;
      }
      try {
        const { data, error: fetchError } = await withTimeout(
          supabase.from('trips').select('*').order('created_at', { ascending: false })
        );

        if (fetchError) {
          console.error('Error loading trips:', fetchError);
          setTrips(sampleTrips);
          setError(fetchError.message || 'Failed to load trips.');
          return;
        }

        setTrips(data || []);
      } catch (err) {
        console.error('Error loading trips:', err);
        setTrips(sampleTrips);
        setError(err.message);
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
      if (!supabase) {
        setTrip(sampleTrips.find((t) => t.id === id) || null);
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

        setTrip(data);
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
