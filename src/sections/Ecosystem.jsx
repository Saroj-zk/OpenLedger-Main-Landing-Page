import WaveField from '@/components/WaveField';

// Partner marks from openledger.xyz. Only the ones that carry a readable name are labelled.
const NAMES = { '001': 'NetMind.AI', '010': 'io.net', '016': 'Trust Wallet', '017': 'NEAR' };
const ids = Array.from({ length: 22 }, (_, i) => String(i + 1).padStart(3, '0'));
const logos = ids.map((id) => ({ id, src: `/ecosystem/${id}.png`, name: NAMES[id] }));

// Two rows that drift in opposite directions.
const rows = [logos.slice(0, 11), logos.slice(11)];

function Tile({ logo }) {
  return (
    <li className="glass group mr-3 grid h-[96px] w-[96px] shrink-0 place-items-center rounded-[22px] sm:mr-4 sm:h-[112px] sm:w-[112px]">
      <img
        src={logo.src}
        alt={logo.name || 'OpenLedger ecosystem partner'}
        loading="lazy"
        draggable="false"
        className="h-12 w-12 rounded-full opacity-70 grayscale transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 sm:h-14 sm:w-14"
      />
    </li>
  );
}

/*
 * One endless row of logos. Each half of the strip holds the logos twice, so a
 * half is wider than any screen; the strip slides by exactly one half and
 * loops. Tiles are spaced with a right margin (not a flex gap) so both halves
 * are the same width and the loop point lines up to the pixel.
 */
function Marquee({ items, reverse = false }) {
  const half = [...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul
        className={`flex w-max py-1 motion-reduce:animate-none ${
          reverse ? 'animate-[marquee-x_128s_linear_infinite_reverse]' : 'animate-[marquee-x_112s_linear_infinite]'
        }`}
        aria-label="OpenLedger ecosystem partners"
      >
        {[...half, ...half].map((logo, i) => (
          <Tile key={`${logo.id}-${i}`} logo={logo} />
        ))}
      </ul>
    </div>
  );
}

export default function Ecosystem() {
  return (
    <section id="ecosystem" data-theme="light" data-parallax-root className="theme-light relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.3" className="ember-glow left-1/2 top-[55%] h-[420px] w-[70%] -translate-x-1/2 opacity-20" aria-hidden="true" />
      <div data-speed="0.15" className="absolute inset-x-0 top-[40%] h-[60%] opacity-60">
        <WaveField tone="light" lines={40} y={0.5} tilt={0.14} amplitude={0.1} spread={0.36} speed={0.7} />
      </div>

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <h2 className="display text-[38px] sm:text-[52px] lg:text-[64px]" data-reveal>
            Partners across
            <br />
            <span className="text-orange">AI and infrastructure.</span>
          </h2>
          <p className="lead lg:pb-2" data-reveal>
            Model, compute, wallet, and application partners working with OpenLedger.
          </p>
        </div>
      </div>

      <div className="relative mt-16 space-y-3 sm:space-y-4 lg:mt-20" data-reveal>
        <Marquee items={rows[0]} />
        <Marquee items={rows[1]} reverse />
      </div>
    </section>
  );
}
