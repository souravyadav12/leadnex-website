import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Actor, useActor, Glow, colors, pointer } from '../common';

/* FEATURES — "30+ native languages · always on".
   A dotted globe with live call arcs between real hubs; a bright packet runs
   each arc and every hub pulses when a call lands. Turns with the scroll. */

const R = 104;
const CITIES = {
  nyc: [40.7, -74],
  lon: [51.5, -0.1],
  mum: [19.1, 72.9],
  sin: [1.35, 103.8],
  syd: [-33.9, 151.2],
  sao: [-23.5, -46.6],
  dxb: [25.2, 55.3],
  tok: [35.7, 139.7],
  sfo: [37.8, -122.4],
  lag: [6.5, 3.4],
};
const ROUTES = [
  ['nyc', 'lon'],
  ['lon', 'mum'],
  ['mum', 'sin'],
  ['sin', 'syd'],
  ['sfo', 'tok'],
  ['dxb', 'lon'],
  ['sao', 'nyc'],
  ['lag', 'dxb'],
  ['tok', 'sin'],
  ['sfo', 'nyc'],
];

const toVec = ([lat, lon], r = R) => {
  const phi = ((90 - lat) * Math.PI) / 180;
  const th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

function circle(points, fn) {
  const v = [];
  for (let i = 0; i <= points; i++) v.push(fn((i / points) * Math.PI * 2));
  return new THREE.BufferGeometry().setFromPoints(v);
}

function GlobeBody() {
  const ctx = useActor();
  const group = useRef();
  const dotMat = useRef();
  const gridMats = useRef([]);
  const arcMats = useRef([]);
  const packets = useRef();
  const pulses = useRef([]);
  const hubs = useRef();

  const dots = useMemo(() => {
    const N = 1700;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      arr[i * 3] = Math.cos(th) * r * (R + 0.6);
      arr[i * 3 + 1] = y * (R + 0.6);
      arr[i * 3 + 2] = Math.sin(th) * r * (R + 0.6);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);

  const grid = useMemo(() => {
    const out = [];
    [-60, -30, 0, 30, 60].forEach((lat) => {
      const rr = R * Math.cos((lat * Math.PI) / 180);
      const y = R * Math.sin((lat * Math.PI) / 180);
      out.push(circle(96, (a) => new THREE.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr)));
    });
    for (let k = 0; k < 6; k++) {
      const rot = (k / 6) * Math.PI;
      out.push(circle(96, (a) => new THREE.Vector3(Math.cos(a) * R * Math.cos(rot), Math.sin(a) * R, Math.cos(a) * R * Math.sin(rot))));
    }
    return out;
  }, []);

  const arcs = useMemo(
    () =>
      ROUTES.map(([a, b]) => {
        const p0 = toVec(CITIES[a]);
        const p1 = toVec(CITIES[b]);
        const chord = p0.distanceTo(p1);
        const ctrl = p0.clone().add(p1).normalize().multiplyScalar(R * (1 + (chord / R) * 0.62));
        const curve = new THREE.QuadraticBezierCurve3(p0, ctrl, p1);
        return { curve, geo: new THREE.BufferGeometry().setFromPoints(curve.getPoints(56)) };
      }),
    [],
  );

  const hubList = useMemo(() => Object.values(CITIES).map((c) => toVec(c, R + 1)), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const up = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useFrame(() => {
    if (!ctx.active) return;
    const { t, pop, progress } = ctx;

    const g = group.current;
    g.rotation.y = t * 0.16 + progress * -1.5 + (1 - pop) * -2 + pointer.sx * 0.3;
    g.rotation.x = 0.36 - pointer.sy * 0.15;
    g.rotation.z = 0.12;

    dotMat.current.color.copy(colors.soft);
    gridMats.current.forEach((m) => m?.color.copy(colors.accent));
    arcMats.current.forEach((m) => m?.color.copy(colors.soft));

    // packets running the arcs (head + short tail)
    let n = 0;
    arcs.forEach((arc, i) => {
      const k0 = (t * 0.22 + i * 0.173) % 1;
      for (let j = 0; j < 5; j++) {
        const k = Math.max(0, k0 - j * 0.022);
        const p = arc.curve.getPoint(k);
        dummy.position.copy(p);
        dummy.scale.setScalar((2.8 - j * 0.45) * (k0 > 0.02 ? 1 : 0.01));
        dummy.updateMatrix();
        packets.current.setMatrixAt(n++, dummy.matrix);
      }
    });
    packets.current.instanceMatrix.needsUpdate = true;
    packets.current.material.color.copy(colors.ok);

    // hub pulses
    pulses.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.45 + i * 0.37) % 1;
      m.scale.setScalar(2 + k * 15);
      m.material.opacity = (1 - k) * 0.7;
      m.material.color.copy(colors.ok);
    });
    hubs.current.material.color.copy(colors.ok);
  });

  return (
    <>
      <Glow size={470} opacity={0.4} z={-120} />
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[R - 1, 64, 48]} />
          <meshStandardMaterial color="#070b14" metalness={0.3} roughness={0.55} />
        </mesh>
        <points geometry={dots}>
          <pointsMaterial ref={dotMat} size={2.3} sizeAttenuation={false} transparent opacity={0.85} depthWrite={false} toneMapped={false} />
        </points>
        {grid.map((geo, i) => (
          <line key={i} geometry={geo}>
            <lineBasicMaterial ref={(el) => (gridMats.current[i] = el)} transparent opacity={0.13} toneMapped={false} />
          </line>
        ))}
        {arcs.map((arc, i) => (
          <line key={i} geometry={arc.geo}>
            <lineBasicMaterial ref={(el) => (arcMats.current[i] = el)} transparent opacity={0.4} toneMapped={false} />
          </line>
        ))}
        <instancedMesh ref={packets} args={[null, null, arcs.length * 5]} frustumCulled={false}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        {/* hubs: a bright dot + an outgoing ring flat on the surface */}
        {hubList.map((p, i) => {
          const q = new THREE.Quaternion().setFromUnitVectors(up, p.clone().normalize());
          return (
            <group key={i} position={p} quaternion={q}>
              <mesh ref={i === 0 ? hubs : undefined}>
                <circleGeometry args={[2.6, 16]} />
                <meshBasicMaterial color={colors.ok} toneMapped={false} />
              </mesh>
              <mesh ref={(el) => (pulses.current[i] = el)}>
                <ringGeometry args={[0.85, 1, 32]} />
                <meshBasicMaterial transparent depthWrite={false} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
}

export default function Globe() {
  return (
    <Actor name="globe" size={300}>
      <GlobeBody />
    </Actor>
  );
}
