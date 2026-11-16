import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * renderBillboardCanvas — High-Definition Synchronous Canvas Renderer
 * Rendered at 1024x2048 with crisp typography and high contrast.
 */
function renderBillboardCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background
  ctx.fillStyle = '#06122c';
  ctx.fillRect(0, 0, w, h);

  // Glowing Cyber Grid Pattern
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 64) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 64) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // 2. Thick Outer Border & White Corner Brackets
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 18;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 22;
  const corner = 90;
  ctx.beginPath();
  // Top-Left
  ctx.moveTo(28, 28 + corner); ctx.lineTo(28, 28); ctx.lineTo(28 + corner, 28);
  // Top-Right
  ctx.moveTo(w - 28 - corner, 28); ctx.lineTo(w - 28, 28); ctx.lineTo(w - 28, 28 + corner);
  // Bottom-Left
  ctx.moveTo(28, h - 28 - corner); ctx.lineTo(28, h - 28); ctx.lineTo(28 + corner, h - 28);
  // Bottom-Right
  ctx.moveTo(w - 28 - corner, h - 28); ctx.lineTo(w - 28, h - 28); ctx.lineTo(w - 28, h - 28 - corner);
  ctx.stroke();

  // 3. Top Status Header Ribbon
  ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
  ctx.fillRect(56, 70, w - 112, 100);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 70, w - 112, 100);

  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 01', 88, 120);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(w - 240, 120, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('LIVE ENGINE', w - 85, 120);

  // 4. MAIN HEADLINE BRANDING: LEADNEX.AI
  ctx.font = '900 136px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('LEADNEX', w / 2, 320);

  ctx.fillStyle = '#00f0ff';
  ctx.fillText('.AI', w / 2, 455);

  // Tagline: AI CALLING. SMARTER CONVERSATIONS.
  ctx.font = 'bold 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AI CALLING.', w / 2, 555);

  ctx.font = 'bold 38px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 615);

  // Glowing Divider Line
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(70, 675);
  ctx.lineTo(w - 70, 675);
  ctx.stroke();

  // 5. Telemetry Stats Panel
  const boxY = 720;
  ctx.fillStyle = 'rgba(2, 10, 28, 0.94)';
  ctx.fillRect(70, boxY, w - 140, 470);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, boxY, w - 140, 470);

  const metrics = [
    { label: 'CONCURRENT LIVE CALLS', val: (12480 + Math.floor(Math.sin(t * 2) * 120)).toLocaleString(), unit: 'ACTIVE' },
    { label: 'SYNTHESIS LATENCY', val: '276', unit: 'MS' },
    { label: 'SPEECH MOS QUALITY', val: '4.92', unit: '/ 5.0' },
    { label: 'SYSTEM SLA GUARANTEE', val: '99.99', unit: '% ONLINE' },
  ];

  metrics.forEach((m, i) => {
    const my = boxY + 65 + i * 105;
    ctx.font = 'bold 27px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.label, 105, my);

    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, w - 210, my);

    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(m.unit, w - 105, my);

    if (i < 3) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(105, my + 48);
      ctx.lineTo(w - 105, my + 48);
      ctx.stroke();
    }
  });

  // 6. Audio Spectrum Analyzer
  const waveY = 1270;
  ctx.font = 'bold 32px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE NEURAL VOICE SPECTRUM', w / 2, waveY);

  const barCount = 30;
  const barWidth = 18;
  const barSpacing = 9;
  const totalW = barCount * (barWidth + barSpacing) - barSpacing;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < barCount; i++) {
    const freq = Math.sin(t * 4 + i * 0.4) * Math.cos(t * 2.5 - i * 0.25);
    const barH = Math.max(16, Math.abs(freq) * 180 + 24);
    const bx = startX + i * (barWidth + barSpacing);
    const by = waveY + 230 - barH;

    ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#38bdf8';
    ctx.fillRect(bx, by, barWidth, barH);
  }

  // 7. Scanning Laser Line
  const scanlineY = ((t * 220) % (h - 120)) + 60;
  ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
  ctx.fillRect(35, scanlineY - 25, w - 70, 50);

  // 8. Footer Telemetry Tag
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 75);
}

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 * Rendered at 1024x2048 with anisotropic filtering and mipmapping for crystal clear readability.
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 2048;

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
