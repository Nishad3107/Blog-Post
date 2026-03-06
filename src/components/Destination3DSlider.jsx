import { useState } from 'react';

export default function Destination3DSlider({ destinations = [] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="slider-3d">
      {destinations.map((item, index) => {
        const offset = index - active;
        return (
          <button
            key={item.title}
            className="slider-3d-card"
            style={{
              transform: `translateX(${offset * 40}%) scale(${index === active ? 1 : 0.85}) rotateY(${offset * -12}deg)`,
              zIndex: 10 - Math.abs(offset),
              opacity: Math.abs(offset) > 2 ? 0 : 1,
            }}
            onClick={() => setActive(index)}
            aria-label={`View ${item.title}`}
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="slider-3d-caption">
              <h3 className="font-heading text-white">{item.title}</h3>
              <p className="text-sm text-light-green font-body">{item.tagline}</p>
            </div>
          </button>
        );
      })}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-3">
        {destinations.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setActive(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === active ? 'bg-accent-green w-5' : 'bg-light-green/40'}`}
            aria-label={`Select ${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}
