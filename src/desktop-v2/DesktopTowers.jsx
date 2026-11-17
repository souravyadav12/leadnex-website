import { forwardRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Activity, 
  Check, 
  Radio, 
  Wifi, 
  Cpu, 
  Globe2, 
  Zap,
  Server
} from 'lucide-react';

/**
 * High-Tech Precision Radar Scanner
 */
function RadarWidget({ angle = 0 }) {
  return (
    <div className="relative mx-auto my-1 flex h-[84px] w-[84px] items-center justify-center rounded-full border border-cyan-500/40 bg-[#030d1a]/90 overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.15),inset_0_0_20px_rgba(0,240,255,0.1)]">
      {/* Background Grid Lines & Concentric Rings */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:12px_12px] opacity-10" />
      <div className="absolute h-[62px] w-[62px] rounded-full border border-cyan-500/20 border-dashed" />
      <div className="absolute h-[38px] w-[38px] rounded-full border border-cyan-500/30" />
      <div className="absolute h-[16px] w-[16px] rounded-full border border-cyan-500/40" />
      
      {/* Precision Crosshairs */}
      <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="absolute h-full w-[1px] rotate-45 bg-cyan-400/10" />
      <div className="absolute w-full h-[1px] rotate-45 bg-cyan-400/10" />

      {/* Rotating Sweep Beam with Soft Fade */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          transform: `rotate(${angle}rad)`,
          background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 240, 255, 0.08) 310deg, rgba(0, 240, 255, 0.45) 360deg)',
        }}
      />

      {/* Center Beacon */}
      <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" />

      {/* Dynamic Target Pings */}
      <div className="absolute top-3 right-5 flex items-center justify-center">
        <span className="absolute h-3 w-3 rounded-full bg-emerald-400/40 animate-ping" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
      </div>
      <div className="absolute bottom-5 left-4 flex items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]" />
      </div>

      {/* Radar Micro Coordinates */}
      <span className="absolute bottom-1 right-2 font-mono text-[7px] text-cyan-500/60 font-semibold tracking-tighter">
        SCAN.09
      </span>
    </div>
  );
}

/**
 * DesktopTowers - Ultra Professional Glass HUD Skyscraper Panels
 */
