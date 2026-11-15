import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faq } from '../data/site';
import { Section, SectionHead, EASE } from '../motion/kit';
import { cn } from '../utils/cn';

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq">
      <SectionHead
        index={faq.index}
        badge={faq.badge}
        title={faq.title}
        subtitle={faq.subtitle}
      />

      <div className="mx-auto max-w-3xl border-t border-line">
        <AnimatePresence initial={false} mode="popLayout">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={item.q}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.03 }}
                className="border-b border-line"
              >
                <motion.button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.25 }}
                  className="flex w-full items-start justify-between gap-5 py-4 text-left"
                >
                  <span className={cn('text-[14.5px] font-medium leading-snug transition-colors', isOpen ? 'text-white' : 'text-white/80')}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={cn('mt-0.5 shrink-0', isOpen ? 'text-cyan' : 'text-dim')}
                  >
                    {isOpen ? <Minus className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-6 text-[13.5px] leading-relaxed text-muted">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Section>
  );
}
