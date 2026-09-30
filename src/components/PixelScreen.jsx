import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * Renders any 2D drawing as a field of square pixels in the OpenLedger palette.
 * `draw(ctx, t, cols, rows)` paints into a tiny offscreen canvas (one texel per
 * cell); each texel's brightness then picks a colour from the orange ramp, and
 * near-neutral texels render as warm white (the glass objects in the artwork).
 */

const RAMP = [
  [48, 12, 0],
  [120, 34, 0],
  [214, 64, 0],
  [255, 85, 0],
  [255, 122, 46],
  [255, 176, 122],
  [255, 236, 220],
];
const LEVELS = 20;
const ORANGE = Array.from({ length: LEVELS }, (_, i) => {
  const t = (i / (LEVELS - 1)) * (RAMP.length - 1);
  const a = RAMP[Math.floor(t)];
  const b = RAMP[Math.min(RAMP.length - 1, Math.floor(t) + 1)];
  const f = t - Math.floor(t);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
});
const WHITE = Array.from({ length: LEVELS }, (_, i) => `rgba(255,242,232,${(0.12 + (i / (LEVELS - 1)) * 0.88).toFixed(3)})`);

const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export default function PixelScreen({
  draw,
  cell = 8,
  gap = 1.5,
  threshold = 0.07,
  fade,
  reveal = 1.6,
  interactive = false,
  fps = 30,
  className = '',
  label,
}) {
  const canvasRef = useRef(null);
  const drawRef = useRef(draw);
  const fadeRef = useRef(fade);
  useEffect(() => {
    drawRef.current = draw;
    fadeRef.current = fade;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const off = document.createElement('canvas');
    const octx = off.getContext('2d', { willReadFrequently: true });
    const reduce = prefersReducedMotion();
    const pointer = { x: -1e4, y: -1e4, energy: 0 };
    const buckets = Array.from({ length: LEVELS * 2 }, () => []);

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = 0;
    let seeds = new Float32Array(0);
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.max(1, Math.ceil(w / cell));
      rows = Math.max(1, Math.ceil(h / cell));
      off.width = cols;
      off.height = rows;
      seeds = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) seeds[y * cols + x] = hash(x, y);
    };

    const render = (now) => {
      // rAF timestamps can land a hair before `start`, so clamp at zero
      const t = reduce ? 6 : Math.max(0, (now - start) / 1000);
      octx.clearRect(0, 0, cols, rows);
      drawRef.current?.(octx, t, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;
      const fadeFn = fadeRef.current;
      const progress = reduce ? 99 : t / reveal;
      const size = cell - gap;
      const radius = 110;

      for (let i = 0; i < buckets.length; i++) buckets[i].length = 0;

      for (let y = 0; y < rows; y++) {
        const fy = y / rows;
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const p = idx * 4;
          const a = data[p + 3];
          if (!a) continue;
          const seed = seeds[idx];
          const fx = x / cols;
          if (progress < 1.4 && fx * 0.9 + seed * 0.5 > progress) continue;

          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          let lum = ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (a / 255);
          if (fadeFn) lum *= fadeFn(fx, fy);

          if (interactive && pointer.energy > 0.01) {
            const dx = x * cell - pointer.x;
            const dy = y * cell - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < radius * radius) lum += (1 - Math.sqrt(d2) / radius) * 0.45 * pointer.energy;
          }
          // Sparse shimmer so the field never feels frozen
          if (seed > 0.985) lum *= 0.75 + 0.5 * Math.sin(t * 3 + seed * 90);
          if (lum < threshold) continue;

          const max = Math.max(r, g, b);
          const sat = max ? (max - Math.min(r, g, b)) / max : 0;
          const neutral = sat < 0.28;
          // Neutral mid-greys read as noise; only let bright highlights through as white.
          if (neutral && lum < 0.3) continue;
          const level = Math.min(LEVELS - 1, Math.floor(Math.min(1, lum * 1.15) * LEVELS));
          buckets[(neutral ? LEVELS : 0) + level].push(x, y);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const inset = gap / 2;
      for (let i = 0; i < buckets.length; i++) {
        const list = buckets[i];
        if (!list.length) continue;
        ctx.fillStyle = i < LEVELS ? ORANGE[i] : WHITE[i - LEVELS];
        for (let k = 0; k < list.length; k += 2) ctx.fillRect(list[k] * cell + inset, list[k + 1] * cell + inset, size, size);
      }
      pointer.energy *= 0.94;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / fps) return;
      last = now;
      render(now);
    };

    const ro = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.energy = 1;
    };
    if (interactive) window.addEventListener('pointermove', onMove, { passive: true });

    resize();
    if (reduce) render(performance.now());
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [cell, gap, threshold, reveal, interactive, fps]);

  return (
    <canvas
      ref={canvasRef}
      className={`block h-full w-full ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
