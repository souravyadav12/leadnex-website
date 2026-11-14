import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { SPRING } from '../../motion/kit';

export const THEMES = [
  { id: 'blue', label: 'Blue', swatch: ['#3b82f6', '#93c5fd'] },
  { id: 'slate', label: 'Slate', swatch: ['#94a3b8', '#e2e8f0'] },
  { id: 'mono', label: 'Black', swatch: ['#e4e6eb', '#787c85'] },
];

const DEFAULT_THEME = 'blue';

const STORAGE_KEY = 'leadnex-theme';

export function applyStoredTheme() {
  if (typeof document === 'undefined') return;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && THEMES.some((t) => t.id === saved)) {
    document.documentElement.dataset.theme = saved;
  }
}

export default function ThemeSwitch({ compact = false, className }) {
  const [active, setActive] = useState(DEFAULT_THEME);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    const valid = THEMES.some((t) => t.id === saved) ? saved : DEFAULT_THEME;
    setActive(valid);
    document.documentElement.dataset.theme = valid;
  }, []);

  const pick = (id) => {
    setActive(id);
    document.documentElement.dataset.theme = id;
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="group" aria-label="Colour theme">
      {!compact && <span className="label-mono-xs mr-1 hidden text-dim xl:inline">theme</span>}
      {THEMES.map((t) => {
        const isActive = active === t.id;
        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => pick(t.id)}
            whileHover={{ scale: 1.14, y: -1 }}
            whileTap={{ scale: 0.92 }}
            transition={SPRING}
            aria-label={`${t.label} theme`}
            aria-pressed={isActive}
            className={cn(
              'relative flex h-5 w-5 items-center justify-center rounded-full',
              isActive ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-[var(--base)]' : 'opacity-60 hover:opacity-100',
            )}
            style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
          >
            {isActive && <Check className="h-2.5 w-2.5 text-black/80" strokeWidth={4} />}
          </motion.button>
        );
      })}
    </div>
  );
}
