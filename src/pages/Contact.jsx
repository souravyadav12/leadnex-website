import { motion } from 'framer-motion';
import LeadSection from '../sections/LeadSection';
import FaqSection from '../sections/FaqSection';
import CtaBanner from '../sections/CtaBanner';
import { lead } from '../data/site';
import { Reveal, SplitText } from '../motion/kit';

export default function Contact() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="bg-grid absolute inset-0 opacity-40 mask-fade-y" />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(55% 60% at 50% 0%, rgba(var(--a1-rgb),0.18), transparent 65%)' }}
          />
        </div>

        <div className="u-shell pb-10 sm:pb-14">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-7 bg-line-strong" />
            <span className="label-mono text-accent-soft">{lead.badge}</span>
          </Reveal>
          <h1 className="h-display mt-5 max-w-4xl text-[clamp(2.1rem,5.2vw,3.7rem)] text-white">
            <SplitText text={lead.title} /> <span className="serif text-accent-soft">{lead.titleAccent}</span>
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{lead.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <LeadSection />
      <FaqSection />
      <CtaBanner />
    </main>
  );
}
