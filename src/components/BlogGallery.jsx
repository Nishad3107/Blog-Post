import { useRef, useState } from 'react';

export default function BlogGallery({ images = [] }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollBy = (direction) => {
    if (!containerRef.current) return;
    const amount = direction === 'left' ? -360 : 360;
    containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!images.length) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy('left')}
        className="gallery-nav left-2"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy('right')}
        className="gallery-nav right-2"
      >
        →
      </button>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className="snap-start flex-shrink-0 w-[320px] h-[220px] rounded-xl shadow-lg overflow-hidden"
          >
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
