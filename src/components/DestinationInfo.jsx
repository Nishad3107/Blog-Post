import { motion } from 'framer-motion';
import BlogGallery from './BlogGallery';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function DestinationInfo({ info, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
        <div className="flex items-center justify-center h-28">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent-green border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-soft-mint">
        <p className="text-dark-green font-body text-center">Travel info unavailable right now.</p>
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-soft-mint space-y-10">
      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <p className="text-sm uppercase tracking-[0.2em] text-accent-green font-body">Destination Overview</p>
        <h3 className="text-2xl font-heading text-primary-dark mt-2">{info.location}</h3>
        <p className="text-dark-green font-body mt-3 leading-relaxed">{info.intro || 'Overview is not available yet.'}</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div>
          <h4 className="font-heading text-lg text-primary-dark mb-3">Top Places</h4>
          <div className="grid grid-cols-1 gap-3">
            {(info.top_places || []).map((place) => (
              <div key={place} className="p-3 rounded-xl bg-background-mint border border-soft-mint text-dark-green font-body">
                {place}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading text-lg text-primary-dark mb-3">Travel Tips</h4>
          <ul className="space-y-2">
            {(info.travel_tips || []).map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-dark-green font-body">
                <span className="text-accent-green mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <div>
          <h4 className="font-heading text-lg text-primary-dark mb-3">Top Attractions</h4>
          <ul className="space-y-2">
            {(info.attractions || []).map((spot) => (
              <li key={spot} className="flex items-start gap-2 text-dark-green font-body">
                <span className="text-accent-green mt-1">•</span>
                <span>{spot}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-sky-400 to-ocean-500 rounded-2xl shadow-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-4 font-heading">Current Weather</h4>
          <p className="text-3xl font-heading">{info.weather?.temperature || '--'}°C</p>
          <p className="text-white/80 font-body capitalize">{info.weather?.condition || 'Unavailable'}</p>
          <p className="text-white/80 font-body mt-3">Humidity: {info.weather?.humidity ?? '--'}%</p>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <h4 className="font-heading text-lg text-primary-dark mb-3">Photo Gallery</h4>
        <BlogGallery images={info.images || []} />
      </motion.div>
    </div>
  );
}
