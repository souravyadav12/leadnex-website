import { createContext, useContext, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────────────────
   Shared plumbing for the LEADNEX.AI 3D scene.

   One fixed WebGL canvas sits over the page. Every 3D object is an <Actor>
   that is pinned to an empty placeholder element in the DOM
   (<div data-3d="phone" />). Each frame the actor reads that element's
   rectangle, moves to it, scales to it, and animates from how far the element
   has travelled through the viewport — so layout stays in plain HTML/CSS and
   the 3D follows it, including under Lenis smooth-scroll.

   World units are CSS pixels (the camera is set up so 1 unit = 1px at z=0).
   ───────────────────────────────────────────────────────────────────────── */

export const CAM_Z = 1200;

/* theme colours, read from the page's CSS variables so palette changes retint */
export const colors = {
  accent: new THREE.Color('#3b82f6'),
  soft: new THREE.Color('#93c5fd'),
  a2: new THREE.Color('#64748b'),
  ok: new THREE.Color('#7dd8c9'),
};

export function syncColors() {
  const cs = getComputedStyle(document.documentElement);
  const read = (name) => {
    const v = cs.getPropertyValue(name).trim().split(',').map((n) => parseFloat(n));
    return v.length === 3 && v.every((n) => !Number.isNaN(n)) ? v : null;
  };
  const set = (color, name) => {
    const v = read(name);
    if (v) color.setRGB(v[0] / 255, v[1] / 255, v[2] / 255, THREE.SRGBColorSpace);
  };
  set(colors.accent, '--a1-rgb');
  set(colors.soft, '--a1-soft-rgb');
  set(colors.a2, '--a2-rgb');
  set(colors.ok, '--ok-rgb');
}

export const cssHex = (c) => `#${c.getHexString()}`;

/* shared input state, written by the driver in Scene3D */
export const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
export const scrollState = { vel: 0 };

/* ── anchors ────────────────────────────────────────────────────────────── */
const anchorCache = {};
export function getAnchor(name) {
  let el = anchorCache[name];
  if (!el || !el.isConnected) {
    el = document.querySelector(`[data-3d="${name}"]`);
    anchorCache[name] = el;
  }
  return el;
}

export const ANCHOR_NAMES = ['phone', 'orb', 'funnel', 'globe', 'shield'];

export function anyAnchorOnScreen() {
  const vh = window.innerHeight;
  for (const n of ANCHOR_NAMES) {
    const el = getAnchor(n);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.bottom > -60 && r.top < vh + 60) return true;
  }
  return false;
}

/* ── tiny math helpers ──────────────────────────────────────────────────── */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
export const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/* ── Actor ──────────────────────────────────────────────────────────────── */
const ActorCtx = createContext(null);
export const useActor = () => useContext(ActorCtx);

/**
 * Pins its children to the element `[data-3d="<name>"]`.
 * Children are modelled to fit a `size`×`size` px box; the actor scales that
 * box to the element's real width. Children read live values from useActor():
 *   t        seconds since load            dt      clamped frame delta
 *   vis      0→1 presence (smoothed)       pop     vis with an overshoot
 *   progress -1 (top of screen) … +1 (bottom) — how far through the viewport
 *   active   true while the actor is on screen
 */
export function Actor({ name, size = 300, delay = 0, children }) {
  const outer = useRef();
  const rect = useRef(null);
  const ctx = useMemo(() => ({ t: 0, dt: 0.016, vis: 0, pop: 0, progress: 0, active: false }), []);

  useFrame((state, delta) => {
    const g = outer.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const el = getAnchor(name);

    let target = 0;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        rect.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
        if (r.bottom > 0 && r.top < vh && state.clock.elapsedTime > delay) target = 1;
      }
    }

    ctx.vis = damp(ctx.vis, target, target ? 3.2 : 6, dt);
    if (ctx.vis < 0.004 && target === 0) {
      ctx.vis = 0;
      ctx.active = false;
      g.visible = false;
      return;
    }
    const rc = rect.current;
    if (!rc) return;

    ctx.active = true;
    ctx.t = state.clock.elapsedTime;
    ctx.dt = dt;
    ctx.pop = easeOutBack(clamp(ctx.vis, 0, 1));
    ctx.progress = clamp((rc.cy - vh / 2) / (vh / 2 + rc.h / 2), -1.3, 1.3);

    g.visible = true;
    g.position.set(rc.cx - vw / 2, -(rc.cy - vh / 2), 0);
    g.scale.setScalar(Math.max(0.0001, (rc.w / size) * ctx.pop));
  });

  return (
    <group ref={outer} visible={false}>
      <ActorCtx.Provider value={ctx}>{children}</ActorCtx.Provider>
    </group>
  );
}

/* ── radial glow sprite ─────────────────────────────────────────────────── */
let glowTex;
function getGlowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

export function Glow({ size = 400, opacity = 0.35, z = -80, tone = 'accent' }) {
  const mat = useRef();
  const map = useMemo(getGlowTexture, []);
  useFrame(() => {
    if (mat.current) mat.current.color.copy(colors[tone]);
  });
  return (
    <sprite scale={[size, size, 1]} position={[0, 0, z]}>
      <spriteMaterial ref={mat} map={map} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
}

/* ── expanding "sonar" rings that always face the camera ────────────────── */
export function Sonar({ radius = 100, count = 3, period = 3, z = -30, tone = 'accent', max = 1.7, opacity = 0.5 }) {
  const meshes = useRef([]);
  const ctx = useActor();
  useFrame(() => {
    if (!ctx.active) return;
    for (let i = 0; i < count; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      const k = (ctx.t / period + i / count) % 1;
      m.scale.setScalar(radius * (0.55 + k * (max - 0.55)));
      m.material.opacity = Math.pow(1 - k, 1.6) * opacity;
      m.material.color.copy(colors[tone]);
    }
  });
  return (
    <group position={[0, 0, z]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => (meshes.current[i] = el)}>
          <ringGeometry args={[0.97, 1, 96]} />
          <meshBasicMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ── lights ─────────────────────────────────────────────────────────────── */
export function Lights() {
  const rim = useRef();
  const fill = useRef();
  useFrame(() => {
    rim.current?.color.copy(colors.accent);
    fill.current?.color.copy(colors.soft);
  });
  return (
    <>
      <ambientLight intensity={0.9} color="#b8c4dc" />
      <directionalLight position={[260, 420, 700]} intensity={2.4} color="#e6efff" />
      <directionalLight ref={rim} position={[-500, -120, 260]} intensity={2.2} />
      <pointLight ref={fill} position={[-220, 220, 420]} intensity={2.4} decay={0} />
    </>
  );
}

/* keep the perspective camera so that 1 world unit = 1 css px at z = 0 */
export function useCameraSetup() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useMemo(() => {
    camera.position.set(0, 0, CAM_Z);
    camera.fov = (2 * Math.atan(size.height / 2 / CAM_Z) * 180) / Math.PI;
    camera.aspect = size.width / size.height;
    camera.near = 10;
    camera.far = 4000;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
}
