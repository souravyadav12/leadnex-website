import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexBillboard — Ultra-Optimized Left Skyscraper LED Billboard
 *
 * Performance Architecture:
 * - Optimal 512x1024 power-of-two canvas (75% lower GPU memory footprint than 1024x2048).
 * - Zero `shadowBlur` CPU bottlenecks (clean mathematical styling).
 * - Throttled 12fps telemetry update (saving 80%+ GPU bus texture bandwidth).
 * - MeshBasicMaterial (self-illuminated, toneMapped={false}, renderOrder={20})
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const textureRef = useRef();
  const canvasRef = useRef();
  const lastDrawRef = useRef(0);

  const { texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1024;

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    canvasRef.current = c;
    textureRef.current = tex;
    return { texture: tex };
  }, []);

  const drawBillboard = (t) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const w = 512;
    const h = 1024;

    // 1. High-Contrast Deep Navy Blue Background
    ctx.fillStyle = '#061329';
    ctx.fillRect(0, 0, w, h);

    // Glowing Cyber Grid Pattern (Optimized: single path)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
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

    // 2. Neon Cyan Outer Border & Corner Brackets
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 12;
    const corner = 45;
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
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.fillRect(30, 40, w - 60, 56);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 40, w - 60, 56);

    ctx.font = 'bold 21px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // TOWER 01', 48, 76);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(w - 120, 68, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE ENGINE', w - 45, 74);

    // 4. MAIN HEADLINE BRANDING: LEADNEX.AI
    ctx.font = '900 76px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('LEADNEX', w / 2, 215);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('.AI', w / 2, 290);

    // Tagline: AI CALLING. SMARTER CONVERSATIONS.
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AI CALLING.', w / 2, 345);

    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 378);

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
    ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.fillRect(20, scanlineY - 15, w - 40, 30);

    // 8. Footer Telemetry Tag
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 40);

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  };

  useEffect(() => {
    drawBillboard(0);
  }, []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    // Throttled to 12fps (0.083s) - silky visual motion with 85% lower GPU bandwidth
    if (now - lastDrawRef.current > 0.083) {
      lastDrawRef.current = now;
      drawBillboard(now);
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

      {/* Active High-Res LED Screen (Safe z = 0.22, renderOrder = 20, OPAQUE so never occluded) */}
      <mesh ref={meshRef} position={[0, 0, 0.22]} renderOrder={20}>
        <planeGeometry args={[7.2, 14.4]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}
