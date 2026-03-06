import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ParallaxProvider } from 'react-scroll-parallax';
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import AddStory from './pages/AddStory';
import About from './pages/About';
import ExploreLocation from './pages/ExploreLocation';
import IntroLoader from './components/IntroLoader';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/explore/:location" element={<ExploreLocation />} />
          <Route path="/add-story" element={<AddStory />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ParallaxProvider>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="intro-loader"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <IntroLoader />
            </motion.div>
          ) : (
            <AppRoutes />
          )}
        </AnimatePresence>
      </ParallaxProvider>
    </Router>
  );
}

export default App;
