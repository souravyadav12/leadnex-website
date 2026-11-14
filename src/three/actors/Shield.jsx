import { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Actor, useActor, Glow, Sonar, colors, pointer } from '../common';

extend({ RoundedBoxGeometry });

/* SECURITY — every call encrypted end to end.
   A shield with a lock, a scan line sweeping over it, encrypted data packets
   orbiting in two counter-rotating rings, and a pulse going out when "checked". */

function shieldShape(scale = 1) {
  const s = new THREE.Shape();
  const k = scale;
  s.moveTo(0, 92 * k);
  s.quadraticCurveTo(38 * k, 86 * k, 74 * k, 74 * k);
  s.lineTo(74 * k, 10 * k);
  s.bezierCurveTo(74 * k, -45 * k, 40 * k, -80 * k, 0, -100 * k);
  s.bezierCurveTo(-40 * k, -80 * k, -74 * k, -45 * k, -74 * k, 10 * k);
  s.lineTo(-74 * k, 74 * k);
  s.quadraticCurveTo(-38 * k, 86 * k, 0, 92 * k);
  return s;
}

const PK1 = 40;
const PK2 = 26;
const dummy = new THREE.Object3D();

function scanTexture() {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 64);
  grd.addColorStop(0, 'rgba(255,255,255,0)');
  grd.addColorStop(0.5, 'rgba(255,255,255,1)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 8, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function ShieldBody() {
  const ctx = useActor();
  const group = useRef();
  const body = useRef();
  const inlay = useRef();
  const edge = useRef();
  const lock = useRef();
  const shackle = useRef();
  const scan = useRef();
  const ringA = useRef();
  const ringB = useRef();
  const pkA = useRef();
  const pkB = useRef();
  const orbitA = useRef();
  const orbitB = useRef();

  const bodyGeo = useMemo(
    () => new THREE.ExtrudeGeometry(shieldShape(1), { depth: 14, bevelEnabled: true, bevelThickness: 4, bevelSize: 4, bevelSegments: 4, curveSegments: 24 }),
    [],
  );
  const inlayGeo = useMemo(() => new THREE.ShapeGeometry(shieldShape(0.82), 24), []);
  const edgeGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(shieldShape(0.82).getPoints(60).map((p) => new THREE.Vector3(p.x, p.y, 0))), []);
  const scanTex = useMemo(scanTexture, []);

  useFrame(() => {
    if (!ctx.active) return;
    const { t, pop, progress } = ctx;

    const g = group.current;
    g.rotation.y = Math.sin(t * 0.5) * 0.4 + progress * -0.9 + (1 - pop) * 2.2 + pointer.sx * 0.3;
    g.rotation.x = -0.05 - pointer.sy * 0.12 + Math.sin(t * 0.7) * 0.03;
    g.position.y = Math.sin(t * 1.0) * 6;

    body.current.emissive.copy(colors.accent).multiplyScalar(0.07);
    inlay.current.color.copy(colors.accent);
    edge.current.color.copy(colors.soft);
    lock.current.color.copy(colors.soft);
    lock.current.emissive.copy(colors.accent).multiplyScalar(0.5);
    shackle.current.color.copy(colors.soft);
    shackle.current.emissive.copy(colors.accent).multiplyScalar(0.5);
    scan.current.material.color.copy(colors.soft);

    // scan line sweeping the face
    const sweep = (t * 0.42) % 1;
    scan.current.position.y = 88 - sweep * 176;
    scan.current.material.opacity = Math.sin(sweep * Math.PI) * 0.75;

    // data packets
    orbitA.current.rotation.y = t * 0.55;
    orbitB.current.rotation.y = -t * 0.4;
    for (let i = 0; i < PK1; i++) {
      const a = (i / PK1) * Math.PI * 2;
      const s = 1.6 + (Math.sin(a * 3 + t * 2) + 1) * 0.9;
      dummy.position.set(Math.cos(a) * 124, 0, Math.sin(a) * 124);
      dummy.rotation.set(t * 0.5 + i, t * 0.4, 0);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      pkA.current.setMatrixAt(i, dummy.matrix);
    }
    pkA.current.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < PK2; i++) {
      const a = (i / PK2) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 146, 0, Math.sin(a) * 146);
      dummy.rotation.set(0, a, 0);
      dummy.scale.set(1.2, 1.2 + (Math.sin(a * 2 - t * 3) + 1) * 1.4, 1.2);
      dummy.updateMatrix();
      pkB.current.setMatrixAt(i, dummy.matrix);
    }
    pkB.current.instanceMatrix.needsUpdate = true;
    pkA.current.material.color.copy(colors.soft);
    pkB.current.material.color.copy(colors.ok);
    ringA.current.material.color.copy(colors.accent);
    ringB.current.material.color.copy(colors.ok);
  });

  return (
    <>
      <Glow size={500} opacity={0.38} z={-120} />
      <Sonar radius={110} count={2} period={4} tone="ok" opacity={0.4} max={1.5} />
      <group ref={group}>
        <mesh geometry={bodyGeo} position={[0, 0, -9]}>
          <meshStandardMaterial ref={body} color="#0f1726" metalness={0.65} roughness={0.34} />
        </mesh>
        <mesh geometry={inlayGeo} position={[0, 0, 9.4]}>
          <meshBasicMaterial ref={inlay} transparent opacity={0.2} toneMapped={false} />
        </mesh>
        <lineLoop geometry={edgeGeo} position={[0, 0, 9.6]}>
          <lineBasicMaterial ref={edge} transparent opacity={0.7} toneMapped={false} />
        </lineLoop>

        {/* lock */}
        <group position={[0, -6, 9.5]}>
          <mesh position={[0, -8, 6]}>
            <roundedBoxGeometry args={[50, 40, 14, 3, 6]} />
            <meshStandardMaterial ref={lock} color="#cfe0ff" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, 12, 6]}>
            <torusGeometry args={[14, 4.4, 12, 28, Math.PI]} />
            <meshStandardMaterial ref={shackle} color="#cfe0ff" metalness={0.5} roughness={0.28} />
          </mesh>
          <mesh position={[0, -4, 13.2]}>
            <circleGeometry args={[4.6, 20]} />
            <meshBasicMaterial color="#0a1020" />
          </mesh>
          <mesh position={[0, -12, 13.2]}>
            <planeGeometry args={[3.6, 10]} />
            <meshBasicMaterial color="#0a1020" />
          </mesh>
        </group>

        {/* scan line */}
        <mesh ref={scan} position={[0, 0, 11]}>
          <planeGeometry args={[132, 14]} />
          <meshBasicMaterial map={scanTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>

        {/* orbiting packets */}
        <group rotation={[1.25, 0, 0.3]}>
          <mesh ref={ringA}>
            <torusGeometry args={[124, 0.5, 6, 120]} />
            <meshBasicMaterial transparent opacity={0.22} toneMapped={false} />
          </mesh>
          <group ref={orbitA}>
            <instancedMesh ref={pkA} args={[null, null, PK1]} frustumCulled={false}>
              <boxGeometry args={[2.4, 2.4, 2.4]} />
              <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
          </group>
        </group>
        <group rotation={[0.95, 0, -0.45]}>
          <mesh ref={ringB}>
            <torusGeometry args={[146, 0.4, 6, 120]} />
            <meshBasicMaterial transparent opacity={0.16} toneMapped={false} />
          </mesh>
          <group ref={orbitB}>
            <instancedMesh ref={pkB} args={[null, null, PK2]} frustumCulled={false}>
              <boxGeometry args={[1.4, 3, 1.4]} />
              <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default function Shield() {
  return (
    <Actor name="shield" size={300}>
      <ShieldBody />
    </Actor>
  );
}
