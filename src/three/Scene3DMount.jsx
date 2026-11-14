import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../motion/hooks/useReducedMotion';

// three.js is a separate chunk, fetched after the page is already interactive.
const Scene3D = lazy(() => import('./Scene3D'));
const Background3D = lazy(() => import('./Background3D'));

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('[3D scene disabled]', err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Home page only, desktop widths only, and never under reduced-motion. */
export default function Scene3DMount() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, []);

  if (pathname !== '/' || reduced || !ready) return null;
  return (
    <>
      {/* scroll-morphing particle background — every width, home page only */}
      <Boundary>
        <Suspense fallback={null}>
          <Background3D small={!wide} />
        </Suspense>
      </Boundary>
      {/* pinned foreground objects — desktop only */}
      {wide && (
        <Boundary>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Boundary>
      )}
    </>
  );
}
