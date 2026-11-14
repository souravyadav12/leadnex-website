import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { colors, pointer, scrollState, syncColors, clamp } from './common';

/* ─────────────────────────────────────────────────────────────────────────
   Scroll-driven 3D BACKGROUND (home page only).

   One field of particles that re-forms itself as you scroll down the page, one
   shape per chapter of the AI-calling story:
     0  hero         voice terrain      — a field of waves, the agent's voice
     1  demo         call signal        — rings rippling out of a connected call
     2  how it works pipeline           — a helix of leads flowing through stages
     3  features      global network    — a sphere of nodes: calls worldwide
     4  security       lattice           — an encrypted grid
     5  pricing → end  calm orbit        — a quiet disc, everything resolved
   The morph is computed on the GPU (six position attributes blended by the
   scroll "stage"), so it is a single draw call.
   ───────────────────────────────────────────────────────────────────────── */

const STAGE_BY_ID = {
  hero: 0,
  'ai-call-3d': 1,
  demo: 1,
  'how-it-works': 2,
  features: 3,
  testimonials: 3,
  compliance: 4,
  pricing: 5,
  faq: 5,
  contact: 5,
};

const rnd = (i, k) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function buildShapes(N) {
  const S = Array.from({ length: 6 }, () => new Float32Array(N * 3));
  const set = (s, i, x, y, z) => {
    S[s][i * 3] = x;
    S[s][i * 3 + 1] = y;
    S[s][i * 3 + 2] = z;
  };
  const cols = Math.round(Math.sqrt(N * 1.6));
  const rows = Math.ceil(N / cols);

  // rings: radius ~ sqrt of rank so density is even
  for (let i = 0; i < N; i++) {
    // 0 — voice terrain (a wide sheet, waves added in the shader)
    const cx = i % cols;
    const cz = Math.floor(i / cols);
    set(0, i, (cx / cols - 0.5) * 46 + (rnd(i, 1) - 0.5) * 0.3, -5.6, 8 - (cz / rows) * 40 + (rnd(i, 2) - 0.5) * 0.3);

    // 1 — call-signal rings, centred right of the text
    const ringN = 22;
    const k = 1 + Math.floor(Math.sqrt(rnd(i, 3)) * ringN);
    const a = rnd(i, 4) * Math.PI * 2;
    set(1, i, 6.5 + Math.cos(a) * k * 0.62, Math.sin(a) * k * 0.62, -4 + (rnd(i, 5) - 0.5) * 0.4);

    // 2 — helix of leads (3 strands)
    const t = i / N;
    const strand = i % 3;
    const ang = t * 46 + (strand * Math.PI * 2) / 3;
    const rad = 3.6 + 2.4 * Math.sin(t * 9) + (rnd(i, 6) - 0.5) * 0.9;
    set(2, i, 5 + Math.cos(ang) * rad, (t - 0.5) * 30, -6 + Math.sin(ang) * rad);

    // 3 — sphere of nodes (fibonacci)
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    const R = 7.5 + (rnd(i, 7) - 0.5) * 0.5;
    set(3, i, 5 + Math.cos(th) * r * R, y * R, -6 + Math.sin(th) * r * R);

    // 4 — lattice
    const side = Math.ceil(Math.cbrt(N));
    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side));
    const sp = 17 / side;
    set(4, i, 5 + (gx - side / 2) * sp, (gy - side / 2) * sp, -6 + (gz - side / 2) * sp);

    // 5 — calm spiral disc
    const arm = i % 3;
    const rr = Math.pow(rnd(i, 8), 0.7) * 16;
    const aa = rr * 0.55 + (arm * Math.PI * 2) / 3 + (rnd(i, 9) - 0.5) * 0.5;
    set(5, i, Math.cos(aa) * rr, Math.sin(aa) * rr * 0.28 - 1.5, -10 + Math.sin(aa) * rr * 0.9);
  }
  return S;
}

const VERT = /* glsl */ `
attribute vec3 aS1; attribute vec3 aS2; attribute vec3 aS3; attribute vec3 aS4; attribute vec3 aS5;
attribute float aSeed;
uniform float uStage; uniform float uTime; uniform float uSurge; uniform float uPx;
varying float vA; varying float vSeed;
vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
void main(){
  float w0 = max(0.0, 1.0 - abs(uStage - 0.0));
  float w1 = max(0.0, 1.0 - abs(uStage - 1.0));
  float w2 = max(0.0, 1.0 - abs(uStage - 2.0));
  float w3 = max(0.0, 1.0 - abs(uStage - 3.0));
  float w4 = max(0.0, 1.0 - abs(uStage - 4.0));
  float w5 = max(0.0, 1.0 - abs(uStage - 5.0));
  vec3 p = position*w0 + aS1*w1 + aS2*w2 + aS3*w3 + aS4*w4 + aS5*w5;

  float surge = 1.0 + uSurge * 1.6;
  // voice terrain: travelling waves
  p.y += w0 * (sin(p.x*0.55 + uTime*1.3)*1.1 + sin(p.z*0.45 - uTime*0.9)*0.8 + sin((p.x+p.z)*0.3 + uTime*0.6)*0.7) * surge;
  // call rings: ripple outward
  float rr = length(p.xy - vec2(6.5, 0.0));
  p.z += w1 * sin(rr*0.9 - uTime*2.4) * 0.9 * surge;
  // lattice shimmer
  p += w4 * 0.12 * vec3(sin(uTime*1.7 + aSeed*30.0), cos(uTime*1.3 + aSeed*20.0), sin(uTime*1.1 + aSeed*10.0));

  // slow spin about each shape's own centre
  vec3 c = vec3(5.0, 0.0, -6.0) * (w2 + w3 + w4) + vec3(0.0, 0.0, -10.0) * w5;
  float spin = uTime * (0.22*w2 + 0.1*w3 + 0.05*w4 + 0.05*w5) + uSurge * 0.6 * (w2 + w3 + w4 + w5);
  p = c + rotY(p - c, spin);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = -mv.z;
  gl_PointSize = uPx * (1.1 + aSeed * 1.9) * (24.0 / d);
  vA = (0.3 + 0.7 * aSeed) * smoothstep(70.0, 10.0, d) * smoothstep(1.0, 4.0, d);
  vSeed = aSeed;
}`;

