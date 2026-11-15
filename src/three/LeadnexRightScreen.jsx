import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * LeadnexRightScreen — Right Skyscraper LED Telemetry Matrix
 *
 * Guaranteed vibrant front-facing LED screen:
 * - Solid opaque mesh (transparent={false}, renderOrder={10}) to prevent depth-sorting occlusion.
 * - Offset in front of building facade (z = 0.18) to prevent z-fighting.
 * - High-tech Global Telephony Grid, live radar sweep, and active cluster status.
 */
export default function LeadnexRightScreen({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
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

  const drawScreen = (t) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const w = 1024;
    const h = 2048;

    // 1. High-Contrast Deep Navy Blue Background
    ctx.fillStyle = '#071630';
    ctx.fillRect(0, 0, w, h);

    // Glowing Circuit Grid Lines
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.2)';
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

    // 2. Thick Outer Frame
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 20;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 35;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.shadowBlur = 0;

    // 3. Header Status Ribbon
    ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
    ctx.fillRect(60, 80, w - 120, 120);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 5;
    ctx.strokeRect(60, 80, w - 120, 120);

    ctx.font = 'bold 40px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText('LEADNEX // TOWER 02', 95, 155);

    ctx.font = 'bold 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'right';
    ctx.fillText('● GLOBAL GRID LIVE', w - 90, 150);

    // 4. Main Section: Global Telephony Cluster
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 35;
    ctx.font = '900 84px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('TELEPHONY GRID', w / 2, 330);

    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('HIGH-CONCURRENCY AUDIO ROUTE', w / 2, 400);

    // 5. Radar Scan Circle
    ctx.shadowBlur = 0;
    const radarCenterX = w / 2;
    const radarCenterY = 620;
    const radarRadius = 160;

    // Concentric Radar Rings
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 4;
    [55, 110, 160].forEach((r) => {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(radarCenterX - 170, radarCenterY);
    ctx.lineTo(radarCenterX + 170, radarCenterY);
    ctx.moveTo(radarCenterX, radarCenterY - 170);
    ctx.lineTo(radarCenterX, radarCenterY + 170);
    ctx.stroke();

    // Rotating Radar Sweep
    const angle = t * 2.8;
    const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 0, radarCenterX, radarCenterY, radarRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
    sweepGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.arc(radarCenterX, radarCenterY, radarRadius, angle, angle + 0.65);
    ctx.closePath();
    ctx.fill();

    // 6. Global Edge Nodes Status Card
    const cardY = 850;
    ctx.fillStyle = 'rgba(2, 10, 28, 0.9)';
    ctx.fillRect(80, cardY, w - 160, 680);
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.6)';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, cardY, w - 160, 680);

    ctx.font = 'bold 34px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('EDGE CLUSTER STATUS', 120, cardY + 70);

    const nodes = [
      { city: 'US-EAST (VIRGINIA)', status: 'ONLINE', ping: '12ms', calls: '5,240 calls' },
      { city: 'US-WEST (OREGON)', status: 'ONLINE', ping: '16ms', calls: '3,890 calls' },
      { city: 'EU-CENTRAL (FRANKFURT)', status: 'ONLINE', ping: '24ms', calls: '2,650 calls' },
      { city: 'AP-NORTHEAST (TOKYO)', status: 'ONLINE', ping: '38ms', calls: '1,780 calls' },
    ];

    nodes.forEach((n, i) => {
      const ny = cardY + 160 + i * 125;
      ctx.font = 'bold 28px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(n.city, 120, ny);

      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`● ${n.status}`, 120, ny + 42);

      ctx.fillStyle = '#00f0ff';
      ctx.textAlign = 'right';
      ctx.fillText(n.calls, w - 120, ny);

      ctx.font = '24px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Ping: ${n.ping}`, w - 120, ny + 42);

      ctx.textAlign = 'left';

      if (i < 3) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, ny + 70);
        ctx.lineTo(w - 120, ny + 70);
        ctx.stroke();
      }
    });

    // 7. Security Certification Banner at Bottom
    const secY = 1600;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fillRect(80, secY, w - 160, 240);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(80, secY, w - 160, 240);

    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('ENTERPRISE SECURITY & COMPLIANCE', w / 2, secY + 75);

    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.fillText('SOC 2 TYPE II · HIPAA READY · TLS 1.3', w / 2, secY + 140);
    ctx.fillText('ZERO PUBLIC TRAINING · AES-256 VAULT', w / 2, secY + 195);

    // 8. Bottom Ticker
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('LEADNEX CORE TELEPHONY · 99.99% SLA', w / 2, h - 80);

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  };

  const lastDrawRef = useRef(0);

  useEffect(() => {
    drawScreen(0);
  }, []);

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    if (now - lastDrawRef.current > 0.04) {
      lastDrawRef.current = now;
      drawScreen(now);
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
        <lineBasicMaterial color="#0284c7" linewidth={3} transparent opacity={1.0} />
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
      <pointLight color="#0284c7" intensity={6.0} distance={25} position={[0, 0, 2.0]} />
      <pointLight color="#00f0ff" intensity={4.5} distance={20} position={[0, -3.5, 1.8]} />
    </group>
  );
}
