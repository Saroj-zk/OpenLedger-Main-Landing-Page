import WaveField from '@/components/WaveField';
import { Arrow, Logo } from '@/components/ui';
import { heyOpenLink } from '@/lib/links';

const footerLinks = [
  ['Built for AI', '#built'],
  ['AI Stack', '#stack'],
  ['HeyOpen', '#heyopen'],
  ['Ecosystem', '#ecosystem'],
  ['Backed & Supported', '#backed'],
];

export function Cta() {
  return (
    <section id="cta" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-32 lg:py-48">
      <div data-speed="0.25" className="ember-glow left-1/2 top-1/2 h-[420px] w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-35" aria-hidden="true" />
      <div data-speed="0.15" className="absolute inset-x-0 bottom-[-4%] top-[42%]">
        <WaveField tone="dark" lines={56} y={0.55} tilt={-0.14} amplitude={0.14} spread={0.42} interactive />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(0,0,0,.8),transparent_80%)]" aria-hidden="true" />

      <div className="shell relative text-center">
        <h2 className="display mx-auto max-w-[900px] text-[48px] sm:text-[72px] lg:text-[96px]" data-reveal>
          AI should move <span className="text-orange">with you.</span>
        </h2>
        <p className="lead mx-auto mt-7 max-w-[560px] !text-fg/75" data-reveal>
          Across models. Across conversations. Across whatever comes next.
        </p>
        <div className="mt-10 flex justify-center" data-reveal>
          <a {...heyOpenLink} className="btn btn-primary btn-lg">
            Meet HeyOpen <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden border-t hair pt-14">
      <div className="shell flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="OpenLedger, back to top">
          <Logo className="h-7 w-7" />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">OpenLedger</span>
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-[14.5px] text-bone/65 transition-colors hover:text-orange">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="shell mt-12 border-t hair py-6 font-mono text-[12px] text-dim">© 2026 OpenLedger</div>

      <div className="relative overflow-hidden" aria-hidden="true">
        <p
          data-speed="-0.12"
          className="display select-none whitespace-nowrap bg-gradient-to-b from-orange via-orange-ember to-transparent bg-clip-text text-center text-[15.2vw] leading-[0.8] text-transparent"
        >
          OPENLEDGER
        </p>
      </div>
    </footer>
  );
}
