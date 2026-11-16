import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * renderRightScreenCanvas — High-Definition Synchronous Canvas Renderer for Right Skyscraper Matrix
 * Features rotating radar, live latency jitter, pulsing heartbeat dots, and scanning beam.
 */
function renderRightScreenCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background
  ctx.fillStyle = '#040d24';
  ctx.fillRect(0, 0, w, h);

  // Glowing Circuit Grid Lines
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.20)';
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

  // 2. Thick Outer Border & High-Tech Corner Brackets
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 16;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.strokeStyle = '#38bdf8';
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

  // 3. Status Header with Pulsing Beacon
  ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
  ctx.fillRect(40, 48, w - 80, 85);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(40, 48, w - 80, 85);

  ctx.font = '900 32px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 02', 65, 90);

  // Animated Edge Mesh Pulse Dot
  const pulse = 0.5 + 0.5 * Math.sin(t * 5.8);
  ctx.fillStyle = pulse > 0.3 ? '#00f0ff' : '#0284c7';
  ctx.beginPath();
  ctx.arc(w - 205, 90, 11 + pulse * 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('EDGE MESH', w - 65, 90);

  // 4. Section Title: GLOBAL TELEPHONY RADAR
  ctx.font = '900 44px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE GRID', w / 2, 185);

  // 5. High-Tech Rotating Radar Display
  const radarCX = w / 2;
  const radarCY = 330;
  const radarR = 115;

  // Concentric Rings
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
  ctx.lineWidth = 2.5;
  for (let r = 38; r <= radarR; r += 38) {
    ctx.beginPath();
    ctx.arc(radarCX, radarCY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(radarCX - radarR, radarCY); ctx.lineTo(radarCX + radarR, radarCY);
  ctx.moveTo(radarCX, radarCY - radarR); ctx.lineTo(radarCX, radarCY + radarR);
  ctx.stroke();

  // Rotating Radar Sweep Arm & Sweeping Sector Trail
  const angle = t * 2.8;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.arc(radarCX, radarCY, radarR, angle - 0.45, angle);
  ctx.closePath();
  const radarGrad = ctx.createRadialGradient(radarCX, radarCY, 0, radarCX, radarCY, radarR);
  radarGrad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
  radarGrad.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
  ctx.fillStyle = radarGrad;
  ctx.fill();

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.lineTo(radarCX + Math.cos(angle) * radarR, radarCY + Math.sin(angle) * radarR);
  ctx.stroke();
  ctx.restore();

  // Active Edge Nodes that ping & flash
  const nodes = [
    { x: radarCX - 60, y: radarCY - 44 },
    { x: radarCX + 55, y: radarCY - 32 },
    { x: radarCX + 34, y: radarCY + 62 },
    { x: radarCX - 50, y: radarCY + 52 },
  ];

  nodes.forEach((n) => {
    const nodeAngle = Math.atan2(n.y - radarCY, n.x - radarCX);
    const diff = ((angle - nodeAngle + Math.PI * 4) % (Math.PI * 2));
    const ping = Math.max(0, 1 - diff / 1.5);

    ctx.fillStyle = ping > 0.15 ? '#ffffff' : '#00f0ff';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 6 + ping * 5, 0, Math.PI * 2);
    ctx.fill();

    if (ping > 0.25) {
      ctx.strokeStyle = `rgba(0, 255, 136, ${ping * 0.9})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 11 + (1 - ping) * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 6. Global Edge Clusters List
  const listY = 495;
  ctx.font = '900 30px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('MULTI-REGION EDGE ROUTING', 50, listY);

  const baseRegions = [
    { name: 'US-EAST (VIRGINIA)', basePing: 12, status: 'HEALTHY' },
    { name: 'US-WEST (OREGON)', basePing: 18, status: 'HEALTHY' },
    { name: 'EU-CENTRAL (FRANKFURT)', basePing: 24, status: 'HEALTHY' },
    { name: 'AP-NORTHEAST (TOKYO)', basePing: 38, status: 'HEALTHY' },
  ];

  const cardH = 75;
  const gap = 12;
  const regStartY = 530;

  baseRegions.forEach((reg, i) => {
    const ry = regStartY + i * (cardH + gap);

    const jitter = Math.floor(Math.sin(t * 3.2 + i * 1.5) * 2);
    const livePing = `${reg.basePing + jitter}ms`;

    ctx.fillStyle = 'rgba(2, 12, 34, 0.96)';
    ctx.fillRect(50, ry, w - 100, cardH);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(50, ry, w - 100, cardH);

    ctx.font = '900 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(reg.name, 75, ry + cardH / 2);

    ctx.font = '900 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(livePing, w - 215, ry + cardH / 2);

    const hb = 0.5 + 0.5 * Math.sin(t * 6 + i * 1.3);
    ctx.fillStyle = hb > 0.3 ? '#00ff88' : '#059669';
    ctx.font = '900 22px "JetBrains Mono", monospace';
    ctx.fillText(`● ${reg.status}`, w - 75, ry + cardH / 2);
  });

  // 7. Security & Compliance Badges
  const secY = 910;
  const secBoxH = 410;
  ctx.fillStyle = 'rgba(2, 12, 34, 0.97)';
  ctx.fillRect(50, secY, w - 100, secBoxH);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(50, secY, w - 100, secBoxH);

  ctx.font = '900 32px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ENTERPRISE SECURITY SUITE', w / 2, secY + 55);

  const badges = [
    'SOC 2 TYPE II CERTIFIED',
    'HIPAA & GDPR COMPLIANT',
    '256-BIT SRTP ENCRYPTION',
    'ZERO DATA RETENTION POLICY',
  ];

  const activeBadgeIndex = Math.floor((t * 1.5) % badges.length);

  badges.forEach((b, i) => {
    const by = secY + 120 + i * 70;
    const isLit = i === activeBadgeIndex;

    ctx.font = '900 26px "JetBrains Mono", monospace';
    ctx.fillStyle = isLit ? '#ffffff' : '#00ff88';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`✓  ${b}`, w / 2, by);
  });

  // 8. Scanning Laser Line on Right Screen
  const scanlineY = ((t * 200) % (h - 120)) + 60;
  const scanGrad = ctx.createLinearGradient(0, scanlineY - 28, 0, scanlineY + 28);
  scanGrad.addColorStop(0, 'rgba(2, 132, 199, 0)');
  scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
  scanGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(25, scanlineY - 28, w - 50, 56);

  // 9. Bottom Ticker
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX TELEPHONY CLOUD · 99.99% SLA', w / 2, h - 55);
}

/**
 * LeadnexRightScreen — Right Skyscraper LED Telemetry Matrix
 * Fully animated with rotating radar and lag-free scroll-aware updates.
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const lastUpdateRef = useRef(0);

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 1536;

    // Render IMMEDIATELY and synchronously so texture is never blank
    renderRightScreenCanvas(c, 0);

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
        renderRightScreenCanvas(canvas, 0);
        texture.needsUpdate = true;
      });
    }
  }, [canvas, texture]);

  // Lag-free scroll-aware animation loop
  useFrame((state) => {
    const scrollY = window.__lenis?.scroll ?? window.scrollY ?? 0;
    if (scrollY > window.innerHeight * 0.85) return;

    const isFastScroll = Math.abs(window.__lenis?.velocity || 0) > 0.5;
    const interval = isFastScroll ? 0.12 : 0.04; // 25 FPS at rest, lightweight 8 FPS during fast fling

    const t = state.clock.elapsedTime;
    if (t - lastUpdateRef.current >= interval) {
      lastUpdateRef.current = t;
      renderRightScreenCanvas(canvas, t);
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
        <lineBasicMaterial color="#0284c7" transparent opacity={0.95} />
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
