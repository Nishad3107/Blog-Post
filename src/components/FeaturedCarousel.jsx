import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import TripCard from './TripCard';

export default function FeaturedCarousel({ trips = [], autoplay = true }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplay) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3500);
    return () => clearInterval(interval);
  }, [emblaApi, autoplay]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {trips.map((trip, index) => (
            <div
              className={`embla__slide ${index === selected ? 'is-active' : ''}`}
              key={trip.id}
            >
              <TripCard {...trip} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {trips.map((trip, index) => (
          <button
            key={trip.id}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === selected ? 'bg-accent-green w-5' : 'bg-light-green/50'}`}
            aria-label={`Go to ${trip.title}`}
          />
        ))}
      </div>
    </div>
  );
}
