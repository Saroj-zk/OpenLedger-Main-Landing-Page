import WaveField from '@/components/WaveField';
import { Arrow } from '@/components/ui';
import { heyOpenLink } from '@/lib/links';

export default function Hero() {
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
        <div data-hero-exit className="mx-auto max-w-[980px] text-center">
          <h1 className="display text-[44px] leading-[0.98] sm:text-[84px] lg:text-[112px]">
            Open by choice.
            <br />
            <span className="text-orange">Private by design.</span>
          </h1>

          <p className="lead mx-auto mt-8 max-w-[600px] !text-fg/75">
            AI shouldn’t be limited to one model or one memory. OpenLedger brings models, memory, privacy, and agents together, while keeping you in control.
          </p>

          <div className="mt-10 flex justify-center">
            <a {...heyOpenLink} className="btn btn-primary btn-lg">
              Meet HeyOpen <Arrow />
            </a>
          </div>
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
