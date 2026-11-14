import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Phone, PhoneIncoming, Brain, CalendarCheck, Database, Mic, AudioLines, Check } from 'lucide-react';
import { hero } from '../data/site';
import { Section, Reveal, EASE } from '../motion/kit';
import { cn } from '../utils/cn';
import { useNearView } from '../hooks/useNearView';

/* ─────────────────────────────────────────────────────────────────────────
   AI Calling — 3D scene (home page, directly under the hero).
   Pure CSS-3D + framer-motion (no extra dependency):
     · a rotating cylinder of voice-bars  = the agent's live voice
     · a glowing phone core + ripple rings = the call being connected
     · floating glass cards at different depths = what happens during a call
   The whole scene follows the pointer and turns gently with the scroll.
   ───────────────────────────────────────────────────────────────────────── */

const BARS = 56;
const RADIUS = 150;

const STEPS = [
  { icon: PhoneIncoming, title: 'Call connects', text: 'Inbound or outbound, answered in under a second.' },
  { icon: Mic, title: 'Agent talks', text: 'Natural voice, live interruptions, <300ms latency.' },
  { icon: Brain, title: 'Lead qualified', text: 'Intent and budget detected while the call is running.' },
  { icon: CalendarCheck, title: 'Meeting booked', text: 'Calendar invite sent before the caller hangs up.' },
  { icon: Database, title: 'CRM updated', text: 'Transcript, score and next step logged automatically.' },
];

