import { useEffect, useRef, useState } from 'react';
import { animate, motion, useScroll, useSpring, useTransform, useReducedMotion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { cn } from '../utils/cn';

/* ─────────────────────────────────────────────────────────────────────────
   Roller3D — a 3D coverflow "roller": cards sit on a curved arc in Z space,
   the arc advances with the scroll (or with a drag), and each card rotates
   and scales by its distance from centre. Transform-only, so it stays smooth.
   ───────────────────────────────────────────────────────────────────────── */
function Card3D({ index, progress, width, gap, children }) {
  const x = useTransform(progress, (v) => `calc(${(index - v) * width * gap}px - 50%)`);
  const z = useTransform(progress, (v) => `${-Math.abs(index - v) * 200}px`);
  const rotateY = useTransform(progress, (v) => `${Math.max(-54, Math.min(54, -(index - v) * 27))}deg`);
  const scale = useTransform(progress, (v) => Math.max(0.7, 1 - Math.abs(index - v) * 0.09));
  const opacity = useTransform(progress, (v) => Math.max(0.08, 1 - Math.abs(index - v) * 0.42));
  const zIndex = useTransform(progress, (v) => String(Math.round(200 - Math.abs(index - v) * 10)));

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width,
        x,
        y: '-50%',
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

export function Roller3D({ items, renderItem, className, height = 420, gap = 1 }) {
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(300);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useMotionValue(0);
  const bias = useMotionValue(0);
  const dragRef = useRef(null);
  const last = Math.max(0, items.length - 1);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'start 0.25'] });
  const rawProgress = useTransform(scrollYProgress, [0, 1], [0, last]);
  /* The scroll target is snapped to a card slot, then a spring carries the
     roller between slots. Cards therefore travel continuously while the page
     moves but always come to rest exactly on one card — no two cards ever
     sit on top of each other at the same opacity. */
  const slot = useTransform(rawProgress, (v) => Math.round(v));
  const smooth = useSpring(slot, { stiffness: 90, damping: 26, mass: 0.5 });
  const progress = useTransform([smooth, bias, dragOffset], ([a, b, c]) =>
    Math.max(0, Math.min(last, a + b + c)),
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(250, Math.min(340, entry.contentRect.width * 0.3)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(progress, 'change', (v) => {
    const idx = Math.round(Math.max(0, Math.min(last, v)));
    if (idx !== active) setActive(idx);
  });

  /* Scrolling takes the wheel back from a drag. */
  useMotionValueEvent(slot, 'change', () => {
    if (bias.get() !== 0) animate(bias, 0, { duration: 0.45, ease: 'easeOut' });
  });

  const onPointerDown = (e) => {
    if (reduced) return;
    e.preventDefault();
    dragRef.current = { x: e.clientX, base: dragOffset.get() };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    dragOffset.set(dragRef.current.base - dx / 240);
  };
  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    const to = Math.round(dragOffset.get());
    if (to === 0) {
      animate(dragOffset, 0, { type: 'spring', stiffness: 260, damping: 30 });
      return;
    }
    // ease onto the nearest slot, then fold that slot into the drag bias so
    // the wheel stays where the user spun it (offset resets to 0 in the same frame)
    animate(dragOffset, to, {
      type: 'spring',
      stiffness: 260,
      damping: 30,
      onComplete: () => {
        bias.set(Math.max(-last, Math.min(last, bias.get() + to)));
        dragOffset.set(0);
      },
    });
  };

  return (
    <div
      ref={wrapRef}
      className={cn('relative select-none touch-pan-y [&_*]:select-none', className)}
      style={{ height, perspective: 1600, perspectiveOrigin: '50% 50%' }}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      role="group"
      aria-label="3D carousel"
    >
      <div
        className="pointer-events-none absolute inset-x-10 bottom-2 h-24 rounded-[50%] blur-2xl"
        style={{ background: 'radial-gradient(closest-side, rgba(var(--a1-rgb),0.16), transparent)' }}
        aria-hidden="true"
      />

      <div
        className={cn('absolute inset-0', dragging ? 'cursor-grabbing' : 'cursor-grab')}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {items.map((item, i) => (
          <Card3D key={i} index={i} progress={progress} width={width} gap={gap}>
            {renderItem(item, i, i === active)}
          </Card3D>
        ))}
      </div>

      <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {items.map((_, i) => (
          <span
            key={i}
            className={cn('h-1 rounded-full transition-all duration-300', i === active ? 'w-5 bg-accent' : 'w-1.5 bg-white/20')}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Band3D — the oversized word strip, but rolling on a drum: the strip is
   rotated in X inside a perspective box and travels with the scroll.
   ───────────────────────────────────────────────────────────────────────── */
export function Band3D({ words, className, size = 'clamp(2rem, 6vw, 4.6rem)', reverse = false }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const from = reverse ? '-40%' : '-6%';
  const to = reverse ? '-6%' : '-40%';
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [26, 10, -14]);

  const strip = [...words, ...words, ...words];

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden border-y border-line/70 py-4', className)}
      style={{ perspective: 900 }}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(var(--a1-rgb),0.06), transparent 55%)' }}
      />
      <motion.div
        style={{ rotateX: reduced ? 0 : rotateX, transformStyle: 'preserve-3d' }}
        className="origin-center"
      >
        <motion.div className="flex w-max items-center gap-8 will-change-transform sm:gap-12" style={{ x: reduced ? 0 : x }}>
          {strip.map((word, i) => (
            <span key={`${word}-${i}`} className="flex shrink-0 items-center gap-8 sm:gap-12">
              <span className="font-semibold uppercase tracking-[-0.02em] outline-type" style={{ fontSize: size, lineHeight: 1 }}>
                {word}
              </span>
              <span className="h-1.5 w-1.5 rotate-45 bg-accent/70" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Cube3D — a slowly rotating wireframe cube. Pure CSS 3D, used as an
   accent artifact where a section needs a focal object.
   ───────────────────────────────────────────────────────────────────────── */
export function Cube3D({ size = 120, className, speed = 26 }) {
  const reduced = useReducedMotion();
  const half = size / 2;
  const faces = [
    { t: `translateZ(${half}px)` },
    { t: `rotateY(180deg) translateZ(${half}px)` },
    { t: `rotateY(90deg) translateZ(${half}px)` },
    { t: `rotateY(-90deg) translateZ(${half}px)` },
    { t: `rotateX(90deg) translateZ(${half}px)` },
    { t: `rotateX(-90deg) translateZ(${half}px)` },
  ];

  return (
    <div className={cn('pointer-events-none', className)} style={{ width: size, height: size, perspective: 800 }} aria-hidden="true">
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduced ? undefined : { rotateX: [16, 16, -8, 16], rotateY: [0, 360] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-[10px] border border-accent/25"
            style={{
              transform: f.t,
              background: 'linear-gradient(135deg, rgba(var(--a1-rgb),0.10), rgba(255,255,255,0.015))',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
