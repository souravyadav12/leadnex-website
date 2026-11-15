import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
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

/* ── Procedural Horizontal Floor Slabs for Towers ───────────────────────── */
function TowerFloorSlabs({ count = 24, width = 8.5, depth = 9.5, startY = 4, stepY = 1.85, isLeft = true }) {
  const { slabGeometries, colors } = useMemo(() => {
    const geos = [];
    const cols = [];
    for (let i = 0; i < count; i++) {
      const y = startY + i * stepY;
      const w = width * (1 - (i / count) * 0.12);
      const d = depth * (1 - (i / count) * 0.12);

      const pts = [
        new THREE.Vector3(-w / 2, y, -d / 2),
        new THREE.Vector3(w / 2, y, -d / 2),
        new THREE.Vector3(w / 2, y, d / 2),
        new THREE.Vector3(-w / 2, y, d / 2),
      ];
      geos.push(new THREE.BufferGeometry().setFromPoints(pts));
      cols.push(i % 3 === 0 ? CYAN : ELECTRIC_BLUE);
    }
    return { slabGeometries: geos, colors: cols };
  }, [count, width, depth, startY, stepY]);

  return (
    <group>
      {slabGeometries.map((geo, idx) => (
        <lineLoop key={idx} geometry={geo}>
          <lineBasicMaterial
            color={colors[idx]}
            transparent
            opacity={idx % 3 === 0 ? 0.75 : 0.3}
            blending={THREE.AdditiveBlending}
          />
        </lineLoop>
      ))}
    </group>
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
      {/* Positioned safely in front of glass facade (z = 4.95) */}
      <LeadnexBillboard
        position={[0, 15.5, 4.95]}
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
        position={[0, 15.5, 4.95]}
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

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += delta * 1.5;
      if (posArr[i * 3 + 1] > 65) {
        posArr[i * 3 + 1] = 0;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
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
  useEffect(() => {
    const cleanup = initScrollController();
    return () => cleanup();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-[5] pointer-events-none select-none overflow-hidden"
      style={{ opacity: 1, willChange: 'transform' }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        camera={{
          fov: small ? 54 : 46,
          near: 0.1,
          far: 300,
          position: [0, 14.5, small ? 32.0 : 27.0],
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.75) : 1}
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
  );
}
