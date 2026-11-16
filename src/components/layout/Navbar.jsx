import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { nav, site } from '../../data/site';
import { ActionButton, Magnetic, EASE, SPRING } from '../../motion/kit';
import { smoothScrollTo } from '../../motion/SmoothScroll';
import { cn } from '../../utils/cn';
import ThemePalette from './ThemePalette';

function Logo({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-2.5" aria-label="LEADNEX.AI Home">
      <motion.span
        whileHover={{ rotate: 18, scale: 1.06 }}
        transition={SPRING}
        className="relative flex h-7 w-7 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-[9px] bg-gradient-to-tr from-cyan via-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
        <span className="absolute inset-[3px] rounded-[6px] border border-white/50" />
        <motion.span
          className="relative h-[6px] w-[6px] rounded-full bg-white shadow-[0_0_8px_#ffffff]"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[16px] font-extrabold tracking-tight text-white">{site.name}</span>
        <span className="label-mono-xs text-cyan font-mono tracking-widest text-[10px] uppercase">VOICE</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 14));

  useEffect(() => {
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMobile(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          scrolled ? 'border-b border-line bg-[var(--base-2)]/92 backdrop-blur-md' : 'border-b border-transparent',
        )}
        role="banner"
      >
        <div className={cn('u-shell flex items-center justify-between gap-6 transition-all duration-500', scrolled ? 'h-14' : 'h-16')}>
          <Logo
            onClick={() => {
              setMobile(false);
              if (pathname === '/') scrollToTop();
            }}
          />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {nav.links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => {
                  if (link.to === '/' && pathname === '/') {
                    scrollToTop();
                  }
                }}
                className="relative"
              >
                {({ isActive }) => (
                  <motion.span
                    whileHover={{ y: -1 }}
                    className={cn(
                      'relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] transition-colors',
                      isActive ? 'text-white' : 'text-muted hover:text-white',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-full border border-line bg-white/[0.06]"
                      />
                    )}
                    <span className="relative font-mono text-[9px] text-accent-soft/70">{link.number}</span>
                    <span className="relative">{link.label}</span>
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemePalette />

            <Magnetic strength={0.14} className="hidden sm:block">
              <ActionButton
                onClick={() => smoothScrollTo('#contact')}
                variant="solid"
                size="sm"
                iconRight={<ArrowUpRight className="h-3.5 w-3.5" />}
              >
                {nav.cta}
              </ActionButton>
            </Magnetic>

            <motion.button
              type="button"
              onClick={() => setMobile((v) => !v)}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-white lg:hidden"
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              aria-expanded={mobile}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobile ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-[var(--base-2)] pt-16 lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
              className="u-shell py-8"
            >
              {nav.links.map((link) => (
                <motion.div
                  key={link.to}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
                >
                  <Link
                    to={link.to}
                    onClick={() => {
                      setMobile(false);
                      if (link.to === '/' && pathname === '/') {
                        scrollToTop();
                      }
                    }}
                    className="flex items-baseline justify-between border-b border-line py-3.5 text-xl font-medium tracking-tight text-white"
                  >
                    {link.label}
                    <span className="font-mono text-[10px] text-dim">{link.number}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
                className="mt-7 flex flex-col gap-3"
              >
                <ActionButton
                  onClick={() => {
                    setMobile(false);
                    smoothScrollTo('#contact');
                  }}
                  variant="solid"
                  size="md"
                  className="w-full"
                >
                  {nav.cta}
                </ActionButton>
                <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-line px-3.5 py-3">
                  <span className="label-mono-xs text-dim">colour palette</span>
                  <ThemePalette />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
