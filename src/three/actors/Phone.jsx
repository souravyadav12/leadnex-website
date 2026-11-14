import { useMemo, useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Actor, useActor, Glow, Sonar, colors, cssHex, pointer } from '../common';
import { hero } from '../../data/site';

extend({ RoundedBoxGeometry });

/* HERO — an incoming AI call.
   A phone whose screen is the live call (caller, timer, voice waveform,
   transcript, qualification status), with sonar rings "ringing" out from it and
   a few lead dots orbiting. It flies in on load. */

const W = 150;
const H = 300;
const D = 15;
const CW = 300;
const CH = 600;
const STATUS = ['Connecting', 'Qualifying', 'Qualifying', 'Booking', 'Booked'];
const HANDSET =
  'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
let handsetPath;

function wrap(c, text, x, y, maxW, lh, maxLines = 3) {
  const words = text.split(' ');
  let line = '';
  let n = 0;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (c.measureText(test).width > maxW && line) {
      c.fillText(line, x, y + n * lh);
      line = w;
      n++;
      if (n >= maxLines) return;
    } else line = test;
  }
  if (line) c.fillText(line, x, y + n * lh);
}

function drawScreen(c, t) {
  const acc = cssHex(colors.accent);
  const soft = cssHex(colors.soft);
  const ok = cssHex(colors.ok);
  const a = colors.accent;
  const accA = (al) => `${a.getStyle().replace('rgb(', 'rgba(').replace(')', `,${al})`)}`;

  c.clearRect(0, 0, CW, CH);
  c.save();
  c.beginPath();
  c.roundRect(0, 0, CW, CH, 34);
  c.clip();

  const bg = c.createLinearGradient(0, 0, 0, CH);
  bg.addColorStop(0, '#0c1628');
  bg.addColorStop(1, '#06080d');
  c.fillStyle = bg;
  c.fillRect(0, 0, CW, CH);
  const glow = c.createRadialGradient(150, 170, 0, 150, 170, 240);
  glow.addColorStop(0, accA(0.3));
  glow.addColorStop(1, accA(0));
  c.fillStyle = glow;
  c.fillRect(0, 0, CW, CH);

  // status bar
  c.fillStyle = 'rgba(255,255,255,0.9)';
  c.font = '600 15px "Inter Variable", system-ui, sans-serif';
  c.textAlign = 'left';
  c.fillText('9:41', 30, 40);
  c.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 4; i++) c.fillRect(236 + i * 7, 36 - i * 3, 4, 4 + i * 3);

  // live tag
  c.textAlign = 'center';
  c.font = '500 10.5px "JetBrains Mono Variable", monospace';
  c.fillStyle = soft;
  c.fillText('●  AI AGENT  ·  LIVE', 150, 84);

  // avatar + pulse
  const pulse = (t * 0.9) % 1;
  c.strokeStyle = accA(0.5 * (1 - pulse));
  c.lineWidth = 2;
  c.beginPath();
  c.arc(150, 172, 46 + pulse * 26, 0, Math.PI * 2);
  c.stroke();
  const ag = c.createLinearGradient(100, 120, 200, 220);
  ag.addColorStop(0, soft);
  ag.addColorStop(1, acc);
  c.fillStyle = ag;
  c.beginPath();
  c.arc(150, 172, 44, 0, Math.PI * 2);
  c.fill();
  handsetPath = handsetPath || new Path2D(HANDSET);
  c.save();
  c.translate(150 - 21, 172 - 21);
  c.scale(1.75, 1.75);
  c.strokeStyle = '#fff';
  c.lineWidth = 2;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke(handsetPath);
  c.restore();

  // caller
  c.fillStyle = '#fff';
  c.font = '600 22px "Inter Variable", system-ui, sans-serif';
  c.fillText(hero.dashboard.call.name, 150, 258);
  c.fillStyle = 'rgba(255,255,255,0.5)';
  c.font = '500 11px "JetBrains Mono Variable", monospace';
  c.fillText(hero.dashboard.call.meta, 150, 280);
  const sec = Math.floor(t) % 600;
  c.fillStyle = soft;
  c.font = '600 14px "JetBrains Mono Variable", monospace';
  c.fillText(`${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`, 150, 306);

  // voice waveform
  const bars = 30;
  for (let i = 0; i < bars; i++) {
    const env = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.4 + i * 0.55) * Math.sin(t * 0.9 + i * 0.21));
    const centre = 1 - Math.abs(i - bars / 2) / (bars / 2);
    const h = 6 + env * (14 + centre * 26);
    c.fillStyle = i % 5 === 0 ? soft : acc;
    c.beginPath();
    c.roundRect(30 + i * 8.1, 352 - h / 2, 4, h, 2);
    c.fill();
  }

  // transcript
  const lines = hero.transcript;
  const slot = 2.6;
  const idx = Math.floor(t / slot) % lines.length;
  const line = lines[idx];
  const typed = Math.min(line.text.length, Math.floor(((t % slot) / slot) * line.text.length * 2.2));
  c.fillStyle = 'rgba(255,255,255,0.06)';
  c.strokeStyle = 'rgba(255,255,255,0.1)';
  c.lineWidth = 1;
  c.beginPath();
  c.roundRect(24, 396, 252, 96, 16);
  c.fill();
  c.stroke();
  const isAi = line.role === 'ai';
  c.fillStyle = isAi ? accA(0.28) : 'rgba(255,255,255,0.14)';
  c.beginPath();
  c.roundRect(36, 408, isAi ? 26 : 38, 16, 5);
  c.fill();
  c.fillStyle = isAi ? soft : 'rgba(255,255,255,0.75)';
  c.font = '600 9px "JetBrains Mono Variable", monospace';
  c.textAlign = 'center';
  c.fillText(isAi ? 'AI' : 'USER', isAi ? 49 : 55, 419.5);
  c.textAlign = 'left';
  c.fillStyle = 'rgba(255,255,255,0.88)';
  c.font = '500 13px "Inter Variable", system-ui, sans-serif';
  wrap(c, line.text.slice(0, typed), 36, 444, 228, 18, 3);

  // status chip
  const st = STATUS[idx % STATUS.length];
  const done = st === 'Booked';
  c.font = '600 11px "JetBrains Mono Variable", monospace';
  const tw = c.measureText(st).width + 26;
  c.fillStyle = done ? 'rgba(125,216,201,0.16)' : accA(0.18);
  c.beginPath();
  c.roundRect(150 - tw / 2, 504, tw, 24, 12);
  c.fill();
  c.fillStyle = done ? ok : soft;
  c.textAlign = 'center';
  c.fillText(st, 150, 520);

  // call buttons
  c.fillStyle = 'rgba(255,255,255,0.1)';
  c.beginPath();
  c.arc(98, 562, 17, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#e5686a';
  c.beginPath();
  c.arc(202, 562, 17, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#fff';
  c.fillRect(194, 560, 16, 4);
  c.fillRect(92, 552, 12, 16);

  // glass sheen
  const sh = c.createLinearGradient(0, 0, CW, CH * 0.55);
  sh.addColorStop(0, 'rgba(255,255,255,0.10)');
  sh.addColorStop(0.5, 'rgba(255,255,255,0.02)');
  sh.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = sh;
  c.fillRect(0, 0, CW, CH);
  c.restore();
}

function PhoneBody() {
  const ctx = useActor();
  const group = useRef();
  const bodyMat = useRef();
  const orbit = useRef();
  const leads = useRef([]);
  const acc = useRef(0);

  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = CW;
    canvas.height = CH;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return { canvas, tex };
  }, []);
  const g2d = useMemo(() => canvas.getContext('2d'), [canvas]);

  useFrame(() => {
    if (!ctx.active) return;
    const { t, dt, pop, progress } = ctx;

    const g = group.current;
    g.rotation.y = -0.46 + Math.sin(t * 0.55) * 0.09 + (1 - pop) * -2.4 + progress * -0.55 + pointer.sx * 0.32;
    g.rotation.x = 0.1 + Math.sin(t * 0.7) * 0.03 - pointer.sy * 0.14;
    g.rotation.z = 0.07 + Math.sin(t * 0.8) * 0.02;
    g.position.y = Math.sin(t * 1.1) * 8;

    bodyMat.current.emissive.copy(colors.accent).multiplyScalar(0.05);

    // lead dots orbiting the phone
    orbit.current.rotation.y = t * 0.25;
    leads.current.forEach((m, i) => {
      if (!m) return;
      const a = t * (0.55 + i * 0.07) + (i / 5) * Math.PI * 2;
      m.position.set(Math.cos(a) * 168, 0, Math.sin(a) * 168);
      m.material.color.copy(i % 2 ? colors.ok : colors.soft);
      const near = (Math.sin(a) + 1) / 2; // closer to the camera = bigger
      m.scale.setScalar(4 + near * 3);
    });

    acc.current += dt;
    if (acc.current > 1 / 15) {
      acc.current = 0;
      drawScreen(g2d, t);
      tex.needsUpdate = true;
    }
  });

  return (
    <>
      <Glow size={560} opacity={0.4} z={-120} />
      <Sonar radius={118} count={3} period={3.4} />
      <group ref={group}>
        {/* body */}
        <mesh>
          <roundedBoxGeometry args={[W, H, D, 5, 24]} />
          <meshStandardMaterial ref={bodyMat} color="#121a29" metalness={0.65} roughness={0.32} />
        </mesh>
        {/* screen */}
        <mesh position={[0, 0, D / 2 + 0.6]}>
          <planeGeometry args={[W - 12, H - 12]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
        {/* camera pill */}
        <mesh position={[0, H / 2 - 17, D / 2 + 1.2]}>
          <capsuleGeometry args={[4.5, 16, 4, 12]} />
          <meshBasicMaterial color="#05070b" />
        </mesh>
        {/* orbit of leads, tilted */}
        <group rotation={[1.15, 0, 0.32]}>
          <mesh>
            <torusGeometry args={[168, 0.5, 6, 120]} />
            <meshBasicMaterial color={colors.accent} transparent opacity={0.22} toneMapped={false} />
          </mesh>
          <group ref={orbit}>
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh key={i} ref={(el) => (leads.current[i] = el)}>
                <sphereGeometry args={[1, 16, 12]} />
                <meshBasicMaterial toneMapped={false} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </>
  );
}

export default function Phone() {
  return (
    <Actor name="phone" size={230} delay={1.9}>
      <PhoneBody />
    </Actor>
  );
}
