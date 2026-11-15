import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexRightScreen — Ultra-Optimized Right Skyscraper LED Telemetry Matrix
 *
 * Performance Architecture:
 * - Optimal 512x1024 power-of-two canvas.
 * - Zero `shadowBlur` CPU bottlenecks (clean mathematical styling).
 * - Throttled 12fps radar/telemetry update (saving 80%+ GPU bus texture bandwidth).
 * - MeshBasicMaterial (self-illuminated, toneMapped={false}, renderOrder={20})
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
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

  const drawScreen = (t) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const w = 512;
    const h = 1024;

    // 1. High-Contrast Deep Navy Blue Background
    ctx.fillStyle = '#061329';
    ctx.fillRect(0, 0, w, h);

    // Glowing Circuit Grid Lines (Optimized: single path)
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.15)';
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
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.strokeStyle = '#38bdf8';
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

    // 3. Status Header
    ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
    ctx.fillRect(30, 40, w - 60, 56);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 40, w - 60, 56);

    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // TOWER 02', 48, 76);

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(w - 120, 68, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('EDGE MESH', w - 45, 74);

    // 4. Section Title: GLOBAL TELEPHONY RADAR
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL VOICE GRID', w / 2, 135);

    // 5. High-Tech Rotating Radar Display
    const radarCX = w / 2;
    const radarCY = 230;
    const radarR = 75;

    // Concentric Rings
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
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
      ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
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
      ctx.fillStyle = 'rgba(2, 10, 28, 0.85)';
      ctx.fillRect(40, ry - 22, w - 80, 36);
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)';
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
    ctx.fillStyle = 'rgba(2, 10, 28, 0.9)';
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

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  };

  useEffect(() => {
    drawScreen(0);
  }, []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    // Throttled to 12fps (0.083s)
    if (now - lastDrawRef.current > 0.083) {
      lastDrawRef.current = now;
      drawScreen(now);
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
