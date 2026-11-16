import { Fragment, useEffect, useRef, useState } from 'react';
import { SectionAura } from './Atmosphere';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useVelocity,
  useInView,
  useReducedMotion as useFMMotionReduced,
} from 'framer-motion';
import { cn } from '../utils/cn';
import Counter from './components/Counter';

// ─────────────────────────────────────────────────────────────────────────────
// Motion kit — every section on the site animates through these primitives, so
// easing, distance and timing stay identical from the smallest icon to the
// largest band. Nothing here hard-codes a one-off transition.
// ─────────────────────────────────────────────────────────────────────────────

export const EASE = [0.16, 1, 0.3, 1];
export const EASE_SOFT = [0.22, 1, 0.36, 1];
export const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 };
export const SPRING_SOFT = { type: 'spring', stiffness: 220, damping: 28 };

const VIEW = { once: true, amount: 0.18, margin: '0px 0px -8% 0px' };

/* ── Reveal ─────────────────────────────────────────────────────────────── */
const DIRECTIONS = {
  up: { y: 26, x: 0 },
  down: { y: -26, x: 0 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
  none: { x: 0, y: 0 },
};

export function Reveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.7,
  blur = true,
  scale = false,
  className,
  once = true,
  amount,
  ...rest
}) {
  const reduced = useFMMotionReduced();
  const Tag = motion[as] ?? motion.div;
  const d = DIRECTIONS[direction] ?? DIRECTIONS.up;

  if (reduced) return <Tag className={className} {...rest}>{children}</Tag>;

  return (
    <Tag
      initial={{ opacity: 0, ...d, scale: scale ? 0.965 : 1, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ ...VIEW, once, ...(amount ? { amount } : {}) }}
      transition={{ duration, delay, ease: EASE }}
      className={cn('will-change-transform', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Stagger ────────────────────────────────────────────────────────────── */
export function Stagger({ children, className, step = 0.07, delay = 0, once = true, as = 'div', amount }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEW, once, ...(amount ? { amount } : {}) }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = 'div', distance = 22, blur = true, ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      variants={{
        hidden: { opacity: 0, y: distance, filter: blur ? 'blur(6px)' : 'blur(0px)' },
        show: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.62, ease: EASE },
        },
      }}
      className={cn('will-change-transform', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── SplitText — masked word-by-word headline reveal ────────────────────── */
export function SplitText({ text, as = 'span', className, delay = 0, step = 0.045, once = true }) {
  const reduced = useFMMotionReduced();
  const Tag = motion[as] ?? motion.span;
  const words = String(text).split(' ');

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEW, once }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em' }}
          >
            <motion.span
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { y: '110%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* a real space between inline-blocks keeps line-breaking on mobile */}
          {i !== words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ── Parallax — scroll-linked translation ───────────────────────────────── */
export function Parallax({ children, className, distance = 60, offset = ['start end', 'end start'], scaleTo }) {
  const ref = useRef(null);
  const reduced = useFMMotionReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, scaleTo ?? 1, 1]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y, scale }} className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

/* ── Magnetic — pointer-following hover ─────────────────────────────────── */
export function Magnetic({ children, strength = 0.28, className, as = 'div' }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const reduced = useFMMotionReduced();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const Tag = motion[as] ?? motion.div;

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <Tag
      ref={ref}
      onPointerEnter={() => {
        if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
      }}
      onPointerMove={(e) => {
        let r = rectRef.current;
        if (!r && ref.current) {
          r = ref.current.getBoundingClientRect();
          rectRef.current = r;
        }
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        rectRef.current = null;
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </Tag>
  );
}

/* ── Tilt — 3D card tilt on pointer ─────────────────────────────────────── */
export function Tilt({ children, className, max = 7, glare = true }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const reduced = useFMMotionReduced();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => {
        if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
      }}
      onPointerMove={(e) => {
        let r = rectRef.current;
        if (!r && ref.current) {
          r = ref.current.getBoundingClientRect();
          rectRef.current = r;
        }
        if (!r) return;
        mx.set((e.clientX - r.left) / Math.max(1, r.width));
        my.set((e.clientY - r.top) / Math.max(1, r.height));
      }}
      onPointerLeave={() => {
        rectRef.current = null;
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn('group/tilt relative will-change-transform', className)}
    >
      {children}
      {glare && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]"
        />
      )}
    </motion.div>
  );
}

/* ── HoverLift — the shared card hover behaviour ────────────────────────── */
export function HoverLift({ children, className, lift = -5, scale = 1.008, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      whileHover={{ y: lift, scale }}
      whileTap={{ scale: 0.995 }}
      transition={SPRING}
      className={cn('will-change-transform', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── CountNum — spring number, reused everywhere ────────────────────────── */
export function CountNum({ end, suffix = '', prefix = '', decimals = 0, className }) {
  return <Counter end={end} suffix={suffix} prefix={prefix} decimals={decimals} className={className} />;
}

/* ── Marquee — seamless, hover-pauses, skews with scroll velocity ───────── */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = '·',
  speed = 38,
  mask = true,
  skew = true,
}) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [skew ? -6 : 0, 0, skew ? 6 : 0]);
  const reduced = useFMMotionReduced();
  const track = [...items, ...items];

  return (
    <motion.div
      style={reduced ? undefined : { skewX }}
      className={cn('marquee-paused relative overflow-hidden', mask && 'mask-fade-x', className)}
    >
      <div
        className="flex w-max items-center animate-marquee"
        style={reduced ? undefined : { animationDuration: `${speed}s` }}
      >
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className={cn('flex items-center whitespace-nowrap', itemClassName)}>
            <span>{item}</span>
            <span className="mx-5 text-dim/60 sm:mx-7" aria-hidden="true">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Section shell ──────────────────────────────────────────────────────── */
const AURA_BY_ID = {
  demo: 'indigo',
  workflow: 'violet',
  features: 'cyan',
  testimonials: 'mint',
  security: 'indigo',
  pricing: 'violet',
  faq: 'cyan',
  lead: 'indigo',
  contact: 'indigo',
};

export function Section({ id, children, className, hairline = true, tone = 'base', bleed = false, aura }) {
  const sectionRef = useRef(null);
  const reduced = useFMMotionReduced();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.65, 1, 1, 0.65]);
  const y = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [24, 0, 0, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.985, 1, 1, 0.985]);

  const tone_ = aura ?? AURA_BY_ID[id] ?? 'indigo';
  return (
    <motion.section
      ref={sectionRef}
      id={id}
      style={reduced ? undefined : { opacity, y, scale }}
      className={cn(
        'isolate relative scroll-mt-24 overflow-clip py-16 sm:py-24 lg:py-28 will-change-transform',
        hairline && 'border-t border-line',
        tone === 'surface' && 'bg-white/[0.012]',
        className,
      )}
    >
      <SectionAura tone={tone_} flip={['workflow', 'pricing', 'contact'].includes(id)} />
      {bleed ? children : <div className="u-shell">{children}</div>}
    </motion.section>
  );
}

/* ── Section head — [index] badge · split headline · subtitle ───────────── */
export function SectionHead({ index, badge, title, titleAccent, subtitle, className, align = 'left', anchor3d, children }) {
  return (
    <div className={cn('relative mb-10 sm:mb-14', align === 'center' && 'text-center', className)}>
      {/* placeholder the WebGL scene pins a 3D object to (see src/three) */}
      {anchor3d && (
        <div
          data-3d={anchor3d}
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 top-1/2 hidden h-[300px] w-[300px] -translate-y-1/2 2xl:right-0 min-[1360px]:block"
        />
      )}
      <Reveal className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>
        {index && <span className="label-mono text-accent-soft">{index}</span>}
        {index && <span className="h-px w-7 bg-line-strong" aria-hidden="true" />}
        {badge && <span className="tag-bracket text-dim">{badge}</span>}
      </Reveal>

      <h2 className="h-section mt-5 max-w-4xl text-[clamp(1.85rem,4.2vw,3.35rem)] text-white">
        <SplitText text={title} />{' '}
        {titleAccent && <span className="serif text-accent-soft">{titleAccent}</span>}
      </h2>

      {subtitle && (
        <Reveal delay={0.12} className="mt-5 max-w-2xl">
          <p className={cn('text-[15px] leading-relaxed text-muted sm:text-base', align === 'center' && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}

      {children && <Reveal delay={0.16} className="mt-8">{children}</Reveal>}
    </div>
  );
}

/* ── Button — the one CTA style, with hover/tap motion baked in ─────────── */
export function ActionButton({
  children,
  to,
  href,
  variant = 'solid',
  size = 'md',
  onClick,
  className,
  icon,
  iconRight,
  ...rest
}) {
  const ref = useRef(null);
  const [ripple, setRipple] = useState(null);

  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-colors duration-300 will-change-transform';
  const sizes = {
    sm: 'px-4 py-2 text-[12.5px]',
    md: 'px-5 py-3 text-[13.5px]',
    lg: 'px-6 py-3.5 text-[14px]',
  };
  const variants = {
    solid: 'bg-white text-[var(--base)] hover:bg-white/90',
    accent: 'bg-primary text-white hover:bg-[#6b89ff] shadow-[0_16px_50px_-18px_rgba(var(--a1-rgb),0.9)]',
    outline: 'border border-line-strong text-white hover:bg-white/[0.06]',
    ghost: 'text-muted hover:text-white',
  };

  const content = (
    <>
      {ripple && (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size, translateX: '-50%', translateY: '-50%' }}
        />
      )}
      {icon && <motion.span className="shrink-0" whileHover={{ rotate: 12, scale: 1.12 }}>{icon}</motion.span>}
      <span className="relative">{children}</span>
      {iconRight && (
        <motion.span className="shrink-0" variants={{ rest: { x: 0 }, hover: { x: 3 } }}>
          {iconRight}
        </motion.span>
      )}
    </>
  );

  const handleDown = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setRipple({
      id: Date.now(),
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      size: Math.max(r.width, r.height) * 1.6,
    });
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      to={to}
      onPointerDown={handleDown}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING}
      initial="rest"
      whileFocus="hover"
      className={cn(base, sizes[size], variants[variant], className)}
      data-cursor="link"
      {...rest}
    >
      {content}
    </Tag>
  );
}

/* ── Scroll progress rail ───────────────────────────────────────────────── */
export function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-soft to-mint"
    />
  );
}

/* ── In-view helper for non-motion children (canvas/loops) ──────────────── */
export function useLazyInView(options = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2, ...options });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);
  return [ref, inView, mounted];
}

/* Re-exported so sections can pull every motion tool from one place. */
export { ScrollBand, ScrollZoom, SectionAura, ScrollGlowRail } from './Atmosphere';
