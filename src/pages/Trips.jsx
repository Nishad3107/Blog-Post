import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import TripCard from '../components/TripCard';
import { useTrips } from '../hooks/useTrips';
import useParallax from '../hooks/useParallax';

export default function Trips() {
  const { trips, loading, error } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  useParallax();

  const fallbackTrips = [
    { id: 1, title: 'Bali, Indonesia', date: 'March 15-22, 2026', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80', description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces. Experience the magic of island life.', location: 'Bali, Indonesia' },
    { id: 2, title: 'Santorini, Greece', date: 'April 5-12, 2026', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80', description: 'White-washed buildings, crystal-clear waters, and world-famous sunsets. Discover the jewel of the Aegean Sea.', location: 'Santorini, Greece' },
    { id: 3, title: 'Kyoto, Japan', date: 'May 1-10, 2026', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80', description: 'Ancient temples, traditional gardens, and authentic Japanese culture. Walk through centuries of history.', location: 'Kyoto, Japan' },
    { id: 4, title: 'Reykjavik, Iceland', date: 'June 20-28, 2026', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80', description: 'Northern lights, dramatic landscapes, and geothermal wonders. Adventure awaits in the land of fire and ice.', location: 'Reykjavik, Iceland' },
  ];

  const displayTrips = trips.length > 0 ? trips : fallbackTrips;

  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return displayTrips;

    const query = searchQuery.toLowerCase().trim();
    return displayTrips.filter((trip) => {
      const titleMatch = trip.title?.toLowerCase().includes(query);
      const locationMatch = trip.location?.toLowerCase().includes(query);
      return titleMatch || locationMatch;
    });
  }, [displayTrips, searchQuery]);

  return (
    <Layout>
      <div className="relative h-64 bg-gradient-to-r from-primary-dark to-dark-green flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="font-heading text-4xl mb-2">My Trips</h1>
          <p className="text-lg text-light-green font-body">Explore my travel adventures</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full pl-12 pr-4 py-3 border-2 border-soft-mint rounded-full focus:border-accent-green focus:outline-none transition font-body bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center mt-3 text-dark-green font-body">
              Found {filteredTrips.length} {filteredTrips.length === 1 ? 'result' : 'results'} for "{searchQuery}"
            </p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-green border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 font-body mb-2">Error loading trips: {error}</p>
            <p className="text-dark-green font-body">Showing sample data instead.</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                image={trip.image_url || trip.image || '🌍'}
                description={trip.description}
                location={trip.location}
                date={trip.date || new Date(trip.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        )}

        {!loading && filteredTrips.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-dark-green font-body text-lg">No trips found matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-accent-green hover:text-primary-green font-body"
            >
              Clear search
            </button>
          </div>
        )}

        {!loading && displayTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-green font-body text-lg">No trips found. Start sharing your travel stories!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
