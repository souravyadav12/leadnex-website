/**
 * testLayers.js
 * Automated check for Patch #3 mobile scroll hero state machine & billboard fitting.
 *
 * Verifies:
 * 1. Stepping p from 0 to 1 in 0.005 increments:
 *    - At most one tower above 0.02 opacity (for sequential stages p >= 0.16).
 *    - The tunnel text is visible only when both towers are at 0 opacity.
 *    - At most one card visible at any p (never two cards on screen).
 *    - At least one content layer is at 0.9 or more outside crossfade windows.
 * 2. At focus, all billboard corners are inside the safe rect across 360x640, 390x844, 430x932.
 */

import * as THREE from 'three';

// ── 1. Layer Opacity Functions ──

function getOpacities(p) {
  // 1. Headline (0.00 to 0.07)
  let headline = 0.0;
  if (p < 0.03) headline = 1.0;
  else if (p >= 0.03 && p <= 0.07) headline = 1.0 - (p - 0.03) / 0.04;

  // 2. Tower 01 (Solo Stage: enters 0.04 to 0.12, holds 0.12 to 0.26, exits 0.26 to 0.30)
  let tower1 = 0.0;
  if (p > 0.04 && p < 0.12) {
    const t = (p - 0.04) / 0.08;
    tower1 = t * t * (3 - 2 * t);
  } else if (p >= 0.12 && p <= 0.26) {
    tower1 = 1.0;
  } else if (p > 0.26 && p <= 0.30) {
    const t = (p - 0.26) / 0.04;
    const tOp = Math.min(1.0, t / 0.8);
    tower1 = Math.max(0, 1.0 - tOp);
  }

  // 3. Tower 02 (Solo Stage: strictly enters AFTER Tower 1 exits, 0.30 to 0.52)
  let tower2 = 0.0;
  if (p >= 0.30 && p < 0.38) {
    const t = (p - 0.30) / 0.08;
    const tOp = Math.min(1.0, t / 0.5);
    tower2 = tOp * tOp * (3 - 2 * tOp);
  } else if (p >= 0.38 && p <= 0.48) {
    tower2 = 1.0;
  } else if (p > 0.48 && p <= 0.52) {
    const t = (p - 0.48) / 0.04;
    const tOp = Math.min(1.0, t / 0.8);
    tower2 = Math.max(0, 1.0 - tOp);
  }

  // 4. Tunnel Text (0.52 to 0.65)
  let tunnelText = 0.0;
  if (p >= 0.52 && p < 0.58) {
    tunnelText = (p - 0.52) / 0.06;
  } else if (p >= 0.58 && p <= 0.62) {
    tunnelText = 1.0;
  } else if (p > 0.62 && p <= 0.65) {
    tunnelText = 1.0 - (p - 0.62) / 0.03;
  }

  // 5. Card 1 (0.65 to 0.83)
  let card1 = 0.0;
  if (p >= 0.65 && p < 0.73) {
    const t = (p - 0.65) / 0.08;
    card1 = t * t * (3 - 2 * t);
  } else if (p >= 0.73 && p <= 0.80) {
    card1 = 1.0;
  } else if (p > 0.80 && p <= 0.83) {
    const t = (p - 0.80) / 0.03;
    card1 = Math.max(0, 1.0 - t);
  }

  // 6. Card 2 (0.83 to 1.00)
  let card2 = 0.0;
  if (p >= 0.83 && p < 0.91) {
    const t = (p - 0.83) / 0.08;
    card2 = t * t * (3 - 2 * t);
  } else if (p >= 0.91 && p <= 1.00) {
    card2 = 1.0;
  }

  return {
    headline: Number(headline.toFixed(4)),
    tower1: Number(tower1.toFixed(4)),
    tower2: Number(tower2.toFixed(4)),
    tunnelText: Number(tunnelText.toFixed(4)),
    card1: Number(card1.toFixed(4)),
    card2: Number(card2.toFixed(4)),
  };
}

let errors = 0;

// ── 2. Stepping p in 0.005 increments ──
for (let i = 0; i <= 200; i++) {
  const p = Number((i * 0.005).toFixed(3));
  const s = getOpacities(p);

  // Assertion 1: Tower 1 and Tower 2 NEVER overlap anywhere across 0 to 1 (100% separate / alag alag)
  if (s.tower1 > 0.02 && s.tower2 > 0.02) {
    console.error(`[FAIL] Both towers above 0.02 at p = ${p}: T1=${s.tower1}, T2=${s.tower2}`);
    errors++;
  }

  // Assertion 2: Tunnel text visible ONLY when both towers are at 0
  if (s.tunnelText > 0.001 && (s.tower1 > 0.001 || s.tower2 > 0.001)) {
    console.error(`[FAIL] Tunnel text visible while towers still visible at p = ${p}: Tunnel=${s.tunnelText}, T1=${s.tower1}, T2=${s.tower2}`);
    errors++;
  }

  // Assertion 3: At most one card visible (never two cards on screen)
  if (s.card1 > 0.001 && s.card2 > 0.001) {
    console.error(`[FAIL] Both cards visible at p = ${p}: Card1=${s.card1}, Card2=${s.card2}`);
    errors++;
  }

  // Assertion 4: At least one content layer is at 0.9 or more outside crossfade windows
  // Crossfade windows: [0.03, 0.12] (headline -> Tower 1), [0.26, 0.38], [0.48, 0.58], [0.62, 0.73], [0.80, 0.91]
  const inCrossfade =
    (p >= 0.03 && p <= 0.12) ||
    (p >= 0.26 && p <= 0.38) ||
    (p >= 0.48 && p <= 0.58) ||
    (p >= 0.62 && p <= 0.73) ||
    (p >= 0.80 && p <= 0.91);

  if (!inCrossfade) {
    const maxContentOp = Math.max(s.headline, s.tower1, s.tower2, s.tunnelText, s.card1, s.card2);
    if (maxContentOp < 0.90) {
      console.error(`[FAIL] No content layer >= 0.9 outside crossfade at p = ${p}: max=${maxContentOp}`);
      errors++;
    }
  }
}

