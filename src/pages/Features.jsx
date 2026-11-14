import { motion } from 'framer-motion';
import FeaturesSection from '../sections/FeaturesSection';
import SecuritySection from '../sections/SecuritySection';
import CtaBanner from '../sections/CtaBanner';
import { features } from '../data/site';
import { Reveal, SplitText, EASE } from '../motion/kit';

export default function Features() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-line pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="bg-grid absolute inset-0 opacity-40 mask-fade-y" />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(55% 60% at 15% 0%, rgba(var(--a1-rgb),0.14), transparent 65%)' }}
          />
        </div>

        <div className="u-shell pb-12 sm:pb-16">
          <Reveal className="flex items-center gap-3">
            <span className="h-px w-7 bg-line-strong" />
            <span className="label-mono text-accent-soft">{features.badge}</span>
          </Reveal>
          <h1 className="h-display mt-5 max-w-4xl text-[clamp(2.1rem,5.2vw,3.7rem)] text-white">
            <SplitText text={features.title} /> <span className="serif text-accent-soft">{features.titleAccent}</span>
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{features.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <FeaturesSection showHead={false} />
      <SecuritySection />
      <CtaBanner />
    </main>
  );
}
