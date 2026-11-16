import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LeadnexBillboard from './LeadnexBillboard';
import LeadnexRightScreen from './LeadnexRightScreen';
import { scrollState, initScrollController } from './ScrollController';

/* ─────────────────────────────────────────────────────────────────────────
   LEADNEX.AI — Twin Corporate Headquarters Skyscraper Architecture
   
   A cinematic front-facing 3D scene featuring:
     - TWO massive futuristic corporate skyscrapers positioned SIDE BY SIDE.
     - Building 1 on the LEFT side (center x = -10.5).
     - Building 2 on the RIGHT side (center x = +10.5).
     - Wide architectural central opening / portal between them (width ~ 12 units).
     - Connected high-tech skybridge arching between the towers at the top.
     - Large vertical LED billboard physically attached to the front face of Tower 1.
     - Dark blue tinted glass, illuminated cyan/blue floor slabs, vertical corner strip lights.
     - Central data runway / light rails leading out from the opening toward the viewer.
     - Synchronized front-facing camera timeline that freezes immediately on scroll stop.
   ───────────────────────────────────────────────────────────────────────── */

const CYAN = new THREE.Color('#00f0ff');
const ELECTRIC_BLUE = new THREE.Color('#0284c7');
const DEEP_NAVY = new THREE.Color('#051226');
const WHITE = new THREE.Color('#ffffff');

/* ── Procedural Horizontal Floor Slabs for Towers (Batched into 1 Draw Call) ── */
function TowerFloorSlabs({ count = 20, width = 8.5, depth = 9.5, startY = 5, stepY = 1.9, isLeft = true }) {
  const mergedGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const y = startY + i * stepY;
      const w = width * (1 - (i / count) * 0.12);
      const d = depth * (1 - (i / count) * 0.12);
      const hw = w / 2;
      const hd = d / 2;

      // 4 line segments per slab
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
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ── Left Corporate Tower (with Front-Facing LEADNEX.AI Billboard) ────────── */
function LeftSkyscraper() {
  const beaconRef = useRef();

  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.elapsedTime;
      beaconRef.current.intensity = Math.sin(t * 5.0) > 0.3 ? 7.0 : 1.0;
    }
  });

  return (
    <group position={[-10.2, 0, 0]}>
      {/* 1. Tower Podium Base (y: 0 to 6) */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[10.5, 6, 11.5]} />
        <meshStandardMaterial color="#051020" roughness={0.2} metalness={0.88} />
      </mesh>
      <lineSegments position={[0, 3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(10.52, 6.02, 11.52)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.65} />
      </lineSegments>

      {/* 2. Main Glass Skyscraper Body (y: 6 to 48) */}
      <mesh position={[0, 27, 0]}>
        <boxGeometry args={[8.6, 42, 9.6]} />
        <meshStandardMaterial
          color="#06162e"
          roughness={0.12}
          metalness={0.92}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Vertical Corner Neon Light Strips */}
      <lineSegments position={[0, 27, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(8.65, 42.05, 9.65)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.85} />
      </lineSegments>

      {/* Internal Floor Slabs */}
      <TowerFloorSlabs count={22} width={8.6} depth={9.6} startY={6.5} stepY={1.85} isLeft={true} />

      {/* 3. Upper Architectural Crown (y: 48 to 56) */}
      <mesh position={[0, 52, 0]}>
        <boxGeometry args={[6.8, 8, 7.8]} />
        <meshStandardMaterial color="#040c1a" roughness={0.15} metalness={0.9} />
      </mesh>
      <lineSegments position={[0, 52, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(6.84, 8.04, 7.84)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.75} />
      </lineSegments>

      {/* Rooftop Spire & Beacon */}
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 10, 12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.95} />
      </mesh>
      <pointLight ref={beaconRef} color="#00f0ff" intensity={6.0} distance={45} position={[0, 65, 0]} />
      <mesh position={[0, 65, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 4. PROMINENT FRONT-FACING VERTICAL DIGITAL LED BILLBOARD */}
      {/* Positioned safely in front of glass facade (z = 5.05) */}
      <LeadnexBillboard
        position={[0, 15.5, 5.05]}
        rotation={[0, 0, 0]}
        scale={[0.88, 0.95, 0.88]}
      />
    </group>
  );
}

/* ── Right Corporate Tower (Flanking the Right Side) ─────────────────────── */
function RightSkyscraper() {
  const beaconRef = useRef();

  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.elapsedTime + 1.2;
      beaconRef.current.intensity = Math.sin(t * 5.0) > 0.3 ? 7.0 : 1.0;
    }
  });

  return (
    <group position={[10.2, 0, 0]}>
      {/* 1. Tower Podium Base (y: 0 to 6) */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[10.5, 6, 11.5]} />
        <meshStandardMaterial color="#051020" roughness={0.2} metalness={0.88} />
      </mesh>
      <lineSegments position={[0, 3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(10.52, 6.02, 11.52)]} />
        <lineBasicMaterial color="#0284c7" transparent opacity={0.65} />
      </lineSegments>

      {/* 2. Main Glass Skyscraper Body (y: 6 to 48) */}
      <mesh position={[0, 27, 0]}>
        <boxGeometry args={[8.6, 42, 9.6]} />
        <meshStandardMaterial
          color="#06162e"
          roughness={0.12}
          metalness={0.92}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Vertical Corner Neon Light Strips */}
      <lineSegments position={[0, 27, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(8.65, 42.05, 9.65)]} />
        <lineBasicMaterial color="#0284c7" transparent opacity={0.85} />
      </lineSegments>

      {/* Internal Floor Slabs */}
      <TowerFloorSlabs count={22} width={8.6} depth={9.6} startY={6.5} stepY={1.85} isLeft={false} />

      {/* 3. Upper Architectural Crown (y: 48 to 56) */}
      <mesh position={[0, 52, 0]}>
        <boxGeometry args={[6.8, 8, 7.8]} />
        <meshStandardMaterial color="#040c1a" roughness={0.15} metalness={0.9} />
      </mesh>
      <lineSegments position={[0, 52, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(6.84, 8.04, 7.84)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.75} />
      </lineSegments>

      {/* Rooftop Spire & Beacon */}
      <mesh position={[0, 60, 0]}>
        <cylinderGeometry args={[0.08, 0.35, 10, 12]} />
        <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.95} />
      </mesh>
      <pointLight ref={beaconRef} color="#0284c7" intensity={6.0} distance={45} position={[0, 65, 0]} />
      <mesh position={[0, 65, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 4. PROMINENT FRONT-FACING VERTICAL DIGITAL LED MATRIX SCREEN ON TOWER 2 */}
      <LeadnexRightScreen
        position={[0, 15.5, 5.05]}
        rotation={[0, 0, 0]}
        scale={[0.88, 0.95, 0.88]}
      />
    </group>
  );
}

