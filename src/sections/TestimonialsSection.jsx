import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/site';
import { Section, SectionHead, Stagger, StaggerItem, HoverLift, Marquee, Reveal, SPRING , ScrollZoom } from '../motion/kit';
import { Roller3D } from '../motion/ThreeD';
import { cn } from '../utils/cn';

export default function TestimonialsSection() {
  return (
    <Section id="testimonials">
      <SectionHead
        index={testimonials.index}
        badge={testimonials.badge}
        title={testimonials.title}
        titleAccent={testimonials.titleAccent}
        subtitle={testimonials.subtitle}
      />

      {/* 3D roller — the ring turns with the scroll, drag to spin it */}
      <div className="hidden lg:block">
        <Roller3D
          items={testimonials.items}
          height={420}
          gap={1}
          renderItem={(t, i, isActive) => (
            <figure
              className={cn(
                'card-sheen group relative flex h-[300px] flex-col overflow-hidden rounded-xl border p-5 transition-all duration-500',
                isActive
                  ? 'border-cyan/40 bg-[rgba(6,10,24,0.7)] backdrop-blur-xl shadow-[0_40px_120px_-50px_rgba(var(--a1-rgb),0.7)]'
                  : 'border-white/10 bg-[rgba(4,8,20,0.55)] backdrop-blur-md',
              )}
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/[0.07] blur-2xl"
                aria-hidden="true"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3 w-3 fill-signal text-signal" strokeWidth={0} />
                  ))}
                </div>
                <Quote className="h-3.5 w-3.5 text-white/15" strokeWidth={2} />
              </div>

              <blockquote className="mt-3 flex-1 overflow-hidden text-[12.5px] leading-relaxed text-white/80">
                “{t.quote}”
              </blockquote>

              <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3.5">
                <figcaption className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/[0.04] font-mono text-[10px] text-white/60">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <span>
                    <span className="block text-[11.5px] font-medium text-white">{t.name}</span>
                    <span className="block text-[9.5px] text-dim">
                      {t.role} · {t.company}
                    </span>
                  </span>
                </figcaption>
                <div className="text-right">
                  <div className="gradient-text font-mono text-[14px] font-bold">{t.metric}</div>
                  <div className="mt-0.5 max-w-[130px] text-[8.5px] leading-tight text-dim">{t.metricLabel}</div>
                </div>
              </div>
            </figure>
          )}
        />
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-dim/70">
          drag to spin · scroll to rotate
        </p>
      </div>

      {/* flat grid for tablet / mobile */}
      <ScrollZoom from={0.96} y={36} className="lg:hidden">
        <Stagger className="grid gap-4 md:grid-cols-2" step={0.06}>
          {testimonials.items.map((t, i) => (
            <StaggerItem key={t.name} className="h-full">
              <HoverLift lift={-6} scale={1.012} className="h-full">
                <figure
                  className={cn(
                    'card-sheen group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white/[0.015] p-5',
                    'transition-colors duration-300 hover:border-accent/25 hover:bg-white/[0.03]',
                  )}
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/[0.05] blur-2xl transition-colors duration-500 group-hover:bg-accent/[0.12]"
                    aria-hidden="true"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="h-3 w-3 fill-signal text-signal" strokeWidth={0} />
                      ))}
                    </div>
                    <Quote className="h-3.5 w-3.5 text-white/15" strokeWidth={2} />
                  </div>

                  <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-white/80">“{t.quote}”</blockquote>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3.5">
                    <figcaption className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white/[0.04] font-mono text-[10px] text-white/60">
                        {t.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                      <span>
                        <span className="block text-[11.5px] font-medium text-white">{t.name}</span>
                        <span className="block text-[9.5px] text-dim">
                          {t.role} · {t.company}
                        </span>
                      </span>
                    </figcaption>

                    <div className="text-right">
                      <div className="gradient-text font-mono text-[14px] font-bold">{t.metric}</div>
                      <div className="mt-0.5 max-w-[110px] text-[8.5px] leading-tight text-dim">{t.metricLabel}</div>
                    </div>
                  </div>
                </figure>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </ScrollZoom>

      <Reveal delay={0.1} className="mt-12 border-t border-line pt-8">
        <p className="label-mono-xs text-center text-dim">{testimonials.cloudLabel}</p>
        <Marquee
          items={['Quantum Health', 'TechFlow', 'Apex Realty', 'NovaStar', 'Meridian', 'Pinnacle', 'Acme Corp']}
          className="mt-4"
          itemClassName="text-[13px] font-semibold tracking-wide text-white/25 sm:text-[15px]"
          speed={34}
        />
      </Reveal>
    </Section>
  );
}
