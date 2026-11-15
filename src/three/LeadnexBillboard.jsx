import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexBillboard — Massive Vertical Digital LED Billboard
 * Mounted on the facade of the LEADNEX.AI Corporate Headquarters.
 *
 * Features:
 * - High-resolution 1024x2048 dynamic CanvasTexture.
 * - Bold illuminated typography: "LEADNEX.AI" + "AI CALLING. SMARTER CONVERSATIONS."
 * - Dynamic real-time animations: scanline sweep, telemetry tickers, audio frequency bars.
 * - High emissive intensity with neon edge framing and light casting.
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const textureRef = useRef();
  const canvasRef = useRef();
  const animTimeRef = useRef(0);

  // Create canvas texture once
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 2048;

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    canvasRef.current = c;
    textureRef.current = tex;
    return { canvas: c, texture: tex };
  }, []);

  // Frame animation for billboard content
  useFrame((state, delta) => {
    animTimeRef.current += delta;
    const t = animTimeRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const w = 1024;
    const h = 2048;

    // 1. Dark Futuristic LED Glass Background
    ctx.fillStyle = '#040915';
    ctx.fillRect(0, 0, w, h);

    // Subtle LED Matrix Dot Grid
    ctx.fillStyle = 'rgba(0, 240, 255, 0.035)';
    const dotSpacing = 16;
    for (let x = 8; x < w; x += dotSpacing) {
      for (let y = 8; y < h; y += dotSpacing) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // 2. Neon Cyan Outer Framing & Corner Brackets
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 14;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 30;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // High-tech Corner Accents
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 18;
    const cornerSize = 90;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(30, 30 + cornerSize);
    ctx.lineTo(30, 30);
    ctx.lineTo(30 + cornerSize, 30);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - 30 - cornerSize, 30);
    ctx.lineTo(w - 30, 30);
    ctx.lineTo(w - 30, 30 + cornerSize);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(30, h - 30 - cornerSize);
    ctx.lineTo(30, h - 30);
    ctx.lineTo(30 + cornerSize, h - 30);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - 30 - cornerSize, h - 30);
    ctx.lineTo(w - 30, h - 30);
    ctx.lineTo(w - 30, h - 30 - cornerSize);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // 3. Header Telemetry Bar
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.fillRect(60, 80, w - 120, 100);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 80, w - 120, 100);

    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // HQ TOWER 01', 90, 142);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(w - 180, 130, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE ENGINE', w - 90, 140);

    // 4. Prominent Brand Logo & Typography
    const pulse = Math.sin(t * 3.0) * 0.15 + 0.85;

    // Outer glow for brand
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 45 * pulse;

    ctx.font = '900 132px "Inter", "Helvetica Neue", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('LEADNEX', w / 2, 420);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('.AI', w / 2, 550);

    // Tagline: AI CALLING. SMARTER CONVERSATIONS.
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#38bdf8';
    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e0f2fe';
    ctx.fillText('AI CALLING.', w / 2, 670);

    ctx.font = 'bold 40px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 735);

    // Decorative Horizontal Divider with glowing center diamond
    ctx.shadowBlur = 15;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 820);
    ctx.lineTo(w - 100, 820);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(w / 2 - 16, 804, 32, 32);

    // 5. Real-Time Telemetry Stats Card
    ctx.shadowBlur = 0;
    const cardY = 890;
    ctx.fillStyle = 'rgba(6, 18, 42, 0.7)';
    ctx.fillRect(80, cardY, w - 160, 480);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, cardY, w - 160, 480);

    const metrics = [
      { label: 'CONCURRENT LIVE CALLS', val: (12480 + Math.floor(Math.sin(t * 2) * 120)).toLocaleString(), unit: 'ACTIVE' },
      { label: 'VOICE SYNTHESIS LATENCY', val: '276', unit: 'MS' },
      { label: 'SPEECH NATURALNESS MOS', val: '4.92', unit: '/ 5.0' },
      { label: 'ENTERPRISE SYSTEM SLA', val: '99.99', unit: '% ONLINE' },
    ];

    metrics.forEach((m, i) => {
      const my = cardY + 70 + i * 105;
      ctx.font = '600 26px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(m.label, 120, my);

      ctx.font = 'bold 46px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'right';
      ctx.fillText(m.val, w - 210, my + 8);

      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(m.unit, w - 120, my + 8);

      if (i < 3) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, my + 35);
        ctx.lineTo(w - 120, my + 35);
        ctx.stroke();
      }
    });

    // 6. Dynamic 3D Voice Waveform Frequency Bars (Audio visualizer)
    const waveY = 1430;
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('LIVE NEURAL VOICE STREAM', w / 2, waveY);

    const barCount = 36;
    const barWidth = 16;
    const barSpacing = 8;
    const totalBarsWidth = barCount * (barWidth + barSpacing) - barSpacing;
    const startX = (w - totalBarsWidth) / 2;

    for (let i = 0; i < barCount; i++) {
      const freq = Math.sin(t * 5 + i * 0.35) * Math.cos(t * 3 - i * 0.2);
      const barH = Math.max(12, Math.abs(freq) * 160 + 20);
      const bx = startX + i * (barWidth + barSpacing);
      const by = waveY + 220 - barH;

      const grad = ctx.createLinearGradient(0, by, 0, by + barH);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#00f0ff');
      grad.addColorStop(1, '#0284c7');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillRect(bx, by, barWidth, barH);
    }

    // 7. Dynamic Animated Scanline Sweep
    const scanlineY = ((t * 220) % (h - 100)) + 50;
    const scanGrad = ctx.createLinearGradient(0, scanlineY - 40, 0, scanlineY + 40);
    scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.28)');
    scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(40, scanlineY - 40, w - 80, 80);

    // 8. Footer Badge
    ctx.shadowBlur = 0;
    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 80);

    // Notify Three.js that texture updated
    textureRef.current.needsUpdate = true;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Billboard Backing Housing / Mounting Frame */}
      <mesh position={[0, 0, -0.2]}>
        <boxGeometry args={[7.2, 14.4, 0.4]} />
        <meshStandardMaterial
          color="#060c18"
          roughness={0.4}
          metalness={0.9}
        />
      </mesh>

      {/* Billboard Outer Neon Rim Light */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(7.22, 14.42, 0.42)]} />
        <lineBasicMaterial color="#00f0ff" linewidth={2} transparent opacity={0.9} />
      </lineSegments>

      {/* Active High-Res LED Screen Display */}
      <mesh ref={meshRef}>
        <planeGeometry args={[7.0, 14.0]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          transparent
          opacity={0.98}
        />
      </mesh>

      {/* Emissive glow & point light illuminating the tower facade */}
      <pointLight color="#00f0ff" intensity={6.0} distance={24} decay={2} position={[0, 0, 1.2]} />
      <pointLight color="#0284c7" intensity={4.0} distance={18} decay={2} position={[0, -4, 1.0]} />
    </group>
  );
}

