import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * renderBillboardCanvas — High-Definition Synchronous Canvas Renderer
 * Ultra-readable, bold, high-contrast typography designed specifically for 3D visibility.
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
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
  ctx.lineWidth = 2.5;
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
  ctx.lineWidth = 20;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 24;
  const corner = 95;
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
  ctx.fillStyle = 'rgba(0, 240, 255, 0.28)';
  ctx.fillRect(56, 65, w - 112, 115);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4.5;
  ctx.strokeRect(56, 65, w - 112, 115);

  ctx.font = '900 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 01', 90, 122);

  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.arc(w - 270, 122, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 34px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('LIVE ENGINE', w - 85, 122);

  // 4. MAIN HEADLINE BRANDING: LEADNEX.AI (Massive & High Impact)
  ctx.font = '900 160px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX', w / 2, 310);

  ctx.fillStyle = '#00f0ff';
  ctx.fillText('.AI', w / 2, 450);

  // Taglines
  ctx.font = '900 46px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('AI CALLING INFRASTRUCTURE', w / 2, 550);

  ctx.font = '900 40px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('SUB-300MS VOICE TURN-AROUND', w / 2, 610);

  // Glowing Divider Line
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(70, 670);
  ctx.lineTo(w - 70, 670);
  ctx.stroke();

  // 5. Four Distinct High-Impact Telemetry Metric Cards
  const metrics = [
    { label: 'ACTIVE CONCURRENT CALLS', val: '12,480', unit: 'CALLS' },
    { label: 'VOICE SYNTHESIS LATENCY', val: '276', unit: 'MS' },
    { label: 'SPEECH QUALITY (MOS)', val: '4.92', unit: '/ 5.0' },
    { label: 'TELEPHONY CLOUD SLA', val: '99.99%', unit: 'ONLINE' },
  ];

  const startY = 705;
  const cardH = 110;
  const gap = 16;

  metrics.forEach((m, i) => {
    const cy = startY + i * (cardH + gap);

    // Card background
    ctx.fillStyle = 'rgba(2, 12, 34, 0.96)';
    ctx.fillRect(70, cy, w - 140, cardH);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, cy, w - 140, cardH);

    // Left label
    ctx.font = '900 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f1f5f9';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.label, 105, cy + cardH / 2);

    // Right value
    ctx.font = '900 48px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(m.val, w - 210, cy + cardH / 2);

    // Unit
    ctx.font = '900 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(m.unit, w - 100, cy + cardH / 2);
  });

  // 6. Audio Spectrum Analyzer
  const waveY = 1260;
  ctx.font = '900 38px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LIVE NEURAL VOICE SPECTRUM', w / 2, waveY);

  const barCount = 28;
  const barWidth = 20;
  const barSpacing = 10;
  const totalW = barCount * (barWidth + barSpacing) - barSpacing;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < barCount; i++) {
    const freq = Math.sin(t * 4 + i * 0.4) * Math.cos(t * 2.5 - i * 0.25);
    const barH = Math.max(22, Math.abs(freq) * 200 + 30);
    const bx = startX + i * (barWidth + barSpacing);
    const by = waveY + 250 - barH;

    ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#38bdf8';
    ctx.fillRect(bx, by, barWidth, barH);
  }

  // 7. Scanning Laser Line
  const scanlineY = ((t * 220) % (h - 120)) + 60;
  ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.fillRect(35, scanlineY - 30, w - 70, 60);

  // 8. Footer Telemetry Tag
  ctx.font = '900 34px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE MESH · 40+ NATIVE LANGUAGES', w / 2, h - 75);
}

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 * Ultra-sharp rendering with 16x anisotropic filtering, full mipmapping and crisp typography.
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
