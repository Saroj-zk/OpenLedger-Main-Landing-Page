import WaveField from '@/components/WaveField';

// Logos from openledger.xyz, flattened to single-colour marks so they can be
// tinted with the theme. `ratio` is the mark's width / height, used to give
// every logo roughly the same visual weight.
const backers = [
  ['Polychain Capital', 'polychain', 3.06],
  ['Borderless Capital', 'borderless', 5.12],
  ['Finality Capital Partners', 'finality', 3.94],
  ['Hash3', 'hash3', 3.94],
  ['HashKey Capital', 'hashkey', 3.0],
  ['TRGC', 'trgc', 4.52],
  ['STIX', 'stix', 2.66],
  ['Mask Network', 'mask', 3.43],
  ['MH Ventures', 'venture', 4.29],
  ['WAGMI Ventures', 'wagmi', 1],
];

const supporters = [
  ['Balaji Srinivasan', 'Former CTO, Coinbase'],
  ['Sreeram Kannan', 'Founder, EigenLayer'],
  ['Sebastien Borget', 'Co-Founder, The Sandbox'],
];

const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

function Mark({ file, ratio, name }) {
  const h = Math.min(60, 40 * Math.sqrt(3.2 / ratio));
  const src = `/backers/${file}.png`;
  return (
    <span
      role="img"
      aria-label={name}
      className="block bg-fg/75 transition-colors duration-300 group-hover:bg-orange"
      style={{
        height: h,
        width: h * ratio,
        maxWidth: '82%',
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

export default function Backers() {
  return (
    <section id="backed" data-theme="light" data-parallax-root aria-labelledby="backed-title" className="theme-light relative overflow-hidden py-28 lg:py-36">
      <div data-speed="0.2" className="absolute inset-x-0 top-[5%] h-[70%] opacity-60 [mask-image:linear-gradient(90deg,transparent,#000_25%,#000_75%,transparent)]">
        <WaveField tone="light" lines={26} y={0.45} tilt={0.12} amplitude={0.12} spread={0.3} speed={0.5} />
      </div>

      <div className="shell relative">
        <div className="mx-auto max-w-[860px] text-center">
          <p className="eyebrow mb-5" data-reveal>
            <b>//</b> Backed &amp; Supported <b>//</b>
          </p>
          <h2 id="backed-title" className="display text-[40px] sm:text-[54px] lg:text-[68px]" data-reveal>
            Backed by leaders across <span className="text-orange">AI and crypto.</span>
          </h2>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-20 lg:grid-cols-5" data-reveal>
          {backers.map(([name, file, ratio]) => (
            <li key={file} className="glass group grid h-[108px] place-items-center rounded-[20px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 sm:h-[124px]">
              <Mark file={file} ratio={ratio} name={name} />
            </li>
          ))}
        </ul>

        <div className="mt-16 flex items-center gap-4" data-reveal>
          <p className="eyebrow shrink-0">Supported by</p>
          <span className="h-px flex-1 bg-[var(--line-2)]" aria-hidden="true" />
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {supporters.map(([name, role]) => (
            <li key={name} className="glass flex items-center gap-4 rounded-[20px] p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-[#0c0a09] font-pixel text-[16px] text-orange" aria-hidden="true">
                {initials(name)}
              </span>
              <div>
                <p className="text-[17px] font-medium tracking-[-0.015em] text-fg">{name}</p>
                <p className="mt-0.5 text-[14px] text-soft">{role}</p>
              </div>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-[20px] border border-dashed border-[var(--line-2)] p-5 text-[17px] font-medium text-fg/70">
            <span className="h-px w-8 bg-orange" aria-hidden="true" />
            And more
          </li>
        </ul>
      </div>
    </section>
  );
}
