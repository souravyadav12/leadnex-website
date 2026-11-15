import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 *
 * Guaranteed vibrant front-facing LED screen:
 * - Solid opaque mesh (transparent={false}, renderOrder={10}) to prevent depth-sorting occlusion.
 * - Offset in front of building facade (z = 0.2) to prevent z-fighting.
 * - Bold illuminated typography: "LEADNEX.AI" + "AI CALLING. SMARTER CONVERSATIONS."
 */
export default function LeadnexBillboard({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const textureRef = useRef();
  const canvasRef = useRef();
  const animTimeRef = useRef(0);

  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 2048;

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;

    canvasRef.current = c;
    textureRef.current = tex;
    return { canvas: c, texture: tex };
  }, []);

  const drawBillboard = (t) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const w = 1024;
    const h = 2048;

    // 1. High-Contrast Deep Navy Blue Background (Bright enough to be clearly seen)
    ctx.fillStyle = '#071630';
    ctx.fillRect(0, 0, w, h);

    // Glowing Cyber Grid Pattern
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 3;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Thick Neon Cyan Outer Border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 20;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 40;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // White Corner Brackets
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 24;
    const corner = 100;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(30, 30 + corner);
    ctx.lineTo(30, 30);
    ctx.lineTo(30 + corner, 30);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - 30 - corner, 30);
    ctx.lineTo(w - 30, 30);
    ctx.lineTo(w - 30, 30 + corner);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(30, h - 30 - corner);
    ctx.lineTo(30, h - 30);
    ctx.lineTo(30 + corner, h - 30);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - 30 - corner, h - 30);
    ctx.lineTo(w - 30, h - 30);
    ctx.lineTo(w - 30, h - 30 - corner);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 3. Top Status Header Ribbon
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.fillRect(60, 80, w - 120, 120);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 5;
    ctx.strokeRect(60, 80, w - 120, 120);

    ctx.font = 'bold 42px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // TOWER 01', 95, 155);

    // Green Active Beacon
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(w - 240, 140, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE ENGINE', w - 90, 150);

    // 4. MAIN HEADLINE BRANDING: LEADNEX.AI
    const glow = Math.sin(t * 3.5) * 15 + 45;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = glow;

    ctx.font = '900 148px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('LEADNEX', w / 2, 440);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('.AI', w / 2, 580);

    // Tagline: AI CALLING. SMARTER CONVERSATIONS.
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 30;
    ctx.font = 'bold 48px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('AI CALLING.', w / 2, 690);

    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 755);

    // Glowing Divider
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(80, 830);
    ctx.lineTo(w - 80, 830);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 5. Telemetry Stats Panel
    const boxY = 890;
    ctx.fillStyle = 'rgba(2, 10, 28, 0.9)';
    ctx.fillRect(80, boxY, w - 160, 500);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, boxY, w - 160, 500);

    const metrics = [
      { label: 'CONCURRENT LIVE CALLS', val: (12480 + Math.floor(Math.sin(t * 2) * 150)).toLocaleString(), unit: 'ACTIVE' },
      { label: 'VOICE SYNTHESIS LATENCY', val: '276', unit: 'MS' },
      { label: 'SPEECH MOS QUALITY', val: '4.92', unit: '/ 5.0' },
      { label: 'ENTERPRISE SYSTEM SLA', val: '99.99', unit: '% ONLINE' },
    ];

    metrics.forEach((m, i) => {
      const my = boxY + 80 + i * 110;
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(m.label, 120, my);

      ctx.font = 'bold 48px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'right';
      ctx.fillText(m.val, w - 210, my + 8);

      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(m.unit, w - 120, my + 8);

      if (i < 3) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, my + 42);
        ctx.lineTo(w - 120, my + 42);
        ctx.stroke();
      }
    });

    // 6. Dynamic Audio Spectrum Analyzer
    const waveY = 1450;
    ctx.font = 'bold 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('LIVE NEURAL VOICE SPECTRUM', w / 2, waveY);

    const barCount = 38;
    const barWidth = 16;
    const barSpacing = 8;
    const totalW = barCount * (barWidth + barSpacing) - barSpacing;
    const startX = (w - totalW) / 2;

    for (let i = 0; i < barCount; i++) {
      const freq = Math.sin(t * 5 + i * 0.35) * Math.cos(t * 3 - i * 0.22);
      const barH = Math.max(16, Math.abs(freq) * 190 + 25);
      const bx = startX + i * (barWidth + barSpacing);
      const by = waveY + 240 - barH;

      const grad = ctx.createLinearGradient(0, by, 0, by + barH);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#00f0ff');
      grad.addColorStop(1, '#0284c7');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.fillRect(bx, by, barWidth, barH);
    }

    // 7. Scanning Laser Line
    const scanlineY = ((t * 260) % (h - 100)) + 50;
    const scanGrad = ctx.createLinearGradient(0, scanlineY - 50, 0, scanlineY + 50);
    scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
    scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(40, scanlineY - 50, w - 80, 100);

    // 8. Footer Telemetry Tag
    ctx.shadowBlur = 0;
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 80);

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  };

  const lastDrawRef = useRef(0);

  useEffect(() => {
    drawBillboard(0);
  }, []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (now - lastDrawRef.current > 0.04) {
      lastDrawRef.current = now;
      drawBillboard(now);
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Housing Frame Backing (z = 0.0) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7.4, 14.6, 0.2]} />
        <meshStandardMaterial color="#020814" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Outer Neon Rim Light Frame */}
      <lineSegments position={[0, 0, 0.12]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.42, 14.62, 0.22)]} />
        <lineBasicMaterial color="#00f0ff" linewidth={3} transparent opacity={1.0} />
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

      {/* Direct Ambient Face Illumination */}
      <pointLight color="#00f0ff" intensity={6.0} distance={25} position={[0, 0, 2.0]} />
      <pointLight color="#0284c7" intensity={4.5} distance={20} position={[0, -3.5, 1.8]} />
    </group>
  );
}
