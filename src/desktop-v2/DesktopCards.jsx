import { useState, useEffect, useRef, forwardRef } from 'react';
import { Mic, Zap, PhoneCall, CheckCircle2, Check, RefreshCw, ArrowRight } from 'lucide-react';

/**
 * DesktopCards - Live Interactive Product Capabilities & Benchmark
 *
 * Fully dynamic & animated:
 * 1. Frames have gentle organic floating motion (card-float-1 & card-float-2).
 * 2. Card 1 has real-time modulating speech waveform (20 FPS), active live voice stream,
 *    and word-by-word highlighted conversational dialogue.
 * 3. Card 2 bottom screen is actively moving:
 *    - Real-time outdial dialer timer & connection cycle.
 *    - Shimmering & pulsing speed-to-lead progress bar with live-updating response times.
 *    - Active pipeline step-by-step wave across all 4 CRM sync rows (Lead Intake -> BANT -> CRM -> Calendar).
 */
export const DesktopCards = forwardRef(function DesktopCards({ onActionClick }, ref) {
  const { card1Ref, card2Ref } = ref || {};
  const [selectedVoice, setSelectedVoice] = useState('Sarah');

  // Real-time 20 FPS Speech Waveform Modulation
  const [waveformBars, setWaveformBars] = useState(() => [
    18, 48, 85, 96, 72, 35, 8, 8, 28, 64, 90, 98, 75, 42, 8, 8, 32, 78, 92, 80, 45, 8, 8, 22, 58, 38, 15
  ]);
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [liveLatency, setLiveLatency] = useState('268ms');
  const [dialSeconds, setDialSeconds] = useState(8.2);
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(3);

  // Card 2 bottom screen: active pipeline progression step (0 -> 1 -> 2 -> 3)
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [liveDialTime, setLiveDialTime] = useState('8.2s');
  const [liveRecordId, setLiveRecordId] = useState(4892);

  const tickRef = useRef(0);

  const dialogueWords = [
    "Hello!", "Calling", "from", "LEADNEX.AI", "regarding", "your", "enterprise", "voice", "demo..."
  ];

  // 20 FPS animation loop for speech soundwave
  useEffect(() => {
    const interval20Fps = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current * 0.05;

      // Realistic speech syllables with periodic natural breath pauses
      const speechCycle = (t * 0.5) % (Math.PI * 2);
      const isPause = Math.sin(speechCycle) < -0.65;
      const envelope = isPause ? 0.12 : (0.55 + 0.45 * Math.sin(t * 2.4));

      const basePhonemes = [
        0.18, 0.48, 0.85, 0.96, 0.72, 0.35, // Syllable 1
        0.08, 0.08,                         // Pause
        0.28, 0.64, 0.90, 0.98, 0.75, 0.42, // Syllable 2
        0.08, 0.08,                         // Pause
        0.32, 0.78, 0.92, 0.80, 0.45,       // Syllable 3
        0.08, 0.08,                         // Pause
        0.22, 0.58, 0.38, 0.15              // Syllable 4
      ];

      const newBars = basePhonemes.map((base, idx) => {
        if (base <= 0.10) return Math.round(6 + Math.random() * 4);
        const jitter = Math.sin(t * 8.0 + idx * 0.7) * 0.18;
        return Math.round(Math.max(8, Math.min(100, (base + jitter) * envelope * 100)));
      });

      setWaveformBars(newBars);
    }, 50);

    // Active transcript word progression (cycles every 450ms)
    const wordInterval = setInterval(() => {
      setActiveWordIdx((prev) => (prev + 1) % dialogueWords.length);
    }, 450);

    // Card 2 bottom screen: Active pipeline step cycle (every 900ms)
    const pipelineInterval = setInterval(() => {
      setActivePipelineStep((prev) => (prev + 1) % 4);
    }, 900);

    // Telemetry & Dial Simulation Interval (every 1s)
    const liveSimInterval = setInterval(() => {
      // Jitter latency
      const lat = 268 + Math.floor(Math.random() * 6);
      setLiveLatency(`${lat}ms`);

      // Outdial speed live fluctuation
      const dialVariations = ['8.2s', '7.9s', '8.4s', '8.1s', '7.8s'];
      setLiveDialTime(dialVariations[Math.floor(Math.random() * dialVariations.length)]);

      // Cycle record ID occasionally
      setLiveRecordId((prev) => (prev >= 4999 ? 4820 : prev + 1));

      // Outdial simulation timer
      setDialSeconds((prev) => {
        if (prev <= 1.0) {
          setCallConnected(true);
          return 8.2;
        }
        return Number((prev - 0.8).toFixed(1));
      });

      setCallDuration((prev) => (prev >= 45 ? 3 : prev + 1));
    }, 1100);

    return () => {
      clearInterval(interval20Fps);
      clearInterval(wordInterval);
      clearInterval(pipelineInterval);
      clearInterval(liveSimInterval);
    };
  }, [dialogueWords.length]);

  return (
    <>
      <style>{`
        @keyframes desktopCardFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes desktopCardFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes barShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes activePulseRow {
          0%, 100% { background-color: rgba(255, 255, 255, 0.02); }
          50% { background-color: rgba(0, 240, 255, 0.08); }
        }
        .card-float-1 {
          animation: desktopCardFloat1 7.5s ease-in-out infinite;
        }
        .card-float-2 {
          animation: desktopCardFloat2 8s ease-in-out infinite 0.8s;
        }
        .bar-shimmer-anim {
          animation: barShimmer 2.0s ease-in-out infinite;
        }
        .active-pipeline-row {
          animation: activePulseRow 1.0s ease-in-out;
        }
      `}</style>

      {/* ── CARD 1: AI CALLING & VOICE AGENTS ── */}
      <div
        ref={card1Ref}
        className="absolute select-none will-change-transform"
        style={{
          top: '12vh',
          left: '10.3vw',
          width: '36.8vw',
          maxHeight: '74vh',
          display: 'none',
          opacity: 0,
          zIndex: 30,
        }}
      >
        <div className="card-float-1 relative flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#030914]/95 p-5 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]">

          {/* Top Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1">
            <Mic className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Autonomous Voice Agents
            </span>
          </div>

          {/* Heading */}
          <h3 className="mt-2 text-[clamp(19px,1.45vw,26px)] font-black tracking-tight text-white leading-tight">
            Natural conversations at <span className="text-cyan-400">sub-300ms speed.</span>
          </h3>

          {/* 3 Voice Chips with High Contrast */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: 'Sarah', name: 'Sarah', role: 'Executive SDR', lat: '265ms' },
              { id: 'Marcus', name: 'Marcus', role: 'Inbound Specialist', lat: '280ms' },
              { id: 'Rachel', name: 'Rachel', role: 'Support Agent', lat: '270ms' },
            ].map((v) => {
              const isActive = selectedVoice === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVoice(v.id)}
                  className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${isActive
                    ? 'border-cyan-400/80 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="font-bold text-[clamp(11.5px,0.8vw,13px)] text-white truncate">
                      {v.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">{v.role}</div>
                  <div className="font-mono text-[10px] font-bold text-emerald-400 mt-1">{v.lat}</div>
                </button>
              );
            })}
          </div>

          {/* Moving Speech Audio Stream Container */}
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#020712] p-3 shadow-inner">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.06] font-mono text-[10.5px]">
              <span className="text-slate-300 font-semibold">Active Synthesis · {selectedVoice}</span>
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Live Carrier Stream
              </span>
            </div>

            {/* Continuously Animated Speech Waveform Clusters */}
            <div className="flex items-end justify-between gap-[3px] h-8 py-1.5 px-1">
              {waveformBars.map((h, i) => {
                const isSilent = h <= 10;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-all duration-75 ease-out"
                    style={{
                      height: `${h}%`,
                      backgroundColor: isSilent ? 'rgba(148, 163, 184, 0.22)' : 'rgba(0, 240, 255, 0.95)',
                      boxShadow: isSilent ? 'none' : '0 0 6px rgba(0, 240, 255, 0.4)',
                    }}
                  />
                );
              })}
            </div>

            {/* Word-by-Word Live Animated Dialogue Transcript */}
            <div className="text-[11.5px] font-sans mt-1.5 flex flex-wrap gap-1 leading-snug">
              {dialogueWords.map((word, wIdx) => {
                const isSpoken = wIdx <= activeWordIdx;
                const isCurrent = wIdx === activeWordIdx;
                return (
                  <span
                    key={wIdx}
                    className={`transition-all duration-150 rounded px-0.5 ${isCurrent
                      ? 'text-cyan-300 font-bold bg-cyan-950/80 shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                      : isSpoken
                        ? 'text-white font-medium'
                        : 'text-slate-500'
                      }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Clean 3-Column Stats Footer with Real-time Jitter */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/[0.08] text-center font-mono">
            <div>
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider">End-to-End Latency</div>
              <div className="text-[13px] font-bold text-emerald-400 tabular-nums transition-colors duration-200">
                {liveLatency}
              </div>
            </div>
            <div>
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider">Voice MOS Score</div>
              <div className="text-[13px] font-bold text-emerald-400 tabular-nums">4.92 / 5.0</div>
            </div>
            <div>
              <div className="text-[9.5px] text-slate-400 uppercase tracking-wider">Speed-to-Lead</div>
              <div className="text-[13px] font-bold text-white tabular-nums">&lt; 12s</div>
            </div>
          </div>

        </div>
      </div>

      {/* ── CARD 2: SPEED-TO-LEAD & ARCHITECTURE BENCHMARK ── */}
      <div
        ref={card2Ref}
        className="absolute select-none will-change-transform"
        style={{
          top: '12vh',
          left: '53vw',
          width: '36.8vw',
          maxHeight: '74vh',
          display: 'none',
          opacity: 0,
          zIndex: 30,
        }}
      >
        <div className="card-float-2 relative flex h-full w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#030914]/95 p-5 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]">

          {/* Top Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
              Speed-to-Lead Architecture
            </span>
          </div>

          {/* Dynamic Live Dial Simulator with Real-Time Counter */}
          <div className="mt-2 rounded-xl border border-white/[0.08] bg-[#020712] p-3 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-40" />
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <div className="font-mono text-[13px] font-bold text-white tracking-wide">
                  +1 (415) 890-2341
                </div>
                <div className="text-[10.5px] text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span>
                    Triggered via Webhook · {callConnected ? `Connected · Call ${callDuration}s` : `Connecting in ${dialSeconds}s`}
                  </span>
                </div>
              </div>
            </div>
            <div className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-1 rounded-md shadow-sm">
              OUTDIAL
            </div>
          </div>

          {/* Shimmering & Actively Moving Comparison Bars */}
          <div className="mt-3 flex flex-col gap-2 font-mono text-[11px]">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LEADNEX AI Outdial
                </span>
                <span className="text-emerald-400 font-bold tracking-wider transition-all duration-300">
                  &lt; 12 seconds
                </span>
              </div>
              <div className="relative h-3 w-full rounded-full bg-white/[0.06] overflow-hidden p-[1px] shadow-inner">
                {/* Active Cyan Progress Bar with Dynamic Light Pulse */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.6)] relative overflow-hidden transition-all duration-300"
                  style={{ width: '93%' }}
                >
                  {/* Glowing Shimmer Light Sweep */}
                  <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent bar-shimmer-anim" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Legacy SDR Call Center</span>
                <span>4 - 8 hours</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-slate-600 transition-all duration-300"
                  style={{ width: '18%' }}
                />
              </div>
            </div>
          </div>

          {/* Actively Moving CRM Sync Key-Value Table (Live Sequential Step Wave) */}
          <div className="mt-3 rounded-xl border border-white/[0.08] bg-[#020712] p-3 font-mono text-[11px] space-y-2 shadow-inner">

            {/* Step 1: Lead Response Speed */}
            <div className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 ${activePipelineStep === 0 ? 'bg-cyan-950/40 border border-cyan-500/30' : 'bg-transparent border border-transparent'
              }`}>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${activePipelineStep === 0 ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
                <span>Lead Response Speed:</span>
              </div>
              <span className="text-emerald-400 font-bold tabular-nums">
                {liveDialTime} Instant Dial
              </span>
            </div>

            {/* Step 2: BANT Lead Qualification */}
            <div className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 ${activePipelineStep === 1 ? 'bg-emerald-950/40 border border-emerald-500/30' : 'bg-transparent border border-transparent'
              }`}>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${activePipelineStep === 1 ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span>BANT Lead Qualification:</span>
              </div>
              <span className="text-emerald-400 font-bold">
                Budget & Need Verified ✓
              </span>
            </div>

            {/* Step 3: Salesforce & HubSpot Sync */}
            <div className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 ${activePipelineStep === 2 ? 'bg-cyan-950/40 border border-cyan-500/30' : 'bg-transparent border border-transparent'
              }`}>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${activePipelineStep === 2 ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
                <span>Salesforce & HubSpot Sync:</span>
              </div>
              <span className="text-white font-bold tabular-nums">
                &lt; 1s (#LD-{liveRecordId})
              </span>
            </div>

            {/* Step 4: Calendar Integration */}
            <div className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-300 ${activePipelineStep === 3 ? 'bg-cyan-950/40 border border-cyan-500/30' : 'bg-transparent border border-transparent'
              }`}>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={`h-1.5 w-1.5 rounded-full ${activePipelineStep === 3 ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
                <span>Calendar Integration:</span>
              </div>
              <span className="text-cyan-400 font-bold">
                Slot Confirmed ✓
              </span>
            </div>

          </div>

        </div>
      </div>
    </>
  );
});

export default DesktopCards;
