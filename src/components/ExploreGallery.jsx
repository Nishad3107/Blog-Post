import { motion } from 'framer-motion';
import { useState } from 'react';
import ImageLightbox from './ImageLightbox';
import { placeholderImage } from '../utils/imageFallback';

export default function ExploreGallery({ images = [] }) {
  const [active, setActive] = useState(null);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <motion.button
            type="button"
            key={`${img}-${index}`}
            className="relative overflow-hidden rounded-2xl shadow-md"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(img)}
          >
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="w-full h-40 sm:h-48 md:h-56 object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = placeholderImage();
              }}
            />
          </motion.button>
        ))}
      </div>
      <ImageLightbox src={active} alt="Gallery" onClose={() => setActive(null)} />
    </>
  );
}
