/*
 * Draw functions for <PixelScreen>. Each paints at "one texel per pixel cell",
 * so shapes are sized in cells, not CSS pixels.
 */

const ORANGE = '#ff5500';
const AMBER = '#ffb07a';
const WHITE = '#f4efe9';

/** A small neural lattice whose nodes take turns firing. */
export function lattice(ctx, t, cols, rows) {
  const nodes = [
    [0.12, 0.3], [0.12, 0.72], [0.38, 0.18], [0.38, 0.5], [0.38, 0.84],
    [0.64, 0.3], [0.64, 0.7], [0.88, 0.5],
  ];
  const edges = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7]];
  const pt = ([x, y]) => [x * cols, y * rows];
  ctx.lineWidth = 1;
  edges.forEach(([a, b], i) => {
    const on = 0.5 + 0.5 * Math.sin(t * 2 - i * 0.7);
    ctx.strokeStyle = `rgba(255,85,0,${0.25 + on * 0.6})`;
    ctx.beginPath();
    ctx.moveTo(...pt(nodes[a]));
    ctx.lineTo(...pt(nodes[b]));
    ctx.stroke();
  });
  nodes.forEach((n, i) => {
    const on = 0.5 + 0.5 * Math.sin(t * 2 - i * 0.9);
    const [x, y] = pt(n);
    ctx.fillStyle = on > 0.8 ? WHITE : AMBER;
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
  });
}

/** Three phase-shifted currents: assets that move instead of sitting still. */
export function liquidity(ctx, t, cols, rows) {
  const bands = [
    { amp: 0.16, freq: 0.16, speed: 1.4, y: 0.32, color: ORANGE },
    { amp: 0.12, freq: 0.22, speed: -1.1, y: 0.52, color: AMBER },
    { amp: 0.18, freq: 0.12, speed: 0.8, y: 0.72, color: ORANGE },
  ];
  bands.forEach((b) => {
    ctx.fillStyle = b.color;
    for (let x = 0; x < cols; x++) {
      const y = b.y * rows + Math.sin(x * b.freq + t * b.speed) * b.amp * rows;
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(x * 0.3 - t * 3) ** 2;
      ctx.fillRect(x, Math.round(y), 1, 2);
    }
  });
  ctx.globalAlpha = 1;
}

/** Two blocks sliding together and locking: plug straight into EVM tooling. */
export function interlock(ctx, t, cols, rows) {
  const phase = (Math.sin(t * 1.2) + 1) / 2;
  const eased = phase * phase * (3 - 2 * phase);
  const bw = Math.round(cols * 0.26);
  const bh = Math.round(rows * 0.46);
  const cy = Math.round(rows * 0.27);
  const gapX = Math.round((1 - eased) * cols * 0.14);
  const leftX = Math.round(cols / 2 - bw - gapX);
  const rightX = Math.round(cols / 2 + gapX);

  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 1;
  ctx.strokeRect(leftX + 0.5, cy + 0.5, bw, bh);
  ctx.strokeStyle = AMBER;
  ctx.strokeRect(rightX + 0.5, cy + 0.5, bw, bh);

  // Teeth: they overlap when locked
  ctx.fillStyle = eased > 0.92 ? WHITE : ORANGE;
  for (let i = 0; i < 3; i++) {
    const ty = cy + 2 + i * Math.round(bh / 3);
    ctx.fillRect(leftX + bw, ty, 2, 2);
    ctx.fillRect(rightX - 2, ty + Math.round(bh / 6), 2, 2);
  }
  ctx.fillStyle = `rgba(255,85,0,${0.2 + eased * 0.5})`;
  ctx.fillRect(leftX + 2, cy + bh - 3, Math.round((bw - 4) * eased), 1);
  ctx.fillRect(rightX + 2, cy + 2, Math.round((bw - 4) * eased), 1);
}

/** A contribution travels from a leaf up to the root of an attribution tree. */
export function attribution(ctx, t, cols, rows) {
  const root = [0.5, 0.16];
  const mids = [[0.28, 0.48], [0.72, 0.48]];
  const leaves = [[0.14, 0.82], [0.4, 0.82], [0.6, 0.82], [0.86, 0.82]];
  const P = ([x, y]) => [Math.round(x * cols), Math.round(y * rows)];
  const line = (a, b, c) => {
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.moveTo(...P(a));
    ctx.lineTo(...P(b));
    ctx.stroke();
  };
  ctx.lineWidth = 1;
  mids.forEach((m) => line(root, m, 'rgba(255,85,0,.55)'));
  leaves.forEach((l, i) => line(mids[i < 2 ? 0 : 1], l, 'rgba(255,85,0,.4)'));

  const cycle = 3.2;
  const k = Math.floor(t / cycle) % leaves.length;
  const f = (t % cycle) / cycle;
  const leaf = leaves[k];
  const mid = mids[k < 2 ? 0 : 1];
  const [a, b] = f < 0.5 ? [leaf, mid] : [mid, root];
  const s = f < 0.5 ? f * 2 : (f - 0.5) * 2;
  const pos = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
  line(leaf, mid, WHITE);
  if (f >= 0.5) line(mid, root, WHITE);

  [root, ...mids, ...leaves].forEach((n, i) => {
    const [x, y] = P(n);
    const lit = n === leaf || (f >= 0.5 && n === mid) || (f > 0.95 && i === 0);
    ctx.fillStyle = lit ? WHITE : ORANGE;
    ctx.fillRect(x - 1, y - 1, 3, 3);
  });
  const [px, py] = P(pos);
  ctx.fillStyle = WHITE;
  ctx.fillRect(px - 1, py - 1, 3, 3);
}
