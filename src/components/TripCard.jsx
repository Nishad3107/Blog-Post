import { Link } from 'react-router-dom';
import { resolveSingleImage } from '../utils/imageFallback';

export default function TripCard({ id, title, image, description, location, date }) {
  const resolvedImage = resolveSingleImage(location || title, image);
  const isImageUrl = typeof resolvedImage === 'string' && (resolvedImage.startsWith('http') || resolvedImage.startsWith('data:') || resolvedImage.startsWith('/'));

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-soft-mint group">
      <div className="h-48 sm:h-52 md:h-56 lg:h-60 bg-gradient-to-br from-soft-mint to-light-green relative overflow-hidden">
        {isImageUrl ? (
          <img
            src={resolvedImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 will-change-transform parallax-zoom"
            loading="lazy"
            data-parallax
            data-zoom="0.08"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl lg:text-7xl">
            <span className="group-hover:scale-110 transition-transform duration-500">{image}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/35 via-transparent to-transparent opacity-70 pointer-events-none" />
        {date && (
          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 text-primary-dark text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full font-body">
            {date}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 lg:p-6">
        {location && (
          <p className="text-xs sm:text-sm text-accent-green font-medium mb-1 flex items-center gap-1 font-body">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        )}
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-dark mb-2 sm:mb-3 group-hover:text-primary-green transition-colors duration-300 font-heading">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-dark-green mb-3 sm:mb-4 line-clamp-2 font-body">{description}</p>
        <Link 
          to={id ? `/trip/${id}` : '#'}
          className="text-accent-green font-semibold hover:text-primary-green transition-colors duration-300 flex items-center gap-1 group-hover:gap-2 font-button"
        >
          Read More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
