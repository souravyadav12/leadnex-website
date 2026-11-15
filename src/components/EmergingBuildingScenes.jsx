import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mic,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Activity,
  Zap,
  BarChart3,
  GitBranch,
  CheckCircle2,
  Calendar,
  Volume2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Play,
  Pause,
} from 'lucide-react';
import { ActionButton, Magnetic } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

/* ── Interactive Speech Stream Simulator ─────────────────────────────────── */
function VoiceStreamSimulator() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [bars, setBars] = useState(() => Array.from({ length: 28 }, () => Math.random() * 0.6 + 0.25));

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBars(Array.from({ length: 28 }, () => Math.random() * 0.75 + 0.2));
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="rounded-2xl border border-cyan/40 bg-black/75 p-5 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,240,255,0.18)]">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan">
            Active Audio Stream · Sarah
          </span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-cyan/[0.1] px-2.5 py-1 text-[10px] font-mono font-semibold text-cyan hover:bg-cyan/[0.2] transition-colors"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-1 h-12 py-2 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 via-cyan to-white transition-all duration-100"
            style={{ height: `${isPlaying ? h * 100 : 12}%` }}
          />
        ))}
      </div>

      <div className="mt-2.5 rounded-xl bg-white/[0.04] p-3 border border-white/[0.06] font-mono text-[11px]">
        <div className="text-cyan font-bold">AI Agent (Sarah):</div>
        <div className="text-slate-200 mt-0.5 leading-relaxed text-[11.5px]">
          &ldquo;Hello! Calling from LEADNEX.AI regarding your enterprise voice demo. Would Thursday at 2 PM work for an architecture walkthrough?&rdquo;
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-white/[0.06] text-center font-mono">
        <div>
          <div className="text-[9px] text-slate-400 uppercase">Latency</div>
          <div className="text-[13px] font-bold text-cyan">274ms</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 uppercase">Voice MOS</div>
          <div className="text-[13px] font-bold text-emerald-400">4.92 / 5.0</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-400 uppercase">Speed to Lead</div>
          <div className="text-[13px] font-bold text-white">&lt; 12s</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EmergingBuildingScenes — Fast, Punchy 2-Panel 3D Emergence Sequence
   
   - Pin distance reduced from 4500px to just 1600px for swift natural scroll.
   - Panel 1: AI Calling & Voice Agents (Live Stream & Personas).
   - Panel 2: Speed-to-Lead, 24/7 Reception & Scaling CTA.
   - Smooth unpin lands directly on Features -> Pricing -> Contact.
   ───────────────────────────────────────────────────────────────────────── */
