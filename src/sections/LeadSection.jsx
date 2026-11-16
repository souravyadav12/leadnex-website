import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CalendarDays, Video, Clock, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { lead } from '../data/site';
import { Section, Reveal, Stagger, StaggerItem, ActionButton, Magnetic, EASE } from '../motion/kit';
import { cn } from '../utils/cn';

const fieldBase =
  'w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] text-white outline-none transition-all duration-300 placeholder:text-dim focus:bg-white/[0.05]';

export default function LeadSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    volume: '',
    message: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = lead.errors.name;
    if (!form.email.trim()) next.email = lead.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = lead.errors.emailInvalid;
    if (!form.company.trim()) next.company = lead.errors.company;
    if (!form.consent) next.consent = lead.errors.consent;
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        {/* left rail */}
        <div>
          <Reveal className="flex flex-wrap items-center gap-3">
            <span className="label-mono text-accent-soft">{lead.index}</span>
            <span className="h-px w-7 bg-line-strong" aria-hidden="true" />
            <span className="tag-bracket text-dim">{lead.badge}</span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="h-section mt-5 text-[clamp(1.85rem,4vw,3rem)] text-white">
              {lead.title} <span className="serif text-accent-soft">{lead.titleAccent}</span>
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted">{lead.subtitle}</p>
          </Reveal>

          <Stagger className="mt-7 space-y-2" step={0.05} delay={0.12}>
            <StaggerItem distance={10}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan font-bold">What you&apos;ll get:</p>
            </StaggerItem>
            {lead.benefits.map((b) => (
              <StaggerItem key={b} distance={10}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-cyan/40 hover:bg-cyan/[0.04] transition-all"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan border border-cyan/40">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span className="text-[12.5px] sm:text-[13px] text-slate-200 font-medium leading-snug">{b}</span>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* calendar card */}
          <Reveal delay={0.2} className="mt-7">
            <div className="rounded-xl border border-line bg-white/[0.015] p-4">
              <div className="flex items-center justify-between">
                <span className="label-mono-xs text-dim">{lead.calendarKicker}</span>
                <motion.span
                  className="flex items-center gap-1 rounded-full border border-mint/25 bg-mint/[0.07] px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-mint"
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  <span className="h-1 w-1 rounded-full bg-mint" /> available
                </motion.span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <CalendarDays className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2} />
                <span className="text-[13px] font-medium text-white">{lead.pickDate}</span>
                <span className="font-mono text-[9.5px] text-dim">— {lead.flexible}</span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {lead.calendar.map((c, i) => {
                  const Icon = i === 0 ? Clock : Video;
                  return (
                    <motion.div
                      key={c.title}
                      whileHover={{ y: -3 }}
                      className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.02] p-2.5"
                    >
                      <Icon className="h-3.5 w-3.5 text-accent-soft" strokeWidth={2} />
                      <div>
                        <div className="text-[11.5px] font-medium text-white">{c.title}</div>
                        <div className="font-mono text-[9px] text-dim">{c.note}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-2.5 font-mono text-[9px] leading-relaxed text-dim">{lead.calendarNote}</p>
            </div>
          </Reveal>
        </div>

        {/* form */}
        <Reveal direction="right" delay={0.1}>
          <div className="edge-light relative overflow-hidden rounded-xl border border-white/10 bg-[rgba(4,8,20,0.65)] backdrop-blur-xl p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="py-8 text-center"
                >
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-mint/40 bg-mint/10"
                  >
                    <CheckCircle2 className="h-6 w-6 text-mint" strokeWidth={2.5} />
                  </motion.span>
                  <h3 className="mt-4 text-[16px] font-semibold text-white">{lead.successTitle}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[12.5px] leading-relaxed text-muted">{lead.successBody}</p>
                  <button
                    type="button"
                    onClick={() => setDone(false)}
                    className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-soft hover:text-white"
                  >
                    send another →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  noValidate
                  className="space-y-3.5"
                >
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="label-mono-xs text-dim">
                        {lead.fields.name}
                      </label>
                      <input
                        id="name"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="John Smith"
                        aria-invalid={!!errors.name}
                        className={cn(fieldBase, 'mt-1.5', errors.name ? 'border-danger/60' : 'border-line focus:border-accent/60')}
                      />
                      <FieldError msg={errors.name} />
                    </div>

                    <div>
                      <label htmlFor="email" className="label-mono-xs text-dim">
                        {lead.fields.email}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="john@company.com"
                        aria-invalid={!!errors.email}
                        className={cn(fieldBase, 'mt-1.5', errors.email ? 'border-danger/60' : 'border-line focus:border-accent/60')}
                      />
                      <FieldError msg={errors.email} />
                    </div>

                    <div>
                      <label htmlFor="phone" className="label-mono-xs text-dim">
                        {lead.fields.phone}
                      </label>
                      <input
                        id="phone"
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="+1 (555) 000-0000"
                        className={cn(fieldBase, 'mt-1.5 border-line focus:border-accent/60')}
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="label-mono-xs text-dim">
                        {lead.fields.company}
                      </label>
                      <input
                        id="company"
                        value={form.company}
                        onChange={set('company')}
                        placeholder="Acme Corp"
                        aria-invalid={!!errors.company}
                        className={cn(fieldBase, 'mt-1.5', errors.company ? 'border-danger/60' : 'border-line focus:border-accent/60')}
                      />
                      <FieldError msg={errors.company} />
                    </div>

                    <div>
                      <label htmlFor="industry" className="label-mono-xs text-dim">
                        {lead.fields.industry}
                      </label>
                      <select
                        id="industry"
                        value={form.industry}
                        onChange={set('industry')}
                        className={cn(fieldBase, 'mt-1.5 cursor-pointer appearance-none border-line focus:border-accent/60')}
                      >
                        <option value="" className="bg-[var(--base-2)]">
                          {lead.fields.industry}
                        </option>
                        {lead.industries.map((i) => (
                          <option key={i} value={i} className="bg-[var(--base-2)]">
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="volume" className="label-mono-xs text-dim">
                        {lead.fields.volume}
                      </label>
                      <select
                        id="volume"
                        value={form.volume}
                        onChange={set('volume')}
                        className={cn(fieldBase, 'mt-1.5 cursor-pointer appearance-none border-line focus:border-accent/60')}
                      >
                        <option value="" className="bg-[var(--base-2)]">
                          {lead.fields.volumePlaceholder}
                        </option>
                        {lead.volumes.map((v) => (
                          <option key={v} value={v} className="bg-[var(--base-2)]">
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label-mono-xs text-dim">
                      {lead.fields.message}
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={form.message}
                      onChange={set('message')}
                      placeholder={lead.fields.message}
                      className={cn(fieldBase, 'mt-1.5 resize-none border-line focus:border-accent/60')}
                    />
                  </div>

                  <label className="flex cursor-pointer items-start gap-2.5">
                    <span className="relative mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={set('consent')}
                        aria-invalid={!!errors.consent}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-line bg-white/[0.03] transition-colors checked:border-accent checked:bg-accent"
                      />
                      <Check className="pointer-events-none absolute h-2.5 w-2.5 scale-0 text-white transition-transform peer-checked:scale-100" strokeWidth={4} />
                    </span>
                    <span className="text-[10.5px] leading-relaxed text-dim">{lead.fields.consent}</span>
                  </label>
                  <FieldError msg={errors.consent} />

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Magnetic strength={0.16}>
                      <ActionButton type="submit" variant="accent" size="md" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                        {lead.submit}
                      </ActionButton>
                    </Magnetic>
                    <ActionButton type="button" variant="ghost" size="md" icon={<PhoneCall className="h-3.5 w-3.5" />}>
                      {lead.trial}
                    </ActionButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function FieldError({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-1 overflow-hidden text-[10.5px] text-danger"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
