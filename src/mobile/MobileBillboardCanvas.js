/**
 * MobileBillboardCanvas.js
 * Dynamic-height billboard canvas textures computed top-to-bottom.
 *
 * Rules:
 * - Canvas width 512, height = Math.round(512 / A) (A clamped to [0.48, 0.75]).
 * - Layout computed top-to-bottom from actual canvas height (never hardcoded pixel assumptions).
 * - Reserve 56px at the bottom for corner brackets. No footer text lines.
 * - Tower 01: Header, title, 4 stat rows, spectrum fills remaining height.
 * - Tower 02: Header, title, radar (diameter = min(0.30*w, 0.20*h)), 4 region rows,
 *   security block as 2x2 grid where all 4 tags use the SAME computed font size (min 36px).
 * - Nothing overlaps or clips.
 */

function drawFittedText(ctx, text, x, y, maxW, baseSize, fontFace = '"JetBrains Mono", monospace') {
  let size = baseSize;
  ctx.font = `900 ${size}px ${fontFace}`;
  while (ctx.measureText(text).width > maxW && size > 24) {
    size -= 2;
    ctx.font = `900 ${size}px ${fontFace}`;
  }
  ctx.fillText(text, x, y);
  return size;
}

/**
 * renderTower01Billboard
 */
export function renderTower01Billboard(canvas, telemetry, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const bottomLimit = h - 56; // 56px reserved at bottom for corner brackets

  // 1. Dark Background & Cyber Grid
  ctx.fillStyle = '#030914';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(0, 240, 255, 0.10)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 44) {
    ctx.moveTo(x, 0); ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 44) {
    ctx.moveTo(0, y); ctx.lineTo(w, y);
  }
  ctx.stroke();

  // 2. Outer Border & White Corner Brackets
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14;
  const c = 52;
  ctx.beginPath();
  ctx.moveTo(16, 16 + c); ctx.lineTo(16, 16); ctx.lineTo(16 + c, 16);
  ctx.moveTo(w - 16 - c, 16); ctx.lineTo(w - 16, 16); ctx.lineTo(w - 16, 16 + c);
  ctx.moveTo(16, h - 16 - c); ctx.lineTo(16, h - 16); ctx.lineTo(16 + c, h - 16);
  ctx.moveTo(w - 16 - c, h - 16); ctx.lineTo(w - 16, h - 16); ctx.lineTo(w - 16, h - 16 - c);
  ctx.stroke();

  // 3. Header Row: "TOWER 01" + "LIVE"
  const headerY = 32;
  const headerH = 56;
  ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
  ctx.fillRect(32, headerY, w - 64, headerH);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, headerY, w - 64, headerH);

  ctx.font = '900 40px "JetBrains Mono", monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOWER 01', 48, headerY + headerH / 2);

  const pulse = 0.5 + 0.5 * Math.sin(t * 5.0);
  const labelText1 = 'LIVE';
  ctx.font = '900 40px "JetBrains Mono", monospace';
  const textW1 = ctx.measureText(labelText1).width;
  const textX1 = w - 48;
  const dotR1 = 10;
  const gap1 = 10;
  const dotX1 = textX1 - textW1 - gap1 - dotR1;
  const centerY1 = headerY + headerH / 2;

  ctx.fillStyle = pulse > 0.3 ? '#00ff88' : '#059669';
  ctx.beginPath();
  ctx.arc(dotX1, centerY1, dotR1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText(labelText1, textX1, centerY1);

  // 4. Title: "LEADNEX.AI"
  const titleY = headerY + headerH + 34;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  drawFittedText(ctx, 'LEADNEX.AI', w / 2, titleY, w - 60, 60, '"Inter", sans-serif');

  // Divider
  const divY = titleY + 36;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(40, divY); ctx.lineTo(w - 40, divY);
  ctx.stroke();

  // 5. 4 Stat Rows (CALLS, LATENCY, SLA, MOS)
  const stats = [
    { label: 'CALLS', val: telemetry?.activeCalls || '12,516' },
    { label: 'LATENCY', val: telemetry?.voiceLatency || '270ms' },
    { label: 'SLA', val: telemetry?.telephonySla || '99.99%' },
    { label: 'MOS', val: telemetry?.speechMos || '4.92' },
  ];

  const rowStartY = divY + 18;
  const rowH = 68;
  const rowGap = 12;

  stats.forEach((s, i) => {
    const ry = rowStartY + i * (rowH + rowGap);

    ctx.fillStyle = 'rgba(2, 12, 34, 0.95)';
    ctx.fillRect(36, ry, w - 72, rowH);
    ctx.strokeStyle = i === 0 ? '#00f0ff' : 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(36, ry, w - 72, rowH);

    ctx.font = '900 40px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.label, 52, ry + rowH / 2);

    ctx.fillStyle = i === 2 ? '#00ff88' : '#00f0ff';
    ctx.textAlign = 'right';
    drawFittedText(ctx, s.val, w - 52, ry + rowH / 2, 210, 42);
  });

  // 6. Spectrum Bars Region (Fills remaining height down to bottomLimit)
  const specLabelY = rowStartY + 4 * (rowH + rowGap) + 16;
  ctx.font = '900 38px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPECTRUM', w / 2, specLabelY);

  const specBottom = bottomLimit - 8;
  const specTop = specLabelY + 24;
  const maxBarH = Math.max(40, specBottom - specTop);

  const spectrum = telemetry?.spectrum || [];
  const barCount = 26;
  const barW = 12;
  const barGap = 5;
  const totalW = barCount * (barW + barGap) - barGap;
  const startX = (w - totalW) / 2;

  for (let i = 0; i < barCount; i++) {
    const pct = spectrum[i] || 40;
    const bh = Math.max(12, (pct / 100) * maxBarH);
    const bx = startX + i * (barW + barGap);
    const by = specBottom - bh;

    const grad = ctx.createLinearGradient(0, by, 0, by + bh);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#00f0ff');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, barW, bh);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, by - 3, barW, 3);
  }
}

