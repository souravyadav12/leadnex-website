import EmergingBuildingScenes from '../components/EmergingBuildingScenes';
import DemoSection from '../sections/DemoSection';
import WorkflowSection from '../sections/WorkflowSection';
import FeaturesSection from '../sections/FeaturesSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import SecuritySection from '../sections/SecuritySection';
import PricingSection from '../sections/PricingSection';
import FaqSection from '../sections/FaqSection';
import LeadSection from '../sections/LeadSection';
import CtaBanner from '../sections/CtaBanner';
import { Band3D } from '../motion/ThreeD';
import { demo, features } from '../data/site';

/**
 * Home — LEADNEX.AI Enterprise AI Calling Platform Experience
 *
 * 1. EmergingBuildingScenes:
 *    - Two massive futuristic corporate skyscrapers side by side with central opening.
 *    - Front-facing LEADNEX.AI LED billboard.
 *    - 7 Sequential scenes physically emerging from the central gap between the two buildings
 *      as the user scrolls, traveling forward toward the camera and settling into readable center layout.
 *
 * 2. Extended Website Deep Dive:
 *    - Interactive Live Call Demo Suite (Test actual phone conversations).
 *    - Autonomous Calling Workflow Pipeline.
 *    - Enterprise Capabilities & Call Center Comparison Table.
 *    - Client Testimonials & Enterprise Proof.
 *    - Cryptographic Zero-Leakage Security Vault.
 *    - Transparent Pricing, FAQ, and Consultation Intake.
 */
export default function Home() {
  return (
    <main className="relative z-10 bg-transparent">
      {/* ─ 1. CINEMATIC 3D TWIN SKYSCRAPER & EMERGING SCENES EXPERIENCE ─ */}
      <EmergingBuildingScenes />

      {/* Real-time Telephony Marquee Ticker */}
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

      {/* ─ 2. INTERACTIVE LIVE CALL DEMO SUITE ─ */}
      <DemoSection />

      {/* ─ 3. AUTONOMOUS CALLING WORKFLOW PIPELINE ─ */}
      <WorkflowSection />

      <Band3D words={demo.scenarios.map((s) => s.title)} reverse className="bg-white/[0.012]" />

      {/* ─ 4. ENTERPRISE CAPABILITIES & CALL CENTER COMPARISON ─ */}
      <FeaturesSection />

      {/* ─ 5. CUSTOMER TESTIMONIALS & PROOF ─ */}
      <TestimonialsSection />

      {/* ─ 6. CRYPTOGRAPHIC ZERO-LEAKAGE SECURITY & COMPLIANCE ─ */}
      <SecuritySection />

      <Band3D words={features.integrations} className="bg-white/[0.012]" />

      {/* ─ 7. TRANSPARENT PRICING PLANS ─ */}
      <PricingSection />

      {/* ─ 8. FREQUENTLY ASKED QUESTIONS ─ */}
      <FaqSection />

      {/* ─ 9. DIRECT DEMO BOOKING & CONSULTATION INTAKE ─ */}
      <LeadSection />

      {/* ─ 10. FINAL PRODUCTION CALL TO ACTION ─ */}
      <CtaBanner />
    </main>
  );
}
