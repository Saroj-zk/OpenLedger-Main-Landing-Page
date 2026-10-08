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
        {/* Copy and the OPEN card share one row: the card stretches to the copy's exact height */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-stretch lg:gap-20">
          <div>
            <p className="eyebrow mb-5" data-reveal>
              <b>//</b> Open in action <b>//</b>
            </p>
            <h2 className="display text-[48px] sm:text-[64px] lg:text-[80px]" data-reveal>
              Meet <span className="text-orange">HeyOpen.</span>
            </h2>
            <p className="lead mt-6 max-w-[540px]" data-reveal>
              Private AI chat with every leading model, a memory that follows you, and uncensored options when you want them.
            </p>
            <div className="mt-9" data-reveal>
              <a {...heyOpenLink} className="btn btn-primary btn-lg">
                Meet HeyOpen <Arrow />
              </a>
            </div>
          </div>

          <div data-reveal data-liquid data-bezel="24" data-blur="10" className="glass flex flex-col justify-between gap-10 rounded-[28px] p-7 sm:p-9">
            <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#0c0a09] shadow-[0_10px_30px_-10px_rgba(255,85,0,.6)]">
              <Logo className="h-7 w-7" />
            </span>
            <div>
              <h3 className="display text-[30px] sm:text-[38px]">
                Powered by <span className="text-orange">OPEN.</span>
              </h3>
              <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-soft">
                OPEN fuels model access, memory, agents, and x402 interactions across HeyOpen.
              </p>
            </div>
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
