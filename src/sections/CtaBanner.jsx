import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ctaBanner } from '../data/site';
import { Reveal, SplitText, ActionButton, Magnetic, Parallax, EASE } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { Cube3D } from '../motion/ThreeD';

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-[var(--base)]/60 backdrop-blur-md py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Parallax distance={40} className="absolute inset-0">
          <div className="bg-grid absolute inset-0 opacity-[0.35] mask-fade-y" />
        </Parallax>
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.5, 0.85, 0.5],
            background: [
              'radial-gradient(65% 110% at 50% 120%, rgba(var(--a1-rgb),0.16), transparent 70%)',
              'radial-gradient(75% 125% at 50% 125%, rgba(var(--a2-rgb),0.2), transparent 70%)',
              'radial-gradient(65% 110% at 50% 120%, rgba(var(--a1-rgb),0.16), transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* 3D wireframe accents */}
      <Parallax distance={60} className="pointer-events-none absolute left-[4%] top-12 hidden md:block">
        <Cube3D size={110} speed={30} className="opacity-70" />
      </Parallax>
      <Parallax distance={-50} className="pointer-events-none absolute right-[6%] bottom-14 hidden md:block">
        <Cube3D size={78} speed={22} className="opacity-50" />
      </Parallax>

      <div className="u-shell relative">
        <div className="flex flex-col items-start gap-7 sm:items-center sm:text-center">
          <Reveal>
            <span className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.07] px-3 py-1">
              <Sparkles className="h-3 w-3 text-accent-soft" strokeWidth={2.25} />
              <span className="label-mono-xs text-accent-soft">{ctaBanner.eyebrow}</span>
            </span>
          </Reveal>

          <h2 className="h-section max-w-3xl text-[clamp(2rem,5vw,3.6rem)] text-white">
            <SplitText text={ctaBanner.title} />{' '}
            <span className="serif text-accent-soft">{ctaBanner.titleAccent}</span>
          </h2>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-3 sm:justify-center">
              <Magnetic strength={0.2}>
                <ActionButton
                  onClick={() => smoothScrollTo('#contact')}
                  variant="solid"
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  {ctaBanner.primary}
                </ActionButton>
              </Magnetic>
              <Magnetic strength={0.16}>
                <ActionButton onClick={() => smoothScrollTo('#contact')} variant="outline" size="lg">
                  {ctaBanner.secondary}
                </ActionButton>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:justify-center">
              {ctaBanner.points.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: EASE }}
                  className="flex items-center gap-2"
                >
                  {i !== 0 && <span className="text-white/15">·</span>}
                  {p}
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
