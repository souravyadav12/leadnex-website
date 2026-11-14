import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Minus } from 'lucide-react';
import { faq } from '../data/site';
import { Section, SectionHead, Reveal, EASE } from '../motion/kit';
import { cn } from '../utils/cn';

export default function FaqSection() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(0);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faq.items;
    return faq.items.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <Section id="faq">
      <SectionHead
        index={faq.index}
        badge={faq.badge}
        title={faq.title}
        subtitle={faq.subtitle}
      />

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dim" strokeWidth={2} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={faq.searchPlaceholder}
              aria-label={faq.searchPlaceholder}
              className="w-full rounded-xl border border-line bg-white/[0.03] py-2.5 pl-9 pr-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-dim focus:border-accent/60"
            />
            <motion.span
              className="pointer-events-none absolute inset-x-3 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>

          <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim">
            {list.length} / {faq.items.length} questions
          </p>
        </Reveal>

        <div className="border-t border-line">
          <AnimatePresence initial={false} mode="popLayout">
            {list.length === 0 && (
              <motion.p
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-6 text-[12.5px] text-muted"
              >
                {faq.empty}
              </motion.p>
            )}

            {list.map((item, i) => {
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
                    className="flex w-full items-start justify-between gap-5 py-3.5 text-left"
                  >
                    <span className={cn('text-[13.5px] font-medium leading-snug transition-colors', isOpen ? 'text-white' : 'text-white/80')}>
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={cn('mt-0.5 shrink-0', isOpen ? 'text-accent-soft' : 'text-dim')}
                    >
                      {isOpen ? <Minus className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
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
                        <p className="max-w-2xl pb-4 pr-6 text-[12.5px] leading-relaxed text-muted">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
