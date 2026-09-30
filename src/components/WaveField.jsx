import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * A ribbon of fine wave lines. Each line follows the same slow carrier wave,
 * offset across the ribbon's width; the width itself breathes and twists along
 * x, so the lines cross over each other like folded silk. The pointer pushes
 * nearby lines apart.
 *
 *   tone       'dark' (orange light on black) or 'light' (ink on paper)
 *   y          ribbon centre, 0–1 of the canvas height
 *   tilt       how far the ribbon rises from left to right, 0–1 of height
 *   amplitude  carrier wave height, 0–1 of height
 *   spread     ribbon width, 0–1 of height
 */

const TONES = {
  dark: {
    stops: [
      [0, 'rgba(255,85,0,0)'],
      [0.18, 'rgba(255,85,0,0.9)'],
      [0.5, 'rgba(255,176,122,1)'],
      [0.82, 'rgba(255,85,0,0.9)'],
      [1, 'rgba(255,85,0,0)'],
    ],
    base: 0.14,
    peak: 0.75,
  },
  light: {
    stops: [
      [0, 'rgba(20,14,10,0)'],
      [0.25, 'rgba(20,14,10,0.9)'],
      [0.5, 'rgba(255,85,0,1)'],
      [0.75, 'rgba(20,14,10,0.9)'],
      [1, 'rgba(20,14,10,0)'],
    ],
    base: 0.06,
    peak: 0.3,
  },
};

export default function WaveField({
  tone = 'dark',
  lines = 42,
  y = 0.55,
  tilt = 0.12,
  amplitude = 0.12,
  spread = 0.3,
  speed = 1,
  interactive = false,
  className = '',
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const palette = TONES[tone] || TONES.dark;
    const pointer = { x: -1e4, y: -1e4, energy: 0 };
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = false;
    let gradient = null;
    const start = performance.now();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gradient = ctx.createLinearGradient(0, 0, w, 0);
      palette.stops.forEach(([o, c]) => gradient.addColorStop(o, c));
    };

    const render = (now) => {
      const t = reduce ? 4 : ((now - start) / 1000) * speed;
      const p = t * 0.22;
      const step = w > 900 ? 7 : 5;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = gradient;

      for (let i = 0; i < lines; i++) {
        const k = lines > 1 ? i / (lines - 1) - 0.5 : 0;
        const centre = 1 - Math.abs(k) * 2;
        ctx.globalAlpha = palette.base + (palette.peak - palette.base) * centre * centre;
        ctx.lineWidth = Math.abs(k) < 0.02 ? 1.4 : 1;
        ctx.beginPath();
        for (let x = -step; x <= w + step; x += step) {
          const u = x / w;
          const carrier = Math.sin(u * 3.6 + p) * 0.62 + Math.sin(u * 7.1 - p * 1.3 + k * 1.6) * 0.38;
          const width = spread * h * (0.45 + 0.55 * Math.sin(u * 2.3 - p * 0.7 + 1.2));
          const twist = Math.cos(u * 2.8 + p * 0.9);
          let yy = h * y - h * tilt * (u - 0.5) + carrier * amplitude * h + k * width * twist;
          if (pointer.energy > 0.01) {
            const dx = x - pointer.x;
            const dy = yy - pointer.y;
            const fall = Math.exp(-(dx * dx) / 26000 - (dy * dy) / 14000);
            yy += Math.sign(dy || 1) * fall * 38 * pointer.energy;
          }
          if (x === -step) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      pointer.energy *= 0.96;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (visible) render(now);
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
      pointer.energy = Math.min(1, pointer.energy + 0.2);
    };
    if (interactive && !reduce) window.addEventListener('pointermove', onMove, { passive: true });

    resize();
    render(performance.now());
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [tone, lines, y, tilt, amplitude, spread, speed, interactive]);

  return <canvas ref={ref} className={`pointer-events-none block h-full w-full ${className}`} aria-hidden="true" />;
}
