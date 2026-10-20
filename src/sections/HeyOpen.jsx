import HeyOpenProduct from '@/components/HeyOpenProduct';
import WaveField from '@/components/WaveField';
import { Arrow, Logo } from '@/components/ui';
import { heyOpenLink } from '@/lib/links';

export default function HeyOpen() {
  return (
    <section id="heyopen" data-theme="light" data-parallax-root className="theme-light relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.2" className="absolute inset-x-0 bottom-[-6%] h-[65%] opacity-70 [mask-image:linear-gradient(180deg,transparent,#000_40%)]">
        <WaveField tone="light" lines={30} y={0.5} tilt={0.16} amplitude={0.1} spread={0.34} speed={0.6} />
      </div>
      <div data-speed="0.3" className="ember-glow left-1/2 top-[60%] h-[480px] w-[70%] -translate-x-1/2 opacity-20" aria-hidden="true" />

      <div className="shell relative">
        {/* Copy and the OPEN card share one row; the card sits at its own height, centred on the copy */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <h2 className="display text-[38px] sm:text-[52px] lg:text-[64px]" data-reveal>
              All your AI.
              <br />
              <span className="text-orange">One private space.</span>
            </h2>
            <p className="lead mt-6 max-w-[540px]" data-reveal>
              Frontier AI models. One Universal Memory. Private conversations. Uncensored access.
            </p>
            <p className="lead mt-4 max-w-[540px]" data-reveal>
              Everything comes together in HeyOpen, powered by OpenLedger and built to keep your data under your control.
            </p>
            <div className="mt-9" data-reveal>
              <a {...heyOpenLink} className="btn btn-primary btn-lg">
                Meet HeyOpen <Arrow />
              </a>
            </div>
          </div>

          <div data-reveal data-liquid data-bezel="24" data-blur="10" className="glass flex flex-col gap-5 rounded-[28px] p-7 sm:p-8">
            {/* Header: token icon, title, status */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[#0c0a09] shadow-[0_10px_30px_-10px_rgba(255,85,0,.6)]">
                <Logo className="h-7 w-7" />
              </span>
              <h3 className="display flex-none whitespace-nowrap text-[24px] sm:text-[28px]">
                Powered by <span className="text-orange">$OPEN</span>
              </h3>
              {/* OPEN isn't live yet */}
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-b sm:ml-auto from-white/80 to-orange/[0.08] px-3.5 py-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#c2410c] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_8px_20px_-10px_rgba(255,85,0,.45)] ring-1 ring-orange/25 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inset-0 animate-ping rounded-full bg-orange/60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-orange" />
                </span>
                Coming soon
              </span>
            </div>
            <p className="max-w-[480px] text-[16px] leading-relaxed text-soft">
              $OPEN connects private model access, Universal Memory, agent capabilities, and x402-powered transactions.
            </p>
          </div>
        </div>

        <div data-scale-in className="mx-auto mt-16 max-w-[1120px] lg:mt-20">
          <a {...heyOpenLink} aria-label="Open HeyOpen" className="block rounded-[26px] shadow-[0_40px_120px_-40px_rgba(255,85,0,.35)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1">
            <HeyOpenProduct />
          </a>
        </div>
      </div>
    </section>
  );
}
