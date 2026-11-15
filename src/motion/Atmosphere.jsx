import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '../utils/cn';

/* ─────────────────────────────────────────────────────────────────────────
   Palette — every ambient light in the site comes from these four hues.
   ───────────────────────────────────────────────────────────────────────── */
const HUES = {
  indigo: { core: 'rgba(var(--a1-rgb),', mid: 'rgba(var(--a1-soft-rgb),' },
  violet: { core: 'rgba(var(--a2-rgb),', mid: 'rgba(var(--a1-rgb),' },
  cyan: { core: 'rgba(var(--a2-rgb),', mid: 'rgba(var(--a1-soft-rgb),' },
  mint: { core: 'rgba(127,224,196,', mid: 'rgba(52,211,153,' },
};const hue = (tone, a) => {
  const h = HUES[tone] ?? HUES.indigo;
  return `radial-gradient(circle, ${h.core}${a}) 0%, ${h.mid}${a * 0.5}) 40%, transparent 72%)`;
};

/* ─────────────────────────────────────────────────────────────────────────
   Atmosphere — a fixed scene behind the whole site.

   Performance notes: every moving layer is a compositor-only CSS transform
   animation (no JS per frame, no filters, no blend modes), the static layers
   are painted once, and nothing here re-rasterises on scroll.
   ───────────────────────────────────────────────────────────────────────── */
export function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--base)]" style={{ contain: "paint" }}
    >
      {/* static base wash — painted once */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, rgba(var(--a1-rgb),0.14) 0%, rgba(7,8,10,0) 62%), radial-gradient(90% 60% at 92% 18%, rgba(var(--a2-rgb),0.10) 0%, rgba(7,8,10,0) 60%)',
        }}
      />

      {/* bloom 1 — indigo crown */}
      <div
        className="absolute left-1/2 top-[-26%] h-[62vh] w-[120vw] -translate-x-1/2 will-change-transform"
        style={{ background: hue('indigo', 0.42), animation: 'bloom-a 26s ease-in-out infinite' }}
      />

      {/* bloom 2 — violet, lower left */}
      <div
        className="absolute -left-[12%] top-[34%] h-[46vh] w-[52vw] will-change-transform"
        style={{ background: hue('violet', 0.34) }}
      />

      {/* bloom 3 — cyan, right */}
      <div
        className="absolute -right-[10%] top-[12%] h-[40vh] w-[40vw] will-change-transform"
        style={{ background: hue('cyan', 0.2) }}
      />

      {/* bloom 4 — mint near the end of the page */}
      <div
        className="absolute bottom-[-12%] left-1/2 h-[40vh] w-[64vw] -translate-x-1/2"
        style={{ background: hue('mint', 0.12), opacity: 0.8 }}
      />

      {/* hairline grid — static, masked */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 55% at 50% 18%, #000 0%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 55% at 50% 18%, #000 0%, transparent 76%)',
        }}
      />

      <MouseAura />

      {/* vignette + grain */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 42%, rgba(4,5,7,0.8) 100%)' }}
      />
      <div className="absolute inset-0 grain" />
    </div>
  );
}

