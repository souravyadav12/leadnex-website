import { forwardRef } from 'react';
import { ArrowRight, PhoneCall, Cpu, Database, CheckCircle2 } from 'lucide-react';

/**
 * DesktopTunnel
 * Stage 3: Enterprise Architecture Flow & High-Velocity Orchestration
 * Replaces nested glowing cyber squares with a clean, credible 3-step enterprise diagram:
 * 01 Trigger -> 02 Neural Core (270ms) -> 03 Action & CRM Sync
 */
export const DesktopTunnel = forwardRef(function DesktopTunnel(props, ref) {
  const { ringsContainerRef, tunnelTextRef, ringsRef } = ref || {};

  return (
    <>
      {/* ── SUBTLE PERSPECTIVE DEPTH CONDUIT ── */}
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
            className="absolute rounded-xl"
            style={{
              top: '46%',
              left: '50%',
              width: '16vw',
              height: '38vh',
              transform: 'translate(-50%, -50%) scale(0.2)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.05)',
              willChange: 'transform, opacity',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── ENTERPRISE ARCHITECTURE FLOW (MAX-W-5XL) ── */}
      <div
        ref={tunnelTextRef}
        className="absolute inset-x-0 pointer-events-none select-none px-6 will-change-transform"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'none',
          opacity: 0,
          zIndex: 25,
        }}
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Header Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 backdrop-blur-md mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              High-Velocity Orchestration
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-sans text-[clamp(26px,2.2vw,38px)] font-black text-white tracking-tight leading-tight">
            Deterministic execution from trigger to CRM
          </h2>
          <p className="mt-1 font-sans text-[clamp(13px,0.95vw,16px)] text-slate-400 max-w-2xl mx-auto">
            Sub-300ms autonomous voice pipeline backed by carrier-grade infrastructure.
          </p>

          {/* 3-Step Enterprise Architecture Flow Diagram */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-left font-mono">
            
            {/* Step 01 */}
            <div className="relative rounded-xl border border-white/10 bg-[#030914]/90 p-4 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-cyan-400" />
                  <span className="text-[12px] font-bold text-white tracking-wider">01 TRIGGER</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  Instant
                </span>
              </div>
              <div className="mt-2.5 text-[12.5px] font-sans font-semibold text-slate-200">
                Inbound Call or Webhook Event
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-sans leading-relaxed">
                Form submission, lead routing event, or incoming SIP trunk.
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative rounded-xl border border-cyan-500/30 bg-[#030d1c]/95 p-4 backdrop-blur-xl shadow-[0_0_25px_rgba(0,240,255,0.08)]">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-[12px] font-bold text-white tracking-wider">02 NEURAL CORE</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  270ms SLA
                </span>
              </div>
              <div className="mt-2.5 text-[12.5px] font-sans font-semibold text-slate-200">
                STT + LLM Reasoning + TTS
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-sans leading-relaxed">
                Low-latency inference with real-time interruption handling.
              </div>
            </div>

            {/* Step 03 */}
            <div className="relative rounded-xl border border-white/10 bg-[#030914]/90 p-4 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span className="text-[12px] font-bold text-white tracking-wider">03 CRM SYNC</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  &lt; 1s
                </span>
              </div>
              <div className="mt-2.5 text-[12.5px] font-sans font-semibold text-slate-200">
                Action & Bi-directional Record
              </div>
              <div className="mt-1 text-[11px] text-slate-400 font-sans leading-relaxed">
                Slot booked on calendar & updated Salesforce / HubSpot data.
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
});

export default DesktopTunnel;
