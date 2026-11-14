import { useEffect, useRef, useState } from 'react';
import { useNearView } from '../hooks/useNearView';
import { motion } from 'framer-motion';
import { Phone, Mic, Globe, Plug, Activity, AudioLines, Check, X } from 'lucide-react';
import { features } from '../data/site';
import { Section, SectionHead, Reveal, Stagger, StaggerItem, Tilt, HoverLift, EASE , ScrollZoom } from '../motion/kit';
import { cn } from '../utils/cn';

/* ── mini visuals ───────────────────────────────────────────────────────── */

/** Drives a number inside a string so the widget keeps breathing. */
function useDrift(base, spread, interval = 2200) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const next = prev + Math.round((Math.random() - 0.5) * spread);
        return Math.min(base + spread, Math.max(base - spread, next));
      });
    }, interval);
    return () => clearInterval(id);
  }, [base, spread, interval]);
  return v;
}

/** Renders a data row, swapping any "96%" style number for a live value. */
function LiveRow({ text, spread = 3 }) {
  const match = text.match(/\d+/);
  const base = match ? Number(match[0]) : null;
  const [box, near] = useNearView();
  const live = useDrift(near ? base ?? 0 : base ?? 0, spread);
  if (base === null) return <div className="font-mono text-[9.5px] text-muted">{text}</div>;
  return (
    <div ref={box} className="font-mono text-[9.5px] text-muted">
      {text.slice(0, match.index)}
      <span className="text-mint">{String(live).padStart(String(base).length, '0')}</span>
      {text.slice(match.index + match[0].length)}
    </div>
  );
}

/** A row that types itself out, pauses, then retypes — a live console feel. */
function TypingRow({ text, speed = 60 }) {
  const [count, setCount] = useState(text.length);
  const [box, near] = useNearView();
  useEffect(() => {
    if (!near) return;
    let i = text.length;
    let dir = -1;
    let timer;
    const step = () => {
      i += dir;
      if (i <= 0) {
        dir = 1;
        i = 0;
      }
      if (i >= text.length) {
        dir = -100; // pause at full text before erasing
        i = text.length;
      }
      setCount(Math.max(0, Math.min(text.length, i)));
      timer = setTimeout(step, dir < 0 && dir !== -1 ? 2600 : speed);
    };
    timer = setTimeout(step, 1800);
    return () => clearTimeout(timer);
  }, [text, speed, near]);

  const shown = text.slice(0, count);
  return (
    <div ref={box} className="font-mono text-[9.5px] text-muted">
      {shown}
      {count < text.length && <span className="ml-0.5 inline-block h-2.5 w-[2px] animate-pulse bg-accent-soft align-middle" />}
    </div>
  );
}