/* ── Central Connecting Skybridge Arching Over the Opening ───────────────── */
function SkybridgeConnector() {
  return (
    <group position={[0, 31, 0]}>
      {/* Skybridge Glass Enclosure spanning from Left to Right Tower */}
      <mesh>
        <boxGeometry args={[12.2, 3.6, 4.2]} />
        <meshStandardMaterial
          color="#061a38"
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(12.24, 3.64, 4.24)]} />
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.85} />
      </lineSegments>

      {/* Internal Walkway Floor Slab */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[12.0, 0.3, 3.8]} />
        <meshStandardMaterial color="#020814" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Skybridge Downward Portal Illumination */}
      <pointLight color="#00f0ff" intensity={3.5} distance={20} position={[0, -2.5, 0]} />
    </group>
  );
}

/* ── Central Portal Runway & Light Rails (Where Content Emerges) ─────────── */
function CentralOpeningRunway() {
  const lineCount = 6;
  const Z_START = 22;
  const Z_END = -35;

  const runwayGeo = useMemo(() => {
    const pts = [];
    const spacing = 1.4;
    const startX = -((lineCount - 1) * spacing) / 2;

    for (let i = 0; i < lineCount; i++) {
      const x = startX + i * spacing;
      pts.push(new THREE.Vector3(x, 0.05, Z_START));
      pts.push(new THREE.Vector3(x, 0.05, Z_END));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Portal Arch Rings in the depth of the central opening
  const portalRings = useMemo(() => {
    return [-4, -12, -20, -28];
  }, []);

  return (
    <group>
      {/* Dynamic Runway Light Conduits on Ground */}
      <lineSegments geometry={runwayGeo}>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Glowing Portal Arch Frames in the Central Opening */}
      {portalRings.map((z, idx) => (
        <group key={idx} position={[0, 11, z]}>
          <lineLoop>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) => {
                const w = 11.2;
                const h = 22.0;
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
              color={idx % 2 === 0 ? CYAN : ELECTRIC_BLUE}
              transparent
              opacity={0.45 - idx * 0.08}
              blending={THREE.AdditiveBlending}
            />
          </lineLoop>
        </group>
      ))}
    </group>
  );
}

/* ── Reflective City Ground Grid ─────────────────────────────────────────── */
function GroundPlaza() {
  const gridHelper = useMemo(() => {
    return new THREE.GridHelper(180, 60, '#00f0ff', '#0284c7');
  }, []);

  return (
    <group position={[0, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#02050d" roughness={0.12} metalness={0.92} />
      </mesh>
      <primitive object={gridHelper} />
    </group>
  );
}

/* ── Floating Atmospheric Data Dust ──────────────────────────────────────── */
function AtmosphericParticles({ count = 280 }) {
  const meshRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 65;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = (state.clock.elapsedTime * 0.6) % 12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        color="#00f0ff"
        size={0.35}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Front-Facing Cinematic Scroll Camera Controller ────────────────────── */
function FrontFacingCameraRig({ small }) {
  const { camera } = useThree();

  useFrame(() => {
    // Deterministic scroll progress 0.0 -> 1.0 (freezes instantly on scroll stop)
    const p = Math.max(0, Math.min(1, scrollState.progress));

    // Base front-facing framing:
    // Both buildings clearly visible on left (x = -10.2) and right (x = +10.2).
    // Central opening wide open in the middle.
    // Subtle forward push as scroll progresses (z goes from 27.5 to 23.5)
    const baseZ = small ? 32.0 : 27.0;
    const targetZ = baseZ - p * 3.8;
    const targetY = 14.5 + p * 2.2;
    const targetX = 0;

    camera.position.set(targetX, targetY, targetZ);
    camera.lookAt(0, 14.5 + p * 1.2, 0);
  });

  return null;
}

/* ── Root 3D Scene Component ─────────────────────────────────────────────── */
export default function LeadnexBuildingScene({ small = false, reduced = false }) {
  const canvasWrapRef = useRef(null);
  const vignetteRef = useRef(null);

  useEffect(() => {
    const cleanup = initScrollController();

    const updateBackdropState = () => {
      const scrollY = window.__lenis?.scroll ?? window.scrollY ?? 0;
      const featuresEl = document.querySelector('#features');
      const featuresTop = featuresEl ? (featuresEl.getBoundingClientRect().top + scrollY) : 1400;

      if (scrollY < featuresTop - window.innerHeight * 0.35) {
        if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = '1';
        if (vignetteRef.current) vignetteRef.current.style.opacity = '0';
      } else {
        if (canvasWrapRef.current) canvasWrapRef.current.style.opacity = '0.14';
        if (vignetteRef.current) vignetteRef.current.style.opacity = '0.96';
      }
    };

    updateBackdropState();

    window.addEventListener('scroll', updateBackdropState, { passive: true });
    window.__lenis?.on?.('scroll', updateBackdropState);

    const st = ScrollTrigger.create({
      trigger: '#features',
      start: 'top 85%',
      onUpdate: () => updateBackdropState(),
    });

    return () => {
      cleanup();
      st.kill();
      window.removeEventListener('scroll', updateBackdropState);
      window.__lenis?.off?.('scroll', updateBackdropState);
    };
  }, []);

  return (
    <>
      {/* 3D Skyscraper Scene Container — Smoothly fades as user scrolls down into content (60fps GPU compositor) */}
      <div
        ref={canvasWrapRef}
        aria-hidden="true"
        className="fixed inset-0 -z-[5] pointer-events-none select-none overflow-hidden transition-opacity duration-700 ease-out"
        style={{ opacity: 1, willChange: 'opacity' }}
      >
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          camera={{
            fov: small ? 54 : 46,
            near: 0.1,
            far: 300,
            position: [0, 14.5, small ? 32.0 : 27.0],
          }}
          dpr={[1, 1.25]}
        >
          {/* Deep Cinematic Atmosphere */}
          <color attach="background" args={['#02050e']} />
          <fogExp2 attach="fog" args={['#02050e', 0.01]} />

          {/* Lighting */}
          <ambientLight color="#081836" intensity={1.8} />
          <directionalLight position={[-15, 45, 25]} color="#38bdf8" intensity={2.6} />
          <directionalLight position={[15, 45, 25]} color="#00f0ff" intensity={2.2} />

          {/* ── TWO MASSIVE TWIN BUILDINGS SIDE BY SIDE ── */}
          <LeftSkyscraper />
          <RightSkyscraper />
          <SkybridgeConnector />

          {/* ── CENTRAL OPENING RUNWAY (Content Emerges Along Here) ── */}
          <CentralOpeningRunway />

          {/* Ground Plaza & Environment */}
          <GroundPlaza />
          {!reduced && <AtmosphericParticles count={small ? 140 : 280} />}

          {/* Front-Facing Scroll Camera Rig */}
          <FrontFacingCameraRig small={small} />
        </Canvas>
      </div>

      {/* Cinematic Dark Ambient Vignette that gently obscures backdrop for maximum content contrast */}
      <div
        ref={vignetteRef}
        aria-hidden="true"
        className="fixed inset-0 -z-[4] pointer-events-none select-none transition-opacity duration-700 ease-out"
        style={{
          opacity: 0,
          background: 'radial-gradient(circle at 50% 30%, #030816 0%, #02050e 85%)',
          willChange: 'opacity',
        }}
      />
    </>
  );
}
