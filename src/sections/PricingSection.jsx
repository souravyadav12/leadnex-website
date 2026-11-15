import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shield, CreditCard, RotateCcw, Sparkles } from 'lucide-react';
import { pricing } from '../data/site';
import { Section, SectionHead, Reveal, Stagger, StaggerItem, HoverLift, ActionButton, EASE, SPRING , ScrollZoom } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

function Cell({ value }) {
  if (value === true) return <Check className="mx-auto h-3.5 w-3.5 text-mint" strokeWidth={3} />;
  if (value === false) return <X className="mx-auto h-3.5 w-3.5 text-white/20" strokeWidth={2.5} />;
  return <span className="font-mono text-[10.5px] text-white/85">{value}</span>;
}

export default function PricingSection({ withComparison = true, showHead = true }) {
  const [yearly, setYearly] = useState(false);
  const guarantees = [Shield, CreditCard, RotateCcw];

  return (
    <Section id="pricing">
      {showHead && (
        <SectionHead
          index={pricing.index}
          badge={pricing.badge}
          title={pricing.title}
          titleAccent={pricing.titleAccent}
          subtitle={pricing.subtitle}
        />
      )}

      {/* billing toggle */}
      <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            'text-[12.5px] transition-colors',
            !yearly ? 'font-semibold text-white' : 'text-muted hover:text-white',
          )}
        >
          {pricing.monthly}
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={yearly}
          aria-label="Toggle annual billing"
          onClick={() => setYearly((v) => !v)}
          className={cn(
            'relative h-7 w-13 rounded-full border transition-colors duration-300',
            yearly ? 'border-accent/50 bg-accent' : 'border-line bg-white/10 hover:bg-white/15',
          )}
        >
          <motion.span
            layout
            transition={SPRING}
            className={cn(
              'absolute top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow',
              yearly ? 'left-[26px]' : 'left-0.5',
            )}
          />
        </button>

        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            'flex items-center gap-1.5 text-[12.5px] transition-colors',
            yearly ? 'font-semibold text-white' : 'text-muted hover:text-white',
          )}
        >
          {pricing.yearly}
          <span className="rounded-full bg-mint/10 px-1.5 py-0.5 text-[9.5px] font-medium text-mint">{pricing.yearlyNote}</span>
        </button>
      </Reveal>

      {/* plans */}
      <ScrollZoom from={0.95} y={44}>
      <Stagger className="grid items-stretch gap-4 md:grid-cols-3" step={0.08}>
        {pricing.plans.map((plan) => (
          <StaggerItem key={plan.name} className="h-full">
            <HoverLift lift={plan.popular ? -8 : -5} scale={1.008} className="h-full">
              <div
                className={cn(
                  'card-sheen relative flex h-full flex-col overflow-hidden rounded-xl border p-5 sm:p-6',
                  plan.popular
                    ? 'border-accent/35 bg-gradient-to-b from-accent/[0.09] via-transparent to-transparent shadow-[0_30px_80px_-40px_rgba(var(--a1-rgb),0.6)]'
                    : 'border-line bg-white/[0.015] hover:border-line-strong',
                )}
              >
                {plan.popular && (
                  <motion.span
                    initial={{ opacity: 0, y: -6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-cyan/40 bg-black/60 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-cyan"
                  >
                    <Sparkles className="h-2.5 w-2.5" /> popular
                  </motion.span>
                )}

                <h3 className="text-[14.5px] font-medium text-white">{plan.name}</h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={plan.price + String(yearly)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="font-mono text-[30px] leading-none tracking-tight text-white"
                    >
                      {yearly ? plan.yearlyPrice : plan.price}
                    </motion.span>
                  </AnimatePresence>
                  {(yearly ? plan.yearlyPrice : plan.price) !== 'Custom' && (
                    <span className="text-[11px] text-muted">/mo</span>
                  )}
                </div>

                <p className="mt-3 text-[12px] leading-relaxed text-muted">{plan.description}</p>

                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {plan.features.map((f, fi) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + fi * 0.03, duration: 0.35 }}
                      className="flex items-start gap-2 text-[11.5px] leading-relaxed text-white/75"
                    >
                      <Check className="mt-[3px] h-3 w-3 shrink-0 text-mint" strokeWidth={3} />
                      {f}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <ActionButton
                    onClick={() => smoothScrollTo('#contact')}
                    variant={plan.popular ? 'accent' : 'outline'}
                    size="md"
                    className="w-full"
                  >
                    {plan.cta}
                  </ActionButton>
                </div>
              </div>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
      </ScrollZoom>

      {/* guarantees */}
      <Stagger className="mt-8 flex flex-wrap justify-center gap-5" step={0.06} delay={0.15}>
        {pricing.guarantees.map((text, i) => {
          const Icon = guarantees[i];
          return (
            <StaggerItem key={text} distance={10}>
              <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2 text-[11.5px] text-muted">
                <Icon className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2} />
                {text}
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* comparison */}
      {withComparison && (
        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-x-auto rounded-xl border border-line bg-white/[0.012] p-4 no-scrollbar sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13.5px] font-semibold text-white">{pricing.comparison.title}</h3>
              <span className="font-mono text-[9px] text-dim sm:hidden">Scroll right →</span>
            </div>

            <table className="w-full min-w-[540px] border-collapse">
              <thead>
                <tr className="border-b border-line-strong">
                  <th className="py-2.5 pr-4 text-left font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim">Feature</th>
                  {pricing.comparison.columns.map((c, i) => (
                    <th
                      key={c}
                      className={cn(
                        'py-2.5 text-center font-mono text-[9.5px] uppercase tracking-[0.14em]',
                        i === 1 ? 'text-accent-soft' : 'text-muted',
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                {pricing.comparison.rows.map((row) => (
                  <motion.tr
                    key={row.name}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                    className="border-b border-white/[0.05]"
                  >
                    <td className="py-2.5 pr-4 text-[11.5px] text-white/80">{row.name}</td>
                    {row.values.map((v, vi) => (
                      <td key={vi} className={cn('py-2.5 text-center', vi === 1 && 'bg-accent/[0.03]')}>
                        <Cell value={v} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
