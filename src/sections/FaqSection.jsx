import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowUpRight, MessageSquare, CheckCircle2 } from 'lucide-react';
import { faq } from '../data/site';
import { Section, Reveal, ActionButton, EASE } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14 items-start">
        {/* Left Column: Aligned Header & Direct Support Card */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="label-mono text-accent-soft">{faq.index}</span>
              <span className="h-px w-7 bg-line-strong" aria-hidden="true" />
              <span className="tag-bracket text-dim">{faq.badge}</span>
            </Reveal>

            <h2 className="h-section mt-4 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold tracking-tight text-white leading-tight">
              Frequently Asked <br />
              <span className="gradient-text font-bold">Questions.</span>
            </h2>

            <p className="mt-4 text-[14.5px] leading-relaxed text-slate-300 max-w-md">
              {faq.subtitle}
            </p>
          </div>

          {/* Enterprise Support Box */}
          <div className="rounded-2xl border border-cyan/30 bg-gradient-to-b from-cyan/[0.08] to-transparent p-5 backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-cyan font-mono text-[11px] font-bold uppercase tracking-wider">
              <MessageSquare className="h-4 w-4" />
              <span>Have Custom Telephony Needs?</span>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-slate-300">
              Our enterprise telephony architects are available for custom SIP trunking, private edge VPCs, and compliance walkthroughs.
            </p>
            <div className="mt-4">
              <ActionButton
                onClick={() => smoothScrollTo('#contact')}
                variant="outline"
                size="sm"
                iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
                className="border-cyan/40 text-cyan hover:bg-cyan/[0.12] text-[12px]"
              >
                Talk to an Architect
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Right Column: Perfectly Aligned Accordion Cards */}
        <div className="space-y-3.5">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const number = String(i + 1).padStart(2, '0');

            return (
              <motion.div
                key={item.q}
                layout
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.04 }}
                className={cn(
                  'rounded-2xl border transition-all duration-300 overflow-hidden',
                  isOpen
                    ? 'border-cyan/50 bg-[#061226]/90 shadow-[0_10px_35px_rgba(0,240,255,0.12)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.035]',
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        'shrink-0 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors',
                        isOpen
                          ? 'border-cyan/60 bg-cyan/[0.15] text-cyan'
                          : 'border-white/10 bg-white/[0.04] text-slate-400',
                      )}
                    >
                      {number}
                    </span>
                    <span
                      className={cn(
                        'text-[14.5px] sm:text-[15.5px] font-medium leading-snug transition-colors',
                        isOpen ? 'text-white' : 'text-slate-200 hover:text-white',
                      )}
                    >
                      {item.q}
                    </span>
                  </div>

                  <span
                    className={cn(
                      'shrink-0 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300',
                      isOpen
                        ? 'border-cyan bg-cyan text-black'
                        : 'border-white/15 bg-white/[0.04] text-slate-400 hover:border-white/30',
                    )}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5 stroke-[2.5]" /> : <Plus className="h-3.5 w-3.5 stroke-[2.5]" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 border-t border-white/[0.06] ml-11 mr-4">
                        <p className="text-[13.5px] leading-relaxed text-slate-300 font-normal">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
