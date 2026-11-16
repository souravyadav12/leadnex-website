import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { renderTower01Billboard, renderTower02Billboard } from './MobileBillboardCanvas';

/**
 * MobileTower01Screen
 * Dynamic aspect ratio billboard screen for Tower 01.
 * Freezes texture uploads during DIVE, EXIT, and ENTER.
 * During HOLD: numbers at 1 Hz, spectrum at 10 FPS.
 */
export function MobileTower01Screen({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  aspectRatio = 0.55,
  telemetry,
  isHold = false,
  isVisible = true,
  reduced = false,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const lastDrawRef = useRef(0);

  const { canvasW, canvasH, planeW, planeH } = useMemo(() => {
    const cw = 512;
    let ch = Math.round(512 / aspectRatio);
    if (ch % 2 !== 0) ch += 1;
    const pw = 7.2;
    const ph = pw / aspectRatio;
    return { canvasW: cw, canvasH: ch, planeW: pw, planeH: ph };
  }, [aspectRatio]);

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = canvasW;
    c.height = canvasH;
    renderTower01Billboard(c, telemetry, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    return { texture: tex, canvas: c };
  }, [canvasW, canvasH]);

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        renderTower01Billboard(canvas, telemetry, 0);
        texture.needsUpdate = true;
      });
    }
  }, [canvas, texture]);

  useFrame((state) => {
    // Only update canvas/texture when in HOLD window and visible
    if (reduced || !isVisible || !isHold) return;

    // 10 FPS draw loop
    const t = state.clock.elapsedTime;
    if (t - lastDrawRef.current >= 0.10) {
      lastDrawRef.current = t;
      renderTower01Billboard(canvas, telemetry, t);
      texture.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[planeW + 0.2, planeH + 0.2, 0.2]} />
        <meshStandardMaterial color="#020814" roughness={0.3} metalness={0.9} />
      </mesh>
      <lineSegments position={[0, 0, 0.12]}>
        <edgesGeometry args={[new THREE.BoxGeometry(planeW + 0.22, planeH + 0.22, 0.22)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.9} />
      </lineSegments>
      <mesh ref={meshRef} position={[0, 0, 0.25]} renderOrder={30}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * MobileTower02Screen
 * Dynamic aspect ratio billboard screen for Tower 02.
 * Freezes texture uploads during DIVE, EXIT, and ENTER.
 * During HOLD: numbers at 1 Hz, radar at 10 FPS.
 */
export function MobileTower02Screen({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  aspectRatio = 0.55,
  telemetry,
  isHold = false,
  isVisible = true,
  reduced = false,
}) {
  const meshRef = useRef();
  const materialRef = useRef();
  const lastDrawRef = useRef(0);

  const { canvasW, canvasH, planeW, planeH } = useMemo(() => {
    const cw = 512;
    let ch = Math.round(512 / aspectRatio);
    if (ch % 2 !== 0) ch += 1;
    const pw = 7.2;
    const ph = pw / aspectRatio;
    return { canvasW: cw, canvasH: ch, planeW: pw, planeH: ph };
  }, [aspectRatio]);

  const { texture, canvas } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = canvasW;
    c.height = canvasH;
    renderTower02Billboard(c, telemetry, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;

    return { texture: tex, canvas: c };
  }, [canvasW, canvasH]);

  useEffect(() => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        renderTower02Billboard(canvas, telemetry, 0);
        texture.needsUpdate = true;
      });
    }
  }, [canvas, texture]);

  useFrame((state) => {
    // Only update canvas/texture when in HOLD window and visible
    if (reduced || !isVisible || !isHold) return;

    // 10 FPS draw loop
    const t = state.clock.elapsedTime;
    if (t - lastDrawRef.current >= 0.10) {
      lastDrawRef.current = t;
      renderTower02Billboard(canvas, telemetry, t);
      texture.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[planeW + 0.2, planeH + 0.2, 0.2]} />
        <meshStandardMaterial color="#020814" roughness={0.3} metalness={0.9} />
      </mesh>
      <lineSegments position={[0, 0, 0.12]}>
        <edgesGeometry args={[new THREE.BoxGeometry(planeW + 0.22, planeH + 0.22, 0.22)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.9} />
      </lineSegments>
      <mesh ref={meshRef} position={[0, 0, 0.25]} renderOrder={30}>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
