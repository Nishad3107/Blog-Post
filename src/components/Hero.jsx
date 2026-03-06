import { Link, useNavigate } from 'react-router-dom';
import { Parallax } from 'react-scroll-parallax';
import { motion } from 'framer-motion';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-accent-green/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-light-green/30 blur-3xl" />
      <div className="absolute top-16 right-1/3 h-40 w-40 rounded-full bg-base-green/20 blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
          <motion.div
            className="text-white"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="text-base-green font-body text-sm sm:text-base tracking-[0.25em] uppercase mb-4">
              Stories, adventures and unforgettable journeys
            </p>
            <h1 className="font-hero text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Explore the World
              <br />
              Through My Travel Diaries
            </h1>
            <p className="text-light-green text-lg sm:text-xl mt-4 font-body">
              Cinematic travel notes, curated routes, and honest guides for explorers.
            </p>
            <p className="text-white/80 mt-4 max-w-xl font-body">
              Follow slow travel stories and destination insights designed to make every trip feel personal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="btn-primary btn-ripple"
              >
                View Trips
              </button>
              <Link to="/add-story" className="btn-secondary btn-ripple">
                Share Your Story
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4 text-light-green/90 text-sm font-body">
              <span className="uppercase tracking-[0.3em]">Follow</span>
              <div className="flex items-center gap-3">
                <a className="nav-link-underline hover:text-white transition-colors" href="#">Instagram</a>
                <span className="text-white/40">/</span>
                <a className="nav-link-underline hover:text-white transition-colors" href="#">YouTube</a>
                <span className="text-white/40">/</span>
                <a className="nav-link-underline hover:text-white transition-colors" href="#">Threads</a>
              </div>
            </div>
          </motion.div>

          <Parallax speed={-8} rotate={[0, -2]}>
            <div className="relative lg:translate-x-8 lg:translate-y-6">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-accent-green/20 blur-2xl" />
              <motion.img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
                alt="Mountain travel"
                className="relative w-full h-[360px] sm:h-[420px] lg:h-[520px] object-cover rounded-[2.5rem] shadow-2xl ring-1 ring-white/10 float-slow"
                loading="lazy"
                whileHover={{ y: -6, rotate: 0.5 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              />
              <div className="absolute -bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 text-primary-dark shadow-lg">
                <p className="text-sm font-body">Next journey: Patagonia</p>
              </div>
            </div>
          </Parallax>
        </div>

        <div className="mt-12 flex flex-col items-center text-white/80 font-body">
          <span className="text-sm uppercase tracking-[0.25em]">Scroll to Explore</span>
          <div className="mt-3 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center animate-bounce-slow">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
