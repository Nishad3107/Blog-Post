import { useEffect } from 'react';
import Layout from '../components/Layout';
import TripCard from '../components/TripCard';
import { useWishlist } from '../hooks/useWishlist';
import { setMeta } from '../utils/seo';

export default function Wishlist() {
  const wishlist = useWishlist();

  useEffect(() => {
    setMeta({
      title: 'Wishlist | TravelBlog',
      description: 'Your saved trips and destinations.',
      image: undefined,
      url: window.location.href,
    });
  }, []);

  return (
    <Layout>
      <div className="relative h-56 bg-gradient-to-r from-primary-dark to-dark-green flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="font-heading text-4xl mb-2">Wishlist</h1>
          <p className="text-lg text-light-green font-body">Your saved destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlist.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-green font-body text-lg">No saved trips yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.items.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                image={trip.image_url || trip.image || '🌍'}
                description={trip.description}
                location={trip.location}
                date={trip.date || new Date(trip.created_at).toLocaleDateString()}
                tags={trip.tags || []}
                saved={wishlist.isSaved(trip.id)}
                onToggle={() => wishlist.toggle(trip)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
