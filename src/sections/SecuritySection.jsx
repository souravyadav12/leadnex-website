import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Lock, ShieldCheck, Database, ArrowRight, Shield, FileCheck, Server, Eye, KeyRound, ClipboardList, BadgeCheck } from 'lucide-react';
import { security } from '../data/site';
import { Section, SectionHead, Reveal, Stagger, StaggerItem, HoverLift, Magnetic, EASE } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

const FLOW_ICONS = [PhoneCall, Lock, ShieldCheck, Database];
const BADGE_ICONS = [ShieldCheck, Shield, FileCheck, Server, Eye, KeyRound, ClipboardList, BadgeCheck];

/* A packet that keeps travelling the pipeline, lighting each stage as it lands */
function LiveFlow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % (security.flow.length + 1)), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-6">
      {/* connecting beam */}
      <div className="absolute left-0 right-0 top-[19px] hidden h-px bg-line md:block" aria-hidden="true" />
      <motion.div
        className="absolute left-0 top-[19px] hidden h-px bg-gradient-to-r from-accent via-accent-soft to-mint md:block"
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
        aria-hidden="true"
      />

      {/* the travelling packet */}
      <motion.span
        className="absolute top-[16px] hidden h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-mint shadow-[0_0_12px_2px_rgba(127,224,196,0.7)] md:block"
        animate={{ left: ['2%', '98%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div className="grid gap-4 md:grid-cols-4">
        {security.flow.map((step, i) => {
          const Icon = FLOW_ICONS[i];
          const on = active > i;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.35 + i * 0.16, duration: 0.55, ease: EASE }}
              whileHover={{ y: -4 }}
              className={cn(
                'relative rounded-xl border p-3.5 transition-colors duration-500',
                on ? 'border-accent/35 bg-white/[0.035]' : 'border-line bg-white/[0.02] hover:border-accent/25',
              )}
            >
              <div className="flex items-center gap-2.5">
                <motion.span
                  animate={on ? { boxShadow: '0 0 0 4px rgba(var(--a1-rgb),0.10)' } : { boxShadow: '0 0 0 0px rgba(var(--a1-rgb),0)' }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-[var(--base-2)]"
                >
                  <Icon className={cn('h-3.5 w-3.5 transition-colors duration-500', on ? 'text-white' : 'text-accent-soft')} strokeWidth={2.25} />
                </motion.span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-dim">0{i + 1}</span>
              </div>
              <div className="mt-2.5 text-[12.5px] font-medium text-white">{step.title}</div>
              <div className="mt-0.5 font-mono text-[9.5px] text-mint/80">{step.meta}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function SecuritySection() {
  return (
    <Section id="compliance" tone="surface">
      <SectionHead
        anchor3d="shield"
        index={security.index}
        badge={security.badge}
        title={security.title}
        titleAccent={security.titleAccent}
        subtitle={security.subtitle}
      />

      {/* pipeline */}
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line bg-[var(--base-2)]/80 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="label-mono text-mint">{security.flowLabel}</span>
              <h3 className="mt-2 text-[15px] font-semibold text-white">{security.flowTitle}</h3>
              <p className="mt-1 max-w-md text-[12px] leading-relaxed text-muted">{security.flowSubtitle}</p>
            </div>
            <motion.span
              className="flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint/[0.07] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-mint"
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.6, repeat: Infinity }}
            >
              <span className="h-1 w-1 rounded-full bg-mint" /> encrypted
            </motion.span>
          </div>

          <LiveFlow />
        </div>
      </Reveal>

      {/* badges */}
      <div className="mt-8">
        <p className="label-mono-xs mb-4 text-dim">{security.badgesLabel}</p>
        <Stagger className="flex flex-wrap gap-2" step={0.04}>
          {security.badges.map((label, i) => {
            const Icon = BADGE_ICONS[i] ?? ShieldCheck;
            return (
              <StaggerItem key={label} distance={10}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="group flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 transition-colors hover:border-accent/30 hover:bg-white/[0.05]"
                >
                  <Icon className="h-3 w-3 text-accent/70 transition-colors group-hover:text-accent" strokeWidth={2.25} />
                  <span className="text-[10.5px] font-semibold text-muted transition-colors group-hover:text-white">{label}</span>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* CTA */}
      <Reveal delay={0.1} className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-[14px] font-bold tracking-tight text-white">{security.ctaTitle}</h4>
          <p className="mt-1 max-w-sm text-[11.5px] text-muted">{security.ctaBody}</p>
        </div>
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={() => smoothScrollTo('#contact')}
            className={cn(
              'tag-bracket group inline-flex items-center gap-2 py-2 font-mono text-[11px] text-accent-soft transition-colors hover:text-white',
            )}
          >
            <motion.span className="inline-block" whileHover={{ x: 3 }} transition={{ duration: 0.25 }}>
              {security.ctaLabel}
            </motion.span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </Magnetic>
      </Reveal>
    </Section>
  );
}
