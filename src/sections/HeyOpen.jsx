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
      <div data-speed="0.3" className="ember-glow left-1/2 top-[55%] h-[480px] w-[70%] -translate-x-1/2 opacity-20" aria-hidden="true" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="eyebrow mb-5" data-reveal>
              <b>//</b> Open in action <b>//</b>
            </p>
            <h2 className="display text-[48px] sm:text-[64px] lg:text-[80px]" data-reveal>
              Meet <span className="text-orange">HeyOpen.</span>
            </h2>
            <p className="lead mt-6 max-w-[540px]" data-reveal>
              A multi-model AI experience with universal memory that keeps your context consistent across models, your conversations private, and your access to AI uncensored.
            </p>
            <p className="mt-5 max-w-[540px] text-[17px] font-medium leading-relaxed tracking-[-0.01em] text-fg lg:text-[19px]" data-reveal>
              Choose your model. Keep your context. Stay private. Move between conversations without starting over.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div data-reveal className="glass rounded-[24px] p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#0c0a09]">
                  <Logo className="h-5 w-5" />
                </span>
                <h3 className="display text-[26px] sm:text-[30px]">
                  Powered by <span className="text-orange">OPEN.</span>
                </h3>
              </div>
              <p className="mt-3 text-[15.5px] leading-relaxed text-soft">
                OPEN powers model access, memory, agents, and premium AI experiences across HeyOpen.
              </p>
            </div>
            <div data-reveal>
              <a {...heyOpenLink} className="btn btn-primary btn-lg">
                Try HeyOpen <Arrow />
              </a>
            </div>
          </div>
        </div>

        <div data-scale-in className="mx-auto mt-16 max-w-[1120px] lg:mt-20">
          <a {...heyOpenLink} aria-label="Open HeyOpen" className="block rounded-[26px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1">
            <HeyOpenProduct />
          </a>
        </div>
      </div>
    </section>
  );
}
