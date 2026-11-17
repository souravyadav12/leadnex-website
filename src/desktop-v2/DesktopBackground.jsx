import { useEffect, useRef } from 'react';

/**
 * DesktopBackground
 * Lightweight floor grid and 40 drifting round particles.
 * - Floor: bottom 24% of H, 3 faint horizontal lines + perspective lines in #0a2a40.
 * - Particles: 40 round dots (1 to 3px, opacity 0.15 to 0.45), zero square particles.
 * - Paused when hero is off-screen.
 */
export function DesktopBackground({ isPaused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize 40 round particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2, // 1 to 3px
      alpha: 0.15 + Math.random() * 0.30, // 0.15 to 0.45
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.2 - Math.random() * 0.35, // slowly drifting upward
    }));

    const render = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, width, height);

      // ── 1. Floor Grid (Bottom 24% of H) ──
      const floorTop = height * 0.76;
      const vpX = width * 0.50;
      const vpY = height * 0.457;

      ctx.save();
      ctx.strokeStyle = '#0a2a40';
      ctx.lineWidth = 1;

      // 3 faint horizontal lines
      const hLines = [floorTop, floorTop + (height - floorTop) * 0.45, floorTop + (height - floorTop) * 0.90];
      hLines.forEach((y, i) => {
        ctx.globalAlpha = 0.25 + i * 0.10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      });

      // Perspective lines converging toward (vpX, vpY)
      ctx.globalAlpha = 0.32;
      const floorSteps = 16;
      for (let i = 0; i <= floorSteps; i++) {
        const bottomX = (width / floorSteps) * i;
        ctx.beginPath();
        // Line from floorTop intersection to bottom
        const slope = (bottomX - vpX) / (height - vpY);
        const startX = vpX + slope * (floorTop - vpY);
        ctx.moveTo(startX, floorTop);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }
      ctx.restore();

      // ── 2. 40 Round Drifting Particles ──
      ctx.save();
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.fillStyle = '#00f0ff';
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    if (!isPaused) {
      animId = requestAnimationFrame(render);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default DesktopBackground;
