import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Play, ShieldCheck, Lock, FileCheck, Phone, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { hero } from '../data/site';
import { Reveal, SplitText, Marquee, ActionButton, CountNum, Magnetic, EASE, SPRING_SOFT } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';
import { useNearView } from '../hooks/useNearView';

/* ── Live waveform ──────────────────────────────────────────────────────── */
function Waveform({ bars = 30, className }) {
  return (
    <div className={cn('flex h-8 items-end gap-[3px]', className)} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="h-full w-[2px] origin-bottom rounded-full bg-gradient-to-t from-accent/40 to-accent-soft"
          style={{ transformOrigin: 'bottom' }}
          animate={{ scaleY: [0.18 + (i % 5) * 0.08, 0.45 + Math.abs(Math.sin(i * 1.7)) * 0.55, 0.18 + (i % 5) * 0.08] }}
          transition={{
            duration: 1.1 + (i % 6) * 0.14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.035,
          }}
        />
      ))}
    </div>
  );
}

/* ── Cycling transcript ─────────────────────────────────────────────────── */
function LiveTranscript() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % hero.transcript.length), 2600);
    return () => clearInterval(id);
  }, []);

  const line = hero.transcript[index];

  return (
    <div className="relative min-h-[3.6rem]">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex gap-2.5"
        >
          <span
            className={cn(
              'mt-[2px] h-fit shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider',
              line.role === 'ai' ? 'bg-accent/20 text-accent-soft' : 'bg-white/10 text-muted',
            )}
          >
            {line.role === 'ai' ? 'AI' : 'User'}
          </span>
          <p className="text-[12px] leading-relaxed text-white/70">{line.text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Floating metric chip ───────────────────────────────────────────────── */
function FloatCard({ label, value, icon: Icon, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className={cn('absolute z-20', className)}
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay }}
        className="glass flex items-center gap-2.5 rounded-xl px-3 py-2 shadow-xl shadow-black/40"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15">
          <Icon className="h-3 w-3 text-accent-soft" strokeWidth={2.25} />
        </span>
        <div>
          <div className="text-[9px] uppercase tracking-wider text-dim">{label}</div>
          <div className="font-mono text-[12px] font-bold text-white">{value}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ── Live dashboard state: values drift the way a real console would ─────── */
function useLiveMetrics(base) {
  const [values, setValues] = useState(() => base.map((b) => b.value));
  const [elapsed, setElapsed] = useState(0);
  const [box, near] = useNearView();

  useEffect(() => {
    if (!near) return;
    const drift = setInterval(() => {
      setValues((prev) =>
        prev.map((v, i) => {
          if (i === 0) return Math.max(base[0].value - 18, Math.min(base[0].value + 18, v + Math.round((Math.random() - 0.5) * 6)));
          return v + 1;
        }),
      );
    }, 2600);
    const clock = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(drift);
      clearInterval(clock);
    };
  }, [base, near]);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  return { values, clock, box };
}

/* Number that springs to a new value instead of jumping */
function LiveNumber({ value, decimals = 0, className }) {
  const [display, setDisplay] = useState(value);
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 120, damping: 20 });
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  useEffect(() => spring.on('change', (v) => setDisplay(v)), [spring]);
  return <span className={className}>{display.toFixed(decimals)}</span>;
}

