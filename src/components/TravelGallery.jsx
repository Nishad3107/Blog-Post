import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GalleryCard from './GalleryCard';
import FeaturedSlider from './FeaturedSlider';

export default function TravelGallery({ trips = [], loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent-green border-t-transparent"></div>
      </div>
    );
  }

  if (!trips.length) {
    return <p className="text-center text-dark-green font-body">No trips available.</p>;
  }

  const featuredTrips = trips.slice(0, 6);

  return (
    <div className="space-y-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="font-heading text-3xl sm:text-4xl text-primary-dark mb-6 text-center">
          Featured Destinations
        </h2>
        <FeaturedSlider trips={featuredTrips} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className="font-heading text-2xl sm:text-3xl text-primary-dark mb-6 text-center">
          Travel Gallery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <GalleryCard key={trip.id} trip={trip} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center"
      >
        <button
          type="button"
          onClick={() => navigate('/trips')}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-accent-green text-primary-dark font-button hover:bg-base-green transition-colors duration-300"
        >
          Explore More Destinations
        </button>
      </motion.div>
    </div>
  );
}
