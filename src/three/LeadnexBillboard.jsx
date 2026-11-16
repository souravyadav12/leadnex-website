import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * renderBillboardCanvas — Synchronous Pure Canvas Renderer
 * Guaranteed to execute synchronously before CanvasTexture initialization.
 */
function renderBillboardCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background (Bright enough to be clearly seen)
  ctx.fillStyle = '#081a3a';
  ctx.fillRect(0, 0, w, h);

  // Glowing Cyber Grid Pattern
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x += 32) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 32) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // 2. Thick Outer Border & White Corner Brackets
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  const corner = 50;
  ctx.beginPath();
  // Top-Left
  ctx.moveTo(16, 16 + corner); ctx.lineTo(16, 16); ctx.lineTo(16 + corner, 16);
  // Top-Right
  ctx.moveTo(w - 16 - corner, 16); ctx.lineTo(w - 16, 16); ctx.lineTo(w - 16, 16 + corner);
  // Bottom-Left
  ctx.moveTo(16, h - 16 - corner); ctx.lineTo(16, h - 16); ctx.lineTo(16 + corner, h - 16);
  // Bottom-Right
  ctx.moveTo(w - 16 - corner, h - 16); ctx.lineTo(w - 16, h - 16); ctx.lineTo(w - 16, h - 16 - corner);
  ctx.stroke();

  // 3. Top Status Header Ribbon
  ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.fillRect(30, 40, w - 60, 58);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 40, w - 60, 58);

  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'left';
  ctx.fillText('LEADNEX // TOWER 01', 48, 77);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(w - 120, 69, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('LIVE ENGINE', w - 45, 75);

  // 4. MAIN HEADLINE BRANDING: LEADNEX.AI
  ctx.font = '900 78px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('LEADNEX', w / 2, 215);

  ctx.fillStyle = '#00f0ff';
  ctx.fillText('.AI', w / 2, 292);

  // Tagline: AI CALLING. SMARTER CONVERSATIONS.
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AI CALLING.', w / 2, 348);

  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 380);

  // Glowing Divider Line
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(40, 415);
  ctx.lineTo(w - 40, 415);
  ctx.stroke();

  // 5. Telemetry Stats Panel
  const boxY = 445;
  ctx.fillStyle = 'rgba(2, 10, 28, 0.9)';
  ctx.fillRect(40, boxY, w - 80, 250);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, boxY, w - 80, 250);

  const metrics = [
    { label: 'CONCURRENT LIVE CALLS', val: (12480 + Math.floor(Math.sin(t * 2) * 120)).toLocaleString(), unit: 'ACTIVE' },
    { label: 'SYNTHESIS LATENCY', val: '276', unit: 'MS' },
    { label: 'SPEECH MOS QUALITY', val: '4.92', unit: '/ 5.0' },
    { label: 'SYSTEM SLA GUARANTEE', val: '99.99', unit: '% ONLINE' },
  ];

  metrics.forEach((m, i) => {
    const my = boxY + 40 + i * 56;
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText(m.label, 60, my);

    ctx.font = 'bold 23px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, w - 105, my + 4);

    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(m.unit, w - 60, my + 4);

    if (i < 3) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, my + 21);
      ctx.lineTo(w - 60, my + 21);
      ctx.stroke();
    }
  });

  // 6. Audio Spectrum Analyzer
  const waveY = 730;
  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('LIVE NEURAL VOICE SPECTRUM', w / 2, waveY);

  const barCount = 28;
  const barWidth = 9;
  const barSpacing = 4.5;
  const totalW = barCount * (barWidth + barSpacing) - barSpacing;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < barCount; i++) {
    const freq = Math.sin(t * 4 + i * 0.4) * Math.cos(t * 2.5 - i * 0.25);
    const barH = Math.max(8, Math.abs(freq) * 95 + 12);
    const bx = startX + i * (barWidth + barSpacing);
    const by = waveY + 120 - barH;

    ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#38bdf8';
    ctx.fillRect(bx, by, barWidth, barH);
  }

  // 7. Scanning Laser Line
  const scanlineY = ((t * 130) % (h - 60)) + 30;
  ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
  ctx.fillRect(20, scanlineY - 15, w - 40, 30);

  // 8. Footer Telemetry Tag
  ctx.font = 'bold 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 40);
}

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 * Bulletproof synchronous initialization: renders canvas BEFORE creating CanvasTexture.
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const lastDrawRef = useRef(0);

  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1024;

    // Render IMMEDIATELY and synchronously so texture is never blank
    renderBillboardCanvas(c, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;

    return { canvas: c, texture: tex };
  }, []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (now - lastDrawRef.current > 0.083) {
      lastDrawRef.current = now;
      renderBillboardCanvas(canvas, now);
      texture.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Housing Frame Backing (z = 0.0) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7.4, 14.6, 0.2]} />
        <meshStandardMaterial color="#020814" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Outer Neon Rim Light Frame */}
      <lineSegments position={[0, 0, 0.12]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.42, 14.62, 0.22)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.95} />
      </lineSegments>

      {/* Active High-Res LED Screen (Positioned ahead at z = 0.25, renderOrder = 30) */}
      <mesh ref={meshRef} position={[0, 0, 0.25]} renderOrder={30}>
        <planeGeometry args={[7.2, 14.4]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
