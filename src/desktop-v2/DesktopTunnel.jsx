import { forwardRef } from 'react';

/**
 * DesktopTunnel
 * 5 perspective portal rings + central tunnel headline text.
 * Vanishing point: 50% W, 45.7% H.
 * Base ring size: 14.7% W x 39% H.
 */
export const DesktopTunnel = forwardRef(function DesktopTunnel(props, ref) {
  const { ringsContainerRef, tunnelTextRef, ringsRef } = ref || {};

  return (
    <>
      {/* ── 5 RECTANGULAR PORTAL RINGS ── */}
      <div
        ref={ringsContainerRef}
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        style={{ display: 'none', zIndex: 15 }}
      >
        {[0, 1, 2, 3, 4].map((k) => (
          <div
            key={k}
            ref={(el) => {
              if (ringsRef) ringsRef.current[k] = el;
            }}
            className="absolute rounded-lg"
            style={{
              top: '45.7%',
              left: '50%',
              width: '14.7vw',
              height: '39vh',
              transform: 'translate(-50%, -50%) scale(0.2)',
              border: `1.5px solid ${k % 2 === 0 ? '#00f0ff' : '#38bdf8'}`,
              boxShadow: `0 0 20px ${k % 2 === 0 ? 'rgba(0,240,255,0.25)' : 'rgba(56,189,248,0.25)'}`,
              willChange: 'transform, opacity',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── TUNNEL TEXT (CENTERED AT 68% OF H) ── */}
      <div
        ref={tunnelTextRef}
        className="absolute inset-x-0 pointer-events-none select-none text-center px-4 will-change-transform"
        style={{
          top: '68%',
          transform: 'translateY(-50%)',
          display: 'none',
          opacity: 0,
          zIndex: 25,
        }}
      >
        <div className="font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-[#00f0ff] mb-2">
          STAGE 03 // HQ CENTRAL PORTAL
        </div>
        <h2 className="font-sans text-[clamp(28px,2vw,40px)] font-black text-[#e6f4ff] tracking-tight leading-tight">
          Step inside the headquarters
        </h2>
        <p className="mt-1 font-mono text-[clamp(13px,0.9vw,16px)] text-[#94a9c2] tracking-wide">
          Leadnex HQ · Neural core mesh
        </p>
      </div>
    </>
  );
});

export default DesktopTunnel;
