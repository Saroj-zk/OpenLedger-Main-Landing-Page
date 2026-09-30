import PixelScreen from '@/components/PixelScreen';
import WaveField from '@/components/WaveField';
import { attribution, interlock, lattice, liquidity } from '@/components/pixelScenes';
import { SectionHead } from '@/components/ui';

const pillars = [
  {
    title: 'Purpose-Built for AI',
    body: 'OpenLedger is designed from the ground up for AI participation. From model training to agent deployment, every component runs on-chain with precision.',
    scene: lattice,
  },
  {
    title: 'AI Liquidity Layer',
    body: 'Data, models, and agents are no longer static assets. OpenLedger makes them liquid and composable.',
    scene: liquidity,
  },
  {
    title: 'EVM-Compatible Infrastructure',
    body: 'OpenLedger follows Ethereum standards. Connect your wallets, smart contracts, and L2 ecosystems with zero friction.',
    scene: interlock,
  },
  {
    title: 'Proof of Attribution',
    body: 'Ensures all contributions are traceable, verifiable, and fairly rewarded.',
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
        <SectionHead label="Built for AI" title={<>Built for where AI is <span className="text-orange">going.</span></>}>
          A foundation for AI that works across models, remembers context, protects what’s private, and goes beyond conversation.
        </SectionHead>

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
