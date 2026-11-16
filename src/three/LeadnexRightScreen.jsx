import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * renderRightScreenCanvas — High-Definition Fully Animated Canvas Renderer for Right Skyscraper Matrix
 * Features 360-degree rotating radar with pinging blips, live network latency jitter,
 * pulsing heartbeat health dots, and scanning cyber laser beam.
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
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
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

  // 2. Thick Outer Border & High-Tech Corner Brackets
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 20;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.strokeStyle = '#38bdf8';
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

  // 3. Status Header with Pulsing Beacon
  ctx.fillStyle = 'rgba(2, 132, 199, 0.28)';
  ctx.fillRect(56, 65, w - 112, 115);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4.5;
  ctx.strokeRect(56, 65, w - 112, 115);

  ctx.font = '900 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 02', 90, 122);

  // Animated Edge Mesh Pulse Dot
  const pulse = 0.5 + 0.5 * Math.sin(t * 5.8);
  ctx.fillStyle = pulse > 0.3 ? '#00f0ff' : '#0284c7';
  ctx.beginPath();
  ctx.arc(w - 250, 122, 14 + pulse * 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 34px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('EDGE MESH', w - 85, 122);

  // 4. Section Title: GLOBAL TELEPHONY RADAR
  ctx.font = '900 58px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE GRID', w / 2, 235);

  // 5. High-Tech Rotating Radar Display with Sweeping Sector
  const radarCX = w / 2;
  const radarCY = 415;
  const radarR = 145;

  // Concentric Rings
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
  ctx.lineWidth = 3;
  for (let r = 50; r <= radarR; r += 48) {
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
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.lineTo(radarCX + Math.cos(angle) * radarR, radarCY + Math.sin(angle) * radarR);
  ctx.stroke();
  ctx.restore();

  // Active Edge Nodes that ping & flash when radar passes over them
  const nodes = [
    { x: radarCX - 75, y: radarCY - 55 },
    { x: radarCX + 70, y: radarCY - 40 },
    { x: radarCX + 42, y: radarCY + 78 },
    { x: radarCX - 62, y: radarCY + 65 },
  ];

  nodes.forEach((n) => {
    const nodeAngle = Math.atan2(n.y - radarCY, n.x - radarCX);
    const diff = ((angle - nodeAngle + Math.PI * 4) % (Math.PI * 2));
    const ping = Math.max(0, 1 - diff / 1.5);

    ctx.fillStyle = ping > 0.15 ? '#ffffff' : '#00f0ff';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8 + ping * 6, 0, Math.PI * 2);
    ctx.fill();

    if (ping > 0.25) {
      ctx.strokeStyle = `rgba(0, 255, 136, ${ping * 0.9})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 14 + (1 - ping) * 18, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  // 6. Global Edge Clusters List (With Live-Jittering Pings & Heartbeat Dots!)
  const listY = 620;
  ctx.font = '900 40px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('MULTI-REGION EDGE ROUTING', 70, listY);

  const baseRegions = [
    { name: 'US-EAST (VIRGINIA)', basePing: 12, status: 'HEALTHY' },
    { name: 'US-WEST (OREGON)', basePing: 18, status: 'HEALTHY' },
    { name: 'EU-CENTRAL (FRANKFURT)', basePing: 24, status: 'HEALTHY' },
    { name: 'AP-NORTHEAST (TOKYO)', basePing: 38, status: 'HEALTHY' },
  ];

  const cardH = 92;
  const gap = 16;
  const regStartY = 660;

  baseRegions.forEach((reg, i) => {
    const ry = regStartY + i * (cardH + gap);

    // Live organic ping jitter
    const jitter = Math.floor(Math.sin(t * 3.2 + i * 1.5) * 2);
    const livePing = `${reg.basePing + jitter}ms`;

    ctx.fillStyle = 'rgba(2, 12, 34, 0.96)';
    ctx.fillRect(70, ry, w - 140, cardH);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, ry, w - 140, cardH);

    ctx.font = '900 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(reg.name, 105, ry + cardH / 2);

    ctx.font = '900 34px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(livePing, w - 270, ry + cardH / 2);

    // Heartbeat pulse dot
    const hb = 0.5 + 0.5 * Math.sin(t * 6 + i * 1.3);
    ctx.fillStyle = hb > 0.3 ? '#00ff88' : '#059669';
    ctx.font = '900 28px "JetBrains Mono", monospace';
    ctx.fillText(`● ${reg.status}`, w - 105, ry + cardH / 2);
  });

  // 7. Security & Compliance Badges with Active Highlighting Shimmer
  const secY = 1170;
  const secBoxH = 500;
  ctx.fillStyle = 'rgba(2, 12, 34, 0.97)';
  ctx.fillRect(70, secY, w - 140, secBoxH);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.strokeRect(70, secY, w - 140, secBoxH);

  ctx.font = '900 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ENTERPRISE SECURITY SUITE', w / 2, secY + 65);

  const badges = [
    'SOC 2 TYPE II CERTIFIED',
    'HIPAA & GDPR COMPLIANT',
    '256-BIT SRTP ENCRYPTION',
    'ZERO DATA RETENTION POLICY',
  ];

  const activeBadgeIndex = Math.floor((t * 1.5) % badges.length);

  badges.forEach((b, i) => {
    const by = secY + 145 + i * 85;
    const isLit = i === activeBadgeIndex;

    ctx.font = '900 34px "JetBrains Mono", monospace';
    ctx.fillStyle = isLit ? '#ffffff' : '#00ff88';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`✓  ${b}`, w / 2, by);
  });

  // 8. Scanning Laser Line on Right Screen
  const scanlineY = ((t * 240) % (h - 140)) + 70;
  const scanGrad = ctx.createLinearGradient(0, scanlineY - 35, 0, scanlineY + 35);
  scanGrad.addColorStop(0, 'rgba(2, 132, 199, 0)');
  scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
  scanGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(35, scanlineY - 35, w - 70, 70);

  // 9. Bottom Ticker
  ctx.font = '900 34px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX TELEPHONY CLOUD · 99.99% SLA', w / 2, h - 75);
}

/**
 * LeadnexRightScreen — Right Skyscraper LED Telemetry Matrix
 * Fully animated at smooth 30 FPS with rotating radar, live latency jitter and pulsing nodes.
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const lastUpdateRef = useRef(0);

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 2048;

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

  // Silky 30fps animation loop (zero frame drops, 100% fluid motion!)
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t - lastUpdateRef.current >= 0.033) {
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