/* Pointer light — transform-only, pointer-move driven, desktop only. */
function MouseAura() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.3);
  const sx = useSpring(x, { stiffness: 80, damping: 24, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 80, damping: 24, mass: 0.7 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        x.set(e.clientX / window.innerWidth);
        y.set(e.clientY / window.innerHeight);
        raf = null;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y, reduced]);

  const left = useTransform(sx, (v) => `${v * 100}%`);
  const top = useTransform(sy, (v) => `${v * 100}%`);

  if (!enabled) return null;

  return (
    <motion.div
      className="absolute h-[36vw] w-[36vw] rounded-full will-change-transform"
      style={{
        left,
        top,
        x: '-50%',
        y: '-50%',
        background: 'radial-gradient(circle, rgba(120,146,255,0.12) 0%, rgba(var(--a2-rgb),0.06) 45%, transparent 70%)',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SectionAura — local colour inside a section. Two soft blooms that slide at
   different rates as the section crosses the viewport.
   ───────────────────────────────────────────────────────────────────────── */
export function SectionAura({ tone = 'indigo', flip = false, intensity = 1, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const a = useTransform(scrollYProgress, [0, 1], [90, -110]);
  const b = useTransform(scrollYProgress, [0, 1], [-60, 80]);

  return (
    <div ref={ref} className={cn('pointer-events-none absolute inset-0 -z-[1] overflow-hidden', className)} aria-hidden="true">
      <motion.div
        className="aura will-change-transform"
        style={{
          y: reduced ? 0 : a,
          top: flip ? '52%' : '-14%',
          left: flip ? '-16%' : '6%',
          width: '46vw',
          height: '46vw',
          maxWidth: 620,
          maxHeight: 620,
          background: hue(tone, 0.2 * intensity),
        }}
      />
      <motion.div
        className="aura will-change-transform"
        style={{
          y: reduced ? 0 : b,
          bottom: flip ? '-12%' : '-18%',
          right: flip ? '-8%' : '-14%',
          width: '38vw',
          height: '38vw',
          maxWidth: 520,
          maxHeight: 520,
          background: hue(flip ? 'indigo' : 'violet', 0.15 * intensity),
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ScrollBand — an oversized word strip that travels horizontally as the
   page scrolls through it. Transform only.
   ───────────────────────────────────────────────────────────────────────── */
export function ScrollBand({
  words,
  className,
  reverse = false,
  size = 'clamp(2.2rem, 7vw, 5.5rem)',
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const from = reverse ? '-38%' : '-8%';
  const to = reverse ? '-8%' : '-38%';
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);

  const strip = [...words, ...words, ...words];

  return (
    <div ref={ref} className={cn('relative overflow-hidden border-y border-line/70 py-3', className)} aria-hidden="true">
      <motion.div className="flex w-max items-center gap-6 will-change-transform sm:gap-10" style={{ x: reduced ? 0 : x }}>
        {strip.map((word, i) => (
          <span key={`${word}-${i}`} className="flex shrink-0 items-center gap-6 sm:gap-10">
            <span className="font-semibold uppercase tracking-[-0.02em] outline-type" style={{ fontSize: size, lineHeight: 1 }}>
              {word}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ScrollZoom — content that settles into place as it enters (scale + y).
   ───────────────────────────────────────────────────────────────────────── */
export function ScrollZoom({ children, className, from = 0.94, y = 40 }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.4'] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const ty = useTransform(scrollYProgress, [0, 1], [y, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 1]);

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={reduced ? undefined : { scale, y: ty, opacity }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   ScrollGlowRail — gradient line on the right edge that fills with progress.
   ───────────────────────────────────────────────────────────────────────── */
export function ScrollGlowRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed right-0 top-0 z-40 hidden h-screen w-[2px] origin-top bg-gradient-to-b from-accent via-violet to-mint/70 lg:block"
      style={{ scaleY }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   IntroCurtain — one-shot page-load reveal. Skipped under reduced motion.
   ───────────────────────────────────────────────────────────────────────── */
export function IntroCurtain({ label = 'LEADNEX.AI' }) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (reduced) {
      setOpen(false);
      return;
    }
    const t = setTimeout(() => setOpen(false), 780);
    return () => clearTimeout(t);
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="curtain"
          className="pointer-events-none fixed inset-0 z-[120] flex flex-col items-center justify-center gap-5 bg-[var(--base)]"
          exit={{ y: '-101%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5"
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-[9px] bg-primary" />
              <span className="absolute inset-[3px] rounded-[6px] border border-white/40" />
              <motion.span
                className="relative h-[5px] w-[5px] rounded-full bg-white"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">{label}</span>
          </motion.div>

          <div className="h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-violet to-mint"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Kept for sections that want a velocity-driven pulse. */
export function useScrollSpeed() {
  const y = useMotionValue(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => {
    y.set(Math.min(1, Math.abs(v - y.get()) / 60));
  });
  return y;
}
