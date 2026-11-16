import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * renderRightScreenCanvas — High-Definition Synchronous Canvas Renderer for Right Skyscraper Matrix
 * Rendered at 1024x2048 with large, crisp typography and high contrast.
 */
function renderRightScreenCanvas(canvas, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. High-Contrast Deep Navy Blue Background
  ctx.fillStyle = '#06122c';
  ctx.fillRect(0, 0, w, h);

  // Glowing Circuit Grid Lines
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.22)';
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

  // 2. Thick Outer Border & High-Tech Corner Brackets
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 18;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.strokeStyle = '#38bdf8';
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

  // 3. Status Header
  ctx.fillStyle = 'rgba(2, 132, 199, 0.25)';
  ctx.fillRect(56, 70, w - 112, 100);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 70, w - 112, 100);

  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX // TOWER 02', 88, 120);

  ctx.fillStyle = '#00f0ff';
  ctx.beginPath();
  ctx.arc(w - 240, 120, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText('EDGE MESH', w - 85, 120);

  // 4. Section Title: GLOBAL TELEPHONY RADAR
  ctx.font = 'bold 44px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GLOBAL VOICE GRID', w / 2, 230);

  // 5. High-Tech Rotating Radar Display
  const radarCX = w / 2;
  const radarCY = 410;
  const radarR = 140;

  // Concentric Rings
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
  ctx.lineWidth = 2.5;
  for (let r = 45; r <= radarR; r += 45) {
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
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(radarCX, radarCY);
  ctx.lineTo(radarCX + Math.cos(angle) * radarR, radarCY + Math.sin(angle) * radarR);
  ctx.stroke();

  // Active Edge Nodes
  const nodes = [
    { x: radarCX - 75, y: radarCY - 55 },
    { x: radarCX + 68, y: radarCY - 40 },
    { x: radarCX + 40, y: radarCY + 75 },
    { x: radarCX - 58, y: radarCY + 65 },
  ];
  ctx.fillStyle = '#00f0ff';
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // 6. Global Edge Clusters List (High-Contrast & Large Fonts)
  const listY = 615;
  ctx.font = 'bold 32px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('MULTI-REGION EDGE ROUTING', 70, listY);

  const regions = [
    { name: 'US-EAST (VIRGINIA)', ping: '12ms', status: 'HEALTHY' },
    { name: 'US-WEST (OREGON)', ping: '18ms', status: 'HEALTHY' },
    { name: 'EU-CENTRAL (FRANKFURT)', ping: '24ms', status: 'HEALTHY' },
    { name: 'AP-NORTHEAST (TOKYO)', ping: '38ms', status: 'HEALTHY' },
    { name: 'SA-EAST (SAO PAULO)', ping: '42ms', status: 'HEALTHY' },
  ];

  regions.forEach((reg, i) => {
    const ry = listY + 65 + i * 82;
    ctx.fillStyle = 'rgba(2, 10, 28, 0.94)';
    ctx.fillRect(70, ry - 35, w - 140, 70);
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, ry - 35, w - 140, 70);

    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(reg.name, 95, ry);

    ctx.font = 'bold 26px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    ctx.fillText(reg.ping, w - 240, ry);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 23px "JetBrains Mono", monospace';
    ctx.fillText(`● ${reg.status}`, w - 95, ry);
  });

  // 7. Security & Compliance Badges (Crystal Clear & Readable)
  const secY = 1170;
  ctx.fillStyle = 'rgba(2, 10, 28, 0.95)';
  ctx.fillRect(70, secY, w - 140, 520);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.strokeRect(70, secY, w - 140, 520);

  ctx.font = 'bold 34px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ENTERPRISE SECURITY SUITE', w / 2, secY + 65);

  const badges = [
    'SOC 2 TYPE II CERTIFIED',
    'HIPAA & GDPR COMPLIANT',
    'TLS 1.3 / SRTP ENCRYPTED',
    'ZERO DATA RETENTION RETRAINING',
    'BI-DIRECTIONAL CRM WEBHOOKS',
  ];

  badges.forEach((b, i) => {
    const by = secY + 140 + i * 72;
    ctx.font = 'bold 27px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`✓  ${b}`, w / 2, by);
  });

  // 8. Bottom Ticker
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('LEADNEX CORE TELEPHONY · 99.99% SLA', w / 2, h - 75);
}

/**
 * LeadnexRightScreen — Right Skyscraper LED Telemetry Matrix
 * Rendered at 1024x2048 with anisotropic filtering and mipmapping for crystal clear readability.
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();

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
