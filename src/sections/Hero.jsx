import WaveField from '@/components/WaveField';
import { Arrow } from '@/components/ui';
import { heyOpenLink } from '@/lib/links';
import { Headline } from '@/content/copy';
import { useCopy } from '@/content/context';

export default function Hero() {
  const { copy } = useCopy();
  const c = copy.hero;
  // Longer headline lines step down a size so each part stays on one line.
  const long = Math.max(c.h.a.length, c.h.b.length) > 20;
  return (
    <section
      id="top"
      data-theme="dark"
      data-parallax-root
      className="theme-dark relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[140px] lg:min-h-[max(100svh,800px)]"
    >
      {/* Warm light the waves sit in */}
      <div data-speed="0.3" className="ember-glow left-1/2 top-[58%] h-[360px] w-[80%] -translate-x-1/2 opacity-30" aria-hidden="true" />

      <div data-speed="0.18" className="absolute inset-x-0 bottom-[-6%] top-[18%]">
        <WaveField tone="dark" lines={48} y={0.62} tilt={0.22} amplitude={0.1} spread={0.34} interactive />
      </div>
      <div data-speed="0.32" className="absolute inset-x-0 bottom-[-10%] top-[30%] opacity-40 blur-[1px]">
        <WaveField tone="dark" lines={18} y={0.6} tilt={-0.12} amplitude={0.14} spread={0.22} speed={0.6} />
      </div>

      {/* Keep the headline readable over the brightest part of the ribbon */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_42%,rgba(0,0,0,.85),transparent_75%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" aria-hidden="true" />

      <div className="shell relative z-10 w-full">
        <div data-hero-exit className="mx-auto max-w-[1180px] text-center">
          <p className="eyebrow mb-7" data-intro>
            <b>//</b> {c.eyebrow} <b>//</b>
          </p>
          <h1 className={`display leading-[1.05] ${long ? 'text-[26px] sm:text-[50px] lg:text-[76px]' : 'text-[32px] sm:text-[60px] lg:text-[92px]'}`}>
            <Headline h={c.h} />
          </h1>

          <p className="lead mx-auto mt-8 max-w-[640px] !text-fg/75" data-intro>
            {c.sub}
          </p>

          <div className="mt-10 flex justify-center" data-intro>
            <a {...heyOpenLink} className="btn btn-primary btn-lg">
              {c.cta} <Arrow />
            </a>
          </div>

          <ul data-intro className="mt-10 flex flex-col items-center justify-center gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.12em] text-bone/55 sm:flex-row" aria-label="Guarantees">
            {c.line.map((t, i) => (
              <li key={t} className="flex items-center gap-x-3">
                {i > 0 && <span className="hidden h-1.5 w-1.5 rounded-[2px] bg-orange sm:block" aria-hidden="true" />}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden="true">
        <span className="relative block h-12 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-orange" />
        </span>
      </div>
    </section>
  );
}
