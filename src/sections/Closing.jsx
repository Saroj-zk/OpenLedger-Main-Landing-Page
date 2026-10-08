import WaveField from '@/components/WaveField';
import { Arrow, Logo } from '@/components/ui';
import { SOCIALS, heyOpenLink } from '@/lib/links';

const footerLinks = [
  ['Privacy', '#privacy'],
  ['AI Stack', '#stack'],
  ['HeyOpen', '#heyopen'],
  ['Ecosystem', '#ecosystem'],
  ['Why OpenLedger', '#built'],
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
        <p className="eyebrow mb-6" data-reveal>
          <b>//</b> Start now <b>//</b>
        </p>
        <h2 className="display mx-auto max-w-[1000px] text-[42px] sm:text-[64px] lg:text-[84px]" data-reveal>
          The private way to AI
          <br />
          <span className="text-orange">starts here.</span>
        </h2>
        <p className="lead mx-auto mt-7 max-w-[580px] !text-fg/75" data-reveal>
          One click to HeyOpen. No sign-up to get going.
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

// Brand marks (24×24) for the social buttons.
const SOCIAL_ICONS = {
  X: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  Discord:
    'M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z',
  Telegram:
    'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z',
};

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

      <div className="shell mt-12 flex items-center justify-between gap-6 border-t hair py-6">
        <span className="font-mono text-[12px] text-dim">© 2026 OpenLedger</span>
        <ul className="flex items-center gap-2" aria-label="OpenLedger on social media">
          {SOCIALS.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`OpenLedger on ${name}`}
                title={name}
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-bone/70 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange hover:text-black hover:ring-orange"
              >
                <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_ICONS[name]} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

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
