import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SmoothScroll, { scrollToTop, smoothScrollTo } from './motion/SmoothScroll';
import { Atmosphere, ScrollGlowRail, IntroCurtain } from './motion/Atmosphere';
import { ScrollProgressRail, EASE } from './motion/kit';
import Scene3DMount from './three/Scene3DMount';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

/** Route changes always land at the top (or on the hash target). */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash;
      const timer = setTimeout(() => smoothScrollTo(id, -80), 60);
      return () => clearTimeout(timer);
    }
    scrollToTop();
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen text-text-primary">
      <IntroCurtain />
      <Atmosphere />
      <SmoothScroll />
      <ScrollProgressRail />
      <ScrollGlowRail />
      <ScrollManager />
      <Scene3DMount />
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
