import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────
   LEADNEX.AI — Centralized Scroll Controller
   
   SINGLE SOURCE OF TRUTH for scroll-driven camera flight & content synchronization:
     - Scrub-driven ScrollTrigger maps document scroll (0.0 -> 1.0) directly.
     - Deterministic 1:1 synchronization: scrolling down advances forward,
       stopping scroll IMMEDIATELY freezes camera with zero drift or recoil,
       scrolling up moves smoothly backward.
     - Real-time subscription hook for the 7 Emerging AI Calling Stages:
         Stage 0 (p: 0.00 - 0.16) · Headquarters Skyscraper & Glowing Billboard (Hero)
         Stage 1 (p: 0.16 - 0.30) · Meet Your AI Voice Agent & 3D Waveform
         Stage 2 (p: 0.30 - 0.45) · Automated Outbound Calling & Speed-to-Lead
         Stage 3 (p: 0.45 - 0.60) · 24/7 Inbound AI Receptionist
         Stage 4 (p: 0.60 - 0.74) · Conversation Intelligence & Sentiment Analytics
         Stage 5 (p: 0.74 - 0.88) · CRM & Workflow Automation Matrix
         Stage 6 (p: 0.88 - 1.00) · Skyline Observation Deck & Final CTA
   ───────────────────────────────────────────────────────────────────────── */

export const scrollState = {
  progress: 0,         // raw deterministic 0.0 -> 1.0
  velocity: 0,         // instantaneous velocity for telemetry
  stage: 0,            // 0..6
  stageProgress: 0,    // 0.0 -> 1.0 within current stage
};

const listeners = new Set();

export function subscribeScroll(fn) {
  listeners.add(fn);
  fn(scrollState.progress, scrollState);
  return () => listeners.delete(fn);
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(scrollState.progress);
  useEffect(() => {
    return subscribeScroll((p) => setProgress(p));
  }, []);
  return progress;
}

let initialized = false;
let scrollTriggerInstance = null;

function updateStages(p) {
  scrollState.progress = p;

  if (p < 0.16) {
    scrollState.stage = 0;
    scrollState.stageProgress = p / 0.16;
  } else if (p < 0.30) {
    scrollState.stage = 1;
    scrollState.stageProgress = (p - 0.16) / 0.14;
  } else if (p < 0.45) {
    scrollState.stage = 2;
    scrollState.stageProgress = (p - 0.30) / 0.15;
  } else if (p < 0.60) {
    scrollState.stage = 3;
    scrollState.stageProgress = (p - 0.45) / 0.15;
  } else if (p < 0.74) {
    scrollState.stage = 4;
    scrollState.stageProgress = (p - 0.60) / 0.14;
  } else if (p < 0.88) {
    scrollState.stage = 5;
    scrollState.stageProgress = (p - 0.74) / 0.14;
  } else {
    scrollState.stage = 6;
    scrollState.stageProgress = (p - 0.88) / 0.12;
  }

  listeners.forEach((fn) => {
    try {
      fn(p, scrollState);
    } catch (e) {
      console.error(e);
    }
  });
}

export function initScrollController() {
  if (typeof window === 'undefined') return () => {};
  if (initialized && scrollTriggerInstance) {
    return () => cleanup();
  }

  // Kill any existing ScrollTrigger with this ID
  const prev = ScrollTrigger.getById('leadnex-master-scroll');
  if (prev) prev.kill();

  // Create single deterministic ScrollTrigger with scrub: true
  scrollTriggerInstance = ScrollTrigger.create({
    id: 'leadnex-master-scroll',
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true, // Strict lockstep scrubbing: zero backward drift on stop
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      updateStages(self.progress);
      scrollState.velocity = self.getVelocity() || 0;
    },
  });

  // Read initial progress immediately
  const initialP = scrollTriggerInstance.progress || 0;
  updateStages(initialP);

  // Link with Lenis instance if available
  let unbindLenis = null;
  if (window.__lenis) {
    const handleLenis = () => {
      ScrollTrigger.update();
    };
    window.__lenis.on('scroll', handleLenis);
    unbindLenis = () => {
      window.__lenis?.off?.('scroll', handleLenis);
    };
  }

  // Refresh ScrollTrigger to calculate accurate measurements once layout settles
  const t = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 120);

  initialized = true;

  function cleanup() {
    clearTimeout(t);
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
    if (unbindLenis) unbindLenis();
    initialized = false;
  }

  return cleanup;
}
