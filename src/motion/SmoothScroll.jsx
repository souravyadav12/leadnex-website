import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — Lenis-driven inertial scrolling synchronized with GSAP ScrollTrigger.
 *
 * Ticked by GSAP ticker for 0 frame lag.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    // Immediately update ScrollTrigger when Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Let GSAP's RAF drive Lenis for zero-lag lockstep frame synchronization
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (e) => {
      const anchor = e.target.closest?.('a[href*="#"]');
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      const id = url.hash;
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -76, duration: 1.2 });
      window.history.replaceState(null, '', id);
    };

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  return null;
}

/** Scroll to an element id, using Lenis when available. */
export function smoothScrollTo(id, offset = -76) {
  const el = typeof id === 'string' ? document.querySelector(id) : id;
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/** Scroll to top on route change (new pages always start at the masthead). */
export function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
