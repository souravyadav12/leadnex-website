import { useState, useEffect } from 'react';
import EmergingBuildingScenes from '../components/EmergingBuildingScenes';
import MobileHero from '../mobile/MobileHero';
import DesktopHeroV2 from '../desktop-v2/DesktopHeroV2';
import { useIsMobile } from '../mobile/useIsMobile';
import FeaturesSection from '../sections/FeaturesSection';
import DemoSection from '../sections/DemoSection';
import WorkflowSection from '../sections/WorkflowSection';
import PricingSection from '../sections/PricingSection';
import LeadSection from '../sections/LeadSection';
import CtaBanner from '../sections/CtaBanner';
import { Band3D } from '../motion/ThreeD';
import { features } from '../data/site';

const USE_DESKTOP_V2 = true;

/**
 * useViewportTier
 * Categorizes viewport into:
 * - 'mobile': < 768px (renders MobileHero)
 * - 'tablet': 768px to 1023px (renders EmergingBuildingScenes)
 * - 'desktop': >= 1024px (renders DesktopHeroV2 if USE_DESKTOP_V2 is true)
 */
function useViewportTier() {
  const [tier, setTier] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w >= 1024) return 'desktop';
    return 'tablet';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setTier('mobile');
      else if (w >= 1024) setTier('desktop');
      else setTier('tablet');
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return tier;
}

/**
 * Home — LEADNEX.AI Enterprise Architecture
 *
 * Sequence:
 * 1. 3D Twin Skyscraper Headquarters with Central Emerging AI Calling Panels
 * 2. Features Section (16 Enterprise Capabilities & Call Center Comparison)
 * 3. Live AI Calling Workflow & Interactive Simulation
 * 4. Pricing Section (Starter, Growth, Enterprise Plans)
 * 5. Contact Section (Direct Consultation & Demo Booking)
 * 6. Closing Production Banner
 */
export default function Home() {
  const isMobile = useIsMobile();
  const tier = useViewportTier();

  let heroComponent;
  if (isMobile || tier === 'mobile') {
    heroComponent = <MobileHero />;
  } else if (tier === 'desktop' && USE_DESKTOP_V2) {
    heroComponent = <DesktopHeroV2 />;
  } else {
    heroComponent = <EmergingBuildingScenes />;
  }

  return (
    <main className="relative z-10 bg-transparent">
      {/* ─ 1. 3D TWIN SKYSCRAPER HEADQUARTERS & CENTRAL EMERGING PANELS ─ */}
      {heroComponent}

      {/* Telephony Technology Marquee */}
      <Band3D
        words={[
          'AUTONOMOUS VOICE AGENTS',
          'SPEED-TO-LEAD < 12S',
          '40+ NATIVE LANGUAGES',
          'SUB-300MS LATENCY',
          'SALESFORCE & HUBSPOT SYNC',
          'SOC 2 & HIPAA READY',
        ]}
        className="bg-white/[0.012]"
      />

      {/* ─ 2. FEATURES SECTION (Directly following 3D experience) ─ */}
      <FeaturesSection />

      {/* Interactive Telephony Workflow & Live Demo */}
      <WorkflowSection />
      <DemoSection />

      <Band3D words={features.integrations} className="bg-white/[0.012]" />

      {/* ─ 3. PRICING SECTION (Following Features) ─ */}
      <PricingSection />

      {/* ─ 4. CONTACT & DEMO INTAKE SECTION ─ */}
      <LeadSection />

      {/* ─ 5. CLOSING CALL TO ACTION ─ */}
      <CtaBanner />
    </main>
  );
}
