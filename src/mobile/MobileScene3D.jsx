import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MobileTower01Screen, MobileTower02Screen } from './MobileTowerScreens';

const CYAN = new THREE.Color('#00f0ff');
const ELECTRIC_BLUE = new THREE.Color('#0284c7');

/* ── Tower Internal Floor Slabs (Batched Geometry) ── */
function TowerFloorSlabs({ count = 20, width = 7.6, depth = 8.6, startY = 5, stepY = 1.9, isLeft = true, opacity = 0.45 }) {
  const mergedGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const y = startY + i * stepY;
      const w = width * (1 - (i / count) * 0.12);
      const d = depth * (1 - (i / count) * 0.12);
      const hw = w / 2;
      const hd = d / 2;

      pts.push(new THREE.Vector3(-hw, y, -hd), new THREE.Vector3(hw, y, -hd));
      pts.push(new THREE.Vector3(hw, y, -hd), new THREE.Vector3(hw, y, hd));
      pts.push(new THREE.Vector3(hw, y, hd), new THREE.Vector3(-hw, y, hd));
      pts.push(new THREE.Vector3(-hw, y, hd), new THREE.Vector3(-hw, y, -hd));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [count, width, depth, startY, stepY]);

  return (
    <lineSegments geometry={mergedGeo}>
      <lineBasicMaterial
        color={isLeft ? CYAN : ELECTRIC_BLUE}
        transparent
        opacity={opacity * 0.45}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ── Clean Tower Glass Mesh (No spires, crowns, or vertical light pillars) ── */
function TowerStructure({ isLeft = true, opacity = 1.0 }) {
  return (
    <group>
      {/* 1. Base */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[9.5, 6, 10.5]} />
        <meshStandardMaterial color="#051020" roughness={0.2} metalness={0.88} transparent opacity={opacity} />
      </mesh>
      <lineSegments position={[0, 3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(9.52, 6.02, 10.52)]} />
        <lineBasicMaterial color={isLeft ? '#00f0ff' : '#0284c7'} transparent opacity={opacity * 0.65} />
      </lineSegments>

      {/* 2. Glass Tower Body */}
      <mesh position={[0, 27, 0]}>
        <boxGeometry args={[7.8, 42, 8.8]} />
        <meshStandardMaterial
          color="#06162e"
          roughness={0.12}
          metalness={0.92}
          transparent
          opacity={opacity * 0.88}
        />
      </mesh>
      <lineSegments position={[0, 27, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(7.84, 42.04, 8.84)]} />
        <lineBasicMaterial color={isLeft ? '#00f0ff' : '#0284c7'} transparent opacity={opacity * 0.85} />
      </lineSegments>

      <TowerFloorSlabs count={20} width={7.8} depth={8.8} startY={6.5} stepY={1.9} isLeft={isLeft} opacity={opacity} />
    </group>
  );
}

/**
 * fitPose
 * Computes exact camera distance and camera.y / lookAt.y shift so the billboard
 * fills safeRect exactly [0.98, 1.0] with projected error < 1px.
 */
export function fitPose(camera, planeW, planeH, planeCenter, safeRect, vw, vh) {
  const x0 = planeCenter.x;
  const y0 = planeCenter.y;
  const z0 = planeCenter.z;

  const fovRad = (camera.fov * Math.PI) / 180;
  const tanHalfFov = Math.tan(fovRad / 2);

  // 1. Initial distance looking straight at plane
  let d = Math.max(
    planeW / (2 * tanHalfFov * (safeRect.width / Math.max(1, safeRect.height))),
    planeH / (2 * tanHalfFov)
  );

  let camY = y0;
  let lookAtY = y0;

  const corners = [
    new THREE.Vector3(x0 - planeW / 2, y0 - planeH / 2, z0),
    new THREE.Vector3(x0 + planeW / 2, y0 - planeH / 2, z0),
    new THREE.Vector3(x0 + planeW / 2, y0 + planeH / 2, z0),
    new THREE.Vector3(x0 - planeW / 2, y0 + planeH / 2, z0),
  ];

  // 2 & 3. Project 4 corners and scale distance up to 6 times until ratio in [0.98, 1.0]
  for (let iter = 0; iter < 6; iter++) {
    camera.position.set(x0, camY, z0 + d);
    camera.lookAt(x0, lookAtY, z0);
    camera.updateMatrixWorld();

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    corners.forEach((c) => {
      const p = c.clone().project(camera);
      const px = (p.x * 0.5 + 0.5) * vw;
      const py = (-p.y * 0.5 + 0.5) * vh;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    });

    const projW = maxX - minX;
    const projH = maxY - minY;
    const ratioW = projW / safeRect.width;
    const ratioH = projH / safeRect.height;
    const scale = Math.max(ratioW, ratioH);

    if (scale >= 0.98 && scale <= 1.00) break;
    d = d * scale;
  }

  // 4. Shift camera.y and look-at y by the same amount until projected plane center equals safeRect center
  const targetCenterY = safeRect.top + safeRect.height / 2;

  for (let iter = 0; iter < 6; iter++) {
    camera.position.set(x0, camY, z0 + d);
    camera.lookAt(x0, lookAtY, z0);
    camera.updateMatrixWorld();

    const p = new THREE.Vector3(x0, y0, z0).project(camera);
    const projCenterY = (-p.y * 0.5 + 0.5) * vh;
    const errY = projCenterY - targetCenterY;

    if (Math.abs(errY) < 0.5) break;

    const dyWorld = -errY * (2 * d * tanHalfFov) / vh;
    camY += dyWorld;
    lookAtY += dyWorld;
  }

  camera.position.set(x0, camY, z0 + d);
  camera.lookAt(x0, lookAtY, z0);
  camera.updateMatrixWorld();

  return {
    cameraPos: new THREE.Vector3(x0, camY, z0 + d),
    lookAt: new THREE.Vector3(x0, lookAtY, z0),
    distance: d,
  };
}

/* ── Static Floor Grid (Fades out 0.50 to 0.54 with Tower 02) ── */
function MobileStaticGround({ opacity = 1.0 }) {
  const grid = useMemo(() => new THREE.GridHelper(120, 36, '#00f0ff', '#0284c7'), []);
  if (opacity <= 0.01) return null;

  return (
    <group position={[0, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#02050d" roughness={0.12} metalness={0.92} transparent opacity={opacity} />
      </mesh>
      <primitive object={grid} />
    </group>
  );
}

/* ── 5 Portal Rings Tunnel + 4 Perspective Floor Lines (0.54 to 1.00) ── */
function TunnelPortalRings({ progress = 0, opacity = 1.0 }) {
  const groupRef = useRef();
  const ringRefs = useRef([]);
  const floorLinesRef = useRef();

  // Vanishing point at 42% of viewport height:
  const vanishY = 17.5;
  const vanishZ = -32.0;

  const floorLinesGeo = useMemo(() => {
    const pts = [];
    const spreadX = [-14, -4.5, 4.5, 14];
    for (let i = 0; i < spreadX.length; i++) {
      pts.push(new THREE.Vector3(spreadX[i], 0.1, 15));
      pts.push(new THREE.Vector3(0, vanishY, vanishZ));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [vanishY, vanishZ]);

  useFrame(() => {
    if (!groupRef.current) return;
    if (progress < 0.54) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // 5 rectangular portal rings
    ringRefs.current.forEach((r, idx) => {
      if (!r) return;
      const phase = ((progress * 6 + idx / 5) % 1.0 + 1.0) % 1.0;
      const scale = 0.15 + 1.45 * phase;
      const z = vanishZ + phase * 44.0;
      const y = vanishY - phase * 1.8;

      r.scale.set(scale, scale, 1);
      r.position.set(0, y, z);

      if (r.material) {
        const ringOp = Math.sin(Math.PI * phase) * 0.9 * opacity;
        r.material.opacity = Math.max(0, ringOp);
      }
    });

    if (floorLinesRef.current?.material) {
      floorLinesRef.current.material.opacity = 0.75 * opacity;
    }
  });

  if (progress < 0.54) return null;

  return (
    <group ref={groupRef}>
      <lineSegments ref={floorLinesRef} geometry={floorLinesGeo}>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.75 * opacity} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {[0, 1, 2, 3, 4].map((i) => (
        <lineLoop key={i} ref={(el) => (ringRefs.current[i] = el)}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              const w = 8.4;
              const h = 18.0;
              const pts = [
                new THREE.Vector3(-w / 2, 0, 0),
                new THREE.Vector3(-w / 2, h, 0),
                new THREE.Vector3(w / 2, h, 0),
                new THREE.Vector3(w / 2, 0, 0),
              ];
              self.setFromPoints(pts);
            }}
          />
          <lineBasicMaterial
            color="#00f0ff"
            linewidth={2}
            transparent
            opacity={0.9 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      ))}
    </group>
  );
}

/**
 * MobileSceneInternal
 * Main 3D scene driven by single damped progress value pS.
 */
function MobileSceneInternal({
  pTargetRef,
  telemetry,
  safeRect,
  aspectRatio,
  onFrameUpdate,
  isVisible = true,
  reduced = false,
}) {
  const { camera, size, gl, scene } = useThree();
  const pSRef = useRef(pTargetRef.current || 0);

  // Refs for scene groups (strictly separate sequential towers)
  const tower1GroupRef = useRef();
  const tower2GroupRef = useRef();

  const planeW = 7.2;
  const planeH = planeW / aspectRatio;
  const planeCenter = useMemo(() => new THREE.Vector3(0, 15.5, 4.65), []);

  // Compute FOCUS pose via fitPose
  const focusPose = useMemo(() => {
    return fitPose(camera, planeW, planeH, planeCenter, safeRect, size.width, size.height);
  }, [camera, planeW, planeH, planeCenter, safeRect, size.width, size.height]);

  // Compute ESTABLISH pose (fits both towers comfortably inside mobile viewport without edge clipping)
  const establishPose = useMemo(() => {
    const fovRad = (camera.fov * Math.PI) / 180;
    const tanHalfFov = Math.tan(fovRad / 2);
    const safeW = safeRect.width || (size.width - 24);
    const vh = safeRect.vh || size.height || 844;
    const totalW = 2 * 3.4 + 7.2 * 0.68;
    const establishDist = Math.max(
      focusPose.distance * 1.95,
      (totalW / (2 * tanHalfFov * (safeW / vh))) * 1.08
    );
    const yShift = 0.12 * establishDist * tanHalfFov;

    return {
      cameraPos: new THREE.Vector3(0, focusPose.cameraPos.y + yShift, 4.65 + establishDist),
      lookAt: new THREE.Vector3(0, focusPose.lookAt.y + yShift * 0.35, 4.65),
      distance: establishDist,
    };
  }, [camera.fov, focusPose, safeRect, size]);

  // Pre-warm renderer on mount
  useEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch {
      // ignore
    }
  }, [gl, scene, camera]);

  // Single damped frame loop
  useFrame((state, delta) => {
    if (!isVisible) return;

    // Damp progress value with lambda = 7
    pSRef.current = THREE.MathUtils.damp(pSRef.current, pTargetRef.current, 7, delta);
    const p = pSRef.current;

    // ── 1. CAMERA ANIMATION (FOCUS POSE ACROSS ALL PROGRESS) ──
    camera.position.copy(focusPose.cameraPos);
    camera.lookAt(focusPose.lookAt);

    // ── 2. TOWER 01 ANIMATION (ALONE & CENTERED, ENTERS ON SCROLL) ──
    // p <= 0.04: clean starting hero, tower 1 hidden (opT1 = 0)
    // p: 0.04 to 0.12: smooth zoom & fade in (scale 0.88 -> 1.0, op 0 -> 1)
    // p: 0.12 to 0.26: hold centered alone in full focus (op 1.0)
    // p: 0.26 to 0.30: exits forward (z -> +3, opacity -> 0)
    let opT1 = 0;
    if (tower1GroupRef.current) {
      if (p <= 0.04) {
        opT1 = 0;
        tower1GroupRef.current.visible = false;
        tower1GroupRef.current.position.set(0, 0, 0);
        tower1GroupRef.current.scale.set(1, 1, 1);
      } else if (p > 0.04 && p < 0.12) {
        const t = (p - 0.04) / 0.08;
        const easeT = 1 - Math.pow(1 - t, 3);
        const z = -4.0 * (1 - easeT);
        const scale = 0.88 + 0.12 * easeT;
        opT1 = t * t * (3 - 2 * t);
        tower1GroupRef.current.visible = opT1 > 0.01;
        tower1GroupRef.current.position.set(0, 0, z);
        tower1GroupRef.current.scale.set(scale, scale, scale);
      } else if (p >= 0.12 && p <= 0.26) {
        opT1 = 1.0;
        tower1GroupRef.current.visible = true;
        tower1GroupRef.current.position.set(0, 0, 0);
        tower1GroupRef.current.scale.set(1, 1, 1);
      } else if (p > 0.26 && p <= 0.30) {
        const t = (p - 0.26) / 0.04;
        const zOffset = 3.0 * (t * t);
        const tOp = Math.min(1.0, t / 0.8);
        opT1 = Math.max(0, 1.0 - tOp);
        tower1GroupRef.current.visible = opT1 > 0.01;
        tower1GroupRef.current.position.set(0, 0, zOffset);
        tower1GroupRef.current.scale.set(1, 1, 1);
      } else {
        opT1 = 0;
        tower1GroupRef.current.visible = false;
      }
    }

    // ── 3. TOWER 02 ANIMATION (ALONE & CENTERED, ENTERS ON SCROLL AFTER TOWER 1 EXITS) ──
    // p < 0.30: tower 2 hidden (opT2 = 0)
    // p: 0.30 to 0.38: enters from behind at x = 0 (z: -8 -> 0, scale 0.85 -> 1.0, op 0 -> 1)
    // p: 0.38 to 0.48: hold centered alone in full focus (op 1.0)
    // p: 0.48 to 0.52: exits forward (z -> +3, opacity -> 0)
    let opT2 = 0;
    if (tower2GroupRef.current) {
      if (p < 0.30 || p > 0.52) {
        opT2 = 0;
        tower2GroupRef.current.visible = false;
      } else if (p >= 0.30 && p < 0.38) {
        const t = (p - 0.30) / 0.08;
        const easeT = 1 - Math.pow(1 - t, 3);
        const z = -8.0 + 8.0 * easeT;
        const scale = 0.85 + 0.15 * easeT;
        const tOp = Math.min(1.0, t / 0.5);
        opT2 = tOp * tOp * (3 - 2 * tOp);

        tower2GroupRef.current.visible = opT2 > 0.01;
        tower2GroupRef.current.position.set(0, 0, z);
        tower2GroupRef.current.scale.set(scale, scale, scale);
      } else if (p >= 0.38 && p <= 0.48) {
        opT2 = 1.0;
        tower2GroupRef.current.visible = true;
        tower2GroupRef.current.position.set(0, 0, 0);
        tower2GroupRef.current.scale.set(1, 1, 1);
      } else if (p > 0.48 && p <= 0.52) {
        const t = (p - 0.48) / 0.04;
        const zOffset = 3.0 * (t * t);
        const tOp = Math.min(1.0, t / 0.8);
        opT2 = Math.max(0, 1.0 - tOp);

        tower2GroupRef.current.visible = opT2 > 0.01;
        tower2GroupRef.current.position.set(0, 0, zOffset);
        tower2GroupRef.current.scale.set(1, 1, 1);
      }
    }

    // ── 4. GROUND GRID OPACITY ──
    let groundOp = 1.0;
    if (p > 0.48 && p <= 0.52) {
      groundOp = Math.max(0, 1.0 - (p - 0.48) / 0.04);
    } else if (p > 0.52) {
      groundOp = 0.0;
    }

    // ── 5. TUNNEL OPACITY ──
    let tunnelOp = 0.0;
    if (p >= 0.52 && p < 0.58) {
      tunnelOp = (p - 0.52) / 0.06;
    } else if (p >= 0.58 && p <= 0.62) {
      tunnelOp = 1.0;
    } else if (p > 0.62 && p <= 0.65) {
      tunnelOp = THREE.MathUtils.lerp(1.0, 0.45, (p - 0.62) / 0.03);
    } else if (p > 0.65) {
      tunnelOp = 0.45;
    }

    // Broadcast frame progress and calculated opacities to HTML overlays
    onFrameUpdate?.({
      p,
      opT1,
      opT2,
      tunnelOp,
      groundOp,
    });
  });

  // Freeze billboard texture updates during movement phases, active only during holds
  const p = pSRef.current;
  const isHoldT1 = p >= 0.12 && p <= 0.26;
  const isHoldT2 = p >= 0.38 && p <= 0.48;

  return (
    <>
      <color attach="background" args={['#02050e']} />
      <fogExp2 attach="fog" args={['#02050e', 0.012]} />

      <ambientLight color="#081836" intensity={2.0} />
      <directionalLight position={[-12, 40, 20]} color="#38bdf8" intensity={2.6} />
      <directionalLight position={[12, 40, 20]} color="#00f0ff" intensity={2.4} />

      {/* ── TOWER 01 GROUP (ALONE & CENTERED, ENTERS ON SCROLL) ── */}
      <group ref={tower1GroupRef} position={[0, 0, 0]} scale={[1, 1, 1]} visible={false}>
        <TowerStructure isLeft={true} opacity={1.0} />
        <MobileTower01Screen
          position={[0, 15.5, 4.65]}
          aspectRatio={aspectRatio}
          telemetry={telemetry}
          isHold={isHoldT1}
          isVisible={isVisible}
          reduced={reduced}
        />
      </group>

      {/* ── TOWER 02 GROUP (ALONE & CENTERED, ENTERS ON SCROLL AFTER TOWER 1) ── */}
      <group ref={tower2GroupRef} position={[0, 0, 0]} scale={[1, 1, 1]} visible={false}>
        <TowerStructure isLeft={false} opacity={1.0} />
        <MobileTower02Screen
          position={[0, 15.5, 4.65]}
          aspectRatio={aspectRatio}
          telemetry={telemetry}
          isHold={isHoldT2}
          isVisible={isVisible}
          reduced={reduced}
        />
      </group>

      {/* ── GROUND GRID ── */}
      <MobileStaticGround opacity={p <= 0.54 ? 1.0 : 0.0} />

      {/* ── TUNNEL RINGS & PERSPECTIVE LINES ── */}
      {!reduced && <TunnelPortalRings progress={p} opacity={p >= 0.67 ? 0.45 : (p >= 0.54 ? 1.0 : 0.0)} />}
    </>
  );
}

/**
 * MobileScene3D
 * Full-bleed canvas container: 100% height, width 100%, background #02050e.
 */
export default function MobileScene3D({
  pTargetRef,
  telemetry,
  safeRect,
  aspectRatio,
  onFrameUpdate,
  isVisible = true,
  reduced = false,
}) {
  return (
    <div className="absolute inset-0 left-0 right-0 w-full h-full overflow-hidden pointer-events-none select-none bg-[#02050e]">
      <style>{`
        @media (max-width: 767px) {
          [aria-hidden="true"].fixed.-z-\\[5\\] {
            display: none !important;
          }
        }
      `}</style>

      <Canvas
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{
          fov: 54,
          near: 0.1,
          far: 240,
          position: [0, 16.0, 28.5],
        }}
        dpr={1.1}
        frameloop={isVisible ? 'always' : 'demand'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
        }}
      >
        <MobileSceneInternal
          pTargetRef={pTargetRef}
          telemetry={telemetry}
          safeRect={safeRect}
          aspectRatio={aspectRatio}
          onFrameUpdate={onFrameUpdate}
          isVisible={isVisible}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
