import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Mic, Zap, ArrowRight, ChevronDown, PhoneCall } from 'lucide-react';
import MobileNavbar from './MobileNavbar';
import MobileScene3D from './MobileScene3D';
import { useTelemetry } from './useTelemetry';
import { useReducedMotion } from '../motion/hooks/useReducedMotion';
import { cn } from '../utils/cn';

gsap.registerPlugin(ScrollTrigger);

/**
 * MobileHero (Patch #3)
 * - Stage height: 100lvh, safeRect measured using 100svh hidden ref.
 * - Single damped progress drives 3D scene and HTML layers.
 * - Card 1 and Card 2 emerge from tunnel vanishing point inside pinned stage.
 * - Strictly sequential: at most one tower / card visible at any time.
 */
export default function MobileHero() {
  const containerRef = useRef(null);
  const svhRef = useRef(null);
  const headerRef = useRef(null);
  const pillRef = useRef(null);
  const pillTextRef = useRef(null);
  const progressBarRef = useRef(null);

  // Overlay Refs
  const headlineRef = useRef(null);
  const tunnelRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  const [selectedVoice, setSelectedVoice] = useState('Sarah');
  const [debugProgress, setDebugProgress] = useState(null);

  const pTargetRef = useRef(0);
  const lastPillTextRef = useRef('Scroll to explore');

  const telemetry = useTelemetry();
  const reduced = useReducedMotion();

  // Dynamic safe rect state
  const [safeRect, setSafeRect] = useState(() => {
    if (typeof window === 'undefined') {
      return { left: 12, right: 12, top: 72, bottom: 580, width: 366, height: 508, aspect: 0.55, vw: 390, vh: 844 };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = 12;
    const right = 12;
    const top = 72;
    const bottom = Math.max(300, vh - 76);
    const width = vw - 24;
    const height = Math.max(200, bottom - top);
    const aspect = Math.max(0.48, Math.min(0.75, width / height));
    return { left, right, top, bottom, width, height, aspect, vw, vh };
  });

  // Recompute safeRect with small viewport height (100svh)
  const computeSafeRect = useCallback(() => {
    if (typeof window === 'undefined') return;
    const vw = window.innerWidth;
    const svhH = svhRef.current?.getBoundingClientRect().height || window.innerHeight;
    const vh = window.innerHeight;

    const left = 12;
    const right = 12;
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom || 64;
    const top = headerBottom + 8;
    const pillTop = pillRef.current?.getBoundingClientRect().top || (svhH - 64);
    const bottom = pillTop - 8;

    const width = vw - 24;
    const height = Math.max(200, bottom - top);
    const aspect = Math.max(0.48, Math.min(0.75, width / height));

    setSafeRect({ left, right, top, bottom, width, height, aspect, vw, vh });
  }, []);

  // Check URL search params for debug mode (?p=0.45)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const pVal = params.get('p');
    if (pVal !== null) {
      const parsed = Math.max(0, Math.min(1, parseFloat(pVal)));
      if (!isNaN(parsed)) {
        setDebugProgress(parsed);
        pTargetRef.current = parsed;
      }
    }
  }, []);

  // Safe rect measurement on mount and debounced resize
  useEffect(() => {
    computeSafeRect();

    let timeoutId = null;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;

    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newW = window.innerWidth;
        const newH = window.innerHeight;
        // Ignore height-only changes under 140px (Chrome URL bar collapse)
        if (newW === lastW && Math.abs(newH - lastH) < 140) {
          return;
        }
        lastW = newW;
        lastH = newH;
        computeSafeRect();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [computeSafeRect]);

  // ScrollTrigger Setup
  useEffect(() => {
    if (debugProgress !== null || reduced || !containerRef.current) return;

    // Mobile ScrollTrigger config
    ScrollTrigger.config({ ignoreMobileResize: true });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=700%', // 700vh scroll runway
        pin: true,
        scrub: true,
        ignoreMobileResize: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          pTargetRef.current = self.progress;
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.config({ ignoreMobileResize: false });
    };
  }, [debugProgress, reduced]);

  // Direct DOM updates from single damped progress frame loop
  const handleFrameUpdate = useCallback(
    ({ p }) => {
      const vh = safeRect.vh || window.innerHeight;
      const targetCenterY = safeRect.top + safeRect.height / 2;
      const vanishY = 0.42 * vh;
      const deltaY = targetCenterY - vanishY;

      // ── 1. ESTABLISHING HEADLINE (0.00 to 0.07) ──
      if (headlineRef.current) {
        if (p < 0.03) {
          headlineRef.current.style.display = 'flex';
          headlineRef.current.style.visibility = 'visible';
          headlineRef.current.style.opacity = '1';
          headlineRef.current.style.transform = 'translate3d(0, 0px, 0)';
        } else if (p >= 0.03 && p <= 0.07) {
          const t = (p - 0.03) / 0.04;
          headlineRef.current.style.display = 'flex';
          headlineRef.current.style.visibility = 'visible';
          headlineRef.current.style.opacity = String(Math.max(0, 1 - t));
          headlineRef.current.style.transform = `translate3d(0, ${(-24 * t).toFixed(1)}px, 0)`;
        } else {
          headlineRef.current.style.display = 'none';
          headlineRef.current.style.visibility = 'hidden';
        }
      }

      // ── 2. TUNNEL TEXT OVERLAY (0.54 to 0.67) ──
      if (tunnelRef.current) {
        if (p >= 0.54 && p <= 0.67) {
          tunnelRef.current.style.display = 'flex';
          tunnelRef.current.style.visibility = 'visible';
          let op = 1.0;
          if (p < 0.60) {
            op = (p - 0.54) / 0.06;
          } else if (p > 0.64) {
            op = 1.0 - (p - 0.64) / 0.03;
          }
          tunnelRef.current.style.opacity = String(Math.max(0, Math.min(1, op)));
        } else {
          tunnelRef.current.style.display = 'none';
          tunnelRef.current.style.visibility = 'hidden';
        }
      }

      // ── 3. CARD 1: AI CALLING (0.67 to 0.85) ──
      // Emerge: 0.67 to 0.75 (scale 0.18 -> 1, opacity 0 -> 1)
      // Hold: 0.75 to 0.82
      // Exit: 0.82 to 0.85 (translateY -24px, scale 0.94, opacity 0)
      if (card1Ref.current) {
        if (p >= 0.67 && p <= 0.85) {
          card1Ref.current.style.display = 'block';
          card1Ref.current.style.visibility = 'visible';

          if (p < 0.75) {
            const t = (p - 0.67) / 0.08;
            const easeT = 1 - Math.pow(1 - t, 3);
            const scale = 0.18 + 0.82 * easeT;
            const op = t * t * (3 - 2 * t);
            const curY = -deltaY * (1 - easeT);
            card1Ref.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            card1Ref.current.style.transform = `translate(-50%, calc(-50% + ${curY.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
          } else if (p <= 0.82) {
            card1Ref.current.style.opacity = '1';
            card1Ref.current.style.transform = 'translate(-50%, -50%) scale(1)';
          } else {
            const t = (p - 0.82) / 0.03;
            const scale = 1.0 - 0.06 * t;
            const op = 1.0 - t;
            const curY = -24 * t;
            card1Ref.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            card1Ref.current.style.transform = `translate(-50%, calc(-50% + ${curY.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
          }
        } else {
          card1Ref.current.style.display = 'none';
          card1Ref.current.style.visibility = 'hidden';
        }
      }

      // ── 4. CARD 2: SPEED-TO-LEAD (0.85 to 1.00) ──
      // Starts ONLY after Card 1 is at opacity 0!
      // Emerge: 0.85 to 0.93 (scale 0.18 -> 1, opacity 0 -> 1)
      // Hold: 0.93 to 1.00 (scale 1.0, opacity 1.0)
      if (card2Ref.current) {
        if (p >= 0.85 && p <= 1.00) {
          card2Ref.current.style.display = 'block';
          card2Ref.current.style.visibility = 'visible';

          if (p < 0.93) {
            const t = (p - 0.85) / 0.08;
            const easeT = 1 - Math.pow(1 - t, 3);
            const scale = 0.18 + 0.82 * easeT;
            const op = t * t * (3 - 2 * t);
            const curY = -deltaY * (1 - easeT);
            card2Ref.current.style.opacity = String(Math.max(0, Math.min(1, op)));
            card2Ref.current.style.transform = `translate(-50%, calc(-50% + ${curY.toFixed(1)}px)) scale(${scale.toFixed(3)})`;
          } else {
            card2Ref.current.style.opacity = '1';
            card2Ref.current.style.transform = 'translate(-50%, -50%) scale(1)';
          }
        } else {
          card2Ref.current.style.display = 'none';
          card2Ref.current.style.visibility = 'hidden';
        }
      }

      // ── 5. BOTTOM PILL TEXT STATE MACHINE ──
      let pillText = 'Scroll to explore';
      if (p < 0.07) pillText = 'Scroll to explore';
      else if (p < 0.31) pillText = '01 - Voice engine';
      else if (p < 0.54) pillText = '02 - Global voice grid';
      else if (p < 0.67) pillText = '03 - Entering HQ';
      else pillText = '04 - Platform';

      if (pillText !== lastPillTextRef.current && pillTextRef.current) {
        lastPillTextRef.current = pillText;
        pillTextRef.current.textContent = pillText;
      }

      // ── 6. NAVBAR PROGRESS BAR ──
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p.toFixed(3)})`;
      }
    },
    [safeRect]
  );

  return (
    <div className="relative w-full bg-[#02050e] text-white">
      {/* Strict full background & zero horizontal scroll styling */}
      <style>{`
        html, body, #root {
          background-color: #02050e !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: clip !important;
        }
      `}</style>

      {/* Hidden 100svh element for measuring small viewport height */}
      <div ref={svhRef} className="fixed top-0 left-0 w-0 h-[100svh] pointer-events-none -z-50 invisible" />

      {/* ── 1. PINNED HERO STAGE (100lvh) ── */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[100lvh] overflow-hidden overflow-x-clip bg-[#02050e]"
      >
        {/* Fixed Header (top 0, 56px, 2px cyan progress bar) */}
        <div ref={headerRef} className="fixed inset-x-0 top-0 z-[60]">
          <MobileNavbar progressBarRef={progressBarRef} />
        </div>

        {/* Full-Bleed 3D Scene */}
        <MobileScene3D
          pTargetRef={pTargetRef}
          telemetry={telemetry}
          safeRect={safeRect}
          aspectRatio={safeRect.aspect}
          onFrameUpdate={handleFrameUpdate}
          isVisible={true}
          reduced={reduced}
        />

        {/* ── ESTABLISHING HEADLINE (0.00 to 0.07) ── */}
        <div
          ref={headlineRef}
          style={{ display: 'flex', visibility: 'visible', opacity: '1' }}
          className="fixed inset-x-0 top-[76px] z-20 px-4 flex flex-col items-center justify-center text-center pointer-events-none will-change-transform"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/[0.12] px-3 py-0.5 mb-2 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan">
              LEADNEX // AI VOICE INFRASTRUCTURE
            </span>
          </div>

          <h1 className="text-[22px] font-extrabold tracking-tight text-white leading-[1.2] max-w-[340px]">
            AI voice agents that call, qualify and close
          </h1>

          <p className="mt-1.5 font-mono text-[12px] text-slate-300 max-w-[320px]">
            Sub-300ms voice in 40+ languages
          </p>
        </div>

        {/* ── TUNNEL TEXT OVERLAY (0.54 to 0.67) ── */}
        <div
          ref={tunnelRef}
          style={{
            display: 'none',
            visibility: 'hidden',
            top: '58%',
            transform: 'translateY(-50%)',
          }}
          className="fixed inset-x-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none will-change-transform"
        >
          <div className="font-mono text-[12px] font-bold uppercase tracking-widest text-[#00f0ff] mb-2">
            STAGE 03 // HQ CENTRAL PORTAL
          </div>
          <h2 className="text-[26px] sm:text-[28px] font-black text-[#e6f4ff] tracking-tight leading-tight">
            Step inside the headquarters
          </h2>
          <p className="mt-1 font-mono text-[13px] sm:text-[14px] text-[#94a9c2]">
            Leadnex HQ · Neural core mesh
          </p>
        </div>

        {/* ── CARD 1: AI CALLING (EMERGES FROM TUNNEL) ── */}
        <div
          ref={card1Ref}
          style={{
            display: 'none',
            visibility: 'hidden',
            left: '50%',
            top: `${safeRect.top + safeRect.height / 2}px`,
            width: `min(${safeRect.vw - 32}px, 440px)`,
            transformOrigin: '50% 42%',
          }}
          className="fixed z-30 pointer-events-auto will-change-transform rounded-2xl border border-cyan/35 bg-[rgba(3,26,46,0.94)] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-md"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3 py-0.5 w-fit">
            <Mic className="h-3.5 w-3.5 text-cyan" />
            <span className="font-mono text-[11px] font-bold text-cyan uppercase tracking-wider">
              AI CALLING AND VOICE AGENTS
            </span>
          </div>

          <h2 className="mt-2.5 text-[20px] sm:text-[22px] font-black text-white leading-tight">
            Real conversations, <br />
            <span className="gradient-text font-bold">sub-300ms speed.</span>
          </h2>

          <p className="mt-1 text-[13px] text-slate-300 leading-snug">
            Autonomous human-level voice agents for high-velocity sales qualification.
          </p>

          {/* 3-Column Voice Chips */}
          <div className="mt-3 grid grid-cols-3 gap-2 font-mono">
            {[
              { id: 'Sarah', name: 'Sarah', lat: '265ms' },
              { id: 'Marcus', name: 'Marcus', lat: '280ms' },
              { id: 'Rachel', name: 'Rachel', lat: '270ms' },
            ].map((v) => {
              const isActive = selectedVoice === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVoice(v.id)}
                  className={cn(
                    'rounded-xl border p-2 text-left transition-all flex flex-col justify-between',
                    isActive
                      ? 'border-cyan bg-cyan/15 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan flex-shrink-0 animate-pulse" />}
                    <span className="font-bold text-[12px] text-white leading-tight">{v.name}</span>
                  </div>
                  <div className="text-[11px] text-cyan mt-0.5 font-mono">{v.lat}</div>
                </button>
              );
            })}
          </div>

          {/* Live Equalizer Row */}
          <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan mb-1.5">
              <span>Live synthesis: {selectedVoice}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ACTIVE
              </span>
            </div>
            <div className="flex items-center justify-between gap-1 h-6">
              {[45, 80, 50, 95, 60, 75, 90, 40, 85, 60, 70, 95, 50, 80, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-gradient-to-t from-blue-600 via-cyan to-white animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i * 0.05) % 0.8}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CARD 2: SPEED-TO-LEAD (EMERGES FROM TUNNEL) ── */}
        <div
          ref={card2Ref}
          style={{
            display: 'none',
            visibility: 'hidden',
            left: '50%',
            top: `${safeRect.top + safeRect.height / 2}px`,
            width: `min(${safeRect.vw - 32}px, 440px)`,
            transformOrigin: '50% 42%',
          }}
          className="fixed z-30 pointer-events-auto will-change-transform rounded-2xl border border-cyan/35 bg-[rgba(3,26,46,0.94)] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,240,255,0.15)] backdrop-blur-md"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.1] px-3 py-0.5 w-fit">
            <Zap className="h-3.5 w-3.5 text-cyan" />
            <span className="font-mono text-[11px] font-bold text-cyan uppercase tracking-wider">
              Speed-to-lead · Architecture benchmark
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Average Outdial Speed</div>
            <div className="text-[26px] font-black text-cyan tracking-tight mt-0.5">
              12s lead to first call
            </div>
          </div>

          {/* Comparison Bars */}
          <div className="mt-3 space-y-2 font-mono text-[12px]">
            <div>
              <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                <span className="text-cyan font-bold">LEADNEX AI Calling</span>
                <span className="text-cyan font-bold">&lt; 12 seconds</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-cyan rounded-full w-[96%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>Legacy call center</span>
                <span>4 - 8 hours</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full w-[18%]" />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-2 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[10.5px] text-slate-400">CONNECT RATE</div>
              <div className="text-[15px] font-bold text-emerald-400 mt-0.5">84.2%</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="text-[10.5px] text-slate-400">COST SAVINGS</div>
              <div className="text-[15px] font-bold text-white mt-0.5">73%</div>
            </div>
          </div>

          {/* CTA Link inside Card 2 */}
          <div className="mt-3">
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 w-full h-[40px] rounded-xl bg-cyan font-bold text-slate-950 text-[13px] shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Book a demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ── FIXED BOTTOM PILL ── */}
        <div
          ref={pillRef}
          className="fixed inset-x-0 bottom-[calc(14px+env(safe-area-inset-bottom,0px))] z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4 will-change-transform"
        >
          <div className="rounded-full px-4 py-2 border border-cyan/40 bg-[#040a18]/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span ref={pillTextRef} className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan">
                Scroll to explore
              </span>
              <ChevronDown className="h-3 w-3 text-cyan animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
