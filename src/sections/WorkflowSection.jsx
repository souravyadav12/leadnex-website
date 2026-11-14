import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { PhoneIncoming, Sparkles, Target, CalendarCheck, Database, LineChart, Check } from 'lucide-react';
import { workflow } from '../data/site';
import { Section, SectionHead, Reveal, EASE, SPRING } from '../motion/kit';
import { cn } from '../utils/cn';

const ICONS = [PhoneIncoming, Sparkles, Target, CalendarCheck, Database, LineChart];

export default function WorkflowSection() {
  const railRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 70%', 'end 60%'] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // which step the reader is on → drives the pinned live panel
  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(workflow.steps.length, Math.max(1, Math.ceil(v * workflow.steps.length)));
    setStage(next);
  });

  const visibleLines = Math.min(workflow.conversation.length, Math.max(1, stage));
  const showChips = stage >= 3;
  const showBooking = stage >= 4;

  return (
    <Section id="how-it-works">
      <SectionHead
        anchor3d="funnel"
        index={workflow.index}
        badge={workflow.badge}
        title={workflow.title}
        titleAccent={workflow.titleAccent}
        subtitle={workflow.subtitle}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* steps with a scroll-drawn rail */}
        <div ref={railRef} className="relative">
          <div className="absolute bottom-2 left-[17px] top-2 w-px bg-line" aria-hidden="true" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-2 left-[17px] top-2 w-px origin-top bg-gradient-to-b from-accent via-accent-soft to-mint"
            aria-hidden="true"
          />

          <div className="space-y-1">
            {workflow.steps.map((step, i) => {
              const Icon = ICONS[i];
              const done = stage > i;
              const current = stage === i + 1;
              return (
                <Reveal key={step.title} delay={i * 0.04} distance={18}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={SPRING}
                    className="group relative grid grid-cols-[36px_1fr] gap-4 py-4 sm:gap-6"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={SPRING}
                      className={cn(
                        'relative z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-[var(--base-2)] transition-colors duration-500',
                        done || current
                          ? 'border-accent/60 text-white shadow-[0_0_0_4px_rgba(var(--a1-rgb),0.08)]'
                          : 'border-line text-muted',
                        'group-hover:border-accent/50 group-hover:text-white',
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {current && (
                        <motion.span
                          className="absolute inset-0 rounded-full border border-accent/50"
                          animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                          aria-hidden="true"
                        />
                      )}
                    </motion.span>

                    <div className={cn('border-b pb-4 transition-colors duration-500', current ? 'border-accent/25' : 'border-line')}>
                      <div className="flex items-baseline gap-2">
                        <span className={cn('font-mono text-[9.5px]', current ? 'text-accent-soft' : 'text-dim')}>0{i + 1}</span>
                        <h3 className="text-[15px] font-medium tracking-tight text-white">{step.title}</h3>
                      </div>
                      <p className="mt-1.5 max-w-lg text-[12.5px] leading-relaxed text-muted">{step.body}</p>
                      <motion.span
                        initial={{ opacity: 0.7 }}
                        whileHover={{ opacity: 1 }}
                        className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-line bg-white/[0.02] px-2 py-0.5 font-mono text-[9.5px] text-white/55"
                      >
                        <span className="h-1 w-1 rounded-full bg-mint" />
                        {step.detail}
                      </motion.span>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* pinned, scroll-driven live panel — stays put while the steps pass */}
        <div className="relative">
          <div className="lg:sticky lg:top-24">
            <div className="edge-light relative overflow-hidden rounded-2xl border border-line bg-[var(--base-2)] p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
              {/* header */}
              <div className="flex items-center justify-between">
                <span className="label-mono-xs text-dim">live conversation</span>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-mint">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-mint"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                  live
                </span>
              </div>

              {/* step progress */}
              <div className="mt-3 flex items-center gap-1">
                {workflow.steps.map((s, i) => (
                  <motion.span
                    key={s.title}
                    className={cn('h-[3px] flex-1 rounded-full', i < stage ? 'bg-accent' : 'bg-white/10')}
                    animate={{ opacity: i < stage ? 1 : 0.55 }}
                    transition={{ duration: 0.35 }}
                  />
                ))}
              </div>

              {/* transcript — lines land as the matching step becomes active */}
              <div className="mt-4 min-h-[104px] space-y-2">
                <AnimatePresence initial={false}>
                  {workflow.conversation.slice(0, visibleLines).map((m, i) => (
                    <motion.div
                      key={m.text}
                      initial={{ opacity: 0, y: 14, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45, ease: EASE, delay: i === visibleLines - 1 ? 0.05 : 0 }}
                      className={cn(
                        'max-w-[86%] rounded-xl px-3 py-2 text-[11.5px] leading-relaxed',
                        m.role === 'ai'
                          ? 'rounded-tl-sm bg-accent/15 text-white'
                          : 'ml-auto rounded-tr-sm bg-white/[0.06] text-white/85',
                      )}
                    >
                      {m.text}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* live status line — mirrors whichever step the reader is on */}
                <div className="flex items-center gap-1.5 pt-1">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-mint"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={stage}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28 }}
                      className="truncate font-mono text-[9.5px] text-mint/80"
                    >
                      {workflow.steps[Math.min(workflow.steps.length - 1, Math.max(0, stage - 1))].detail}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {stage < 3 && (
                  <motion.div
                    className="flex items-center gap-1 px-1 pt-1"
                    animate={{ opacity: [0.35, 0.9, 0.35] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    aria-hidden="true"
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1 w-1 rounded-full bg-accent-soft"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* qualification chips — tick in step by step */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {workflow.qualification.map((q, i) => {
                  const on = showChips || i === 0;
                  return (
                    <motion.span
                      key={q}
                      animate={{ opacity: on ? 1 : 0.25, y: on ? 0 : 4 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      whileHover={{ y: -2, scale: 1.04 }}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider',
                        on && q === 'Highly qualified'
                          ? 'border-mint/30 bg-mint/10 text-mint'
                          : on
                            ? 'border-line bg-white/[0.04] text-muted'
                            : 'border-line/60 bg-white/[0.02] text-dim',
                      )}
                    >
                      <motion.span animate={{ scale: on ? 1 : 0.6 }} transition={SPRING}>
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </motion.span>
                      {q}
                    </motion.span>
                  );
                })}
              </div>

              {/* booking card — appears once the call is booked */}
              <AnimatePresence>
                {showBooking && (
                  <motion.div
                    initial={{ opacity: 0, y: 18, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-xl border border-accent/20 bg-gradient-to-b from-accent/[0.09] to-transparent p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="label-mono-xs text-accent-soft">calendar</span>
                        <span className="font-mono text-[9px] text-mint">synced</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-mint" strokeWidth={3} />
                        <span className="text-[12px] font-medium text-white">{workflow.booking.slot}</span>
                      </div>
                      <p className="mt-1 pl-5 text-[10.5px] text-muted">{workflow.booking.note}</p>

                      <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                        <span className="text-[10.5px] text-dim">{workflow.booking.title}</span>
                        <motion.span
                          className="rounded-full bg-mint/10 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-mint"
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                        >
                          crm updated
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ambient scan line */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-accent/[0.08] to-transparent"
                animate={{ y: ['-20%', '620%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