/* ── cylinder of voice bars ─────────────────────────────────────────────── */
function VoiceCylinder({ active, reduced }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{ transformStyle: 'preserve-3d', rotateX: -16 }}
      animate={reduced ? undefined : { rotateY: 360 }}
      transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      {Array.from({ length: BARS }).map((_, i) => {
        const peak = 0.35 + Math.abs(Math.sin(i * 0.9)) * 0.65;
        return (
          <div
            key={i}
            className="absolute left-0 top-0"
            style={{ transform: `rotateY(${(i * 360) / BARS}deg) translateZ(${RADIUS}px)`, transformStyle: 'preserve-3d' }}
          >
            <motion.span
              className="absolute block w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-t from-accent/30 via-accent to-accent-soft shadow-[0_0_14px_rgba(var(--a1-rgb),0.55)]"
              style={{ height: 120 }}
              animate={
                active && !reduced
                  ? { scaleY: [0.16, peak, 0.22 + (i % 4) * 0.06, peak * 0.8, 0.16] }
                  : { scaleY: 0.2 + (i % 5) * 0.05 }
              }
              transition={{ duration: 1.5 + (i % 7) * 0.18, repeat: Infinity, ease: 'easeInOut', delay: (i % 14) * 0.06 }}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

/* ── flat orbit rings lying in the XZ plane + outgoing "ring" ripples ───── */
function Rings({ reduced }) {
  return (
    <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d', rotateX: 72 }} aria-hidden="true">
      {[250, 320].map((d, i) => (
        <motion.span
          key={d}
          className={cn('absolute rounded-full border', i ? 'border-accent/15 border-dashed' : 'border-accent/30')}
          style={{ width: d * 2, height: d * 2, left: -d, top: -d }}
          animate={reduced ? undefined : { rotate: i ? -360 : 360 }}
          transition={{ duration: 70 + i * 30, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`r${i}`}
          className="absolute rounded-full border border-accent/50"
          style={{ width: 200, height: 200, left: -100, top: -100 }}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={reduced ? { scale: 1.2, opacity: 0.15 } : { scale: [0.4, 1.9], opacity: [0.55, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeOut', delay: i * 1.2 }}
        />
      ))}
    </div>
  );
}

/* ── glowing phone core ─────────────────────────────────────────────────── */
function Core({ clock }) {
  return (
    <div className="absolute left-1/2 top-1/2 h-0 w-0" style={{ transformStyle: 'preserve-3d' }}>
      <div className="absolute flex h-[132px] w-[132px] items-center justify-center" style={{ left: -66, top: -66, transform: 'translateZ(40px)' }}>
        <div className="absolute inset-0 rounded-full border border-accent/40 bg-[radial-gradient(circle_at_32%_28%,rgba(var(--a1-soft-rgb),0.55),rgba(var(--a1-rgb),0.35)_45%,rgba(var(--a2-rgb),0.55))] shadow-[inset_0_-12px_30px_rgba(0,0,0,0.45)]" />
        <motion.span
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--base)]/70"
          animate={{ rotate: [0, -12, 10, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
        >
          <Phone className="h-6 w-6 text-white" strokeWidth={2} />
        </motion.span>
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-[var(--base-2)] px-2.5 py-1 font-mono text-[10px] text-accent-soft">
          ● {clock}
        </span>
      </div>
    </div>
  );
}

/* ── floating glass card at a given depth ───────────────────────────────── */
function DepthCard({ x, y, z, delay = 0, className, children }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 w-max"
      style={{ transform: `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), ${z}px)`, transformStyle: 'preserve-3d' }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: 'easeInOut', delay }}
        className={cn('rounded-xl border border-line-strong bg-[var(--base-2)] px-3.5 py-2.5 shadow-2xl shadow-black/50', className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Scene({ step, lineIdx, clock, reduced, near }) {
  const stageRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });
  const scrollRotate = useTransform(scrollYProgress, [0, 1], [-26, 26]);
  const rotateY = useTransform([sx, scrollRotate], ([p, s]) => p * 18 + (reduced ? 0 : s));
  const rotateX = useTransform(sy, (p) => 8 - p * 12);

  const line = hero.transcript[lineIdx];
  const stepInfo = STEPS[step];

  return (
    <div
      ref={stageRef}
      onPointerMove={(e) => {
        const r = stageRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative mx-auto h-[400px] w-full max-w-[540px] sm:h-[540px]"
      style={{ perspective: 1400 }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(var(--a1-rgb),0.22), transparent)' }}
        aria-hidden="true"
      />

      {/* fixed 540×540 scene, scaled down on phones */}
      <div className="absolute left-1/2 top-1/2 h-[540px] w-[540px] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-100">
        <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}>
          <Rings reduced={reduced} />
          <VoiceCylinder active={near} reduced={reduced} />
          <Core clock={clock} />

          {/* inbound call — front left */}
          <DepthCard x={-185} y={-165} z={150} delay={0.1}>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mint/15">
                <PhoneIncoming className="h-3.5 w-3.5 text-mint" strokeWidth={2.25} />
              </span>
              <div>
                <div className="text-[11.5px] font-semibold text-white">{hero.dashboard.call.name}</div>
                <div className="font-mono text-[9px] text-dim">Inbound · Enterprise lead</div>
              </div>
            </div>
          </DepthCard>

          {/* live transcript — front */}
          <DepthCard x={0} y={205} z={190} delay={0.3} className="w-[300px]">
            <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-dim">
              <AudioLines className="h-3 w-3 text-accent-soft" /> Live transcript
            </div>
            <div className="relative min-h-[34px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={lineIdx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11.5px] leading-snug text-white/80"
                >
                  <span className={cn('mr-1.5 rounded px-1 py-0.5 font-mono text-[8.5px] uppercase', line.role === 'ai' ? 'bg-accent/20 text-accent-soft' : 'bg-white/10 text-muted')}>
                    {line.role === 'ai' ? 'AI' : 'User'}
                  </span>
                  {line.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </DepthCard>

          {/* intent — back right */}
          <DepthCard x={190} y={-110} z={-60} delay={0.5}>
            <div className="text-[9px] uppercase tracking-wider text-dim">Intent detected</div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-[12px] font-semibold text-white">Demo request</span>
              <span className="rounded-full bg-mint/10 px-1.5 py-0.5 font-mono text-[9px] text-mint">94%</span>
            </div>
          </DepthCard>

          {/* booked — front right */}
          <DepthCard x={175} y={95} z={170} delay={0.7}>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15">
                <CalendarCheck className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2.25} />
              </span>
              <div>
                <div className="text-[11.5px] font-semibold text-white">Meeting booked</div>
                <div className="font-mono text-[9px] text-dim">Thu · 2:00 PM</div>
              </div>
            </div>
          </DepthCard>

          {/* latency — back left */}
          <DepthCard x={-195} y={70} z={-90} delay={0.9}>
            <div className="text-[9px] uppercase tracking-wider text-dim">Response latency</div>
            <div className="font-mono text-[14px] font-bold text-white">&lt;300ms</div>
          </DepthCard>
        </motion.div>
      </div>

      {/* what the agent is doing right now */}
      <div className="pointer-events-none absolute -bottom-1 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-[var(--base-2)]/80 px-3 py-1 font-mono text-[10px] text-muted"
          >
            <stepInfo.icon className="h-3 w-3 text-accent-soft" /> {stepInfo.title}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Call3D() {
  const reduced = useReducedMotion();
  const [box, near] = useNearView('120px');
  const [step, setStep] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!near) return;
    const a = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2600);
    const b = setInterval(() => setLineIdx((i) => (i + 1) % hero.transcript.length), 2600);
    const c = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(a);
      clearInterval(b);
      clearInterval(c);
    };
  }, [near]);

  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <Section id="ai-call-3d" tone="surface" aura="indigo" className="!py-14 sm:!py-20 lg:!py-24">
      <div ref={box} className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div>
          <Reveal className="flex flex-wrap items-center gap-3">
            <span className="tag-bracket text-dim">Inside a call</span>
          </Reveal>
          <h2 className="h-section mt-5 text-[clamp(1.85rem,4vw,3.1rem)] text-white">
            Every call, <span className="serif text-accent-soft">handled end to end</span>
          </h2>
          <Reveal delay={0.1} className="mt-5 max-w-md">
            <p className="text-[15px] leading-relaxed text-muted">
              Explore the scene — it&apos;s one AI call, seen from the inside. The voice, the conversation and the booking all run in the same few seconds.
            </p>
          </Reveal>

          <ol className="mt-8 space-y-2">
            {STEPS.map((s, i) => {
              const on = i === step;
              const done = i < step;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-300',
                      on ? 'border-accent/40 bg-accent/[0.07]' : 'border-line bg-white/[0.015] hover:bg-white/[0.03]',
                    )}
                  >
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors', on ? 'bg-accent text-white' : 'bg-white/[0.05] text-muted')}>
                      {done ? <Check className="h-4 w-4 text-mint" strokeWidth={2.5} /> : <s.icon className="h-4 w-4" strokeWidth={2} />}
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-[13px] font-semibold', on ? 'text-white' : 'text-white/75')}>{s.title}</span>
                      <span className="block truncate text-[11.5px] text-dim">{s.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <Scene step={step} lineIdx={lineIdx} clock={clock} reduced={reduced} near={near} />
      </div>
    </Section>
  );
}