export const DesktopTowers = forwardRef(function DesktopTowers(
  { telemetry, callsDisplayRef },
  ref
) {
  const { tower1Ref, tower2Ref } = ref || {};

  return (
    <>
      <style>{`
        @keyframes desktopTowerFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes desktopTowerFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        .tower-float-1 {
          animation: desktopTowerFloat1 7s ease-in-out infinite;
        }
        .tower-float-2 {
          animation: desktopTowerFloat2 7.5s ease-in-out infinite 0.5s;
        }
      `}</style>

      {/* ── TOWER 01 (LEFT TELEMETRY MONITOR) ── */}
      <div
        ref={tower1Ref}
        className="absolute will-change-transform select-none"
        style={{
          top: '14vh',
          left: '51vw',
          height: '66vh',
          width: 'clamp(280px, min(calc(66vh * 0.62), 23vw), 430px)',
          transform: 'perspective(1100px) rotateY(14deg)',
          transformOrigin: 'center center',
          zIndex: 20,
        }}
      >
        <div className="tower-float-1 relative flex h-full w-full flex-col justify-between rounded-xl border border-cyan-500/30 bg-[#040e1b]/85 p-3.5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),0_0_25px_rgba(0,240,255,0.12)]">
          
          {/* Futuristic Corner Tech Accents */}
          <div className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
          <div className="absolute -top-[1px] -right-[1px] h-3 w-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
          <div className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
          <div className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />

          {/* Top Panel Specular Highlight */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-cyan-400/90 uppercase">
                TWR // 01
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span className="font-mono text-[9px] font-bold text-emerald-400 tracking-wider">
                SYS.ACTIVE
              </span>
            </div>
          </div>

          {/* Brand/Core Node */}
          <div className="py-2 text-center bg-gradient-to-b from-cyan-950/20 to-transparent rounded-lg border border-cyan-500/10">
            <h3 className="font-sans text-[clamp(17px,1.3vw,22px)] font-black tracking-wider text-white drop-shadow-[0_2px_10px_rgba(0,240,255,0.3)]">
              LEADNEX<span className="text-cyan-400">.AI</span>
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-cyan-300/60 block -mt-0.5">
              Autonomous Voice Engine
            </span>
          </div>

          {/* Stats Matrix */}
          <div className="flex flex-col gap-1.5 py-1 font-mono text-[clamp(11px,0.8vw,13px)]">
            {/* Active Calls */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-slate-900/50 border border-cyan-500/15 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-cyan-400/70" />
                <span className="text-slate-400 text-[11px] tracking-wide uppercase">Calls</span>
              </div>
              <span ref={callsDisplayRef} className="font-bold text-white tracking-wider tabular-nums">
                {telemetry?.activeCallsFormatted || '12,518'}
              </span>
            </div>

            {/* Latency */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-slate-900/50 border border-cyan-500/15 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-cyan-400/70" />
                <span className="text-slate-400 text-[11px] tracking-wide uppercase">Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-emerald-400/80 bg-emerald-950/50 px-1 py-0.2 rounded border border-emerald-500/20">LOW</span>
                <span className="font-bold text-cyan-300 tracking-wider tabular-nums">
                  {telemetry?.voiceLatency || '271ms'}
                </span>
              </div>
            </div>

            {/* SLA */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-slate-900/50 border border-cyan-500/15 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" />
                <span className="text-slate-400 text-[11px] tracking-wide uppercase">Uptime SLA</span>
              </div>
              <span className="font-bold text-emerald-400 tracking-wider tabular-nums">
                {telemetry?.telephonySla || '99.99%'}
              </span>
            </div>

            {/* MOS Score */}
            <div className="flex items-center justify-between py-1.5 px-2.5 rounded-md bg-slate-900/50 border border-cyan-500/15 hover:border-cyan-400/30 transition-colors">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-sky-400/70" />
                <span className="text-slate-400 text-[11px] tracking-wide uppercase">Audio MOS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-semibold text-cyan-400/90 bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-500/20">HD</span>
                <span className="font-bold text-sky-300 tracking-wider tabular-nums">
                  {telemetry?.speechMos || '4.92'}
                </span>
              </div>
            </div>
          </div>

          {/* 26-Channel Voice Spectrum Analyzer */}
          <div className="flex flex-col flex-grow justify-end pt-1.5">
            <div className="flex items-center justify-between pb-1 font-mono text-[9px] text-cyan-400/80 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                DSP SPECTRUM
              </span>
              <span className="text-slate-400">26-CH // STEREO</span>
            </div>
            
            <div className="relative flex items-end justify-between gap-[2px] h-[68px] rounded-lg border border-cyan-500/20 bg-[#020710]/95 p-2 overflow-hidden shadow-inner">
              {/* Subtle Grid overlay in visualizer */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] [background-size:100%_8px] pointer-events-none" />

              {(telemetry?.spectrum || [20, 35, 55, 75, 40, 60, 90, 80, 50, 65, 85, 95, 70, 45, 60, 80, 65, 50, 40, 60, 75, 55, 35, 25, 20, 15]).map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end h-full items-center z-10">
                  {/* Peak Marker Dot */}
                  <div 
                    className="w-[2px] h-[2px] rounded-full bg-cyan-200 mb-0.5 transition-all duration-75"
                    style={{ opacity: height > 15 ? 1 : 0 }}
                  />
                  {/* Equalizer Bar */}
                  <div
                    className="w-full rounded-t-xs transition-all duration-75 shadow-[0_0_6px_rgba(0,240,255,0.4)]"
                    style={{
                      height: `${Math.max(6, height)}%`,
                      background: 'linear-gradient(to top, rgba(2,132,199,0.7), rgba(0,240,255,0.9), #ffffff)',
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Frequency Markers */}
            <div className="flex justify-between font-mono text-[7px] text-slate-500 pt-1 px-1">
              <span>100Hz</span>
              <span>1kHz</span>
              <span>8kHz</span>
              <span>16kHz</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOWER 02 (RIGHT GLOBAL GRID MONITOR) ── */}
      <div
        ref={tower2Ref}
        className="absolute will-change-transform select-none"
        style={{
          top: '14vh',
          left: '74.5vw',
          height: '66vh',
          width: 'clamp(280px, min(calc(66vh * 0.62), 23vw), 430px)',
          transform: 'perspective(1100px) rotateY(-14deg)',
          transformOrigin: 'center center',
          zIndex: 20,
        }}
      >
        <div className="tower-float-2 relative flex h-full w-full flex-col justify-between rounded-xl border border-sky-500/30 bg-[#040e1b]/85 p-3.5 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),0_0_25px_rgba(56,189,248,0.12)]">
          
          {/* Futuristic Corner Tech Accents */}
          <div className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t-2 border-l-2 border-sky-400 rounded-tl-xl" />
          <div className="absolute -top-[1px] -right-[1px] h-3 w-3 border-t-2 border-r-2 border-sky-400 rounded-tr-xl" />
          <div className="absolute -bottom-[1px] -left-[1px] h-3 w-3 border-b-2 border-l-2 border-sky-400 rounded-bl-xl" />
          <div className="absolute -bottom-[1px] -right-[1px] h-3 w-3 border-b-2 border-r-2 border-sky-400 rounded-br-xl" />

          {/* Top Panel Specular Highlight */}
          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

          {/* Header Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/15">
            <div className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-sky-400/90 uppercase">
                TWR // 02
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
              <span className="font-mono text-[9px] font-bold text-cyan-400 tracking-wider">
                EDGE.MESH
              </span>
            </div>
          </div>

          {/* Title Header */}
          <div className="py-2 text-center bg-gradient-to-b from-sky-950/20 to-transparent rounded-lg border border-sky-500/10">
            <h3 className="font-sans text-[clamp(17px,1.3vw,22px)] font-black tracking-wider text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.3)]">
              GLOBAL ROUTING
            </h3>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-sky-300/60 block -mt-0.5">
              Anycast Low-Latency Grid
            </span>
          </div>

          {/* High-Tech Radar Component */}
          <RadarWidget angle={telemetry?.radarAngle || 0} />

          {/* Regional Edge Node Ping Table */}
          <div className="flex flex-col gap-1 py-1 font-mono text-[clamp(11px,0.75vw,12px)]">
            {(telemetry?.regions || [
              { name: 'US East (IAD)', ping: '12ms' },
              { name: 'US West (SFO)', ping: '18ms' },
              { name: 'EU Central (FRA)', ping: '24ms' },
              { name: 'AP North (NRT)', ping: '35ms' },
            ]).map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1 px-2.5 rounded bg-slate-900/50 border border-sky-500/10 hover:border-sky-400/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#10b981]" />
                  <span className="text-slate-300 tracking-tight text-[11px]">{r.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="h-2.5 w-2.5 text-cyan-400/70" />
                  <span className="font-bold text-cyan-300 tabular-nums">{r.ping}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance & Security 2x2 Grid - Fixed Text Truncation */}
          <div className="pt-2 border-t border-sky-500/20">
            <div className="flex items-center justify-center gap-1.5 pb-1.5 font-mono text-[9px] font-bold text-sky-400 uppercase tracking-wider">
              <Lock className="h-2.5 w-2.5 text-emerald-400" />
              <span>Security & Compliance</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono">
              {[
                { label: 'SOC 2 Type II', icon: ShieldCheck },
                { label: 'HIPAA & GDPR', icon: Lock },
                { label: '256-bit SRTP', icon: Zap },
                { label: 'Zero Retention', icon: Server },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-md bg-[#020b17]/90 px-2 py-1.5 border border-sky-500/20 text-slate-200 shadow-sm"
                  >
                    <IconComponent className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                    <span className="text-[10px] font-semibold tracking-tight text-slate-300 truncate">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
});

export default DesktopTowers;