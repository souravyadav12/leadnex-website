import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Lights, anyAnchorOnScreen, pointer, scrollState, syncColors, useCameraSetup } from './common';
import Phone from './actors/Phone';
import VoiceOrb from './actors/VoiceOrb';
import Funnel from './actors/Funnel';
import Globe from './actors/Globe';
import Shield from './actors/Shield';

/** Runs the render loop by hand: nothing is drawn while no 3D anchor is on screen. */
function Driver() {
  const advance = useThree((s) => s.advance);
  useCameraSetup();

  useEffect(() => {
    syncColors();
    let raf = 0;
    let last = performance.now();
    let lastY = window.scrollY;
    let themeT = 0;
    let wasOn = true;

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (dt <= 0) return;

      const y = window.scrollY;
      scrollState.vel += ((y - lastY) / dt - scrollState.vel) * Math.min(1, dt * 8);
      lastY = y;
      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 4);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 4);

      themeT += dt;
      if (themeT > 0.4) {
        themeT = 0;
        syncColors();
      }

      const on = anyAnchorOnScreen();
      if (on || wasOn) advance(now / 1000);
      wasOn = on;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [advance]);

  return null;
}

export default function Scene3D() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[45]" aria-hidden="true">
      <Canvas
        frameloop="never"
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1200], fov: 40, near: 10, far: 4000 }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Driver />
        <Lights />
        <Phone />
        <VoiceOrb />
        <Funnel />
        <Globe />
        <Shield />
      </Canvas>
    </div>
  );
}
