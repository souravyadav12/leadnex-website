import { useState, forwardRef } from 'react';
import { Mic, Zap, Check, ArrowRight } from 'lucide-react';

/**
 * DesktopCards
 * Card 1: AI Calling & Voice Agents
 * Card 2: Speed-to-Lead & Architecture Benchmark
 * Both emerge sequentially from the vanishing point (50% W, 45.7% H)
 */
export const DesktopCards = forwardRef(function DesktopCards({ onActionClick }, ref) {
  const { card1Ref, card2Ref } = ref || {};
  const [selectedVoice, setSelectedVoice] = useState('Sarah');

  const heights = [35, 65, 45, 80, 55, 90, 40, 75, 95, 60, 85, 50, 70, 90, 45, 80, 60, 95, 75, 40, 85, 55, 70, 90];

  return (
    <>
      {/* ── CARD 1: AI CALLING & VOICE AGENTS ── */}
      <div
        ref={card1Ref}
        className="absolute select-none will-change-transform rounded-[14px] border border-[#0a5c66] bg-[rgba(3,26,46,0.95)] shadow-[0_20px_60px_rgba(0,240,255,0.2)] backdrop-blur-md"
        style={{
          top: '20.9vh',
          left: '10.3vw',
          width: '36.8vw',
          maxHeight: '62vh',
          padding: 'clamp(14px, 1.2vw, 24px)',
          display: 'none',
          opacity: 0,
          zIndex: 30,
        }}
      >
        {/* Top Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/[0.1] px-3 py-1">
          <Mic className="h-3.5 w-3.5 text-[#00f0ff]" />
          <span className="font-mono text-[clamp(10px,0.7vw,11.5px)] font-bold uppercase tracking-wider text-[#00f0ff]">
            AI CALLING AND VOICE AGENTS
          </span>
        </div>

        {/* Heading */}
        <h3 className="mt-2 text-[clamp(20px,1.5vw,28px)] font-black tracking-tight text-white leading-tight">
          Real conversations, <br />
          <span className="text-[#00f0ff]">sub-300ms speed.</span>
        </h3>

        {/* 3 Voice Chips */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { id: 'Sarah', name: 'Sarah (Executive)', lat: '265ms' },
            { id: 'Marcus', name: 'Marcus (SDR Rep)', lat: '280ms' },
            { id: 'Rachel', name: 'Rachel (24/7 Care)', lat: '270ms' },
          ].map((v) => {
            const isActive = selectedVoice === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVoice(v.id)}
                className={`rounded-xl border p-2 text-left transition-all ${
                  isActive
                    ? 'border-[#00f0ff] bg-[#00f0ff]/[0.18] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] flex-shrink-0 animate-pulse" />
                  )}
                  <span className="font-bold text-[clamp(11px,0.75vw,13px)] text-white truncate">
                    {v.name}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-[#00f0ff] mt-0.5">{v.lat}</div>
              </button>
            );
          })}
        </div>

        {/* Live Synthesis Stream Box */}
        <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#020b17]/90 p-2.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.08] font-mono text-[10px]">
            <span className="text-[#00f0ff] font-bold">Active Stream · {selectedVoice}</span>
            <span className="text-[#00ff88] font-bold">● Live synthesis</span>
          </div>

          {/* Equalizer Bars */}
          <div className="flex items-center justify-between gap-1 h-7 py-1 px-1">
            {heights.map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-blue-600 via-[#00f0ff] to-white animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i * 0.05) % 0.8}s`,
                  animationDuration: `${0.8 + (i % 4) * 0.15}s`,
                }}
              />
            ))}
          </div>

          <div className="text-[11px] text-slate-300 font-mono mt-1 truncate">
            &ldquo;Hello! Calling from LEADNEX.AI regarding your enterprise voice demo...&rdquo;
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-white/[0.08] text-center font-mono">
          <div>
            <div className="text-[9px] text-[#94a9c2] uppercase">Latency</div>
            <div className="text-[12px] font-bold text-[#00f0ff]">274ms</div>
          </div>
          <div>
            <div className="text-[9px] text-[#94a9c2] uppercase">Voice MOS</div>
            <div className="text-[12px] font-bold text-[#00ff88]">4.92 / 5.0</div>
          </div>
          <div>
            <div className="text-[9px] text-[#94a9c2] uppercase">Speed to Lead</div>
            <div className="text-[12px] font-bold text-white">&lt; 12s</div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: SPEED-TO-LEAD & ARCHITECTURE BENCHMARK ── */}
      <div
        ref={card2Ref}
        className="absolute select-none will-change-transform rounded-[14px] border border-[#0a5c66] bg-[rgba(3,26,46,0.95)] shadow-[0_20px_60px_rgba(2,132,199,0.2)] backdrop-blur-md"
        style={{
          top: '20.9vh',
          left: '53vw',
          width: '36.8vw',
          maxHeight: '62vh',
          padding: 'clamp(14px, 1.2vw, 24px)',
          display: 'none',
          opacity: 0,
          zIndex: 30,
        }}
      >
        {/* Top Chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/[0.1] px-3 py-1">
          <Zap className="h-3.5 w-3.5 text-[#38bdf8]" />
          <span className="font-mono text-[clamp(10px,0.7vw,11.5px)] font-bold uppercase tracking-wider text-[#38bdf8]">
            SPEED-TO-LEAD · ARCHITECTURE BENCHMARK
          </span>
        </div>

        {/* Big Outdial Speed Metric */}
        <div className="mt-2">
          <div className="text-[11px] font-mono text-[#94a9c2] uppercase">Average outdial speed</div>
          <div className="text-[clamp(24px,1.9vw,34px)] font-black text-white tracking-tight leading-none mt-0.5">
            &lt; 12s <span className="text-[#00f0ff] text-[clamp(14px,1.1vw,18px)] font-bold">lead to first call</span>
          </div>
        </div>

        {/* Comparison Bars */}
        <div className="mt-3 flex flex-col gap-2 font-mono">
          <div>
            <div className="flex justify-between text-[11px] text-[#00f0ff] font-bold mb-1">
              <span>LEADNEX AI Calling</span>
              <span>&lt; 12 seconds</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                style={{ width: '94%' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[#94a9c2] mb-1">
              <span>Legacy call center</span>
              <span>4 - 8 hours</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full bg-slate-600 opacity-60"
                style={{ width: '14%' }}
              />
            </div>
          </div>
        </div>

        {/* Enterprise Architecture Verification Rows */}
        <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#020b17]/90 p-2.5 font-mono text-[11px] space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Lead Response:</span>
            <span className="text-[#00f0ff] font-bold">8.2s Auto-Dial</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>BANT Qualification:</span>
            <span className="text-[#00ff88] font-bold">Budget & Need Verified</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Salesforce & HubSpot Sync:</span>
            <span className="text-white font-bold">&lt; 1s Automated Record</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Calendar Booking:</span>
            <span className="text-[#00f0ff] font-bold">Slot Locked</span>
          </div>
        </div>
      </div>
    </>
  );
});

export default DesktopCards;
