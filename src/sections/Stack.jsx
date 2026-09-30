import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import WaveField from '@/components/WaveField';
import { SectionHead } from '@/components/ui';
import { Bot, Database, GitBranch, Layers, Lock, Sliders } from '@/icons';
import { prefersReducedMotion } from '@/lib/motion';

const layers = [
  { label: 'Multi-Model', title: 'The right model for every task.', body: 'Access leading models without being tied to a single provider.', Icon: Layers },
  { label: 'Universal Memory', title: 'Context that carries forward.', body: 'Keep memory consistent across models, conversations, and agents.', Icon: Database },
  { label: 'Private Context', title: 'Personal stays personal.', body: 'Keep conversations, preferences, and context under your control.', Icon: Lock },
  { label: 'Agentic AI', title: 'From answers to action.', body: 'AI that can research, create, monitor, and act with context.', Icon: Bot },
  { label: 'Smart Routing', title: 'The right model, automatically.', body: 'Match each task to the right model while optimizing context and token usage.', Icon: GitBranch },
  { label: 'User Control', title: 'You decide what AI knows.', body: 'Control what gets remembered, shared, and used.', Icon: Sliders },
];

export default function Stack() {
  const sum = useRef(null);

  // The closing line assembles itself term by term as it scrolls through view.
  useLayoutEffect(() => {
    const el = sum.current;
    if (!el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-term]'),
        { opacity: 0.18, y: 10 },
        { opacity: 1, y: 0, ease: 'none', stagger: 0.25, scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', scrub: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.3" className="ember-glow left-[-10%] top-[30%] h-[460px] w-[560px] opacity-50" aria-hidden="true" />
      <div data-speed="-0.25" className="ember-glow right-[-6%] top-[62%] h-[380px] w-[460px] opacity-45" aria-hidden="true" />
      <div data-speed="0.2" className="absolute inset-x-0 top-[24%] h-[70%] opacity-70">
        <WaveField tone="dark" lines={36} y={0.5} tilt={0.3} amplitude={0.08} spread={0.4} speed={0.6} />
      </div>

      <div className="shell relative">
        <SectionHead label="The OpenLedger AI Stack" title={<>AI is more than <span className="text-orange">a model.</span></>}>
          The next generation of AI needs access to the best models, memory that carries across them, privacy that stays with the user, and agents that can get things done.
        </SectionHead>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {layers.map(({ label, title, body, Icon }) => (
            <li
              key={label}
              data-reveal
              data-liquid
              data-bezel="24"
              data-blur="12"
              className="glass glass-dark group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] p-7 sm:p-8"
            >
              <span className="absolute inset-x-8 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-orange to-transparent transition-transform duration-700 group-hover:scale-x-100" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">{label}</p>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-bone/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] transition-colors group-hover:text-orange">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              </div>
              <h3 className="mt-auto pt-12 text-[24px] font-medium leading-tight tracking-[-0.025em] text-fg">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-soft">{body}</p>
            </li>
          ))}
        </ul>

        <div ref={sum} className="mt-14 lg:mt-20">
          <p className="sr-only">Multi-Model + Universal Memory + Private Context + Agents + Smart Routing + User Control</p>
          <div
            aria-hidden="true"
            data-liquid
            data-bezel="20"
            data-blur="10"
            className="glass glass-dark flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[24px] px-6 py-6 text-center sm:px-10"
          >
            {['Multi-Model', 'Universal Memory', 'Private Context', 'Agents', 'Smart Routing', 'User Control'].map((t, i) => (
              <span key={t} data-term className="flex items-center gap-3">
                {i > 0 && <span className="font-pixel text-[22px] text-orange">+</span>}
                <span className="display whitespace-nowrap text-[20px] sm:text-[22px] xl:text-[25px]">{t}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
