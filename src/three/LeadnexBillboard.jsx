import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexBillboard — Left Skyscraper LED Billboard
 *
 * Prominently displays:
 *   LEADNEX.AI
 *   AI CALLING. SMARTER CONVERSATIONS.
 *   Live voice engine telemetry and active audio spectrum bars.
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

    // 1. Deep Midnight Blue LED Panel Background
    ctx.fillStyle = '#061329';
    ctx.fillRect(0, 0, w, h);

    // Glowing Cyber Grid Pattern
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Neon Cyan Outer Framing & Corner Accents
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 16;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 35;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // High-tech Corner Brackets
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    const corner = 90;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(32, 32 + corner);
    ctx.lineTo(32, 32);
    ctx.lineTo(32 + corner, 32);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(w - 32 - corner, 32);
    ctx.lineTo(w - 32, 32);
    ctx.lineTo(w - 32, 32 + corner);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(32, h - 32 - corner);
    ctx.lineTo(32, h - 32);
    ctx.lineTo(32 + corner, h - 32);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(w - 32 - corner, h - 32);
    ctx.lineTo(w - 32, h - 32);
    ctx.lineTo(w - 32, h - 32 - corner);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 3. Top Status Ribbon
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.fillRect(60, 80, w - 120, 110);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 80, w - 120, 110);

    ctx.font = 'bold 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // TOWER 01', 95, 150);

    // Live Pulse Dot
    const pulseAlpha = Math.sin(t * 4) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(w - 240, 135, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE ENGINE', w - 90, 145);

    // 4. MAIN HEADLINE BRANDING: LEADNEX.AI
    const glowIntensity = Math.sin(t * 3) * 15 + 40;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = glowIntensity;

    ctx.font = '900 136px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('LEADNEX', w / 2, 450);

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('.AI', w / 2, 580);

    // Tagline: AI CALLING. SMARTER CONVERSATIONS.
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 25;
    ctx.font = 'bold 44px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e0f2fe';
    ctx.fillText('AI CALLING.', w / 2, 700);

    ctx.font = 'bold 42px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('SMARTER CONVERSATIONS.', w / 2, 765);

    // Glowing Divider Line
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(90, 840);
    ctx.lineTo(w - 90, 840);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // 5. Real-Time Telemetry Stats Box
    const boxY = 910;
    ctx.fillStyle = 'rgba(4, 16, 40, 0.85)';
    ctx.fillRect(80, boxY, w - 160, 480);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, boxY, w - 160, 480);

    const metrics = [
      { label: 'CONCURRENT LIVE CALLS', val: (12480 + Math.floor(Math.sin(t * 2) * 150)).toLocaleString(), unit: 'ACTIVE' },
      { label: 'VOICE SYNTHESIS LATENCY', val: '276', unit: 'MS' },
      { label: 'CONVERSATION MOS SCORE', val: '4.92', unit: '/ 5.0' },
      { label: 'ENTERPRISE SYSTEM SLA', val: '99.99', unit: '% ONLINE' },
    ];

    metrics.forEach((m, i) => {
      const my = boxY + 75 + i * 105;
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, my + 38);
        ctx.lineTo(w - 120, my + 38);
        ctx.stroke();
      }
    });

    // 6. Dynamic Audio Frequency Spectrum Analyzer
    const waveY = 1450;
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('NEURAL SPEECH STREAM · LIVE', w / 2, waveY);

    const barCount = 38;
    const barWidth = 16;
    const barSpacing = 8;
    const totalW = barCount * (barWidth + barSpacing) - barSpacing;
    const startX = (w - totalW) / 2;

    for (let i = 0; i < barCount; i++) {
      const freq = Math.sin(t * 5 + i * 0.35) * Math.cos(t * 3 - i * 0.22);
      const barH = Math.max(14, Math.abs(freq) * 180 + 20);
      const bx = startX + i * (barWidth + barSpacing);
      const by = waveY + 230 - barH;

      const grad = ctx.createLinearGradient(0, by, 0, by + barH);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#00f0ff');
      grad.addColorStop(1, '#0284c7');

      ctx.fillStyle = grad;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(bx, by, barWidth, barH);
    }

    // 7. Scanning Laser Line
    const scanlineY = ((t * 240) % (h - 100)) + 50;
    const scanGrad = ctx.createLinearGradient(0, scanlineY - 45, 0, scanlineY + 45);
    scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
    scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(40, scanlineY - 45, w - 80, 90);

    // 8. Footer Telemetry Tag
    ctx.shadowBlur = 0;
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL VOICE MESH · AUTONOMOUS AGENTS', w / 2, h - 80);

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  };

  useEffect(() => {
    drawBillboard(0);
  }, []);

  useFrame((state, delta) => {
    animTimeRef.current += delta;
    drawBillboard(animTimeRef.current);
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Housing Frame (Placed at z = -0.15) */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[7.2, 14.4, 0.3]} />
        <meshStandardMaterial color="#040b18" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Outer Neon Rim Light Frame */}
      <lineSegments position={[0, 0, 0.02]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.22, 14.42, 0.32)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.95} />
      </lineSegments>

      {/* Active High-Res LED Screen (Placed in front at z = 0.08, NO Z-FIGHTING!) */}
      <mesh ref={meshRef} position={[0, 0, 0.08]}>
        <planeGeometry args={[7.0, 14.0]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          side={THREE.DoubleSide}
          transparent
          opacity={1.0}
        />
      </mesh>

      {/* Neon Light Casting */}
      <pointLight color="#00f0ff" intensity={5.0} distance={22} position={[0, 0, 1.5]} />
      <pointLight color="#0284c7" intensity={3.5} distance={18} position={[0, -3.5, 1.2]} />
    </group>
  );
}
