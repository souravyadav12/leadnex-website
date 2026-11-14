import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { EASE, SPRING } from '../../motion/kit';

export const THEMES = [
  {
    id: 'blue',
    label: 'Blue',
    note: 'default',
    swatches: ['#3b82f6', '#93c5fd', '#64748b', '#06080c'],
  },
  {
    id: 'slate',
    label: 'Slate',
    note: 'gray',
    swatches: ['#94a3b8', '#e2e8f0', '#64748b', '#090a0c'],
  },
  {
    id: 'mono',
    label: 'Black',
    note: 'mono',
    swatches: ['#e4e6eb', '#ffffff', '#787c85', '#050506'],
  },
];

const DEFAULT_THEME = 'blue';
const STORAGE_KEY = 'leadnex-theme';

export function applyStoredTheme() {
  if (typeof document === 'undefined') return;
  const saved = localStorage.getItem(STORAGE_KEY);
  document.documentElement.dataset.theme = THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;
}

export default function ThemePalette({ align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(DEFAULT_THEME);
  const wrapRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    setActive(THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (id) => {
    setActive(id);
    document.documentElement.dataset.theme = id;
    localStorage.setItem(STORAGE_KEY, id);
  };

  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Colour palette"
        className={cn(
          'group flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors',
          open ? 'border-line-strong bg-white/[0.06]' : 'border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.05]',
        )}
      >
        <span className="flex items-center gap-[3px]">
          {current.swatches.slice(0, 3).map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10" style={{ background: c }} />
          ))}
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted group-hover:text-white sm:inline">
          {current.label}
        </span>
        <Palette className="h-3.5 w-3.5 text-dim transition-colors group-hover:text-accent-soft" strokeWidth={2} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Colour palette"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={cn(
              'absolute top-[calc(100%+10px)] z-50 w-[248px] overflow-hidden rounded-xl border border-line-strong bg-[var(--base-2)] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            <div className="flex items-center justify-between px-1.5 pb-1.5">
              <span className="label-mono-xs text-dim">colour palette</span>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-dim/70">blue · black · gray</span>
            </div>

            <div className="space-y-1">
              {THEMES.map((t) => {
                const isActive = active === t.id;
                return (
                  <motion.button
                    key={t.id}
                    type="button"
                    onClick={() => pick(t.id)}
                    whileHover={{ x: 2 }}
                    transition={SPRING}
                    aria-pressed={isActive}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border p-2 text-left transition-colors',
                      isActive
                        ? 'border-accent/40 bg-accent/[0.08]'
                        : 'border-transparent hover:border-line hover:bg-white/[0.03]',
                    )}
                  >
                    <span className="flex shrink-0 overflow-hidden rounded-md ring-1 ring-white/10">
                      {t.swatches.map((c) => (
                        <span key={c} className="h-7 w-[7px]" style={{ background: c }} />
                      ))}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-white">{t.label}</span>
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-dim">{t.note}</span>
                    </span>

                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                        isActive ? 'border-accent bg-accent text-[var(--base)]' : 'border-line text-transparent',
                      )}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={4} />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
