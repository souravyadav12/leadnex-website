import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Check, Globe, MessageCircle, BookOpen, Video } from 'lucide-react';
import { footer, site } from '../../data/site';
import { Reveal, Stagger, StaggerItem, SplitText, Magnetic, EASE } from '../../motion/kit';
import { smoothScrollTo } from '../../motion/SmoothScroll';
import { cn } from '../../utils/cn';

const SOCIAL_ICONS = [Globe, MessageCircle, BookOpen, Video];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle');

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState('error');
      return;
    }
    setState('done');
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-[var(--base)]/80 backdrop-blur-md" role="contentinfo">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />

      {/* masthead */}
      <div className="u-shell relative pt-14 sm:pt-18">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-line pb-10 lg:flex-row lg:items-end">
          <div>
            <span className="label-mono text-accent-soft">{footer.kicker}</span>
            <h2 className="h-section mt-3 max-w-xl text-[clamp(1.7rem,3.6vw,2.6rem)] text-white">
              <SplitText text={footer.headline} />{' '}
              <span className="serif text-accent-soft">{footer.headlineAccent}</span>
            </h2>
          </div>
          <Magnetic strength={0.18}>
            <button
              type="button"
              onClick={() => smoothScrollTo('#contact')}
              className="group inline-flex items-center gap-2 self-start border-b border-white/20 pb-1 text-[12.5px] font-semibold text-white transition-colors hover:border-accent lg:self-auto"
            >
              {footer.link}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </Magnetic>
        </Reveal>
      </div>

      <div className="u-shell relative py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-8">
          {/* brand */}
          <Reveal>
            <Link to="/" className="flex items-center gap-2.5" aria-label="LeadNex AI Home">
              <motion.span
                whileHover={{ rotate: 16 }}
                className="relative flex h-7 w-7 items-center justify-center"
              >
                <span className="absolute inset-0 rounded-[9px] bg-primary/90" />
                <span className="absolute inset-[3px] rounded-[6px] border border-white/40" />
                <span className="relative h-[5px] w-[5px] rounded-full bg-white" />
              </motion.span>
              <span className="flex items-baseline gap-1">
                <span className="text-[15px] font-semibold tracking-tight text-white">{site.name}</span>
                <span className="label-mono-xs text-accent-soft">ai</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-[12.5px] leading-relaxed text-muted">{footer.description}</p>

            <div className="mt-5">
              <p className="label-mono-xs text-dim">{footer.newsletter.label}</p>
              <AnimatePresence mode="wait" initial={false}>
                {state === 'done' ? (
                  <motion.p
                    key="done"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-1.5 text-[12px] text-mint"
                    role="status"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    {footer.newsletter.success}
                  </motion.p>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={submit}
                    noValidate
                    className="mt-2 flex max-w-sm gap-2"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === 'error') setState('idle');
                      }}
                      placeholder={footer.newsletter.placeholder}
                      aria-label={footer.newsletter.placeholder}
                      aria-invalid={state === 'error' || undefined}
                      className={cn(
                        'min-w-0 flex-1 rounded-lg border bg-white/[0.03] px-3 py-2 text-[12.5px] text-white outline-none transition-colors placeholder:text-dim focus:border-accent/60',
                        state === 'error' ? 'border-danger/60' : 'border-line',
                      )}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      className="shrink-0 rounded-lg border border-line-strong px-3 py-2 text-[11.5px] font-medium text-white transition-colors hover:bg-white/[0.06]"
                    >
                      {footer.newsletter.cta}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
              {state === 'error' && <p className="mt-1.5 text-[10.5px] text-danger">{footer.newsletter.error}</p>}
            </div>

            <div className="mt-5 flex gap-2">
              {footer.socials.map((label, i) => {
                const Icon = SOCIAL_ICONS[i];
                return (
                  <motion.a
                    key={label}
                    href="#"
                    aria-label={label}
                    whileHover={{ y: -3, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white/[0.03] text-muted transition-colors hover:border-line-strong hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </motion.a>
                );
              })}
            </div>
          </Reveal>

          {/* link columns */}
          {footer.columns.map((col, ci) => (
            <Stagger key={col.title} className="space-y-2.5" step={0.04} delay={ci * 0.05}>
              <StaggerItem distance={8}>
                <h3 className="label-mono-xs text-dim">{col.title}</h3>
              </StaggerItem>
              {col.links.map((l) => (
                <StaggerItem key={l.label} distance={8}>
                  <FooterLink item={l} />
                </StaggerItem>
              ))}
            </Stagger>
          ))}
        </div>

        {/* bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 sm:flex-row">
          <p className="font-mono text-[10.5px] text-dim">
            © {new Date().getFullYear()} {site.legal} All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10.5px] text-dim">
            {footer.legalLinks.map((l) => (
              <motion.span key={l} whileHover={{ y: -1 }} className="cursor-default transition-colors hover:text-white">
                {l}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* ghost wordmark */}
      <div className="pointer-events-none relative -mb-4 select-none overflow-hidden" aria-hidden="true">
        <motion.div
          className="u-shell"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text text-[19vw] font-semibold leading-[0.78] tracking-[-0.05em] text-transparent">
            {site.name}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ item }) {
  const content = (
    <motion.span
      whileHover={{ x: 3 }}
      transition={{ duration: 0.22 }}
      className="inline-flex items-center gap-1 text-[12.5px] text-muted transition-colors hover:text-white"
    >
      {item.label}
    </motion.span>
  );

  if (item.href?.startsWith('/#')) {
    return (
      <button
        type="button"
        onClick={() => smoothScrollTo(item.href.replace('/#', '#'))}
        className="text-left"
      >
        {content}
      </button>
    );
  }
  if (item.href) {
    return <Link to={item.href}>{content}</Link>;
  }
  return <span className="cursor-default select-none text-[12.5px] text-muted/40">{item.label}</span>;
}
