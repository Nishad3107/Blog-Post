import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resolveSingleImage } from '../utils/imageFallback';

export default function GalleryCard({ trip }) {
  const navigate = useNavigate();
  const image = resolveSingleImage(trip.location || trip.title, trip.image_url || trip.image);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/trip/${trip.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/trip/${trip.id}`);
      }}
    >
      <img src={image} alt={trip.title} loading="lazy" className="w-full h-64 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h4 className="font-heading text-lg drop-shadow">{trip.title}</h4>
        <p className="text-white/80 text-sm font-body line-clamp-2">{trip.description}</p>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          type="button"
          className="bg-base-green text-primary-dark px-4 py-2 rounded-full text-sm font-button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/trip/${trip.id}`);
          }}
        >
          View Story
        </button>
      </div>
    </motion.div>
  );
}