export default function EmergingBuildingScenes() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('Sarah');

  useEffect(() => {
    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=1600',
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const getPanelStyle = (enterStart, settleStart, settleEnd, exitEnd) => {
    const p = scrollProgress;

    if (p < enterStart || p > exitEnd) {
      return {
        display: 'none',
        opacity: 0,
        pointerEvents: 'none',
      };
    }

    let tz = 0;
    let scale = 1;
    let opacity = 1;

    if (p >= enterStart && p < settleStart) {
      const t = (p - enterStart) / (settleStart - enterStart);
      tz = -750 + t * 750;
      scale = 0.25 + t * 0.75;
      opacity = Math.max(0, Math.min(1, t * 1.3));
    } else if (p >= settleStart && p <= settleEnd) {
      tz = 0;
      scale = 1;
      opacity = 1;
    } else if (p > settleEnd && p <= exitEnd) {
      const t = (p - settleEnd) / (exitEnd - settleEnd);
      tz = t * 350;
      scale = 1.0 + t * 0.22;
      opacity = Math.max(0, 1 - t * 1.3);
    }

    return {
      display: 'flex',
      opacity,
      transform: `perspective(1000px) translate3d(0px, 0px, ${tz}px) scale(${scale})`,
      pointerEvents: p >= settleStart && p <= settleEnd ? 'auto' : 'none',
      transition: 'none',
      willChange: 'transform, opacity',
    };
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full h-screen overflow-hidden">
      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
        style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
      >
        {/* ── INITIAL PROMPT (p: 0.00 – 0.15) ── */}
        {scrollProgress < 0.18 && (
          <div
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 7),
              transition: 'opacity 0.2s',
            }}
            className="absolute inset-x-0 bottom-12 sm:bottom-16 flex flex-col items-center justify-center text-center pointer-events-auto"
          >
            <div className="glass-hero rounded-full px-7 py-3 border border-cyan/50 bg-black/70 shadow-[0_0_35px_rgba(0,240,255,0.35)]">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
                </span>
                <span className="font-mono text-[11.5px] font-bold uppercase tracking-[0.22em] text-cyan">
                  LEADNEX.AI HEADQUARTERS · SCROLL TO EXPLORE
                </span>
                <ChevronDown className="h-4 w-4 text-cyan animate-bounce" />
              </div>
            </div>
            <p className="mt-3 font-mono text-[10.5px] text-slate-300 uppercase tracking-widest drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Twin Corporate Towers · Content Emerges From Central Opening
            </p>
          </div>
        )}

        {/* ── PANEL 1: AI CALLING & VOICE AGENTS (p: 0.15 – 0.52) ── */}
        <div
          style={getPanelStyle(0.15, 0.25, 0.42, 0.52)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-black/80 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,240,255,0.25)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3.5 py-1">
                <Mic className="h-3.5 w-3.5 text-cyan" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan">
                  STAGE 01 · AUTONOMOUS AI VOICE AGENTS
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-white leading-tight">
                AI Calling, Built for <br />
                <span className="gradient-text font-bold">Real Conversations.</span>
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-slate-200">
                Natural human-like voice agents that qualify leads, handle inbound support 24/7, and book meetings with sub-300ms turnaround.
              </p>

              {/* Voice Switcher Chips */}
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                {[
                  { id: 'Sarah', label: 'Sarah (Executive)', latency: '265ms' },
                  { id: 'Marcus', label: 'Marcus (SDR Rep)', latency: '280ms' },
                  { id: 'Rachel', label: 'Rachel (24/7 Care)', latency: '270ms' },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={cn(
                      'rounded-xl border p-2.5 text-left transition-all',
                      selectedVoice === v.id
                        ? 'border-cyan bg-cyan/[0.18] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20',
                    )}
                  >
                    <div className="font-bold text-[12.5px] text-white truncate">{v.label}</div>
                    <div className="font-mono text-[9px] text-cyan mt-1">{v.latency}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <ActionButton
                  onClick={() => smoothScrollTo('#contact')}
                  variant="accent"
                  size="md"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="bg-gradient-to-r from-cyan via-blue to-violet px-6 py-3 text-white font-semibold shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  Explore AI Calling
                </ActionButton>
                <ActionButton
                  onClick={() => smoothScrollTo('#pricing')}
                  variant="outline"
                  size="md"
                  className="border-white/20 text-white"
                >
                  Book a Demo
                </ActionButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <VoiceStreamSimulator />
            </div>
          </div>
        </div>

        {/* ── PANEL 2: SPEED-TO-LEAD & AUTONOMOUS SCALE (p: 0.52 – 0.88) ── */}
        <div
          style={getPanelStyle(0.52, 0.62, 0.78, 0.88)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-blue-500/40 bg-black/80 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(2,132,199,0.25)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/[0.1] px-3.5 py-1">
                <Zap className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  STAGE 02 · SPEED-TO-LEAD & SCALE
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.9rem,3.8vw,3.2rem)] font-extrabold tracking-tight text-white leading-tight">
                Never Miss a Lead. <br />
                <span className="gradient-text font-bold">24/7/365 Scale.</span>
              </h2>

              <p className="mt-3.5 text-[15px] leading-relaxed text-slate-200">
                Outbound speed-to-lead under 12 seconds, 24/7 inbound reception in 40+ native languages, and instant bi-directional CRM logging with Salesforce and HubSpot.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[22px] font-black text-cyan">&lt; 12s</div>
                  <div className="text-[9px] text-slate-300 mt-0.5">Speed to Lead</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[22px] font-black text-emerald-400">3.4x</div>
                  <div className="text-[9px] text-slate-300 mt-0.5">Booking Rate</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[22px] font-black text-white">40+</div>
                  <div className="text-[9px] text-slate-300 mt-0.5">Languages</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3.5">
                <ActionButton
                  onClick={() => smoothScrollTo('#contact')}
                  variant="accent"
                  size="md"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="bg-gradient-to-r from-cyan via-blue to-violet px-6 py-3 text-white font-semibold shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                >
                  Book Your Demo
                </ActionButton>
                <ActionButton
                  onClick={() => smoothScrollTo('#pricing')}
                  variant="outline"
                  size="md"
                  className="border-white/20 text-white"
                >
                  View Pricing Plans
                </ActionButton>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-cyan/30 bg-black/70 p-5 font-mono text-[11px] space-y-3">
              <div className="text-cyan font-bold pb-2 border-b border-white/[0.08] flex items-center justify-between">
                <span>ENTERPRISE PIPELINE ENGINE</span>
                <span className="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300 p-2 rounded-lg bg-white/[0.03]">
                  <span>Lead Response:</span>
                  <span className="text-cyan font-bold">8.2s Auto-Dial</span>
                </div>
                <div className="flex justify-between text-slate-300 p-2 rounded-lg bg-white/[0.03]">
                  <span>BANT Qualification:</span>
                  <span className="text-emerald-400 font-bold">Budget &amp; Need Verified</span>
                </div>
                <div className="flex justify-between text-slate-300 p-2 rounded-lg bg-white/[0.03]">
                  <span>Salesforce Sync:</span>
                  <span className="text-white font-bold">&lt; 1s Automated Record</span>
                </div>
                <div className="flex justify-between text-slate-300 p-2 rounded-lg bg-white/[0.03]">
                  <span>Calendar Confirmation:</span>
                  <span className="text-cyan font-bold">Slot Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
