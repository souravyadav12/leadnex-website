import Hero from '../sections/Hero';
import Call3D from '../sections/Call3D';
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
import { hero, demo, features } from '../data/site';

export default function Home() {
  return (
    <main>
      <Hero />

      {/* 3D AI-calling scene — first page only */}
      <Call3D />

      {/* oversized word strip that travels with the scroll */}
      <Band3D words={hero.trust.map((t) => t.stat)} className="bg-white/[0.012]" />

      <DemoSection />
      <WorkflowSection />

      <Band3D words={demo.scenarios.map((s) => s.title)} reverse className="bg-white/[0.012]" />

      <FeaturesSection />
      <TestimonialsSection />
      <SecuritySection />

      <Band3D words={features.integrations} className="bg-white/[0.012]" />

      <PricingSection />
      <FaqSection />
      <LeadSection />
      <CtaBanner />
    </main>
  );
}
