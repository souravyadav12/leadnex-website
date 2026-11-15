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
} from 'lucide-react';
import { ActionButton, Magnetic } from '../motion/kit';
import { smoothScrollTo } from '../motion/SmoothScroll';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

/* ── Interactive Waveform Visualizer for Scene 2 & 3 ──────────────────────── */
function VoiceWaveformPreview() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [bars, setBars] = useState(() => Array.from({ length: 32 }, () => Math.random() * 0.6 + 0.25));

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBars(Array.from({ length: 32 }, () => Math.random() * 0.75 + 0.2));
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="rounded-2xl border border-cyan/30 bg-black/60 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan">
            Neural Voice Stream · Active
          </span>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1 rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-mono text-slate-300 hover:text-white"
        >
          <Volume2 className="h-2.5 w-2.5 text-cyan" />
          {isPlaying ? 'Mute' : 'Play'}
        </button>
      </div>

      <div className="flex items-center justify-between gap-1 h-14 py-2 px-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 via-cyan to-white transition-all duration-100"
            style={{ height: `${isPlaying ? h * 100 : 10}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center font-mono">
        <div>
          <div className="text-[8.5px] text-slate-400 uppercase">Latency</div>
          <div className="text-[12px] font-bold text-cyan">274ms</div>
        </div>
        <div>
          <div className="text-[8.5px] text-slate-400 uppercase">Voice MOS</div>
          <div className="text-[12px] font-bold text-emerald-400">4.92 / 5.0</div>
        </div>
        <div>
          <div className="text-[8.5px] text-slate-400 uppercase">Concurrency</div>
          <div className="text-[12px] font-bold text-white">10,000+</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EmergingBuildingScenes — Pinned 3D Presentation Experience
   
   Mechanics:
     - Viewport is pinned while user scrolls through 6 distinct intervals.
     - Content panels physically emerge from the central opening between the
       two corporate buildings (translateZ: -700px -> 0px, scale: 0.25 -> 1.0).
     - Settles centered in the viewport (65-80% width) with both buildings
       flanking the left and right.
     - Fully reversible and freezes immediately when scrolling stops.
   ───────────────────────────────────────────────────────────────────────── */
export default function EmergingBuildingScenes() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('Sarah (Executive)');

  useEffect(() => {
    if (!containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=4800',
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

  /**
   * Helper to calculate 3D transformation for an emerging panel:
   *   - enterStart to settleStart: emerges from central gap (-700px -> 0px, scale: 0.25 -> 1.0, opacity: 0 -> 1)
   *   - settleStart to settleEnd: static in center (translateZ: 0px, scale: 1.0, opacity: 1)
   *   - settleEnd to exitEnd: glides forward past camera (translateZ: 0px -> 350px, scale: 1.0 -> 1.2, opacity: 1 -> 0)
   */
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
      tz = -700 + t * 700;
      scale = 0.25 + t * 0.75;
      opacity = Math.max(0, Math.min(1, t * 1.2));
    } else if (p >= settleStart && p <= settleEnd) {
      tz = 0;
      scale = 1;
      opacity = 1;
    } else if (p > settleEnd && p <= exitEnd) {
      const t = (p - settleEnd) / (exitEnd - settleEnd);
      tz = t * 320;
      scale = 1.0 + t * 0.2;
      opacity = Math.max(0, 1 - t * 1.2);
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
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-6"
        style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
      >
        {/* ── SCENE 1: INITIAL VIEW (Prompt & Building Framing) (p: 0.00 - 0.09) ── */}
        {scrollProgress < 0.12 && (
          <div
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 10),
              transition: 'opacity 0.2s',
            }}
            className="absolute inset-x-0 bottom-12 sm:bottom-16 flex flex-col items-center justify-center text-center pointer-events-auto"
          >
            <div className="glass-hero rounded-full px-6 py-2.5 border border-cyan/40 bg-black/60 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">
                  LEADNEX.AI HEADQUARTERS · SCROLL TO ENTER PORTAL
                </span>
                <ChevronDown className="h-4 w-4 text-cyan animate-bounce" />
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] text-slate-400 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Two Corporate Towers · Content Emerges From Center Portal
            </p>
          </div>
        )}

        {/* ── SCENE 2: AI CALLING (p: 0.08 - 0.24) ── */}
        <div
          style={getPanelStyle(0.08, 0.14, 0.20, 0.25)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-black/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,240,255,0.22)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3.5 py-1">
                <Mic className="h-3.5 w-3.5 text-cyan" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan">
                  STAGE 01 · CORE PLATFORM
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,3.0rem)] font-extrabold tracking-tight text-white leading-tight">
                AI Calling, Built for <br />
                <span className="gradient-text font-bold">Real Conversations.</span>
              </h2>

              <p className="mt-3.5 text-[15px] leading-relaxed text-slate-300">
                Automate customer conversations, qualify leads, follow up instantly and scale your business with intelligent AI-powered voice agents running in production.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
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
              <VoiceWaveformPreview />
            </div>
          </div>
        </div>

        {/* ── SCENE 3: AI VOICE AGENTS (p: 0.24 - 0.40) ── */}
        <div
          style={getPanelStyle(0.24, 0.30, 0.36, 0.41)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-black/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,240,255,0.22)]"
        >
          <div className="w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3.5 py-1">
              <Zap className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan">
                STAGE 02 · VOICE SYNTHESIS
              </span>
            </div>

            <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,3.0rem)] font-extrabold tracking-tight text-white leading-tight">
              Meet Your Autonomous <br />
              <span className="gradient-text font-bold">AI Voice Agent.</span>
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-slate-300 max-w-2xl">
              Natural human-like conversations with ultra-low latency (&lt;300ms), dynamic sentiment adaptation, and zero robotic tone.
            </p>

            {/* Voice Profile Selector */}
            <div className="mt-6">
              <div className="font-mono text-[11px] text-slate-400 uppercase mb-2">Select Active Voice Model:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Sarah (Executive)', tone: 'Warm & Conversational', latency: '265ms' },
                  { name: 'Marcus (Enterprise SDR)', tone: 'Authoritative & Sharp', latency: '280ms' },
                  { name: 'Rachel (Support & Care)', tone: 'Empathetic & Calm', latency: '270ms' },
                ].map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVoice(v.name)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all',
                      selectedVoice === v.name
                        ? 'border-cyan bg-cyan/[0.15] shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/25',
                    )}
                  >
                    <div className="font-bold text-[13px] text-white">{v.name}</div>
                    <div className="font-mono text-[10px] text-cyan mt-1">{v.tone}</div>
                    <div className="font-mono text-[9px] text-slate-400 mt-2">Latency: {v.latency}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 4: OUTBOUND CALLING (p: 0.40 - 0.56) ── */}
        <div
          style={getPanelStyle(0.40, 0.46, 0.52, 0.57)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-blue-500/40 bg-black/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(2,132,199,0.22)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/[0.1] px-3.5 py-1">
                <PhoneOutgoing className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  STAGE 03 · OUTBOUND SPEED-TO-LEAD
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,3.0rem)] font-extrabold tracking-tight text-white leading-tight">
                Never Miss a Lead <br />
                <span className="gradient-text font-bold">Again.</span>
              </h2>

              <p className="mt-3.5 text-[15px] leading-relaxed text-slate-300">
                Instant speed-to-lead outbound dialing within seconds of form submission. Qualify prospects, handle objections, and auto-book calendar slots directly onto rep schedules.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 font-mono">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                  <div className="text-[22px] font-bold text-cyan">&lt; 12s</div>
                  <div className="text-[9px] text-slate-400 uppercase">Speed to Lead Dial Time</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                  <div className="text-[22px] font-bold text-white">3.4x</div>
                  <div className="text-[9px] text-slate-400 uppercase">Booking Conversion vs Reps</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              {[
                { time: 'T + 0.0s', action: 'Lead Enters Funnel', status: 'Captured' },
                { time: 'T + 8.2s', action: 'Outbound Dial Triggered', status: 'Ringing' },
                { time: 'T + 20.0s', action: 'BANT Qualification', status: 'Budget $50k+' },
                { time: 'T + 1m 10s', action: 'Calendar Demo Locked', status: 'Confirmed' },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.04] p-2.5 border border-white/[0.06]">
                  <div>
                    <div className="text-[12px] font-semibold text-white">{step.action}</div>
                    <div className="font-mono text-[9px] text-cyan">{step.status}</div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-400">{step.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 5: INBOUND CALLING (p: 0.56 - 0.72) ── */}
        <div
          style={getPanelStyle(0.56, 0.62, 0.68, 0.73)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-black/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,240,255,0.22)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3.5 py-1">
                <PhoneIncoming className="h-3.5 w-3.5 text-cyan" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan">
                  STAGE 04 · 24/7 INBOUND RECEPTIONIST
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,3.0rem)] font-extrabold tracking-tight text-white leading-tight">
                Every Call Answered. <br />
                <span className="gradient-text font-bold">Every Time.</span>
              </h2>

              <p className="mt-3.5 text-[15px] leading-relaxed text-slate-300">
                24/7 autonomous receptionist and support. Zero wait times, multi-lingual support in 40+ languages, and smart routing with instant escalation.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {['Zero Hold Times', '40+ Languages', 'Instant Human Escalation', 'HIPAA & SOC 2'].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[10px] text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-cyan" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-cyan/30 bg-black/60 p-5">
              <div className="font-mono text-[10px] text-cyan font-bold pb-2 border-b border-white/[0.08]">
                INBOUND CALL MONITOR
              </div>
              <div className="pt-3 space-y-3 font-mono">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Call Queue Status</div>
                  <div className="text-[14px] font-bold text-white">0 Callers Waiting (Instant Pickup)</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Language Routing</div>
                  <div className="text-[13px] font-semibold text-cyan">Auto-detecting 40+ dialects</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">First-Call Resolution</div>
                  <div className="text-[14px] font-bold text-emerald-400">89.4% Autonomous</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 6: ANALYTICS & AUTOMATION (p: 0.72 - 0.88) ── */}
        <div
          style={getPanelStyle(0.72, 0.78, 0.84, 0.89)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-indigo-500/40 bg-black/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_25px_90px_rgba(99,102,241,0.22)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/[0.1] px-3.5 py-1">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  STAGE 05 · REVENUE TELEMETRY
                </span>
              </div>

              <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,3.0rem)] font-extrabold tracking-tight text-white leading-tight">
                Conversation Intelligence & <br />
                <span className="gradient-text font-bold">CRM Automation.</span>
              </h2>

              <p className="mt-3.5 text-[15px] leading-relaxed text-slate-300">
                Real-time transcription, automated CRM logging, sentiment analysis, objection tracking, and bi-directional sync with Salesforce and HubSpot.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="text-[18px] font-bold text-emerald-400">96%</div>
                  <div className="text-[8.5px] text-slate-400">Sentiment Score</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="text-[18px] font-bold text-cyan">&lt; 1s</div>
                  <div className="text-[8.5px] text-slate-400">CRM Sync Time</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                  <div className="text-[18px] font-bold text-white">100%</div>
                  <div className="text-[8.5px] text-slate-400">Auto-Logged</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-indigo-400/30 bg-black/60 p-5 font-mono text-[11px]">
              <div className="text-cyan font-bold pb-2 border-b border-white/[0.08]">
                CRM SYNC VERIFICATION
              </div>
              <div className="pt-3 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Salesforce Deal:</span>
                  <span className="text-emerald-400 font-bold">Updated</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>HubSpot Contact:</span>
                  <span className="text-emerald-400 font-bold">Synced</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Google Calendar:</span>
                  <span className="text-cyan font-bold">Locked</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>SMS Confirmation:</span>
                  <span className="text-white font-bold">Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 7: FINAL CTA (p: 0.88 - 1.00) ── */}
        <div
          style={getPanelStyle(0.88, 0.94, 1.0, 1.0)}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl border border-cyan/40 bg-black/80 p-8 sm:p-12 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,240,255,0.25)] text-center"
        >
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-4 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Sparkles className="h-3.5 w-3.5 text-cyan" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan">
                FINAL STAGE · LEADNEX HEADQUARTERS
              </span>
            </div>

            <h2 className="mt-5 text-[clamp(2.0rem,4.2vw,3.6rem)] font-extrabold tracking-tight text-white leading-tight">
              Ready to Transform Your <br />
              <span className="gradient-text font-bold">Business Conversations?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-slate-300">
              Deploy your first production AI voice agent today. Zero hardware, instant deployment, sub-300ms latency, and enterprise SLA guarantee.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Magnetic strength={0.2}>
                <ActionButton
                  onClick={() => smoothScrollTo('#contact')}
                  variant="accent"
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="bg-gradient-to-r from-cyan via-blue to-violet px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_0_35px_rgba(0,240,255,0.5)]"
                >
                  Book Your Demo
                </ActionButton>
              </Magnetic>
              <Magnetic strength={0.16}>
                <ActionButton
                  onClick={() => smoothScrollTo('#pricing')}
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/[0.04] px-7 py-3.5 text-[15px] text-white backdrop-blur-md hover:border-cyan/50"
                >
                  Explore Pricing
                </ActionButton>
              </Magnetic>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-white/[0.08] pt-6 font-mono text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan" />
                14-Day Risk-Free Pilot
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan" />
                SOC 2 Type II Certified
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan" />
                Sub-300ms SLA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

