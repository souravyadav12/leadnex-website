import { Component, lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../motion/hooks/useReducedMotion';

// LeadnexBuildingScene is loaded as a separate chunk
const LeadnexBuildingScene = lazy(() => import('./LeadnexBuildingScene'));

class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('[3D building scene disabled]', err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Scene3DMount — Home page only.
 * Renders the persistent 3D corporate skyscraper headquarters canvas behind all HTML content.
 */
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
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  if (pathname !== '/' || !ready) return null;

  return (
    <Boundary>
      <Suspense fallback={null}>
        <LeadnexBuildingScene small={!wide} reduced={reduced} />
      </Suspense>
    </Boundary>
  );
}
