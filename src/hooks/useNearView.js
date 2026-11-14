import { useEffect, useRef, useState } from 'react';

/**
 * True while the element is within `margin` of the viewport. Used to pause the
 * live widgets' timers when they are off screen, so a page full of "working"
 * demos doesn't keep re-rendering while nobody is looking at them.
 */
export function useNearView(margin = '220px') {
  const ref = useRef(null);
  const [near, setNear] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, near];
}
