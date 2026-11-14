import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SplitText, Reveal, ActionButton } from '../motion/kit';

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center">
      <div className="u-shell py-28">
        <Reveal className="flex items-center gap-3">
          <span className="h-px w-7 bg-line-strong" />
          <span className="label-mono text-accent-soft">404 · page not found</span>
        </Reveal>

        <h1 className="h-display mt-5 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] text-white">
          <SplitText text="This page does not exist." />
        </h1>

        <Reveal delay={0.2}>
          <p className="mt-5 max-w-md text-[14px] leading-relaxed text-muted">
            The link may be out of date. Your AI agent would have caught that on the first ring.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
          <Link to="/">
            <ActionButton variant="solid" size="md" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to home
            </ActionButton>
          </Link>
          <Link to="/features">
            <ActionButton variant="outline" size="md">
              See features
            </ActionButton>
          </Link>
        </Reveal>

        <motion.div
          aria-hidden="true"
          className="mt-14 h-px w-full bg-gradient-to-r from-accent/40 via-line to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
    </main>
  );
}
