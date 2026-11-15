import EmergingBuildingScenes from '../components/EmergingBuildingScenes';
import FeaturesSection from '../sections/FeaturesSection';
import DemoSection from '../sections/DemoSection';
import WorkflowSection from '../sections/WorkflowSection';
import PricingSection from '../sections/PricingSection';
import LeadSection from '../sections/LeadSection';
import CtaBanner from '../sections/CtaBanner';
import { Band3D } from '../motion/ThreeD';
import { features } from '../data/site';

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
  return (
    <main className="relative z-10 bg-transparent">
      {/* ─ 1. 3D TWIN SKYSCRAPER HEADQUARTERS & CENTRAL EMERGING PANELS ─ */}
      <EmergingBuildingScenes />

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
