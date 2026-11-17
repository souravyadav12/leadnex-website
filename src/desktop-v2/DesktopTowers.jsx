import { forwardRef } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wifi, 
  Cpu, 
  Globe2, 
  Zap, 
  PhoneCall, 
  CheckCircle2, 
  Database 
} from 'lucide-react';

/**
 * SpeechClusterWaveform
 * Real-time animated speech synthesis audio waveform:
 * Continuously modualting phoneme bursts, variable heights, natural silence pauses, no background grid.
 */
function SpeechClusterWaveform({ spectrum }) {
  // Default fallback bars if spectrum not yet loaded
  const defaultBars = [
    18, 48, 85, 96, 72, 35, 8, 8, 8, 28, 65, 92, 98, 78, 45, 8, 8, 35, 78, 92, 85, 52, 8, 8, 25, 62, 42, 18
  ];
  const bars = spectrum && spectrum.length ? spectrum : defaultBars;

  return (
    <div className="flex flex-col justify-end pt-2">
      <div className="flex items-center justify-between pb-1 font-mono text-[10.5px] text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          SPEECH SYNTHESIS STREAM
        </span>
        <span className="text-cyan-400 font-mono text-[10px] font-semibold">24kHz PCM</span>
      </div>
      
      <div className="relative flex items-end justify-between gap-[3px] h-[58px] rounded-xl border border-white/10 bg-[#020712] px-3 py-1.5 overflow-hidden shadow-inner">
        {bars.map((h, i) => {
          const isSilent = h <= 10;
          return (
            <div key={i} className="flex-1 flex flex-col justify-end h-full items-center">
              <div
                className="w-full rounded-t-sm transition-all duration-75 ease-out"
                style={{
                  height: `${h}%`,
                  backgroundColor: isSilent ? 'rgba(148, 163, 184, 0.22)' : 'rgba(0, 240, 255, 0.90)',
                  boxShadow: isSilent ? 'none' : '0 0 8px rgba(0, 240, 255, 0.45)',
                }}
              />
            </div>
          );
        })}
      </div>
      
      {/* High-Contrast Frequency Labels */}
      <div className="flex justify-between font-mono text-[9px] text-slate-400 font-medium pt-1 px-1">
        <span>100Hz</span>
        <span>1kHz</span>
        <span>8kHz</span>
        <span>16kHz</span>
      </div>
    </div>
  );
}

/**
 * DesktopTowers - Dynamic Live Product Telemetry & Global Grid
 *
 * Rules:
 * - Content frames are continuously dynamic (real-time live speech waveform, live calls ticker, jitter latency).
 * - Gentle 2.5° tilt (easy to read, zero edge clipping, clear visual hierarchy).
 * - Hairline neutral borders (border-white/10) with subtle dark navy surfaces.
 * - Single-line compliance trust line with clean bullet separation (zero text wrapping bugs).
 */