function Widget({ widget }) {
  if (!widget) return null;

  if (widget.kind === 'call') {
    return (
      <div className="mt-5 overflow-hidden rounded-lg border border-line bg-black/40">
        <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
          <span className="font-mono text-[8.5px] uppercase tracking-wider text-mint">{widget.rows[0]}</span>
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-mint"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>
        <div className="space-y-1 px-2.5 py-2">
          {widget.rows.slice(1, -1).map((r, i) => (
            <TypingRow key={r} text={r} speed={i === 0 ? 38 : 55} />
          ))}
          <LiveRow text={widget.rows[widget.rows.length - 1]} spread={2} />
        </div>
      </div>
    );
  }

  if (widget.kind === 'meter') {
    return <LiveMeter widget={widget} />;
  }

  if (widget.kind === 'voice') {
    return (
      <div className="mt-5 rounded-lg border border-line bg-black/40 p-2.5">
        <div className="font-mono text-[8.5px] uppercase tracking-wider text-dim">{widget.title}</div>
        <div className="mt-1.5 flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AudioLines className="h-3 w-3 text-accent-soft" />
          </motion.span>
          <div className="flex h-5 flex-1 items-center justify-between gap-[2px]">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                className="h-5 w-[3px] shrink-0 rounded-full bg-accent/70"
                style={{ transformOrigin: 'center' }}
                animate={{ scaleY: [0.3 + Math.abs(Math.sin(i * 0.9)) * 0.55, 0.55 + Math.abs(Math.sin(i * 0.9 + 1)) * 0.75, 0.3 + Math.abs(Math.sin(i * 0.9)) * 0.55] }}
                transition={{ duration: 0.9 + (i % 5) * 0.18, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 space-y-0.5">
          {widget.rows.map((r) => (
            <div key={r} className="font-mono text-[9px] text-muted">
              {r}
            </div>
          ))}
        </div>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-accent via-accent-soft to-mint"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    );
  }

  if (widget.kind === 'langs') {
    return <LangPicker />;
  }

  if (widget.kind === 'integrations') {
    return (
      <div className="mt-5 flex flex-wrap gap-1">
        {features.integrations.map((n, i) => (
          <motion.span
            key={n}
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 + i * 0.04 }}
            className="flex items-center gap-1 rounded border border-line bg-white/[0.03] px-1.5 py-0.5 font-mono text-[8.5px] text-muted"
          >
            <motion.span
              className="h-1 w-1 rounded-full bg-mint"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
            />
            {n}
          </motion.span>
        ))}
      </div>
    );
  }

  if (widget.kind === 'telemetry') {
    return (
      <div className="mt-5 grid gap-2 sm:grid-cols-4">
        {widget.rows.map((r, i) => (
          <TelemetryCell key={r.label} row={r} index={i} />
        ))}
      </div>
    );
  }

  return null;
}

function LiveMeter({ widget }) {
  const [v, setV] = useState(widget.value);
  const [box, near] = useNearView();
  useEffect(() => {
    if (!near) return;
    const id = setInterval(() => {
      setV((prev) => Math.min(widget.value, Math.max(widget.value - 7, prev + Math.round((Math.random() - 0.4) * 5))));
    }, 1600);
    return () => clearInterval(id);
  }, [widget.value, near]);

  return (
    <div ref={box} className="mt-5 rounded-lg border border-line bg-black/40 p-2.5">
      <div className="flex items-center justify-between font-mono text-[9px] text-dim">
        <span>latency</span>
        <span className="text-mint">{widget.label}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-accent to-mint"
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <motion.span
            className="absolute inset-y-0 right-0 w-8 bg-white/40 blur-[6px]"
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
}

function LangPicker() {
  const [active, setActive] = useState(0);
  const [box, near] = useNearView();
  useEffect(() => {
    if (!near) return;
    const id = setInterval(() => setActive((i) => (i + 1) % features.languages.length), 1700);
    return () => clearInterval(id);
  }, [near]);

  return (
    <div ref={box} className="mt-5 grid grid-cols-6 gap-1">
      {features.languages.map((l, i) => {
        const on = i === active;
        return (
          <motion.button
            key={l}
            type="button"
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.94 }}
            animate={{ opacity: on ? 1 : 0.75 }}
            className={cn(
              'relative rounded border px-1 py-0.5 text-center font-mono text-[8.5px] transition-colors duration-300',
              on ? 'border-accent/50 bg-accent/15 text-white' : 'border-line bg-white/[0.03] text-dim hover:text-white',
            )}
          >
            {l}
            {on && (
              <motion.span
                layoutId="lang-active"
                className="absolute inset-0 -z-10 rounded bg-accent/10"
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function TelemetryCell({ row, index }) {
  const match = row.value.match(/[\d.]+/);
  const base = match ? Number(match[0]) : 0;
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0;
  const [v, setV] = useState(base);
  const [box, near] = useNearView();
  useEffect(() => {
    if (!near) return;
    const id = setInterval(() => {
      setV((prev) => {
        const next = prev + (Math.random() - 0.35) * base * 0.03;
        return Math.min(base * 1.06, Math.max(base * 0.94, next));
      });
    }, 2100 + index * 260);
    return () => clearInterval(id);
  }, [base, index, near]);

  const display = match
    ? row.value.replace(match[0], v.toFixed(decimals).padStart(match[0].length, '0'))
    : row.value;

  return (
    <motion.div
      ref={box}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.45, ease: EASE }}
      whileHover={{ y: -3 }}
      className="rounded-lg border border-line bg-black/40 p-2.5"
    >
      <div className="font-mono text-[13px] font-bold text-white">{display}</div>
      <div className="mt-0.5 text-[9px] text-muted">{row.label}</div>
      <div className="mt-0.5 text-[8px] text-dim">{row.note}</div>
    </motion.div>
  );
}

const CARD_ICONS = [Phone, Activity, Mic, Globe, Plug, Activity];

export default function FeaturesSection({ showHead = true }) {
  return (
    <Section id="features">
      {showHead && (
        <SectionHead
          anchor3d="globe"
          index={features.index}
          badge={features.badge}
          title={features.title}
          titleAccent={features.titleAccent}
          subtitle={features.subtitle}
        />
      )}

      <ScrollZoom from={0.96} y={36}>
      <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" step={0.07}>
        {features.cards.map((card, i) => {
          const Icon = CARD_ICONS[i];
          return (
            <StaggerItem key={card.title} className={cn(card.wide && 'md:col-span-2 xl:col-span-2')}>
              <Tilt max={4} className="h-full">
                <HoverLift className="card-hairline card-sheen group flex h-full flex-col rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <motion.span
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/20 bg-accent/10"
                      >
                        <Icon className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2.25} />
                      </motion.span>
                      <span className="label-mono-xs text-dim">{card.code}</span>
                    </div>
                    <span className="font-mono text-[9px] text-white/15">0{i + 1}</span>
                  </div>

                  <h3 className="mt-3 text-[15.5px] font-semibold leading-snug tracking-tight text-white">{card.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{card.body}</p>
                  {card.note && (
                    <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-wider text-mint/80">{card.note}</p>
                  )}

                  <div className="mt-auto">
                    <Widget widget={card.widget} />
                  </div>
                </HoverLift>
              </Tilt>
            </StaggerItem>
          );
        })}
      </Stagger>
      </ScrollZoom>

      {/* comparison table */}
      <div className="mt-16 sm:mt-24">
        <Reveal className="mb-8">
          <h3 className="h-section text-[clamp(1.5rem,3.2vw,2.4rem)] text-white">
            {features.comparison.title}{' '}
            <span className="serif text-accent-soft">{features.comparison.titleAccent}</span>
          </h3>
          <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">{features.comparison.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-x-auto rounded-xl border border-line no-scrollbar">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-strong bg-white/[0.02]">
                  {features.comparison.columns.map((c, i) => (
                    <th
                      key={c}
                      className={cn(
                        'px-4 py-3 font-mono text-[9.5px] uppercase tracking-[0.14em]',
                        i === 0 && 'text-dim',
                        i === 1 && 'text-muted',
                        i === 2 && 'border-x border-accent/20 bg-accent/[0.07] text-accent-soft',
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
                viewport={{ once: true, amount: 0.15 }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                className="divide-y divide-white/[0.05]"
              >
                {features.comparison.rows.map((row) => (
                  <motion.tr
                    key={row.label}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                    }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                    className="text-[12px]"
                  >
                    <td className="px-4 py-3 font-mono text-[10.5px] text-muted">{row.label}</td>
                    <td className="px-4 py-3 text-white/45">
                      <span className="flex items-center gap-1.5">
                        <X className="h-3 w-3 shrink-0 text-white/20" strokeWidth={2.5} />
                        {row.old}
                      </span>
                    </td>
                    <td className="border-x border-accent/10 bg-accent/[0.03] px-4 py-3 text-white/85">
                      <span className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 shrink-0 text-mint" strokeWidth={3} />
                        {row.now}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
