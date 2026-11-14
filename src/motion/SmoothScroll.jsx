import { useEffect } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './hooks/useReducedMotion';

/**
 * SmoothScroll — Lenis-driven inertial scrolling.
 *
 * Lenis v1 scrolls the window natively, so framer-motion's useScroll,
 * IntersectionObserver, sticky positioning and anchor links all keep working.
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
      lerp: 0.09,
    });

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Expose for programmatic scrolls (nav anchors, "back to top").
    window.__lenis = lenis;

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
      cancelAnimationFrame(raf);
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
