import { useState, useEffect, useRef } from 'react';
import { Palette, Check, ArrowUpRight } from 'lucide-react';

const THEMES = [
  { id: 'blue', label: 'Blue', note: 'default', swatches: ['#3b82f6', '#93c5fd', '#64748b', '#06080c'] },
  { id: 'slate', label: 'Slate', note: 'gray', swatches: ['#94a3b8', '#e2e8f0', '#64748b', '#090a0c'] },
  { id: 'mono', label: 'Black', note: 'mono', swatches: ['#e4e6eb', '#ffffff', '#787c85', '#050506'] },
];

const DEFAULT_THEME = 'blue';
const STORAGE_KEY = 'leadnex-theme';

/**
 * DesktopHeader
 * 72px fixed glass header for DesktopHeroV2.
 * - Left: Logo + "VOICE" tag (12px, #00f0ff)
 * - Center: Single pill group (Home, Features, Pricing, Contact)
 *   Animated active highlight moves to Features when p >= 0.86
 * - Right: Theme switcher dropdown + cyan "Book a demo" pill button
 * - Bottom: 2px cyan progress bar
 */
export default function DesktopHeader({ activeNav = 'Home', progressBarRef, onNavClick }) {
  const [themeOpen, setThemeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);
  const themeWrapRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    setCurrentTheme(THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME);
  }, []);

  useEffect(() => {
    if (!themeOpen) return;
    const onDown = (e) => {
      if (themeWrapRef.current && !themeWrapRef.current.contains(e.target)) {
        setThemeOpen(false);
      }
    };
    const onKey = (e) => e.key === 'Escape' && setThemeOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [themeOpen]);

  const selectTheme = (id) => {
    setCurrentTheme(id);
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
    setThemeOpen(false);
  };

  const navItems = [
    { id: 'Home', label: 'Home', target: '#top' },
    { id: 'Features', label: 'Features', target: '#features' },
    { id: 'Pricing', label: 'Pricing', target: '#pricing' },
    { id: 'Contact', label: 'Contact', target: '#contact' },
  ];

  return (
    <>
      {/* Hide the legacy desktop header when DesktopHeroV2 is active on >= 1024px */}
      <style>{`
        @media (min-width: 1024px) {
          header[role="banner"] {
            display: none !important;
          }
        }
      `}</style>

      <header
        className="fixed inset-x-0 top-0 z-50 h-[72px] select-none backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(2, 5, 14, 0.8)',
          borderBottom: '0.5px solid #0a3a52',
        }}
      >
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-[5.9%]">
        {/* Left: Logo + "VOICE" tag */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavClick?.('#top');
          }}
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="LEADNEX.AI Home"
        >
          <div className="relative flex h-8 w-8 items-center justify-center transition-transform group-hover:scale-105">
            <span className="absolute inset-0 rounded-[9px] bg-gradient-to-tr from-cyan via-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
            <span className="absolute inset-[3px] rounded-[6px] border border-white/50" />
            <span className="relative h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-extrabold tracking-tight text-white font-sans">
              LEADNEX.AI
            </span>
            <span className="font-mono text-[12px] font-bold tracking-widest text-[#00f0ff] uppercase">
              VOICE
            </span>
          </div>
        </a>

        {/* Center: ONE pill group */}
        <nav
          className="flex items-center rounded-full p-1 border border-[#0a3a52] bg-[#031526]/80 backdrop-blur-md"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavClick?.(item.target)}
                className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white bg-[#0a2a40] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-[#94a9c2] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme button + "Book a demo" pill button */}
        <div className="flex items-center gap-3.5">
          {/* Theme Palette Button */}
          <div ref={themeWrapRef} className="relative">
            <button
              type="button"
              onClick={() => setThemeOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0a3a52] bg-[#031526] text-[#94a9c2] hover:text-[#00f0ff] hover:border-[#00f0ff]/50 transition-colors"
              aria-label="Switch theme"
              aria-expanded={themeOpen}
            >
              <Palette className="h-4 w-4" />
            </button>

            {/* Theme Dropdown */}
            {themeOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#0a3a52] bg-[#020a16] p-2 shadow-2xl z-50 backdrop-blur-xl"
                role="menu"
              >
                <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#00f0ff]">
                  Select Palette
                </div>
                {THEMES.map((theme) => {
                  const isCur = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => selectTheme(theme.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12px] transition-colors ${
                        isCur ? 'bg-[#0a2a40] text-white font-bold' : 'text-[#94a9c2] hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {theme.swatches.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="h-3 w-3 rounded-full border border-black/50"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <span>{theme.label}</span>
                      </div>
                      {isCur && <Check className="h-3.5 w-3.5 text-[#00f0ff]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cyan "Book a demo" pill button */}
          <button
            type="button"
            onClick={() => onNavClick?.('#contact')}
            className="flex items-center gap-1.5 rounded-full bg-[#00f0ff] px-5 py-2 text-[13px] font-bold text-[#02222a] shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Book a demo</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2px cyan progress bar under header */}
      <div
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-[2px] w-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </header>
  </>
  );
}
