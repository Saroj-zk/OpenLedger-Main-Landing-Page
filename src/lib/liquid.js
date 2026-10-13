import { useEffect } from 'react';

/*
 * Apple-style liquid glass refraction.
 *
 * For each element marked data-liquid we render a displacement map shaped like
 * that element's rounded rectangle: flat in the middle, bending hard in a thin
 * bezel around the edge. An SVG filter blurs the backdrop and then displaces it
 * with that map, so whatever sits behind the glass visibly bends at the rim.
 *
 * SVG filters inside backdrop-filter only work in Chromium today; everywhere
 * else the plain blur from .glass stays in place.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
let host = null;
let uid = 0;

function supportsRefraction() {
  if (typeof navigator === 'undefined') return false;
  // Safari and Firefox accept the syntax but don't render it, so check the engine.
  const chromium = /Chrome\//.test(navigator.userAgent);
  return chromium && CSS.supports('backdrop-filter', 'url(#x)');
}

function getHost() {
  if (host) return host;
  host = document.createElementNS(SVG_NS, 'svg');
  host.setAttribute('aria-hidden', 'true');
  host.setAttribute('width', '0');
  host.setAttribute('height', '0');
  host.style.position = 'absolute';
  host.style.pointerEvents = 'none';
  document.body.appendChild(host);
  return host;
}

/** Signed-distance rounded-rect map; returns a PNG data URL. */
function buildMap(w, h, radius, bezel) {
  const scale = w * h > 400000 ? 0.5 : 1;
  const cw = Math.max(2, Math.round(w * scale));
  const ch = Math.max(2, Math.round(h * scale));
  const r = Math.min(radius, w / 2, h / 2) * scale;
  const b = bezel * scale;
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(cw, ch);
  const hx = cw / 2;
  const hy = ch / 2;

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      const dist = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
      const depth = -dist;

      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        nx = Math.sign(px);
      } else {
        ny = Math.sign(py);
      }

      let s = 0;
      if (depth < b && depth >= 0) {
        const t = 1 - depth / b;
        s = t * t * (3 - 2 * t);
      }
      const i = (y * cw + x) * 4;
      img.data[i] = 128 + nx * s * 127;
      img.data[i + 1] = 128 + ny * s * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

function mountFilter(el) {
  const id = `liquid-${++uid}`;
  const filter = document.createElementNS(SVG_NS, 'filter');
  filter.setAttribute('id', id);
  filter.setAttribute('x', '0');
  filter.setAttribute('y', '0');
  filter.setAttribute('filterUnits', 'userSpaceOnUse');
  filter.setAttribute('color-interpolation-filters', 'sRGB');

  const blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('result', 'blur');
  const image = document.createElementNS(SVG_NS, 'feImage');
  image.setAttribute('x', '0');
  image.setAttribute('y', '0');
  image.setAttribute('preserveAspectRatio', 'none');
  image.setAttribute('result', 'map');
  const disp = document.createElementNS(SVG_NS, 'feDisplacementMap');
  disp.setAttribute('in', 'blur');
  disp.setAttribute('in2', 'map');
  disp.setAttribute('xChannelSelector', 'R');
  disp.setAttribute('yChannelSelector', 'G');
  filter.append(blur, image, disp);
  getHost().appendChild(filter);

  let lastKey = '';
  const update = () => {
    const w = Math.round(el.offsetWidth);
    const h = Math.round(el.offsetHeight);
    if (!w || !h) return;
    const cs = getComputedStyle(el);
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const bezel = parseFloat(el.dataset.bezel) || Math.min(28, Math.min(w, h) * 0.35);
    const key = `${w}x${h}r${radius}b${bezel}`;
    if (key === lastKey) return;
    lastKey = key;
    filter.setAttribute('width', w);
    filter.setAttribute('height', h);
    image.setAttribute('width', w);
    image.setAttribute('height', h);
    image.setAttribute('href', buildMap(w, h, radius, bezel));
    blur.setAttribute('stdDeviation', el.dataset.blur || '10');
    disp.setAttribute('scale', el.dataset.refract || String(Math.min(70, bezel * 2)));
    el.style.setProperty('--liquid-filter', `url(#${id})`);
    el.classList.add('liquid-on');
  };

  // Rebuilding the map is per-pixel work, so settle resizes before redrawing.
  let timer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(update, 90);
  });
  ro.observe(el);
  update();

  return () => {
    clearTimeout(timer);
    ro.disconnect();
    filter.remove();
    el.classList.remove('liquid-on');
    el.style.removeProperty('--liquid-filter');
  };
}

export function useLiquidGlass(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !supportsRefraction()) return undefined;
    const cleanups = [...root.querySelectorAll('[data-liquid]')].map(mountFilter);
    return () => cleanups.forEach((fn) => fn());
  }, [rootRef]);
}
