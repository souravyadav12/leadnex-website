import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, TrendingUp, Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { hero } from '../data/site';
import { Reveal, SplitText, ActionButton, CountNum, Magnetic, EASE } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

/* ── Live Telemetry HUD Bar (Compact, non-obstructive) ──────────────────── */
function HeroTelemetryBar() {
  const [metrics, setMetrics] = useState(() => hero.dashboard.metrics.map((m) => m.value));
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const drift = setInterval(() => {
      setMetrics((prev) =>
        prev.map((v, i) => (i === 1 ? Math.max(820, Math.min(940, v + Math.round((Math.random() - 0.5) * 12))) : v)),
      );
    }, 2800);
    const statusCycle = setInterval(() => setStatusIdx((i) => (i + 1) % 3), 4200);
    return () => {
      clearInterval(drift);
      clearInterval(statusCycle);
    };
  }, []);

  const statuses = ['SYSTEM OPTIMAL · STREAMING LOAD', 'ORCHESTRATION ONLINE', 'GUARDRAILS ACTIVE · ZERO DRIFT'];

  return (
    <div className="mt-8 rounded-2xl border border-cyan/25 bg-black/40 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-mint" />
            <span className="relative h-2 w-2 rounded-full bg-mint" />
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-mint font-semibold">
            {statuses[statusIdx]}
          </span>
        </div>
        <span className="font-mono text-[9px] text-cyan/80 tracking-widest uppercase">HUD NODE #01</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-3">
        {hero.dashboard.metrics.map((m, i) => (
          <div key={m.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-2 text-center">
            <div className="font-mono text-[15px] font-bold text-white">
              <CountNum end={metrics[i]} />
            </div>
            <div className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-wider text-slate-400">
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Hero Component (Framed Left, Unobstructed 3D Universe Right) ────────── */
export default function Hero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.08]);
  const heroScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.65], [0, -45]);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-[96vh] overflow-hidden pt-32 sm:pt-36 lg:pt-40">
      
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="u-shell relative z-10 will-change-transform"
      >
        <div className="grid grid-cols-1 items-center gap-12 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24">
          
          {/* ─ LEFT: Integrated Glassmorphism Control Center ─ */}
          <div className="relative">
            <div className="glass-hero rounded-3xl p-7 sm:p-10 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
              
              {/* Eyebrow Badge */}
              <Reveal direction="up" duration={0.6}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan/40 bg-cyan/[0.1] px-4 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-cyan" />
                    <span className="relative h-2 w-2 rounded-full bg-cyan" />
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] font-semibold text-cyan">
                    {hero.badge}
                  </span>
                </div>
              </Reveal>

              {/* Main Heading: High-contrast, crystal clear typography */}
              <h1 className="h-display mt-6 text-[clamp(2.4rem,5.4vw,4.3rem)] font-bold tracking-tight text-white leading-[1.06]">
                <SplitText text={hero.headline[0]} />{' '}
                <br className="hidden sm:block" />
                <span className="gradient-text-animated text-glow-cyan font-bold">
                  <SplitText text={hero.headline[1]} delay={0.12} />
                </span>{' '}
                <SplitText text={hero.headline[2]} delay={0.24} />
              </h1>

              {/* Supporting Description */}
              <Reveal delay={0.28} className="mt-5 max-w-xl">
                <p className="text-[15.5px] leading-relaxed text-slate-200 sm:text-[17px] font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {hero.description}
                </p>
              </Reveal>

              {/* Floating Action Buttons */}
              <Reveal delay={0.38} className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <Magnetic strength={0.2}>
                    <ActionButton
                      onClick={() => smoothScrollTo('#contact')}
                      variant="accent"
                      size="lg"
                      iconRight={<ArrowRight className="h-4 w-4" />}
                      className="btn-glow bg-gradient-to-r from-cyan via-blue to-violet px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:shadow-[0_0_55px_rgba(0,240,255,0.6)]"
                    >
                      {hero.primaryCta}
                    </ActionButton>
                  </Magnetic>
                  <Magnetic strength={0.16}>
                    <ActionButton
                      onClick={() => smoothScrollTo('#features')}
                      variant="outline"
                      size="lg"
                      icon={<Sparkles className="h-3.5 w-3.5 text-cyan" />}
                      className="border-white/20 bg-white/[0.04] px-6 py-3.5 text-[14px] text-white backdrop-blur-md hover:border-cyan/50 hover:bg-cyan/[0.08]"
                    >
                      {hero.secondaryCta}
                    </ActionButton>
                  </Magnetic>
                </div>
              </Reveal>

              {/* Integrated Live Telemetry Readout */}
              <Reveal delay={0.46}>
                <HeroTelemetryBar />
              </Reveal>

              {/* Engineering Standards */}
              <Reveal delay={0.52} className="mt-6">
                <div className="flex flex-wrap items-center gap-5 border-t border-white/[0.08] pt-4">
                  {[ShieldCheck, Cpu, Code2].map((Icon, i) => (
                    <span
                      key={hero.compliance[i]?.label ?? i}
                      className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium"
                    >
                      <Icon className="h-3.5 w-3.5 text-cyan" strokeWidth={2} />
                      {hero.compliance[i]?.label}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          {/* ─ RIGHT: Completely Open Viewport for 3D AI Neural Core & Tunnel ─ */}
          <div className="relative hidden lg:flex flex-col items-end justify-between h-full pointer-events-none min-h-[420px]">
            {/* Minimal floating HUD beacon anchored in upper corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="glass-chip flex items-center gap-2.5 rounded-full px-4 py-2 pointer-events-auto"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-cyan" />
                <span className="relative h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyan font-semibold">
                LEADNEX.AI · Headquarters Simulation
              </span>
            </motion.div>

            {/* Subtle scroll cue badge at lower corner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.6 }}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-slate-400"
            >
              <span>Scroll to explore Headquarters</span>
              <span className="h-3 w-px bg-cyan/60 animate-pulse" />
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Numerical Stats Horizon Strip — Translucent with backdrop blur */}
      <div className="border-y border-white/[0.08] bg-[rgba(2,4,10,0.45)] backdrop-blur-md relative z-10">
        <div className="u-shell grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
          {hero.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              className="px-2 py-6 text-center sm:py-7"
            >
              <div className="gradient-text font-mono text-[22px] font-bold sm:text-[28px]">
                <CountNum end={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-300">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
