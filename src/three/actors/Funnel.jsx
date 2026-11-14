import { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Actor, useActor, Glow, colors, pointer, cssHex } from '../common';
import { hero } from '../../data/site';

extend({ RoundedBoxGeometry });

/* WORKFLOW — "one call, six things happen automatically".
   Leads fall into a funnel; at each stage some drop out and the rest turn from
   grey to accent (qualified); the survivors land on a calendar card that
   lights up — meeting booked. */

const TOP_Y = 120;
const BOT_Y = -85;
const R_TOP = 118;
const R_BOT = 22;
const radiusAt = (y) => {
  const u = THREE.MathUtils.clamp((TOP_Y - y) / (TOP_Y - BOT_Y), 0, 1);
  return R_BOT + (R_TOP - R_BOT) * Math.pow(1 - u, 1.6);
};
const N = 72;
const STAGES = [0.18, 0.4, 0.62, 0.84];

function makeCanvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function FunnelBody() {
  const ctx = useActor();
  const group = useRef();
  const glass = useRef();
  const rings = useRef([]);
  const lines = useRef();
  const dots = useRef();
  const card = useRef();
  const cardMat = useRef();
  const cardGlow = useRef();
  const hit = useRef(0);

  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        phase: i / N,
        speed: 0.07 + ((i * 37) % 11) * 0.003,
        angle: (i * 2.399) % (Math.PI * 2),
        spread: 0.3 + ((i * 53) % 10) / 14,
        drop: ((i * 29) % 100) / 100,
      })),
    [],
  );

  const glassGeo = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const y = TOP_Y - (i / 28) * (TOP_Y - BOT_Y);
      pts.push(new THREE.Vector2(radiusAt(y), y));
    }
    return new THREE.LatheGeometry(pts, 48);
  }, []);

  const lineGeo = useMemo(() => {
    const verts = [];
    const COUNT = 16;
    const STEPS = 20;
    for (let k = 0; k < COUNT; k++) {
      const a = (k / COUNT) * Math.PI * 2;
      for (let s = 0; s < STEPS; s++) {
        const y0 = TOP_Y - (s / STEPS) * (TOP_Y - BOT_Y);
        const y1 = TOP_Y - ((s + 1) / STEPS) * (TOP_Y - BOT_Y);
        verts.push(Math.cos(a) * radiusAt(y0), y0, Math.sin(a) * radiusAt(y0));
        verts.push(Math.cos(a) * radiusAt(y1), y1, Math.sin(a) * radiusAt(y1));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return g;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const grey = useMemo(() => new THREE.Color('#8a909c'), []);

  const cardTex = useMemo(
    () =>
      makeCanvasTexture(296, 232, (c, w, h) => {
        c.fillStyle = '#0b1220';
        c.fillRect(0, 0, w, h);
        c.fillStyle = cssHex(colors.accent);
        c.fillRect(0, 0, w, 62);
        c.fillStyle = '#fff';
        c.font = '600 26px "JetBrains Mono Variable", monospace';
        c.textAlign = 'center';
        c.fillText('THU', w / 2, 42);
        c.font = '600 44px "Inter Variable", system-ui, sans-serif';
        c.fillText('2:00 PM', w / 2, 128);
        c.fillStyle = cssHex(colors.ok);
        c.font = '600 22px "JetBrains Mono Variable", monospace';
        c.fillText('✓  MEETING BOOKED', w / 2, 188);
      }),
    [],
  );

  const labelTex = useMemo(
    () =>
      makeCanvasTexture(420, 96, (c, w, h) => {
        c.textAlign = 'center';
        c.fillStyle = 'rgba(255,255,255,0.92)';
        c.font = '700 40px "JetBrains Mono Variable", monospace';
        c.fillText(String(hero.dashboard.metrics[2]?.value ?? 1248), w / 2, 46);
        c.fillStyle = 'rgba(255,255,255,0.5)';
        c.font = '500 22px "JetBrains Mono Variable", monospace';
        c.fillText('LEADS IN', w / 2, 82);
      }),
    [],
  );

  useFrame(() => {
    if (!ctx.active) return;
    const { t, pop, progress } = ctx;

    const g = group.current;
    g.rotation.y = t * 0.16 + progress * -0.9 + (1 - pop) * 1.6 + pointer.sx * 0.25;
    g.rotation.x = 0.32 - pointer.sy * 0.12;
    g.position.y = Math.sin(t * 0.9) * 5;

    glass.current.material.color.copy(colors.accent);
    lines.current.material.color.copy(colors.soft);

    // rings pulse as leads pass each stage
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.32 - i * 0.18) % 1;
      const pulse = Math.max(0, 1 - k * 2.4);
      m.material.color.copy(colors.soft);
      m.material.opacity = 0.35 + pulse * 0.65;
      m.scale.setScalar(1 + pulse * 0.05);
    });

    // falling leads
    let landed = 0;
    for (let i = 0; i < N; i++) {
      const s = seeds[i];
      const k = (t * s.speed + s.phase) % 1;
      const y = TOP_Y - Math.pow(k, 0.9) * (TOP_Y - BOT_Y);
      let r = radiusAt(y) * s.spread;
      let scale = 3.2;
      const out = s.drop < 0.55 ? THREE.MathUtils.smoothstep(k, 0.4 + s.drop * 0.3, 0.72 + s.drop * 0.2) : 0;
      if (out > 0) {
        r += out * 46;
        scale *= 1 - out;
      }
      if (k > 0.94) landed++;
      const a = s.angle + k * 7;
      dummy.position.set(Math.cos(a) * r, y - out * 24, Math.sin(a) * r);
      dummy.scale.setScalar(Math.max(0.001, scale));
      dummy.updateMatrix();
      dots.current.setMatrixAt(i, dummy.matrix);

      // grey → accent as it passes the qualifying stages → ok at the bottom
      if (k < 0.3) col.copy(grey);
      else if (k < 0.62) col.copy(grey).lerp(colors.accent, (k - 0.3) / 0.32);
      else col.copy(colors.accent).lerp(colors.ok, THREE.MathUtils.smoothstep(k, 0.7, 0.95));
      dots.current.setColorAt(i, col);
    }
    dots.current.instanceMatrix.needsUpdate = true;
    if (dots.current.instanceColor) dots.current.instanceColor.needsUpdate = true;

    // calendar card glows when leads land
    hit.current += (Math.min(1, landed / 3) - hit.current) * 0.15;
    card.current.rotation.x = -0.28 + Math.sin(t * 1.2) * 0.04;
    card.current.position.y = -132 + Math.sin(t * 1.4) * 3;
    cardGlow.current.material.opacity = 0.18 + hit.current * 0.32;
    cardGlow.current.material.color.copy(colors.ok);
  });

  return (
    <>
      <Glow size={480} opacity={0.34} z={-100} />
      <group ref={group}>
        <mesh ref={glass} geometry={glassGeo}>
          <meshPhysicalMaterial transparent opacity={0.1} roughness={0.15} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments ref={lines} geometry={lineGeo}>
          <lineBasicMaterial transparent opacity={0.2} toneMapped={false} />
        </lineSegments>
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((u, i) => {
          const y = TOP_Y - u * (TOP_Y - BOT_Y);
          return (
            <mesh key={u} ref={(el) => (rings.current[i] = el)} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radiusAt(y), 1.5, 8, 64]} />
              <meshBasicMaterial transparent toneMapped={false} />
            </mesh>
          );
        })}
        <instancedMesh ref={dots} args={[null, null, N]} frustumCulled={false}>
          <sphereGeometry args={[1, 12, 10]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

      </group>

      {/* booked card — outside the turning funnel so it always faces the viewer */}
        <group ref={card} position={[0, -132, 0]}>
          <mesh ref={cardGlow} position={[0, 0, -6]} scale={[1.28, 1.34, 1]}>
            <planeGeometry args={[78, 62]} />
            <meshBasicMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
          <mesh>
            <roundedBoxGeometry args={[78, 62, 8, 3, 8]} />
            <meshStandardMaterial ref={cardMat} color="#101828" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 4.5]}>
            <planeGeometry args={[72, 56]} />
            <meshBasicMaterial map={cardTex} toneMapped={false} />
          </mesh>
        </group>

      {/* counter above the funnel — always faces the camera */}
      <sprite position={[0, 168, 40]} scale={[126, 29, 1]}>
        <spriteMaterial map={labelTex} transparent toneMapped={false} depthWrite={false} />
      </sprite>
    </>
  );
}

export default function Funnel() {
  return (
    <Actor name="funnel" size={350}>
      <FunnelBody />
    </Actor>
  );
}
