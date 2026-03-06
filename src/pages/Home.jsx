import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedCarousel from '../components/FeaturedCarousel';
import BlogCard from '../components/BlogCard';
import Destination3DSlider from '../components/Destination3DSlider';
import TravelGallery from '../components/TravelGallery';
import { useTrips } from '../hooks/useTrips';

const featuredTrips = [
  {
    id: 1,
    title: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
    description: 'Tropical paradise with stunning beaches, ancient temples, and lush rice terraces. Experience the magic of island life.',
    location: 'Bali, Indonesia',
    date: '7 days',
  },
  {
    id: 2,
    title: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    description: 'White-washed buildings, crystal-clear waters, and world-famous sunsets. Discover the jewel of the Aegean Sea.',
    location: 'Santorini, Greece',
    date: '5 days',
  },
  {
    id: 3,
    title: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
    description: 'Ancient temples, traditional gardens, and authentic Japanese culture. Walk through centuries of history.',
    location: 'Kyoto, Japan',
    date: '10 days',
  },
];

const travelStories = [
  {
    id: 1,
    title: 'A Week in Bali: My Ultimate Travel Guide',
    location: 'Indonesia',
    excerpt: 'From surfing in Canggu to exploring sacred temples, here is everything you need to know for your Bali adventure.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Hidden Gems of the Greek Islands',
    location: 'Greece',
    excerpt: 'Beyond the popular tourist spots lies untouched beauty. Discover secret beaches and local villages.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Solo Travel in Japan: A First Timer Experience',
    location: 'Japan',
    excerpt: 'My journey through Tokyo, Osaka, and Kyoto as a solo traveler. Tips, tricks, and unforgettable moments.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Chasing Waterfalls in Iceland',
    location: 'Iceland',
    excerpt: 'From Skogafoss to hidden glacial falls, Iceland is a dream for slow explorers.',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Road Trip Through the Alps',
    location: 'Switzerland',
    excerpt: 'Snow-capped passes, alpine lakes, and scenic routes made for cinematic drives.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Desert Nights in Morocco',
    location: 'Morocco',
    excerpt: 'Ride camels, sleep under the stars, and wake up to endless dunes.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
];

const destinations = [
  {
    title: 'Santorini',
    tagline: 'Aegean sunsets',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Kyoto',
    tagline: 'Ancient serenity',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Patagonia',
    tagline: 'Wild frontiers',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Iceland',
    tagline: 'Northern lights',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(3);
  const loaderRef = useRef(null);
  const { trips, loading: tripsLoading } = useTrips();

  useEffect(() => {
    if (!loaderRef.current) return;
    if (visibleCount >= travelStories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 3, travelStories.length));
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount]);

  return (
    <div className="relative z-10">
      <Layout>
        <Hero />

        <motion.section
          className="relative py-12 sm:py-16 lg:py-20 bg-background-mint/95 overflow-hidden"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Parallax speed={-6} className="absolute inset-0">
            <div className="absolute inset-0 parallax-layer opacity-25" style={{ backgroundImage: 'linear-gradient(180deg, rgba(234,251,243,0.85), rgba(186,243,216,0.6))' }} />
          </Parallax>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-primary-dark mb-2 sm:mb-3 text-3xl sm:text-4xl">Featured Trips</h2>
              <p className="text-dark-green text-base sm:text-lg font-body">Curated routes and cinematic getaways</p>
            </div>
            <FeaturedCarousel trips={featuredTrips} autoplay />
          </div>
        </motion.section>

        <motion.section
          className="relative py-12 sm:py-16 lg:py-20 bg-soft-mint/95 overflow-hidden"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Parallax speed={-8} className="absolute inset-0">
            <div className="absolute inset-0 parallax-layer opacity-20" style={{ backgroundImage: 'linear-gradient(180deg, rgba(234,251,243,0.75), rgba(138,233,189,0.5))' }} />
          </Parallax>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="font-heading text-primary-dark mb-2 sm:mb-3 text-3xl sm:text-4xl">Travel Stories</h2>
              <p className="text-dark-green text-base sm:text-lg font-body">Interactive stories with cinematic visuals</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {travelStories.slice(0, visibleCount).map((story) => (
                <motion.div
                  key={story.id}
                  variants={sectionVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <BlogCard {...story} />
                </motion.div>
              ))}
            </div>
            {visibleCount < travelStories.length && (
              <div className="mt-10 flex justify-center" ref={loaderRef}>
                <div className="loader-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          className="bg-background-mint py-12 sm:py-16 lg:py-20"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-primary-dark mb-2 sm:mb-3 text-3xl sm:text-4xl">Travel Gallery</h2>
              <p className="text-dark-green text-base sm:text-lg font-body">Interactive stories from across the globe</p>
            </div>
            <div className="mb-12">
              <Destination3DSlider destinations={destinations} />
            </div>
            <TravelGallery trips={trips} loading={tripsLoading} />
          </div>
        </motion.section>

        <motion.section
          className="bg-gradient-to-r from-primary-dark to-dark-green py-12 sm:py-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center text-white">
            <div>
              <h2 className="font-heading mb-4 text-3xl sm:text-4xl">About the Traveller</h2>
              <p className="text-light-green text-base sm:text-lg mb-4 font-body">
                I explore slow, document honestly, and share routes that make you feel like a local.
              </p>
              <p className="text-white/80 font-body mb-6">
                From alpine peaks to hidden seaside towns, I focus on places with soul and stories worth telling.
              </p>
              <button className="btn-primary btn-ripple">Meet the Traveller</button>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-white/10 blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                alt="Traveller"
                className="relative w-full h-72 sm:h-80 lg:h-96 object-cover rounded-[2rem] shadow-xl ring-1 ring-white/10"
                loading="lazy"
              />
            </div>
          </div>
        </motion.section>
      </Layout>
    </div>
  );
}
