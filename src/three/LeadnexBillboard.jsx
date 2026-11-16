import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * renderBillboardCanvas — High-Definition Synchronous Canvas Renderer
 * Balanced, elegant typography with smooth live animations.
 */
function renderBillboardCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background
  ctx.fillStyle = '#040d24';
  ctx.fillRect(0, 0, w, h);

  // Glowing Cyber Grid Pattern
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.20)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 48) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 48) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // 2. Thick Outer Border & White Corner Brackets
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 20;
  const corner = 75;
  ctx.beginPath();
  // Top-Left
  ctx.moveTo(20, 20 + corner); ctx.lineTo(20, 20); ctx.lineTo(20 + corner, 20);
  // Top-Right
  ctx.moveTo(w - 20 - corner, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + corner);
  // Bottom-Left
  ctx.moveTo(20, h - 20 - corner); ctx.lineTo(20, h - 20); ctx.lineTo(20 + corner, h - 20);
  // Bottom-Right
  ctx.moveTo(w - 20 - corner, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - corner);
  ctx.stroke();

  // 3. Top Status Header Ribbon with Live Pulsing Beacon
  ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.fillRect(40, 48, w - 80, 85);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(40, 48, w - 80, 85);

  ctx.font = '900 32px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 01', 65, 90);

  // Animated Live Engine Pulse Dot
  const pulse = 0.5 + 0.5 * Math.sin(t * 6.5);
  ctx.fillStyle = pulse > 0.3 ? '#00ff88' : '#059669';
  ctx.beginPath();
  ctx.arc(w - 215, 90, 11 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('LIVE ENGINE', w - 65, 90);

  // 4. MAIN HEADLINE BRANDING: LEADNEX.AI (Sleek, Balanced, Well-Proportioned)
  ctx.font = '900 64px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX', w / 2, 215);

  ctx.fillStyle = '#00f0ff';
  ctx.fillText('.AI', w / 2, 285);

  // Taglines
  ctx.font = '900 30px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AI CALLING INFRASTRUCTURE', w / 2, 365);

  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('SUB-300MS VOICE TURN-AROUND', w / 2, 405);

  // Glowing Divider Line
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(50, 445);
  ctx.lineTo(w - 50, 445);
  ctx.stroke();

  // 5. Four Live-Animated Telemetry Metric Cards
  const liveCalls = (12480 + Math.floor(Math.sin(t * 1.8) * 35 + Math.cos(t * 3.4) * 20)).toLocaleString();
  const liveLatency = (274 + Math.floor(Math.sin(t * 2.5) * 6)).toString();

  const metrics = [
    { label: 'ACTIVE CONCURRENT CALLS', val: liveCalls, unit: 'CALLS' },
    { label: 'VOICE SYNTHESIS LATENCY', val: liveLatency, unit: 'MS' },
    { label: 'SPEECH QUALITY (MOS)', val: '4.92', unit: '/ 5.0' },
    { label: 'TELEPHONY CLOUD SLA', val: '99.99%', unit: 'ONLINE' },
  ];

  const startY = 475;
  const cardH = 88;
  const gap = 14;

  metrics.forEach((m, i) => {
    const cy = startY + i * (cardH + gap);

    // Card background with subtle breathing cyber glow
    ctx.fillStyle = 'rgba(2, 12, 34, 0.96)';
    ctx.fillRect(50, cy, w - 100, cardH);
    ctx.strokeStyle = i === 0 ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.60)';
    ctx.lineWidth = i === 0 ? 3 : 2.5;
    ctx.strokeRect(50, cy, w - 100, cardH);

    // Left label
    ctx.font = '900 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.label, 75, cy + cardH / 2);

    // Right value
    ctx.font = '900 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, w - 165, cy + cardH / 2);

    // Unit
    ctx.font = '900 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(m.unit, w - 75, cy + cardH / 2);
  });

  // 6. Live-Animated Neural Voice Spectrum
  const waveY = 930;
  ctx.font = '900 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE NEURAL VOICE SPECTRUM', w / 2, waveY);

  const barCount = 28;
  const barWidth = 15;
  const barSpacing = 8;
  const totalW = barCount * (barWidth + barSpacing) - barSpacing;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < barCount; i++) {
    const freq1 = Math.sin(t * 5.2 + i * 0.45);
    const freq2 = Math.cos(t * 3.8 - i * 0.32);
    const freq3 = Math.sin(t * 7.5 + i * 0.75);
    const composite = Math.abs(freq1 * 0.55 + freq2 * 0.3 + freq3 * 0.25);
    const barH = Math.max(16, composite * 165 + 20);
    const bx = startX + i * (barWidth + barSpacing);
    const by = waveY + 200 - barH;

    // Glowing vertical gradient
    const grad = ctx.createLinearGradient(0, by, 0, by + barH);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#00f0ff');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, barWidth, barH);

    // Floating peak cap dot
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, by - 6, barWidth, 3);
  }

  // 7. Smooth Animated Scanning Laser Line
  const scanlineY = ((t * 220) % (h - 120)) + 60;
  const scanGrad = ctx.createLinearGradient(0, scanlineY - 30, 0, scanlineY + 30);
  scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
  scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
  scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(25, scanlineY - 30, w - 50, 60);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(25, scanlineY - 2, w - 50, 3);

  // 8. Footer Telemetry Tag
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE MESH · 40+ NATIVE LANGUAGES', w / 2, h - 55);
}

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 * Perfectly balanced typography and lag-free scroll-aware animations.
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const lastUpdateRef = useRef(0);

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 1536;

    // Render IMMEDIATELY and synchronously so texture is never blank
    renderBillboardCanvas(c, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    return { texture: tex, canvas: c };
  }, []);

  // When web fonts finish loading, re-render immediately for sharp vector glyphs
  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        renderBillboardCanvas(canvas, 0);
        texture.needsUpdate = true;
      });
    }
  }, [canvas, texture]);

  // Continuous 30 FPS animation loop (never stops or pauses anywhere on page)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t - lastUpdateRef.current >= 0.033) {
      lastUpdateRef.current = t;
      renderBillboardCanvas(canvas, t);
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

      {/* Active High-Res LED Screen */}
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
