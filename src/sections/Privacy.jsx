import WaveField from '@/components/WaveField';
import { SectionSwitch } from '@/components/CopySwitcher';
import { Headline } from '@/content/copy';
import { useCopy } from '@/content/context';

// Icons for the four protections, in the order the copy lists them.
const icons = [
  {
    icon: (
      <>
        <path d="M18 11c-1.5 0-2.5.5-3 2" />
        <path d="M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z" />
        <path d="M6 11c1.5 0 2.5.5 3 2" />
      </>
    ),
  },
  {
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
      </>
    ),
  },
  {
    icon: (
      <>
        <circle cx="12" cy="16" r="1" />
        <rect x="3" y="10" width="18" height="12" rx="2" />
        <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </>
    ),
  },
];

export default function Privacy() {
  const { copy } = useCopy();
  const c = copy.privacy;
  // A heading line too long for the left column takes the full width, with the intro underneath.
  const stacked = Math.max(c.h.a.length, c.h.b.length) > 24;
  return (
    <section id="privacy" data-theme="light" data-parallax-root className="theme-light relative overflow-hidden py-28 lg:py-36">
      <SectionSwitch section="privacy" />
      <div data-speed="0.2" className="absolute inset-x-0 top-[-6%] h-[55%] opacity-60 [mask-image:linear-gradient(180deg,transparent,#000_35%,#000_70%,transparent)]">
        <WaveField tone="light" lines={26} y={0.5} tilt={0.16} amplitude={0.1} spread={0.32} speed={0.6} />
      </div>

      <div className="shell relative">
        <div className={stacked ? 'grid gap-6' : 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16'}>
          <div>
            <p className="eyebrow mb-5" data-reveal>
              <b>//</b> {c.label} <b>//</b>
            </p>
            <h2 className="display text-[38px] sm:text-[52px] lg:text-[64px]" data-reveal>
              <Headline h={c.h} />
            </h2>
          </div>
          <p className={`lead ${stacked ? 'max-w-[720px]' : 'lg:pb-2'}`} data-reveal>
            {c.sub}
          </p>
        </div>

        {/* Hairline grid with a dot at every intersection */}
        <div className="relative mt-16 lg:mt-20">
          <ul className="grid border-t border-[var(--line-2)] sm:grid-cols-2 lg:grid-cols-4 lg:border-b">
            {c.items.map((m, i) => (
              <li
                key={m.title}
                data-reveal
                className={`group relative border-b border-[var(--line-2)] px-1 py-9 transition-colors duration-300 hover:bg-fg/[0.025] sm:px-8 sm:py-11 lg:border-b-0 ${
                  i % 2 === 1 ? 'sm:border-l' : ''
                } ${i > 0 ? 'lg:border-l' : ''}`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange/[0.08] text-orange ring-1 ring-orange/20 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]" aria-hidden="true">
                    {icons[i].icon}
                  </svg>
                </span>
                <h3 className="mt-7 text-[21px] font-medium leading-snug tracking-[-0.02em] text-fg sm:text-[22px]">{m.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-soft">{m.body}</p>
              </li>
            ))}
          </ul>
          {c.note && (
            <p className="mt-6 text-[13.5px] text-soft" data-reveal>
              {c.note}
            </p>
          )}
          <div className={`pointer-events-none absolute inset-x-0 top-0 hidden lg:block ${c.note ? 'h-[calc(100%-3.5rem)]' : 'h-full'}`} aria-hidden="true">
            {[0, 25, 50, 75, 100].map((x) => (
              <span key={x}>
                <span className="absolute top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/35" style={{ left: `${x}%` }} />
                <span className="absolute bottom-0 h-[5px] w-[5px] -translate-x-1/2 translate-y-1/2 rounded-full bg-fg/35" style={{ left: `${x}%` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