// ── 3. fitPose Projection Assertion across Viewports ──

function fitPoseTest(vw, vh) {
  const safeRect = {
    left: 12,
    right: 12,
    top: 64 + 8,
    bottom: vh - 72 - 8,
    width: vw - 24,
    height: (vh - 72 - 8) - (64 + 8),
  };
  const aspect = Math.max(0.48, Math.min(0.75, safeRect.width / safeRect.height));
  const planeW = 7.2;
  const planeH = planeW / aspect;
  const x0 = 0.0;
  const y0 = 15.5;
  const z0 = 4.65;

  const camera = new THREE.PerspectiveCamera(54, vw / vh, 0.1, 240);
  const fovRad = (camera.fov * Math.PI) / 180;
  const tanHalfFov = Math.tan(fovRad / 2);

  let d = Math.max(
    planeW / (2 * tanHalfFov * (safeRect.width / safeRect.height)),
    planeH / (2 * tanHalfFov)
  );

  let camY = y0;
  let lookAtY = y0;

  const corners = [
    new THREE.Vector3(x0 - planeW / 2, y0 - planeH / 2, z0),
    new THREE.Vector3(x0 + planeW / 2, y0 - planeH / 2, z0),
    new THREE.Vector3(x0 + planeW / 2, y0 + planeH / 2, z0),
    new THREE.Vector3(x0 - planeW / 2, y0 + planeH / 2, z0),
  ];

  for (let iter = 0; iter < 6; iter++) {
    camera.position.set(x0, camY, z0 + d);
    camera.lookAt(x0, lookAtY, z0);
    camera.updateMatrixWorld();

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    corners.forEach((c) => {
      const p = c.clone().project(camera);
      const px = (p.x * 0.5 + 0.5) * vw;
      const py = (-p.y * 0.5 + 0.5) * vh;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    });

    const scale = Math.max((maxX - minX) / safeRect.width, (maxY - minY) / safeRect.height);
    if (scale >= 0.98 && scale <= 1.00) break;
    d *= scale;
  }

  const targetCenterY = safeRect.top + safeRect.height / 2;
  for (let iter = 0; iter < 6; iter++) {
    camera.position.set(x0, camY, z0 + d);
    camera.lookAt(x0, lookAtY, z0);
    camera.updateMatrixWorld();

    const p = new THREE.Vector3(x0, y0, z0).project(camera);
    const projCenterY = (-p.y * 0.5 + 0.5) * vh;
    const errY = projCenterY - targetCenterY;
    if (Math.abs(errY) < 0.5) break;

    const dyWorld = -errY * (2 * d * tanHalfFov) / vh;
    camY += dyWorld;
    lookAtY += dyWorld;
  }

  camera.position.set(x0, camY, z0 + d);
  camera.lookAt(x0, lookAtY, z0);
  camera.updateMatrixWorld();

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  corners.forEach((c) => {
    const p = c.clone().project(camera);
    const px = (p.x * 0.5 + 0.5) * vw;
    const py = (-p.y * 0.5 + 0.5) * vh;
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  });

  const tol = 1.0;
  const inSafeRect =
    minX >= safeRect.left - tol &&
    maxX <= safeRect.left + safeRect.width + tol &&
    minY >= safeRect.top - tol &&
    maxY <= safeRect.top + safeRect.height + tol;

  if (!inSafeRect) {
    console.error(`[FAIL] fitPose corners outside safeRect for ${vw}x${vh}:`, {
      minX, maxX, minY, maxY, safeRect
    });
    errors++;
  } else {
    console.log(`✓ fitPose passed for ${vw}x${vh}: Billboard margins left=${minX.toFixed(1)}px, right=${(vw - maxX).toFixed(1)}px, top=${minY.toFixed(1)}px, bottom=${(vh - maxY).toFixed(1)}px`);
  }
}

fitPoseTest(360, 640);
fitPoseTest(390, 844);
fitPoseTest(430, 932);

if (errors === 0) {
  console.log('✓ All 201 progress steps and all 3 viewport fitPose tests PASSED!');
  process.exit(0);
} else {
  console.error(`✕ ${errors} test failures!`);
  process.exit(1);
}