const FRAG = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform float uOpacity;
varying float vA; varying float vSeed;
void main(){
  vec2 q = gl_PointCoord - 0.5;
  float d = length(q);
  float soft = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uA, uB, step(0.72, vSeed));
  gl_FragColor = vec4(col, soft * vA * uOpacity);
  #include <colorspace_fragment>
}`;

function Field({ small }) {
  const N = small ? 2400 : 5200;
  const mat = useRef();
  const { gl, camera } = useThree();
  const geo = useMemo(() => {
    const S = buildShapes(N);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(S[0], 3));
    for (let k = 1; k < 6; k++) g.setAttribute(`aS${k}`, new THREE.BufferAttribute(S[k], 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(Float32Array.from({ length: N }, (_, i) => rnd(i, 11)), 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 200);
    return g;
  }, [N]);

  const uniforms = useMemo(
    () => ({
      uStage: { value: 0 },
      uTime: { value: 0 },
      uSurge: { value: 0 },
      uPx: { value: 2 },
      uOpacity: { value: 0.5 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
    }),
    [],
  );

  // chapter anchors: document-space centre of each section, refreshed as layout settles
  const anchors = useRef([]);
  const refresh = () => {
    const list = [];
    document.querySelectorAll('main > section[id]').forEach((el) => {
      const st = STAGE_BY_ID[el.id];
      if (st === undefined) return;
      const r = el.getBoundingClientRect();
      list.push({ y: r.top + window.scrollY + r.height / 2, stage: st });
    });
    list.sort((a, b) => a.y - b.y);
    anchors.current = list;
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 1200);
    window.addEventListener('resize', refresh);
    return () => {
      clearInterval(id);
      window.removeEventListener('resize', refresh);
    };
  }, []);

  const stage = useRef(0);
  const lastY = useRef(0);
  const lastVel = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.25); // generous cap so the morph still settles on slow devices
    const t = state.clock.elapsedTime;
    const y = window.scrollY + window.innerHeight * 0.5;

    // scroll → stage (hold near each section's centre, ease between sections)
    const a = anchors.current;
    let target = 0;
    if (a.length) {
      if (y <= a[0].y) target = a[0].stage;
      else if (y >= a[a.length - 1].y) target = a[a.length - 1].stage;
      else {
        for (let i = 0; i < a.length - 1; i++) {
          if (y >= a[i].y && y <= a[i + 1].y) {
            const k = (y - a[i].y) / (a[i + 1].y - a[i].y);
            const e = THREE.MathUtils.smoothstep(k, 0.2, 0.8);
            target = a[i].stage + (a[i + 1].stage - a[i].stage) * e;
            break;
          }
        }
      }
    }
    stage.current += (target - stage.current) * (1 - Math.exp(-4 * dt));

    const vel = clamp(Math.abs(scrollState.vel) / 2800, 0, 1);
    lastVel.current += (vel - lastVel.current) * (1 - Math.exp(-5 * dt));

    const u = mat.current?.uniforms;
    if (!u) return;
    u.uStage.value = stage.current;
    u.uTime.value = t;
    u.uSurge.value = lastVel.current;
    u.uPx.value = gl.getPixelRatio() * (small ? 1.6 : 1.9);
    u.uA.value.copy(colors.accent);
    u.uB.value.copy(colors.soft);

    // gentle camera drift + pointer parallax, and a slow tilt through the page
    camera.position.x += (pointer.sx * 1.2 - camera.position.x) * (1 - Math.exp(-3 * dt));
    camera.position.y += (1.6 - pointer.sy * 0.8 - camera.position.y) * (1 - Math.exp(-3 * dt));
    camera.lookAt(0, -0.5, 0);
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ThemeSync() {
  useEffect(() => {
    syncColors();
    const id = setInterval(syncColors, 400);
    return () => clearInterval(id);
  }, []);
  return null;
}

export default function Background3D({ small = false }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-[5]" aria-hidden="true">
      <Canvas
        dpr={[1, small ? 1.25 : 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.6, 14], fov: 52, near: 0.5, far: 200 }}
        style={{ pointerEvents: 'none' }}
      >
        <ThemeSync />
        <Field small={small} />
      </Canvas>
    </div>
  );
}