export const DesktopTowers = forwardRef(function DesktopTowers(
  { telemetry, callsDisplayRef },
  ref
) {
  const { tower1Ref, tower2Ref } = ref || {};

  const regions = telemetry?.regions || [
    { name: 'US East · iad', ping: '11ms', isAmber: false },
    { name: 'US West · sfo', ping: '18ms', isAmber: false },
    { name: 'EU Central · fra', ping: '22ms', isAmber: false },
    { name: 'AP Northeast · nrt', ping: '38ms', isAmber: true },
  ];

  const primaryPing = regions[0]?.ping || '11ms';

  return (
    <>
      <style>{`
        @keyframes desktopTowerFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes desktopTowerFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .tower-float-1 {
          animation: desktopTowerFloat1 8s ease-in-out infinite;
        }
        .tower-float-2 {
          animation: desktopTowerFloat2 8s ease-in-out infinite 0.6s;
        }
      `}</style>

      {/* ── TOWER 01 (AUTONOMOUS VOICE ENGINE) ── */}
      <div
        ref={tower1Ref}
        className="absolute will-change-transform select-none"
        style={{
          top: '14vh',
          left: 'calc(100vw - 64px - 2 * clamp(270px, 20vw, 345px) - 24px)',
          height: '66vh',
          width: 'clamp(270px, 20vw, 345px)',
          transform: 'perspective(1400px) rotateY(2.5deg)',
          transformOrigin: 'center center',
          zIndex: 20,
        }}
      >
        <div className="tower-float-1 relative flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#030914]/95 p-4 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
          
          {/* Subtle Top Specular Line */}
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Header Row */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                Voice Engine
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Live Telemetry
            </div>
          </div>

          {/* Hero Metric Section: ONE Big Prominent Number */}
          <div className="pt-2 pb-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Active Concurrent Calls
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span 
                ref={callsDisplayRef} 
                className="font-sans text-[clamp(28px,2.2vw,40px)] font-black tracking-tight text-white tabular-nums drop-shadow-[0_2px_10px_rgba(0,240,255,0.25)]"
              >
                {telemetry?.activeCallsFormatted || '12,518'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5">
              LEADNEX autonomous neural telephony
            </div>
          </div>

          {/* Secondary Telemetry Rows (Lighter styling, dynamic numbers) */}
          <div className="flex flex-col gap-1.5 font-mono text-[11.5px]">
            {/* Latency */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-300">Edge Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-semibold text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Sub-300ms
                </span>
                <span className="font-bold text-emerald-400 tabular-nums transition-colors duration-200">
                  {telemetry?.voiceLatency || '268ms'}
                </span>
              </div>
            </div>

            {/* SLA */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-slate-300">Carrier Uptime SLA</span>
              </div>
              <span className="font-bold text-emerald-400 tabular-nums">
                {telemetry?.telephonySla || '99.99%'}
              </span>
            </div>

            {/* MOS Score */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-300">Speech MOS Score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-semibold text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-white/10">
                  HD Opus
                </span>
                <span className="font-bold text-white tabular-nums transition-colors duration-200">
                  {telemetry?.speechMos || '4.92 / 5.0'}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Speech Audio Waveform Stream */}
          <SpeechClusterWaveform spectrum={telemetry?.spectrum} />
        </div>
      </div>

      {/* ── TOWER 02 (GLOBAL EDGE ANYCAST GRID) ── */}
      <div
        ref={tower2Ref}
        className="absolute will-change-transform select-none"
        style={{
          top: '14vh',
          left: 'calc(100vw - 64px - clamp(270px, 20vw, 345px))',
          height: '66vh',
          width: 'clamp(270px, 20vw, 345px)',
          transform: 'perspective(1400px) rotateY(-2.5deg)',
          transformOrigin: 'center center',
          zIndex: 20,
        }}
      >
        <div className="tower-float-2 relative flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#030914]/95 p-4 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
          
          {/* Subtle Top Specular Line */}
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-200 uppercase">
                Global Edge Grid
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              iad-1 (Active)
            </div>
          </div>

          {/* Hero Section: Primary Route Telemetry (Live Dynamic Ping) */}
          <div className="pt-2 pb-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Primary Regional Telephony Route
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-sans text-[clamp(28px,2.2vw,40px)] font-black tracking-tight text-emerald-400 tabular-nums drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)] transition-all duration-200">
                {primaryPing}
              </span>
              <span className="font-mono text-[11px] text-slate-300">
                US East · iad
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5">
              Zero-loss UDP carrier trunking
            </div>
          </div>

          {/* 4 Clean Regional Ping Rows with Live Dynamically Jittering Values */}
          <div className="flex flex-col gap-1.5 font-mono text-[11.5px]">
            {regions.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <span 
                    className={`h-1.5 w-1.5 rounded-full ${r.isAmber ? 'bg-amber-400' : 'bg-emerald-400'} shadow-[0_0_5px_#10b981]`} 
                  />
                  <span className="text-slate-300">{r.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3 w-3 text-emerald-400/80" />
                  <span className={`font-bold tabular-nums drop-shadow-[0_0_6px_rgba(16,185,129,0.25)] transition-colors duration-200 ${r.isAmber ? 'text-amber-300' : 'text-emerald-400'}`}>
                    {r.ping}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Single Clean Horizontal Compliance Trust Line (NO awkward word-wrapping) */}
          <div className="pt-2.5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 whitespace-nowrap overflow-hidden tracking-tight">
              <span>SOC 2 Type II</span>
              <span className="text-slate-600">·</span>
              <span>HIPAA</span>
              <span className="text-slate-600">·</span>
              <span>GDPR</span>
              <span className="text-slate-600">·</span>
              <span>256-bit SRTP</span>
              <span className="text-slate-600">·</span>
              <span>Zero Retention</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
});

export default DesktopTowers;
