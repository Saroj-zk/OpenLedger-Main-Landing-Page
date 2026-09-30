import { useEffect, useRef } from 'react';
import WaveField from '@/components/WaveField';
import { SectionHead } from '@/components/ui';
import { prefersReducedMotion } from '@/lib/motion';

// Partner marks from openledger.xyz. Only the ones that carry a readable name are labelled.
const NAMES = { '001': 'NetMind.AI', '010': 'io.net', '016': 'Trust Wallet', '017': 'NEAR' };
const logo = (id) => ({ id, src: `/ecosystem/${id}.png`, name: NAMES[id] });

// Honeycomb rows of 6 / 5 / 6 / 5: centring the short rows offsets them by half a cell.
const rows = [
  ['001', '002', '003', '004', '005', '006'],
  ['007', '008', '009', '010', '011'],
  ['012', '013', '014', '015', '016', '017'],
  ['018', '019', '020', '021', '022'],
].map((r) => r.map(logo));

/*
 * A slow wave rolls across the comb (each logo bobs a little later than the one
 * to its left), and logos near the pointer swell like a dock. Transforms are
 * written straight to the nodes each frame, so React never re-renders.
 */
function useCombMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    const cells = [...root.querySelectorAll('[data-cell]')];
    if (prefersReducedMotion()) {
      root.classList.add('is-in');
      return undefined;
    }
    const pointer = { x: 0, y: 0, active: 0, target: 0 };
    let centres = [];
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const measure = () => {
      const r = root.getBoundingClientRect();
      centres = cells.map((c) => {
        const b = c.getBoundingClientRect();
        return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, size: c.offsetWidth };
      });
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = (now - start) / 1000;
      pointer.active += (pointer.target - pointer.active) * 0.08;
      const reach = (centres[0]?.size || 90) * 2.2;
      cells.forEach((c, i) => {
        const p = centres[i];
        if (!p) return;
        const wave = Math.sin(t * 1.3 - p.x * 0.012 - p.y * 0.004);
        let lift = 0;
        if (pointer.active > 0.001) {
          const d = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          lift = Math.max(0, 1 - d / reach) ** 2 * pointer.active;
        }
        const scale = 1 + 0.05 * wave + 0.42 * lift;
        c.style.transform = `translate3d(0, ${(wave * 7 - lift * 10).toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
        c.style.zIndex = lift > 0.05 ? String(10 + Math.round(lift * 10)) : '';
        c.style.setProperty('--glow', (0.15 + 0.85 * lift).toFixed(3));
      });
    };

    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        root.classList.add('is-in');
        measure();
      }
    });
    io.observe(root);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    measure();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
}

function Comb() {
  const ref = useRef(null);
  useCombMotion(ref);

  return (
    <ul ref={ref} className="comb relative mx-auto w-fit py-6" aria-label="OpenLedger ecosystem partners">
      {rows.map((row, r) => (
        <li key={r} className="comb-row flex justify-center">
          <ul className="flex gap-[var(--gap)]">
            {row.map((l, i) => (
              <li
                key={l.id}
                data-cell
                className="comb-cell group relative will-change-transform"
                style={{ animationDelay: `${(r * 6 + i) * 45}ms` }}
              >
                <span
                  className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(255,85,0,.55),transparent_65%)] blur-md transition-opacity"
                  style={{ opacity: 'var(--glow, .15)' }}
                  aria-hidden="true"
                />
                <img
                  src={l.src}
                  alt={l.name || 'OpenLedger ecosystem partner'}
                  loading="lazy"
                  draggable="false"
                  className="relative h-full w-full rounded-full shadow-[0_14px_30px_-10px_rgba(0,0,0,.95),0_0_0_1px_rgba(255,255,255,.12)]"
                />
                {l.name && (
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] text-bone opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    {l.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.3" className="ember-glow right-[5%] top-[35%] h-[460px] w-[560px] opacity-35" aria-hidden="true" />
      <div data-speed="0.15" className="absolute inset-x-0 top-[40%] h-[60%] opacity-70">
        <WaveField tone="dark" lines={40} y={0.5} tilt={0.14} amplitude={0.1} spread={0.36} speed={0.7} interactive />
      </div>

      <div className="shell relative grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <SectionHead label="The OpenLedger Ecosystem" title={<>The AI frontier <span className="text-orange">keeps getting bigger.</span></>}>
          And the OpenLedger ecosystem keeps expanding with it.
        </SectionHead>
        <Comb />
      </div>
    </section>
  );
}
