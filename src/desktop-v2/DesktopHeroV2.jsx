import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown, Volume2 } from 'lucide-react';
import DesktopHeader from './DesktopHeader';
import DesktopBackground from './DesktopBackground';
import DesktopTowers from './DesktopTowers';
import DesktopTunnel from './DesktopTunnel';
import DesktopCards from './DesktopCards';
import DesktopFeaturesStrip from './DesktopFeaturesStrip';
import useTelemetry from './useTelemetry';

gsap.registerPlugin(ScrollTrigger);

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function easeOutCubic(t) {
  const x = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - x, 3);
}

function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/**
 * DesktopHeroV2
 * Scroll-driven desktop hero experience for viewport width >= 1024px.
 * Pinned stage (100svh), 600vh scroll runway, single rAF render loop with damp().
 */
export default function DesktopHeroV2() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  // Layer Refs
  const heroBlockRef = useRef(null);
  const tower1Ref = useRef(null);
  const tower2Ref = useRef(null);
  const callsDisplayRef = useRef(null);

  const ringsContainerRef = useRef(null);
  const ringsRef = useRef([]);
  const tunnelTextRef = useRef(null);

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const featuresStripRef = useRef(null);

  const bottomChipRef = useRef(null);
  const bottomChipTextRef = useRef(null);
  const progressBarRef = useRef(null);

  // States
  const [activeNav, setActiveNav] = useState('Home');
  const [isOffScreen, setIsOffScreen] = useState(false);
  const [debugProgress, setDebugProgress] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Telemetry simulation
  const telemetry = useTelemetry(isOffScreen);

  // Motion targets
  const pTargetRef = useRef(0);
  const pSRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastNavRef = useRef('Home');
  const lastChipTextRef = useRef('');

  // Check URL params for debug mode (?p=0.35)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const pParam = params.get('p');
    if (pParam !== null) {
      const parsed = Math.max(0, Math.min(1, parseFloat(pParam)));
      if (!isNaN(parsed)) {
        setDebugProgress(parsed);
        pTargetRef.current = parsed;
        pSRef.current = parsed;
      }
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);
    return () => mq.removeEventListener('change', onMqChange);
  }, []);

  // IntersectionObserver to pause particle/floor animations when hero is off-screen
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOffScreen(!entry.isIntersecting);
      },
      { threshold: 0.02 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler for buttons and header nav
  const handleScrollTo = useCallback((target) => {
    if (target === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // GSAP ScrollTrigger Context
  useLayoutEffect(() => {
    if (debugProgress !== null || reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=600%', // 600vh runway
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          pTargetRef.current = self.progress;
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [debugProgress, reducedMotion]);

  // Main 60fps RequestAnimationFrame Render Loop
  useEffect(() => {
    if (reducedMotion) return;

    let animId = null;

    const frameLoop = (now) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Damp pS toward pTarget with lambda = 8
      if (debugProgress !== null) {
        pSRef.current = debugProgress;
      } else {
        pSRef.current = damp(pSRef.current, pTargetRef.current, 8, dt);
      }
      const p = pSRef.current;

      const W = window.innerWidth;
      const H = window.innerHeight;

      // ── 1. HERO BLOCK (p: 0.05 to 0.16) ──
      if (heroBlockRef.current) {
        if (p < 0.05) {
          heroBlockRef.current.style.display = 'block';
          heroBlockRef.current.style.visibility = 'visible';
          heroBlockRef.current.style.opacity = '1';
          heroBlockRef.current.style.transform = 'translate3d(0px, 0px, 0)';
        } else if (p >= 0.05 && p <= 0.16) {
          const t = (p - 0.05) / 0.11;
          const e = smoothstep(t);
          const op = Math.max(0, 1 - e);
          const x = -40 * e;
          heroBlockRef.current.style.display = 'block';
          heroBlockRef.current.style.visibility = 'visible';
          heroBlockRef.current.style.opacity = op.toFixed(3);
          heroBlockRef.current.style.transform = `translate3d(${x.toFixed(1)}px, 0px, 0)`;
        } else {
          heroBlockRef.current.style.display = 'none';
          heroBlockRef.current.style.visibility = 'hidden';
          heroBlockRef.current.style.opacity = '0';
        }
      }

      // ── 2. TOWERS (0.10 to 0.28 Center & Grow, 0.28 to 0.46 Hold, 0.46 to 0.52 Exit) ──
      if (tower1Ref.current && tower2Ref.current) {
        const Ht = 0.627 * H;
        const Wt = Math.min(0.625 * Ht, 0.22 * W);
        const initCenter1 = 0.515 * W + Wt / 2;
        const initCenter2 = 0.750 * W + Wt / 2;
        const targetCenter1 = 0.274 * W;
        const targetCenter2 = 0.726 * W;
        const deltaX1 = targetCenter1 - initCenter1;
        const deltaX2 = targetCenter2 - initCenter2;
        const holdY = 0.042 * H;

        if (p < 0.10) {
          // Initial position at right
          tower1Ref.current.style.display = 'block';
          tower1Ref.current.style.visibility = 'visible';
          tower1Ref.current.style.opacity = '1';
          tower1Ref.current.style.transform = 'perspective(900px) translate3d(0px, 0px, 0px) rotateY(16deg) scale(1)';

          tower2Ref.current.style.display = 'block';
          tower2Ref.current.style.visibility = 'visible';
          tower2Ref.current.style.opacity = '1';
          tower2Ref.current.style.transform = 'perspective(900px) translate3d(0px, 0px, 0px) rotateY(-16deg) scale(1)';

          if (callsDisplayRef.current) {
            callsDisplayRef.current.textContent = telemetry.activeCallsFormatted;
          }
        } else if (p >= 0.10 && p < 0.28) {
          // Move to center, grow scale 1.15, rotateY -> 0
          const t = (p - 0.10) / 0.18;
          const e = smoothstep(t);
          const curX1 = deltaX1 * e;
          const curX2 = deltaX2 * e;
          const curY = holdY * e;
          const scale = 1.0 + 0.15 * e;
          const rot1 = 16 * (1 - e);
          const rot2 = -16 * (1 - e);

          tower1Ref.current.style.display = 'block';
          tower1Ref.current.style.visibility = 'visible';
          tower1Ref.current.style.opacity = '1';
          tower1Ref.current.style.transform = `perspective(900px) translate3d(${curX1.toFixed(1)}px, ${curY.toFixed(1)}px, 0px) rotateY(${rot1.toFixed(1)}deg) scale(${scale.toFixed(3)})`;

          tower2Ref.current.style.display = 'block';
          tower2Ref.current.style.visibility = 'visible';
          tower2Ref.current.style.opacity = '1';
          tower2Ref.current.style.transform = `perspective(900px) translate3d(${curX2.toFixed(1)}px, ${curY.toFixed(1)}px, 0px) rotateY(${rot2.toFixed(1)}deg) scale(${scale.toFixed(3)})`;

          // Calls count-up from 0 to live between 0.14 and 0.28
          if (callsDisplayRef.current) {
            if (p < 0.14) {
              callsDisplayRef.current.textContent = '0';
            } else {
              const tCalls = (p - 0.14) / 0.14;
              const val = Math.floor(telemetry.activeCalls * Math.min(1, tCalls));
              callsDisplayRef.current.textContent = val.toLocaleString();
            }
          }
        } else if (p >= 0.28 && p <= 0.46) {
          // HOLD at full scale
          tower1Ref.current.style.display = 'block';
          tower1Ref.current.style.visibility = 'visible';
          tower1Ref.current.style.opacity = '1';
          tower1Ref.current.style.transform = `perspective(900px) translate3d(${deltaX1.toFixed(1)}px, ${holdY.toFixed(1)}px, 0px) rotateY(0deg) scale(1.15)`;

          tower2Ref.current.style.display = 'block';
          tower2Ref.current.style.visibility = 'visible';
          tower2Ref.current.style.opacity = '1';
          tower2Ref.current.style.transform = `perspective(900px) translate3d(${deltaX2.toFixed(1)}px, ${holdY.toFixed(1)}px, 0px) rotateY(0deg) scale(1.15)`;

          if (callsDisplayRef.current) {
            callsDisplayRef.current.textContent = telemetry.activeCallsFormatted;
          }
        } else if (p > 0.46 && p <= 0.52) {
          // Move outward, scale up by 0.25, fade to 0
          const t = (p - 0.46) / 0.06;
          const e = smoothstep(t);
          const dX = 130 * (W / 1360) * e;
          const scale = 1.15 + 0.25 * e;
          const op = Math.max(0, 1 - e);

          tower1Ref.current.style.display = 'block';
          tower1Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
          tower1Ref.current.style.opacity = op.toFixed(3);
          tower1Ref.current.style.transform = `perspective(900px) translate3d(${(deltaX1 - dX).toFixed(1)}px, ${holdY.toFixed(1)}px, 0px) scale(${scale.toFixed(3)})`;

          tower2Ref.current.style.display = 'block';
          tower2Ref.current.style.visibility = op > 0.01 ? 'visible' : 'hidden';
          tower2Ref.current.style.opacity = op.toFixed(3);
          tower2Ref.current.style.transform = `perspective(900px) translate3d(${(deltaX2 + dX).toFixed(1)}px, ${holdY.toFixed(1)}px, 0px) scale(${scale.toFixed(3)})`;
        } else {
          // Fully hidden after 0.52
          tower1Ref.current.style.display = 'none';
          tower1Ref.current.style.visibility = 'hidden';
          tower1Ref.current.style.opacity = '0';

          tower2Ref.current.style.display = 'none';
          tower2Ref.current.style.visibility = 'hidden';
          tower2Ref.current.style.opacity = '0';
        }
      }

      // ── 3. TUNNEL RINGS (0.46 to 0.96) ──
      if (ringsContainerRef.current) {
        if (p >= 0.46 && p <= 0.96) {
          ringsContainerRef.current.style.display = 'block';

          let vis = 1.0;
          if (p < 0.56) vis = (p - 0.46) / 0.10;
          else if (p > 0.66 && p <= 0.74) vis = 1.0 - 0.60 * ((p - 0.66) / 0.08);
          else if (p > 0.74 && p < 0.90) vis = 0.40;
          else if (p >= 0.90) vis = 0.40 * (1 - (p - 0.90) / 0.06);

          ringsRef.current.forEach((ringEl, k) => {
            if (!ringEl) return;
            let f = ((p - 0.46) * 3.2 + k * 0.2) % 1.0;
            if (f < 0) f += 1.0;
            const scale = 0.2 + 1.6 * f;
            const op = Math.max(0, vis * Math.sin(Math.PI * f) * 0.9);
            ringEl.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
            ringEl.style.opacity = op.toFixed(3);
          });
        } else {
          ringsContainerRef.current.style.display = 'none';
        }
      }

      // ── 4. TUNNEL TEXT (0.53 to 0.67 — NEVER overlaps towers) ──
      if (tunnelTextRef.current) {
        if (p >= 0.53 && p <= 0.67) {
          tunnelTextRef.current.style.display = 'block';
          tunnelTextRef.current.style.visibility = 'visible';

          let op = 1.0;
          if (p < 0.58) op = (p - 0.53) / 0.05;
          else if (p > 0.62) op = 1.0 - (p - 0.62) / 0.05;

          tunnelTextRef.current.style.opacity = Math.max(0, Math.min(1, op)).toFixed(3);
        } else {
          tunnelTextRef.current.style.display = 'none';
          tunnelTextRef.current.style.visibility = 'hidden';
          tunnelTextRef.current.style.opacity = '0';
        }
      }

      // ── 5. CARD 1 (0.62 to 0.74 EMERGES FROM VANISHING POINT) ──
      if (card1Ref.current) {
        const deltaX = 0.213 * W;
        const deltaY = 0.248 * H;

        if (p < 0.62) {
          card1Ref.current.style.display = 'none';
          card1Ref.current.style.visibility = 'hidden';
          card1Ref.current.style.opacity = '0';
        } else if (p >= 0.62 && p < 0.74) {
          const t = (p - 0.62) / 0.12;
          const eTr = easeOutCubic(t);
          const eOp = smoothstep(t);
          const curX = deltaX * (1 - eTr);
          const curY = deltaY * (1 - eTr);
          const scale = 0.15 + 0.85 * eTr;

          card1Ref.current.style.display = 'block';
          card1Ref.current.style.visibility = 'visible';
          card1Ref.current.style.opacity = eOp.toFixed(3);
          card1Ref.current.style.transform = `translate(${curX.toFixed(1)}px, ${curY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        } else {
          // Fully settled in natural position
          card1Ref.current.style.display = 'block';
          card1Ref.current.style.visibility = 'visible';
          card1Ref.current.style.opacity = '1';
          card1Ref.current.style.transform = 'translate(0px, 0px) scale(1)';
        }
      }

      // ── 6. CARD 2 (0.68 to 0.80 EMERGES FROM VANISHING POINT) ──
      if (card2Ref.current) {
        const deltaX = -0.214 * W;
        const deltaY = 0.248 * H;

        if (p < 0.68) {
          card2Ref.current.style.display = 'none';
          card2Ref.current.style.visibility = 'hidden';
          card2Ref.current.style.opacity = '0';
        } else if (p >= 0.68 && p < 0.80) {
          const t = (p - 0.68) / 0.12;
          const eTr = easeOutCubic(t);
          const eOp = smoothstep(t);
          const curX = deltaX * (1 - eTr);
          const curY = deltaY * (1 - eTr);
          const scale = 0.15 + 0.85 * eTr;

          card2Ref.current.style.display = 'block';
          card2Ref.current.style.visibility = 'visible';
          card2Ref.current.style.opacity = eOp.toFixed(3);
          card2Ref.current.style.transform = `translate(${curX.toFixed(1)}px, ${curY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        } else {
          // Fully settled in natural position
          card2Ref.current.style.display = 'block';
          card2Ref.current.style.visibility = 'visible';
          card2Ref.current.style.opacity = '1';
          card2Ref.current.style.transform = 'translate(0px, 0px) scale(1)';
        }
      }

      // ── 7. FEATURES TEASER STRIP (0.86 to 0.96) ──
      if (featuresStripRef.current) {
        if (p < 0.86) {
          featuresStripRef.current.style.display = 'none';
          featuresStripRef.current.style.visibility = 'hidden';
          featuresStripRef.current.style.opacity = '0';
        } else {
          const t = Math.min(1.0, (p - 0.86) / 0.10);
          const e = smoothstep(t);
          const yOff = 50 * (1 - e);

          featuresStripRef.current.style.display = 'block';
          featuresStripRef.current.style.visibility = 'visible';
          featuresStripRef.current.style.opacity = e.toFixed(3);
          featuresStripRef.current.style.transform = `translateY(${yOff.toFixed(1)}px)`;
        }
      }

      // ── 8. BOTTOM CHIP TEXT STATE MACHINE ──
      let chipText = 'Scroll';
      let showChip = true;

      if (p < 0.05) {
        chipText = 'Scroll';
      } else if (p < 0.46) {
        chipText = '01 · Live engine and global grid';
      } else if (p < 0.62) {
        chipText = '02 · Entering HQ';
      } else if (p < 0.86) {
        chipText = '03 · Platform';
      } else {
        showChip = false;
      }

      if (bottomChipRef.current) {
        if (showChip) {
          bottomChipRef.current.style.display = 'flex';
          bottomChipRef.current.style.opacity = '1';
          if (chipText !== lastChipTextRef.current && bottomChipTextRef.current) {
            lastChipTextRef.current = chipText;
            bottomChipTextRef.current.textContent = chipText;
          }
        } else {
          bottomChipRef.current.style.display = 'none';
          bottomChipRef.current.style.opacity = '0';
        }
      }

      // ── 9. HEADER PROGRESS BAR & NAV HIGHLIGHT ──
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p)).toFixed(4)})`;
      }

      const nextNav = p >= 0.86 ? 'Features' : 'Home';
      if (nextNav !== lastNavRef.current) {
        lastNavRef.current = nextNav;
        setActiveNav(nextNav);
      }

      animId = requestAnimationFrame(frameLoop);
    };

    animId = requestAnimationFrame(frameLoop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [debugProgress, reducedMotion, telemetry]);

  // Reduced motion: standard stacked fallback
  if (reducedMotion) {
    return (
      <div className="relative w-full bg-[#02050e] text-white">
        <DesktopHeader activeNav="Home" onNavClick={handleScrollTo} />
        <div className="pt-24 px-[5.9%] max-w-[1920px] mx-auto space-y-16 py-12">
          {/* Hero text */}
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold tracking-tight">
              AI voice agents that call, qualify and close
            </h1>
            <p className="mt-4 text-xl text-[#94a9c2]">
              Sub-300ms human-grade voice in 40+ native languages.
            </p>
          </div>
          {/* Towers fallback */}
          <div className="grid grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-[#00f0ff] bg-[#031a2e]">
              <h3 className="text-xl font-bold text-[#00f0ff]">Tower 01 — Live Engine</h3>
              <p className="mt-2 text-slate-300">Active Calls: {telemetry.activeCallsFormatted}</p>
            </div>
            <div className="p-6 rounded-lg border border-[#38bdf8] bg-[#031a2e]">
              <h3 className="text-xl font-bold text-[#38bdf8]">Tower 02 — Global Grid</h3>
              <p className="mt-2 text-slate-300">US-E: 12ms · EU-C: 23ms</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#02050e] text-white overflow-hidden">
      {/* Strict zero gaps styling */}
      <style>{`
        html, body, #root {
          background-color: #02050e !important;
        }
      `}</style>

      {/* ── 1. FIXED GLASS HEADER ── */}
      <DesktopHeader
        activeNav={activeNav}
        progressBarRef={progressBarRef}
        onNavClick={handleScrollTo}
      />

      {/* ── 2. PINNED HERO CONTAINER (100svh) ── */}
      <div
        ref={containerRef}
        className="relative w-full h-[100svh] overflow-hidden bg-[#02050e]"
      >
        <div
          ref={stageRef}
          className="relative w-full h-full max-w-[1920px] mx-auto overflow-hidden"
          style={{ perspective: '900px' }}
        >
          {/* Lightweight Background Grid & Particles */}
          <DesktopBackground isPaused={isOffScreen} />

          {/* ── LEFT HERO BLOCK (0.00 to 0.16) ── */}
          <div
            ref={heroBlockRef}
            className="absolute will-change-transform select-none z-20"
            style={{
              left: '5.9vw',
              top: '20vh',
              width: '40vw',
              display: 'block',
            }}
          >
            {/* Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/[0.1] px-3.5 py-1 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="font-mono text-[clamp(11px,0.75vw,13px)] font-bold uppercase tracking-widest text-[#00f0ff]">
                AI VOICE INFRASTRUCTURE
              </span>
            </div>

            {/* H1 Headline */}
            <h1
              className="mt-4 font-sans font-medium text-white tracking-tight"
              style={{
                fontSize: 'clamp(40px, 3.4vw, 64px)',
                lineHeight: 1.12,
              }}
            >
              AI voice agents that call, qualify and close
            </h1>

            {/* Subline */}
            <p
              className="mt-4 font-sans text-[#94a9c2] leading-relaxed max-w-[560px]"
              style={{
                fontSize: 'clamp(15px, 1.1vw, 20px)',
              }}
            >
              Sub-300ms human-grade voice in 40+ native languages.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleScrollTo('#contact')}
                className="flex items-center gap-2 rounded-full bg-[#00f0ff] px-7 py-3.5 font-bold text-[#02222a] text-[15px] shadow-[0_0_25px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Book a demo</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('#demo')}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 font-bold text-white text-[15px] hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/[0.08] transition-all"
              >
                <Volume2 className="h-4 w-4 text-[#00f0ff]" />
                <span>Listen to sample</span>
              </button>
            </div>
          </div>

          {/* ── CSS 3D TOWERS (RIGHT SIDE) ── */}
          <DesktopTowers
            ref={{ tower1Ref, tower2Ref }}
            telemetry={telemetry}
            callsDisplayRef={callsDisplayRef}
          />

          {/* ── 5 RECTANGULAR PORTAL RINGS & TUNNEL TEXT ── */}
          <DesktopTunnel
            ref={{
              ringsContainerRef,
              ringsRef,
              tunnelTextRef,
            }}
          />

          {/* ── CARDS 1 & 2 (EMERGE FROM VANISHING POINT) ── */}
          <DesktopCards
            ref={{ card1Ref, card2Ref }}
            onActionClick={handleScrollTo}
          />

          {/* ── FEATURES TEASER STRIP (0.86 to 0.96) ── */}
          <DesktopFeaturesStrip
            ref={featuresStripRef}
            onTileClick={handleScrollTo}
          />

          {/* ── BOTTOM PROGRESS CHIP ── */}
          <div
            ref={bottomChipRef}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 select-none pointer-events-none transition-opacity duration-300"
          >
            <div className="flex items-center gap-2.5 rounded-full border border-[#00f0ff]/40 bg-[#031526]/90 px-4 py-1.5 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span
                ref={bottomChipTextRef}
                className="font-mono text-[12px] font-bold text-white tracking-wider"
              >
                Scroll
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#00f0ff] animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