/**
 * renderTower02Billboard
 */
export function renderTower02Billboard(canvas, telemetry, t = 0) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const bottomLimit = h - 56; // 56px reserved for bottom brackets

  // 1. Dark Base & Circuit Grid
  ctx.fillStyle = '#030914';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(2, 132, 199, 0.10)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x += 44) {
    ctx.moveTo(x, 0); ctx.lineTo(x, h);
  }
  for (let y = 0; y < h; y += 44) {
    ctx.moveTo(0, y); ctx.lineTo(w, y);
  }
  ctx.stroke();

  // 2. Thick Outer Border & Corners
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 14;
  const c = 52;
  ctx.beginPath();
  ctx.moveTo(16, 16 + c); ctx.lineTo(16, 16); ctx.lineTo(16 + c, 16);
  ctx.moveTo(w - 16 - c, 16); ctx.lineTo(w - 16, 16); ctx.lineTo(w - 16, 16 + c);
  ctx.moveTo(16, h - 16 - c); ctx.lineTo(16, h - 16); ctx.lineTo(16 + c, h - 16);
  ctx.moveTo(w - 16 - c, h - 16); ctx.lineTo(w - 16, h - 16); ctx.lineTo(w - 16, h - 16 - c);
  ctx.stroke();

  // 3. Header Row: "TOWER 02" + "EDGE"
  const headerY = 32;
  const headerH = 56;
  ctx.fillStyle = 'rgba(2, 132, 199, 0.22)';
  ctx.fillRect(32, headerY, w - 64, headerH);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, headerY, w - 64, headerH);

  ctx.font = '900 40px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOWER 02', 48, headerY + headerH / 2);

  const pulse = 0.5 + 0.5 * Math.sin(t * 5.0);
  const labelText2 = 'EDGE';
  ctx.font = '900 40px "JetBrains Mono", monospace';
  const textW2 = ctx.measureText(labelText2).width;
  const textX2 = w - 48;
  const dotR2 = 10;
  const gap2 = 10;
  const dotX2 = textX2 - textW2 - gap2 - dotR2;
  const centerY2 = headerY + headerH / 2;

  ctx.fillStyle = pulse > 0.3 ? '#00f0ff' : '#0284c7';
  ctx.beginPath();
  ctx.arc(dotX2, centerY2, dotR2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'right';
  ctx.fillText(labelText2, textX2, centerY2);

  // 4. Title: "GLOBAL GRID"
  const titleY = headerY + headerH + 34;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  drawFittedText(ctx, 'GLOBAL GRID', w / 2, titleY, w - 60, 56, '"Inter", sans-serif');

  // 5. Dynamic Sizing Computations
  // Radar diameter = min(0.30 * w, 0.20 * h)
  const radarD = Math.min(0.30 * w, 0.20 * h);
  const radarR = radarD / 2;
  const radarCY = titleY + 30 + radarR;

  // 6. Draw Radar
  const rX = w / 2;
  const rY = radarCY;

  ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
  ctx.lineWidth = 2;
  for (let r = radarR / 3; r <= radarR; r += radarR / 3) {
    ctx.beginPath();
    ctx.arc(rX, rY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(rX - radarR, rY); ctx.lineTo(rX + radarR, rY);
  ctx.moveTo(rX, rY - radarR); ctx.lineTo(rX, rY + radarR);
  ctx.stroke();

  const radarAngle = telemetry?.radarAngle ?? (t * 2.5);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(rX, rY);
  ctx.arc(rX, rY, radarR, radarAngle - 0.45, radarAngle);
  ctx.closePath();
  const rGrad = ctx.createRadialGradient(rX, rY, 0, rX, rY, radarR);
  rGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
  rGrad.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
  ctx.fillStyle = rGrad;
  ctx.fill();

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rX, rY);
  ctx.lineTo(rX + Math.cos(radarAngle) * radarR, rY + Math.sin(radarAngle) * radarR);
  ctx.stroke();
  ctx.restore();

  // Radar pinging nodes
  const nodes = [
    { x: rX - radarR * 0.5, y: rY - radarR * 0.35 },
    { x: rX + radarR * 0.45, y: rY - radarR * 0.28 },
    { x: rX + radarR * 0.3, y: rY + radarR * 0.5 },
    { x: rX - radarR * 0.4, y: rY + radarR * 0.42 },
  ];
  nodes.forEach((n) => {
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 7. 4 Region Rows
  const regions = telemetry?.regions || [
    { name: 'US-E', ping: '11ms' },
    { name: 'US-W', ping: '14ms' },
    { name: 'EU-C', ping: '22ms' },
    { name: 'AP-NE', ping: '40ms' },
  ];

  // Calculate remaining vertical budget
  const availableBelowRadar = bottomLimit - (radarCY + radarR + 16);
  // Security box needs ~160px minimum
  const secH = Math.min(180, Math.max(140, availableBelowRadar * 0.42));
  const regionAreaH = availableBelowRadar - secH - 16;
  const regGap = 8;
  const regH = Math.max(48, Math.floor((regionAreaH - 3 * regGap) / 4));
  const regStartY = radarCY + radarR + 16;

  regions.forEach((r, i) => {
    const ry = regStartY + i * (regH + regGap);

    ctx.fillStyle = 'rgba(2, 12, 34, 0.95)';
    ctx.fillRect(36, ry, w - 72, regH);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(36, ry, w - 72, regH);

    ctx.font = '900 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.name, 52, ry + regH / 2);

    ctx.fillStyle = '#00f0ff';
    ctx.textAlign = 'right';
    drawFittedText(ctx, r.ping, w - 52, ry + regH / 2, 160, 38);
  });

  // 8. Security Box
  const secY = regStartY + 4 * (regH + regGap) + 10;
  const finalSecH = bottomLimit - secY - 6;

  ctx.fillStyle = 'rgba(2, 12, 34, 0.96)';
  ctx.fillRect(36, secY, w - 72, finalSecH);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(36, secY, w - 72, finalSecH);

  ctx.font = '900 36px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SECURITY', w / 2, secY + 28);

  const tags = ['SOC 2', 'HIPAA', 'SRTP', 'ZERO DATA'];
  const boxW = w - 72;
  const cellW = boxW / 2;
  const checkMark = '✓';

  // Compute common font size for 2x2 grid
  let chosenFontSize = 38;
  let useSingleColumn = false;

  for (let s = 40; s >= 34; s -= 1) {
    ctx.font = `900 ${s}px "JetBrains Mono", monospace`;
    const checkW = ctx.measureText(checkMark).width;
    const maxAvailable = cellW - checkW - 20; // cell width minus check width minus padding
    const widest = Math.max(...tags.map((t) => ctx.measureText(t).width));
    if (widest <= maxAvailable) {
      if (s >= 36) {
        chosenFontSize = s;
        break;
      }
    }
    if (s < 36) {
      // Below 36px on canvas: switch to a single column of 4 rows!
      useSingleColumn = true;
      break;
    }
  }

  if (useSingleColumn) {
    // Single column of 4 rows: cell width is boxW
    let sCol = 38;
    for (let s = 40; s >= 36; s -= 1) {
      ctx.font = `900 ${s}px "JetBrains Mono", monospace`;
      const checkW = ctx.measureText(checkMark).width;
      const maxAvailable = boxW - checkW - 48;
      const widest = Math.max(...tags.map((t) => ctx.measureText(t).width));
      if (widest <= maxAvailable) {
        sCol = s;
        break;
      }
    }
    ctx.font = `900 ${sCol}px "JetBrains Mono", monospace`;
    const availH = finalSecH - 42;
    const rowH = availH / 4;
    tags.forEach((tag, idx) => {
      const cy = secY + 42 + idx * rowH + rowH / 2;
      const rowX = 36 + 32;
      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(checkMark, rowX, cy);
      const checkW = ctx.measureText(checkMark).width;
      ctx.fillText(tag, rowX + checkW + 10, cy);
    });
  } else {
    // 2x2 grid: each tag lives in its own cell
    ctx.font = `900 ${chosenFontSize}px "JetBrains Mono", monospace`;
    const availH = finalSecH - 38;
    const rowH = availH / 2;
    const checkW = ctx.measureText(checkMark).width;

    tags.forEach((tag, idx) => {
      const col = idx % 2; // 0 or 1
      const row = Math.floor(idx / 2); // 0 or 1
      const cellLeft = 36 + col * cellW;
      const cellTop = secY + 38 + row * rowH;
      const cy = cellTop + rowH / 2;

      const tagW = ctx.measureText(tag).width;
      const totalContentW = checkW + 10 + tagW;
      const startX = cellLeft + Math.max(12, (cellW - totalContentW) / 2);

      ctx.fillStyle = '#00ff88';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(checkMark, startX, cy);
      ctx.fillText(tag, startX + checkW + 10, cy);
    });
  }
}
