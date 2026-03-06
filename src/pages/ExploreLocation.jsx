import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ExploreWeatherWidget from '../components/ExploreWeatherWidget';
import ExploreGallery from '../components/ExploreGallery';
import ExploreBlog from '../components/ExploreBlog';
import { buildExploreData } from '../utils/exploreApi';

function titleCase(value) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ExploreLocation() {
  const { location } = useParams();
  const decodedLocation = useMemo(() => decodeURIComponent(location || ''), [location]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decodedLocation) return;

    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const payload = await buildExploreData(decodedLocation);
        if (isMounted) {
          setData({
            location: payload.location || titleCase(decodedLocation),
            intro: payload.intro,
            topPlaces: payload.topPlaces || [],
            weather: payload.weather || null,
            images: payload.images || [],
            thumbnail: payload.thumbnail || '',
          });
        }
      } catch (err) {
        if (isMounted) setError('Destination not found. Try another location.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [decodedLocation]);

  return (
    <Layout>
      <div className="bg-background-mint min-h-screen">
        {loading ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
            <div className="h-64 sm:h-80 rounded-3xl bg-white/40 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 rounded-2xl bg-white/40 animate-pulse" />
              <div className="h-48 rounded-2xl bg-white/40 animate-pulse" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-white/40 animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-3xl font-heading text-primary-dark mb-4">{error}</h1>
            <p className="text-dark-green font-body">Try a different destination name.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-dark-green to-primary-green text-white">
              {data.images?.[0] && (
                <img
                  src={data.images[0]}
                  alt={data.location}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
              )}
              <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16">
                <p className="text-sm uppercase tracking-[0.3em] text-base-green">Explore</p>
                <h1 className="font-hero text-4xl sm:text-5xl lg:text-6xl mt-3">{data.location}</h1>
                <p className="text-white/80 mt-4 max-w-2xl font-body">
                  {data.intro || `Plan your next journey to ${data.location} with smart insights.`}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-soft-mint">
                <h2 className="font-heading text-2xl text-primary-dark mb-4">Destination Overview</h2>
                <p className="text-dark-green font-body leading-relaxed">
                  {data.intro || `Discover the highlights of ${data.location}.`}
                </p>
              </div>
              <ExploreWeatherWidget weather={data.weather} />
            </section>

            <section className="bg-white rounded-2xl shadow-lg p-8 border-2 border-soft-mint">
              <h2 className="font-heading text-2xl text-primary-dark mb-4">Top Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.topPlaces.map((place) => (
                  <div key={place} className="p-4 rounded-xl bg-background-mint text-dark-green font-body">
                    {place}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl text-primary-dark mb-4">Travel Gallery</h2>
              <ExploreGallery images={data.images} />
            </section>

            <ExploreBlog location={data.location} intro={data.intro} topPlaces={data.topPlaces} />
          </div>
        )}
      </div>
    </Layout>
  );
}