/* ── Dashboard panel ────────────────────────────────────────────────────── */
function DashboardPanel() {
  const ref = useRef(null);
  const { values: liveValues, clock, box: liveBox } = useLiveMetrics(hero.dashboard.metrics);
  const [statusIdx, setStatusIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % 3), 5200);
    return () => clearInterval(id);
  }, []);
  const status = ['Qualifying', 'Booked', 'Follow-up'][statusIdx];
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 20 });
  const sy = useSpring(my, { stiffness: 140, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);

  const { scrollYProgress } = useScroll();
  const panelY = useTransform(scrollYProgress, [0, 0.35], [0, -70]);
  const panelScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.93]);
  const panelRotate = useTransform(scrollYProgress, [0, 0.35], [0, -1.6]);
  const panelFade = useTransform(scrollYProgress, [0, 0.4], [1, 0.55]);

  return (
    <motion.div
      ref={liveBox}
      initial={{ opacity: 0, x: 26, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
      style={{ y: panelY, scale: panelScale, rotate: panelRotate, opacity: panelFade }}
      className="relative mx-auto w-full max-w-lg will-change-transform lg:ml-auto lg:mr-0"
    >
      <div
        className="pointer-events-none absolute -inset-10 rounded-full opacity-70 blur-3xl"
        style={{ background: 'radial-gradient(55% 50% at 50% 45%, rgba(var(--a1-rgb),0.24), transparent 70%)' }}
        aria-hidden="true"
      />

      {/* orbit rings — slow counter-rotating hairlines behind the panel */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <motion.div
          className="absolute h-[118%] w-[118%] rounded-full border border-accent/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ maskImage: 'linear-gradient(120deg, #000 25%, transparent 60%)', WebkitMaskImage: 'linear-gradient(120deg, #000 25%, transparent 60%)' }}
        />
        <motion.div
          className="absolute h-[136%] w-[136%] rounded-full border border-violet/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          style={{ maskImage: 'linear-gradient(200deg, #000 20%, transparent 55%)', WebkitMaskImage: 'linear-gradient(200deg, #000 20%, transparent 55%)' }}
        />
      </div>

      <FloatCard label={hero.dashboard.floating[0].label} value={hero.dashboard.floating[0].value} icon={TrendingUp} className="hidden md:block -right-4 -top-9 lg:-right-6" delay={0.7} />
      <FloatCard label={hero.dashboard.floating[1].label} value={hero.dashboard.floating[1].value} icon={Phone} className="hidden md:block -bottom-7 -left-4 lg:-left-6" delay={0.9} />

      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="edge-light gborder relative overflow-hidden rounded-2xl border border-line bg-[var(--base-2)] shadow-[0_40px_120px_-45px_rgba(0,0,0,0.95)]"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[var(--a2)] shadow-lg shadow-accent/25">
              <Activity className="h-4 w-4 text-white" strokeWidth={2.25} />
            </span>
            <div>
              <div className="text-[12px] font-semibold text-white">{hero.dashboard.title}</div>
              <div className="font-mono text-[9px] text-dim">{hero.dashboard.subtitle}</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-mint/10 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-mint">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
            </span>
            {hero.dashboard.live}
          </span>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-3 gap-2 p-3">
          {hero.dashboard.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.09, duration: 0.5, ease: EASE }}
              className="rounded-lg border border-line bg-white/[0.03] p-2.5"
            >
              <div className="font-mono text-[15px] font-bold text-white">
                <CountNum end={liveValues[i]} />
              </div>
              <div className="mt-0.5 truncate text-[9px] text-dim">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* live call */}
        <div className="mx-3 mb-3 rounded-lg border border-accent/15 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[var(--a2)]">
                <Phone className="h-3 w-3 text-white" />
              </span>
              <div>
                <div className="text-[11.5px] font-medium text-white">{hero.dashboard.call.name}</div>
                <div className="font-mono text-[8.5px] text-dim">{hero.dashboard.call.meta}</div>
              </div>
            </div>
            <span className="flex items-center gap-1.5">
              <span className="font-mono text-[8.5px] text-dim">{clock}</span>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-mint/20 bg-mint/10 px-1.5 py-0.5 font-mono text-[8.5px] text-mint"
              >
                {status}
              </motion.span>
            </span>
          </div>

          <Waveform className="mt-3" />

          <div className="mt-3 border-t border-line pt-3">
            <LiveTranscript />
          </div>
        </div>

        {/* ROI */}
        <div className="mx-3 mb-3 flex items-center justify-between rounded-lg border border-accent/15 bg-gradient-to-r from-accent/10 via-[var(--a2)]/10 to-accent/10 px-3 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-mint" strokeWidth={2.25} />
            {hero.dashboard.roi.label}
          </span>
          <motion.span
            className="font-mono text-[13px] font-bold text-mint"
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            {hero.dashboard.roi.value}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-28 sm:pt-32">
      {/* backdrop */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <div className="bg-grid absolute inset-0 opacity-[0.45] mask-fade-y" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(58% 55% at 18% 0%, rgba(var(--a1-rgb),0.14), transparent 65%), radial-gradient(45% 45% at 85% 25%, rgba(var(--a2-rgb),0.08), transparent 70%)',
              'radial-gradient(58% 55% at 26% 4%, rgba(var(--a1-rgb),0.18), transparent 65%), radial-gradient(45% 45% at 78% 32%, rgba(var(--a2-rgb),0.11), transparent 70%)',
              'radial-gradient(58% 55% at 18% 0%, rgba(var(--a1-rgb),0.14), transparent 65%), radial-gradient(45% 45% at 85% 25%, rgba(var(--a2-rgb),0.08), transparent 70%)',
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="u-shell">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 pb-12 lg:grid-cols-[1.06fr_1fr] lg:gap-16 lg:pb-16">
          <div>
            <Reveal direction="up" duration={0.7}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-2.5 py-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <span className="label-mono-xs text-white/70">{hero.badge}</span>
              </span>
            </Reveal>

            <h1 className="h-display mt-6 text-[clamp(2.3rem,5.4vw,3.85rem)] text-white">
              <SplitText text={hero.headline[0]} />{' '}
              <span className="gradient-text-animated">
                <SplitText text={hero.headline[1]} delay={0.12} />
              </span>{' '}
              <br className="hidden sm:block" />
              <SplitText text={hero.headline[2]} delay={0.24} />
            </h1>

            <Reveal delay={0.3} className="mt-6 max-w-xl">
              <p className="text-[15px] leading-relaxed text-muted sm:text-[16.5px]">{hero.description}</p>
            </Reveal>

            <Reveal delay={0.4} className="mt-6">
              <div className="flex flex-wrap gap-2">
                {hero.trust.map((t) => (
                  <motion.div
                    key={t.label}
                    whileHover={{ y: -3, scale: 1.03 }}
                    transition={SPRING_SOFT}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1.5"
                  >
                    <span className="font-mono text-[11px] font-bold text-accent-soft">{t.stat}</span>
                    <span className="text-[10px] text-muted">{t.label}</span>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.48} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.22}>
                  <ActionButton
                    onClick={() => smoothScrollTo('#contact')}
                    variant="solid"
                    size="lg"
                    iconRight={<ArrowRight className="h-4 w-4" />}
                  >
                    {hero.primaryCta}
                  </ActionButton>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <ActionButton
                    onClick={() => smoothScrollTo('#demo')}
                    variant="outline"
                    size="lg"
                    icon={<Play className="h-3.5 w-3.5 fill-current" />}
                  >
                    {hero.secondaryCta}
                  </ActionButton>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={0.56} className="mt-6">
              <div className="flex flex-wrap items-center gap-4">
                {[ShieldCheck, Lock, FileCheck].map((Icon, i) => (
                  <motion.span
                    key={hero.compliance[i].label}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-1.5 text-[11px] text-dim"
                  >
                    <Icon className="h-3.5 w-3.5 text-accent-soft/70" strokeWidth={2} />
                    {hero.compliance[i].label}
                  </motion.span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.64} className="mt-9">
              <p className="label-mono-xs text-dim">{hero.marqueeLabel}</p>
              <Marquee items={hero.logos} className="mt-3 max-w-md" itemClassName="text-[12.5px] font-semibold tracking-wide text-white/30" speed={30} />
            </Reveal>
          </div>

          <div className="relative">
            <DashboardPanel />
            {/* placeholder the WebGL scene pins the 3D phone to (see src/three) */}
            <div data-3d="phone" aria-hidden="true" className="pointer-events-none absolute -left-[182px] top-[231px] hidden h-[264px] w-[184px] min-[1280px]:block" />
          </div>
        </div>
      </div>

      {/* stat strip */}
      <div className="border-y border-line bg-[var(--base-2)]/60">
        <div className="u-shell grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {hero.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="px-1 py-6 text-center sm:py-7"
            >
              <div className="gradient-text font-mono text-[22px] font-bold sm:text-[26px]">
                <CountNum end={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="mt-1.5 text-[10.5px] text-dim">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
