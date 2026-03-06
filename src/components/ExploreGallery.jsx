import { motion } from 'framer-motion';

export default function ExploreGallery({ images = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((img, index) => (
        <motion.div
          key={`${img}-${index}`}
          className="relative overflow-hidden rounded-2xl shadow-md"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={img}
            alt={`Gallery ${index + 1}`}
            className="w-full h-40 sm:h-48 md:h-56 object-cover"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
}
