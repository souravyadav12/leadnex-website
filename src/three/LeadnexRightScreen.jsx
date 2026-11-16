import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * renderRightScreenCanvas — Synchronous Pure Canvas Renderer for Right Skyscraper Matrix
 */
function renderRightScreenCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background
  ctx.fillStyle = '#081a3a';
  ctx.fillRect(0, 0, w, h);

  // Glowing Circuit Grid Lines
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.18)';
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

  // 2. Thick Outer Border & High-Tech Corner Brackets
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 12;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#38bdf8';
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

  // 3. Status Header
  ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
  ctx.fillRect(30, 40, w - 60, 58);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(30, 40, w - 60, 58);

  ctx.font = 'bold 21px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('LEADNEX // TOWER 02', 48, 77);

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(w - 120, 69, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 16px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('EDGE MESH', w - 45, 75);

  // 4. Section Title: GLOBAL TELEPHONY RADAR
  ctx.font = 'bold 25px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('GLOBAL VOICE GRID', w / 2, 135);

  // 5. High-Tech Rotating Radar Display
  const radarCX = w / 2;
  const radarCY = 230;
  const radarR = 75;

  // Concentric Rings
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.38)';
  ctx.lineWidth = 1.5;
  for (let r = 25; r <= radarR; r += 25) {
    ctx.beginPath();
    ctx.arc(radarCX, radarCY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Crosshairs
  ctx.beginPath();
  ctx.moveTo(radarCX - radarR, radarCY); ctx.lineTo(radarCX + radarR, radarCY);
  ctx.moveTo(radarCX, radarCY - radarR); ctx.lineTo(radarCX, radarCY + radarR);
  ctx.stroke();

  // Radar Sweep Arm
  const angle = t * 2.8;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.lineTo(radarCX + Math.cos(angle) * radarR, radarCY + Math.sin(angle) * radarR);
  ctx.stroke();

  // Active Edge Nodes
  const nodes = [
    { x: radarCX - 40, y: radarCY - 30 },
    { x: radarCX + 35, y: radarCY - 20 },
    { x: radarCX + 20, y: radarCY + 40 },
    { x: radarCX - 30, y: radarCY + 35 },
  ];
  ctx.fillStyle = '#00f0ff';
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 6. Global Edge Clusters List
  const listY = 340;
  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.fillText('MULTI-REGION EDGE ROUTING', 40, listY);

  const regions = [
    { name: 'US-EAST (VIRGINIA)', ping: '12ms', status: 'HEALTHY' },
    { name: 'US-WEST (OREGON)', ping: '18ms', status: 'HEALTHY' },
    { name: 'EU-CENTRAL (FRANKFURT)', ping: '24ms', status: 'HEALTHY' },
    { name: 'AP-NORTHEAST (TOKYO)', ping: '38ms', status: 'HEALTHY' },
    { name: 'SA-EAST (SAO PAULO)', ping: '42ms', status: 'HEALTHY' },
  ];

  regions.forEach((reg, i) => {
    const ry = listY + 36 + i * 44;
    ctx.fillStyle = 'rgba(2, 10, 28, 0.88)';
    ctx.fillRect(40, ry - 22, w - 80, 36);
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, ry - 22, w - 80, 36);

    ctx.font = 'bold 12.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(reg.name, 52, ry);

    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(reg.ping, w - 120, ry);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(reg.status, w - 52, ry);
  });

  // 7. Security & Compliance Badges
  const secY = 620;
  ctx.fillStyle = 'rgba(2, 10, 28, 0.92)';
  ctx.fillRect(40, secY, w - 80, 270);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, secY, w - 80, 270);

  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.fillText('ENTERPRISE SECURITY SUITE', w / 2, secY + 40);

  const badges = [
    'SOC 2 TYPE II CERTIFIED',
    'HIPAA & GDPR COMPLIANT',
    'TLS 1.3 / SRTP ENCRYPTED',
    'ZERO DATA RETENTION RETRAINING',
    'BI-DIRECTIONAL CRM WEBHOOKS',
  ];

  badges.forEach((b, i) => {
    const by = secY + 80 + i * 36;
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText(`✓  ${b}`, w / 2, by);
  });

  // 8. Bottom Ticker
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('LEADNEX CORE TELEPHONY · 99.99% SLA', w / 2, h - 40);
}

/**
 * LeadnexRightScreen — Right Skyscraper LED Telemetry Matrix
 * Bulletproof synchronous initialization: renders canvas BEFORE creating CanvasTexture.
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();

  const { texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 1024;

    // Render IMMEDIATELY and synchronously so texture is never blank
    renderRightScreenCanvas(c, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;

    return { texture: tex };
  }, []);

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
