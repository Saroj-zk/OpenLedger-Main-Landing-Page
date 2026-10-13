import PixelScreen from '@/components/PixelScreen';
import WaveField from '@/components/WaveField';
import { attribution, interlock, lattice, liquidity } from '@/components/pixelScenes';

const pillars = [
  {
    title: 'Built for AI workloads',
    body: 'Designed around the full AI lifecycle, from training data to deployed agents.',
    scene: lattice,
  },
  {
    title: 'AI as on-chain assets',
    body: 'Datasets, models, and agents can be owned, combined, and built on.',
    scene: liquidity,
  },
  {
    title: 'EVM-compatible',
    body: 'Use the Ethereum wallets, contracts, and tooling you already have.',
    scene: interlock,
  },
  {
    title: 'Proof of Attribution',
    body: 'Each contribution to a model is recorded on-chain, so the people behind it are credited and rewarded.',
    scene: attribution,
  },
];

export default function BuiltForAI() {
  return (
    <section id="built" data-theme="light" data-parallax-root className="theme-light relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.25" className="absolute inset-x-0 top-[-8%] h-[70%] opacity-80 [mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]">
        <WaveField tone="light" lines={30} y={0.5} tilt={-0.18} amplitude={0.12} spread={0.36} speed={0.7} />
      </div>

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="display text-[38px] sm:text-[52px] lg:text-[64px]" data-reveal>
              Verifiable <span className="text-orange">by design.</span>
            </h2>
          </div>
          <div data-reveal>
            <p className="lead lg:pb-2">
              OpenLedger is an EVM-compatible chain that records which data, models, and contributors shaped an AI result, and rewards them through Proof of Attribution.
            </p>
          </div>
        </div>

        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
          {pillars.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              className="glass group flex flex-col rounded-[28px] p-3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5"
            >
              <div className="theme-dark relative aspect-[4/3] overflow-hidden rounded-[20px]">
                <div className="dot-grid absolute inset-0 opacity-50" aria-hidden="true" />
                <PixelScreen draw={p.scene} cell={9} gap={2} threshold={0.05} reveal={0.6} />
                <span className="absolute left-4 top-4 font-mono text-[11px] text-bone/50">0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col px-3 pb-4 pt-6">
                <h3 className="text-[21px] font-medium leading-tight tracking-[-0.02em] text-fg">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-soft">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
