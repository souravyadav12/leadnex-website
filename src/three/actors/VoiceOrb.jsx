import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Actor, useActor, Glow, colors, pointer, scrollState, clamp } from '../common';

/* DEMO — the agent's voice.
   A noise-displaced orb that "speaks" (amplitude follows a speech-like
   envelope and kicks up when you scroll fast), a ring of voice bars around it,
   and a wire shell. It sits next to "Experience the AI in action". */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = /* glsl */ `
uniform float uTime; uniform float uAmp;
varying vec3 vN; varying vec3 vV; varying float vD;
${NOISE}
void main(){
  float n  = snoise(position * 1.35 + vec3(0.0, uTime * 0.7, uTime * 0.3));
  float n2 = snoise(position * 3.2 - vec3(uTime * 0.9));
  float d = (n * 0.55 + n2 * 0.18) * uAmp;
  vec3 p = position + normal * d * 0.6;
  vD = d;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform vec3 uA; uniform vec3 uB;
varying vec3 vN; varying vec3 vV; varying float vD;
void main(){
  float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.2);
  float k = clamp(f * 1.15 + vD * 1.1 + 0.1, 0.0, 1.0);
  vec3 col = mix(uB * 0.16, uA, k);
  col += uA * f * 0.55;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const BARS = 64;
const dummy = new THREE.Object3D();

function OrbBody() {
  const ctx = useActor();
  const group = useRef();
  const ring = useRef();
  const bars = useRef();
  const wire = useRef();
  const halo = useRef();
  const barMat = useRef();
  const amp = useRef(0.4);
  const orbMat = useRef();

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.4 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() } }),
    [],
  );

  useFrame(() => {
    if (!ctx.active) return;
    const { t, dt, pop, progress } = ctx;

    // speech-like envelope + scroll kick
    const speech = 0.5 + 0.5 * Math.sin(t * 1.9) * Math.sin(t * 0.73 + 1.3);
    const kick = clamp(Math.abs(scrollState.vel) / 2600, 0, 0.7);
    const target = 0.35 + speech * 0.55 + kick;
    amp.current += (target - amp.current) * (1 - Math.exp(-6 * dt));

    const u = orbMat.current.uniforms;
    u.uTime.value = t;
    u.uAmp.value = amp.current;
    u.uA.value.copy(colors.accent).lerp(colors.soft, 0.25);
    u.uB.value.copy(colors.a2);

    const g = group.current;
    g.rotation.y = t * 0.12 + progress * -1.1 + (1 - pop) * 2 + pointer.sx * 0.3;
    g.rotation.x = pointer.sy * -0.2;
    g.position.y = Math.sin(t * 1.0) * 6;

    ring.current.rotation.z = t * 0.18;
    wire.current.rotation.y = -t * 0.2;
    wire.current.rotation.x = t * 0.1;
    wire.current.material.color.copy(colors.soft);
    halo.current.material.color.copy(colors.accent);
    barMat.current.color.copy(colors.soft);

    // voice-bar ring
    for (let i = 0; i < BARS; i++) {
      const a = (i / BARS) * Math.PI * 2;
      const e = 0.5 + 0.5 * Math.sin(a * 5 + t * 4.2) * Math.sin(a * 11 - t * 2.7 + 1.4);
      const h = 6 + (0.25 + e) * amp.current * 52;
      dummy.position.set(Math.cos(a) * 112, 0, Math.sin(a) * 112);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      bars.current.setMatrixAt(i, dummy.matrix);
    }
    bars.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <Glow size={520} opacity={0.42} z={-100} />
      <group ref={group}>
        <mesh scale={64}>
          <sphereGeometry args={[1, 96, 64]} />
          <shaderMaterial ref={orbMat} uniforms={uniforms} vertexShader={VERT} fragmentShader={FRAG} />
        </mesh>
        <mesh ref={wire} scale={80}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial wireframe transparent opacity={0.2} toneMapped={false} />
        </mesh>
        <group rotation={[1.2, 0, 0.18]}>
          <group ref={ring}>
            <instancedMesh ref={bars} args={[null, null, BARS]} frustumCulled={false}>
              <boxGeometry args={[2.6, 1, 2.6]} />
              <meshBasicMaterial ref={barMat} toneMapped={false} />
            </instancedMesh>
          </group>
          <mesh ref={halo}>
            <torusGeometry args={[138, 0.6, 6, 120]} />
            <meshBasicMaterial transparent opacity={0.28} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function VoiceOrb() {
  return (
    <Actor name="orb" size={300}>
      <OrbBody />
    </Actor>
  );
}
