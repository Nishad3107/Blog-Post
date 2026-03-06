import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import { useNavigate } from 'react-router-dom';
import { resolveSingleImage } from '../utils/imageFallback';

export default function BlogCard({ id, image, title, location, excerpt }) {
  const navigate = useNavigate();
  const resolvedImage = resolveSingleImage(location || title, image);
  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.2} className="h-full">
      <motion.article
        className="glass-card card-glow group h-full"
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      >
        <div className="relative h-44 sm:h-48 overflow-hidden rounded-2xl">
          <Parallax speed={-4}>
            <motion.img
              src={resolvedImage}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-xs sm:text-sm text-base-green font-body uppercase tracking-[0.2em]">{location}</p>
          <h3 className="text-lg sm:text-xl font-heading text-white mt-2">{title}</h3>
          <p className="text-sm sm:text-base text-white/80 font-body mt-2 line-clamp-3">{excerpt}</p>
          <button
            type="button"
            onClick={() => navigate(`/trip/${id}`)}
            className="mt-4 text-base-green font-button hover:text-white transition-colors duration-300 inline-flex items-center gap-2"
          >
            Read Story
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </motion.article>
    </Tilt>
  );
}
