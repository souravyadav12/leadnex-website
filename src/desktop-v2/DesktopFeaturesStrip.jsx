import { forwardRef } from 'react';
import { Layers, PlayCircle, CreditCard, ArrowRight } from 'lucide-react';

/**
 * DesktopFeaturesStrip
 * 3-tile teaser grid rising between 0.86 and 0.96.
 * Dimensions: left & right 5.9% W, bottom 4.7% H, height 16% H.
 */
export const DesktopFeaturesStrip = forwardRef(function DesktopFeaturesStrip(
  { onTileClick },
  ref
) {
  const tiles = [
    {
      icon: Layers,
      tag: 'CAPABILITIES',
      title: 'Features',
      desc: '16 enterprise voice capabilities',
      target: '#features',
      accent: '#00f0ff',
    },
    {
      icon: PlayCircle,
      tag: 'VOICE AGENTS',
      title: 'Live demo',
      desc: 'Sarah, Marcus, Rachel stream',
      target: '#demo',
      accent: '#38bdf8',
    },
    {
      icon: CreditCard,
      tag: 'TRANSPARENT PLANS',
      title: 'Pricing',
      desc: 'Starter, Growth, Enterprise',
      target: '#pricing',
      accent: '#00ff88',
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute select-none will-change-transform rounded-2xl border border-[#0a5c66] bg-[rgba(3,26,46,0.96)] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl"
      style={{
        left: '5.9vw',
        right: '5.9vw',
        bottom: '4.7vh',
        height: '16vh',
        display: 'none',
        opacity: 0,
        zIndex: 35,
      }}
    >
      <div className="grid h-full grid-cols-3 gap-3">
        {tiles.map((t, idx) => {
          const Icon = t.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onTileClick?.(t.target)}
              className="group flex h-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#020b17]/80 px-4 py-2 text-left transition-all hover:border-[#00f0ff]/50 hover:bg-[#04152a]"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] transition-colors group-hover:scale-105"
                  style={{ color: t.accent }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div
                    className="font-mono text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: t.accent }}
                  >
                    {t.tag}
                  </div>
                  <div className="font-sans text-[clamp(14px,1vw,16px)] font-extrabold text-white group-hover:text-[#00f0ff] transition-colors">
                    {t.title}
                  </div>
                  <div className="font-mono text-[11px] text-[#94a9c2] truncate">
                    {t.desc}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#94a9c2] transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default DesktopFeaturesStrip;
