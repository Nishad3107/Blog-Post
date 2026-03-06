import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { resolveSingleImage } from '../utils/imageFallback';

export default function FeaturedSlider({ trips }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {trips.map((trip, index) => {
            const image = resolveSingleImage(trip.location || trip.title, trip.image_url || trip.image);
            const isActive = index === selected;
            return (
              <div
                key={trip.id}
                className="flex-[0_0_80%] sm:flex-[0_0_65%] lg:flex-[0_0_45%] px-3"
              >
                <motion.button
                  type="button"
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="relative w-full h-72 sm:h-80 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl focus:outline-none"
                  animate={{ scale: isActive ? 1.02 : 0.96 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <img
                    src={image}
                    alt={trip.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-left text-white">
                    <h3 className="text-2xl sm:text-3xl font-heading drop-shadow">{trip.title}</h3>
                    <p className="text-white/80 text-sm sm:text-base font-body line-clamp-2">
                      {trip.description}
                    </p>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full backdrop-blur border border-white/20"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full backdrop-blur border border-white/20"
      >
        →
      </button>
    </div>
  );
}
