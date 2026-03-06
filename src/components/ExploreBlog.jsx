export default function ExploreBlog({ location, intro, topPlaces = [] }) {
  const bestTime = 'Spring and early autumn offer the most pleasant weather for exploring.';
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-soft-mint space-y-6">
      <h2 className="font-heading text-2xl text-primary-dark">Exploring {location}</h2>
      <section>
        <h3 className="font-heading text-lg text-primary-dark mb-2">Overview</h3>
        <p className="text-dark-green font-body leading-relaxed">
          {intro || `Discover the highlights of ${location} with this curated travel guide.`}
        </p>
      </section>
      <section>
        <h3 className="font-heading text-lg text-primary-dark mb-2">Top Places to Visit</h3>
        <ul className="space-y-2">
          {topPlaces.slice(0, 5).map((place) => (
            <li key={place} className="flex items-start gap-2 text-dark-green font-body">
              <span className="text-accent-green mt-1">•</span>
              <span>{place}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="font-heading text-lg text-primary-dark mb-2">Travel Tips</h3>
        <p className="text-dark-green font-body">Plan early mornings, carry essentials, and explore local neighborhoods.</p>
      </section>
      <section>
        <h3 className="font-heading text-lg text-primary-dark mb-2">Best Time to Visit</h3>
        <p className="text-dark-green font-body">{bestTime}</p>
      </section>
    </div>
  );
}
