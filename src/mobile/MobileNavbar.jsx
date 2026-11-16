import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, PhoneCall } from 'lucide-react';
import { site, nav } from '../data/site';
import ThemePalette from '../components/layout/ThemePalette';
import { cn } from '../utils/cn';

/**
 * MobileNavbar
 * Dedicated mobile header for <MobileHero />:
 * - Logo + small "VOICE" tag + hamburger icon ONLY (no horizontal overflow at 360px).
 * - ThemePalette in drawer.
 * - Thin 2px cyan progress bar right under the header showing scroll progress 0 to 100%.
 */
export default function MobileNavbar({ scrollProgress = 0, progressBarRef }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const progressPercent = Math.max(0, Math.min(100, Math.round(scrollProgress * 100)));

  return (
    <>
      {/* Hide desktop header strictly on mobile viewports */}
      <style>{`
        @media (max-width: 767px) {
          header[role="banner"] {
            display: none !important;
          }
        }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-[60] h-14 bg-[#02050e]/95 backdrop-blur-md border-b border-cyan/20 px-4 flex items-center justify-between">
        {/* Brand Logo & Voice Tag */}
        <Link
          to="/"
          onClick={() => {
            setOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2"
          aria-label="LEADNEX.AI Home"
        >
          <span className="relative flex h-7 w-7 items-center justify-center flex-shrink-0">
            <span className="absolute inset-0 rounded-[8px] bg-gradient-to-tr from-cyan via-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(0,240,255,0.4)]" />
            <span className="absolute inset-[2.5px] rounded-[5.5px] border border-white/50" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-extrabold tracking-tight text-white">{site.name}</span>
            <span className="text-cyan font-mono tracking-widest text-[9.5px] font-bold uppercase">VOICE</span>
          </span>
        </Link>

        {/* Clean Hamburger Button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/[0.08] text-cyan hover:bg-cyan/20 active:scale-95 transition-all"
          aria-label={open ? 'Close Menu' : 'Open Menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Thin 2px Cyan Progress Bar under the header */}
        <div className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-white/[0.08] pointer-events-none">
          <div
            ref={progressBarRef}
            className="h-full bg-cyan shadow-[0_0_8px_#00f0ff] origin-left will-change-transform"
            style={{ width: '100%', transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </header>

      {/* Slide-over Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-lg"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-[#030914] border-l border-cyan/30 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan animate-ping" />
                    <span className="font-mono text-xs uppercase tracking-widest text-cyan font-bold">Menu</span>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="mt-6 flex flex-col gap-2">
                  {nav.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all',
                          isActive
                            ? 'bg-cyan/15 text-cyan border border-cyan/40 font-semibold'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        )
                      }
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-50" />
                    </NavLink>
                  ))}
                </nav>

                {/* ThemePalette inside mobile drawer */}
                <div className="mt-8 pt-5 border-t border-white/10">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">Color Palette</div>
                  <ThemePalette align="left" />
                </div>
              </div>

              {/* Drawer Bottom CTA */}
              <div className="pt-6 border-t border-white/10">
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan font-bold text-slate-950 text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Book Enterprise Demo</span>
                </Link>
                <div className="mt-3 text-center font-mono text-[10px] text-slate-400">
                  Sub-300ms Autonomous Telephony
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
