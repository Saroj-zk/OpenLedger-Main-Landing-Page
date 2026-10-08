import { useEffect, useRef, useState } from 'react';
import WaveField from '@/components/WaveField';
import { SectionHead } from '@/components/ui';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * The OpenLedger AI stack. Each capability gets a small, live piece of the
 * HeyOpen product rather than an abstract illustration: the real model
 * picker, the model switch that keeps your memory, token-aware routing,
 * an agent paying a tool over x402, and an uncensored route.
 */

/** Counts up on an interval while `ref` is on screen; stays at 0 for reduced motion. */
function useTicker(ref, ms) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let id = 0;
    const io = new IntersectionObserver(([entry]) => {
      clearInterval(id);
      if (entry.isIntersecting) id = setInterval(() => setTick((t) => t + 1), ms);
    });
    io.observe(ref.current);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [ref, ms]);
  return tick;
}

function Icon({ children, className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const LOGOS = {
  gpt: { src: '/heyopen/Chatgpt.svg', mono: true },
  claude: { src: '/heyopen/Claude_AI_symbol.svg' },
  deepseek: { src: '/heyopen/deepseek-color.svg' },
  gemini: { src: '/heyopen/Gemini.svg', mono: true },
};

/** Provider logo from the HeyOpen app, or the model's initial when we don't ship its mark. */
function ModelMark({ kind, name, className = 'h-4 w-4' }) {
  const l = LOGOS[kind];
  if (!l) {
    return <span className={`grid shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[9px] font-semibold text-bone/80 ${className}`}>{name[0]}</span>;
  }
  if (l.mono) {
    return <span className={`inline-block shrink-0 bg-current ${className}`} style={{ WebkitMask: `url(${l.src}) center / contain no-repeat`, mask: `url(${l.src}) center / contain no-repeat` }} />;
  }
  return <img src={l.src} alt="" className={`shrink-0 ${className}`} />;
}

const TAG_STYLE = {
  Incognito: 'bg-[#a855f7]/20 text-[#d8b4fe] ring-[#a855f7]/40',
  web: 'bg-white/10 text-[#a1a1aa] ring-white/10',
  E2EE: 'bg-[#22c55e]/15 text-[#86efac] ring-[#22c55e]/35',
  TEE: 'bg-[#22c55e]/15 text-[#86efac] ring-[#22c55e]/35',
  uncensored: 'bg-orange/15 text-orange-amber ring-orange/40',
};

function Tag({ children }) {
  return <span className={`rounded-full px-2 py-[1px] text-[10px] font-medium ring-1 ${TAG_STYLE[children]}`}>{children}</span>;
}

/* ---------- Multi-Model: the HeyOpen model picker, scrolling ---------- */
const PICKER = [
  ['GPT 5.1', 'gpt', ['Incognito', 'web']],
  ['Claude Sonnet 5', 'claude', ['Incognito']],
  ['Deepseek V4 Flash E2ee', 'deepseek', ['E2EE', 'TEE']],
  ['Gemini 2.5 Pro', 'gemini', ['Incognito', 'web']],
  ['GLM 5.2', null, ['TEE']],
  ['Gemma 4 26b Uncensored', 'gemini', ['uncensored']],
  ['Grok 4.6', null, ['Incognito', 'web']],
  ['Claude Opus 5', 'claude', ['Incognito', 'web']],
  ['GLM 5.3 Flash E2ee', null, ['E2EE', 'TEE']],
  ['Deepseek V4 Pro', 'deepseek', ['Incognito', 'web']],
  ['Codestral 2508', null, ['Incognito', 'web']],
  ['GPT 5.6 Sol', 'gpt', ['Incognito']],
];

function ModelsVisual() {
  return (
    <div className="relative grid h-full items-center gap-4 px-5 sm:grid-cols-[0.8fr_1.2fr] sm:pl-9 sm:pr-5">
      <span className="absolute right-3 top-3 z-10 rounded-lg bg-[#0c0a09] px-2 py-1 font-pixel text-[18px] leading-none text-orange ring-1 ring-orange/30 sm:hidden">200+</span>
      <div className="hidden sm:block">
        <p className="font-pixel text-[56px] leading-none text-orange sm:text-[80px]">200+</p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-bone/50">models</p>
      </div>
      <div className="h-[220px] overflow-hidden rounded-[18px] border border-[#3f3f46] bg-[#18181b]/90 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,.9)]">
        <div className="mb-1 flex items-center gap-2 rounded-[12px] bg-[#27272a]/70 px-3 py-2 text-[12px] text-[#71717a]">
          <Icon className="h-3.5 w-3.5">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </Icon>
          Search models…
        </div>
        <div className="h-[170px] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_12%,#000_85%,transparent)]">
          <ul className="animate-[marquee-y_28s_linear_infinite]">
            {[...PICKER, ...PICKER].map(([name, kind, tags], i) => (
              <li key={`${name}-${i}`} className="flex items-center gap-2.5 rounded-[10px] px-2.5 py-[7px] text-[#e4e4e7]">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/[0.06]">
                  <ModelMark kind={kind} name={name} className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium">{name}</span>
                <span className="flex shrink-0 gap-1">
                  {tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Universal Memory: switch the model, the memory stays attached ---------- */
const SWITCH = [
  ['GPT 5.1', 'gpt'],
  ['Claude Sonnet 5', 'claude'],
  ['Deepseek V4 Pro', 'deepseek'],
  ['Gemini 2.5 Pro', 'gemini'],
];

const CONTEXT = [
  ['Preferences', <><path d="M20 7h-9" /><path d="M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></>],
  ['Projects', <><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></>],
  ['History', <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></>],
];

function ModelPill({ model, on }) {
  const [name, kind] = model;
  return (
    <span
      className={`flex h-9 min-w-0 items-center gap-2 rounded-full border px-3 text-[12.5px] font-medium transition-all duration-500 ${
        on ? 'border-orange/50 bg-[#1f140d] text-[#f4f4f5] shadow-[0_0_24px_-6px_rgba(255,85,0,.6)]' : 'border-white/[0.08] bg-[#141110] text-[#71717a] opacity-60'
      }`}
    >
      <ModelMark kind={kind} name={name} className="h-3.5 w-3.5" />
      <span key={name} className="truncate animate-[row-in_.45s_var(--ease-out)_both]">
        {name}
      </span>
    </span>
  );
}

/*
 * Two model slots share one context. Each switch hands over to the other slot:
 * the old model dims, the new one lights its line into the same context panel,
 * and every item ticks as carried over.
 */
function MemoryVisual() {
  const ref = useRef(null);
  const tick = useTicker(ref, 2600);
  const current = SWITCH[tick % SWITCH.length];
  const previous = SWITCH[(tick + SWITCH.length - 1) % SWITCH.length];
  const right = tick % 2 === 1; // which slot holds the model you just switched to
  const slots = right ? [previous, current] : [current, previous];

  return (
    <div ref={ref} className="flex h-full flex-col justify-center px-5 sm:px-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <ModelPill model={slots[0]} on={!right} />
        <span className={`text-orange transition-transform duration-500 ${right ? '' : 'rotate-180'}`} aria-hidden="true">
          <Icon className="h-4 w-4">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </Icon>
        </span>
        <ModelPill model={slots[1]} on={right} />
      </div>

      {/* Both slots plug into the same context */}
      <svg className="mx-auto h-8 w-[70%]" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 0 C8 18, 50 14, 50 32" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1.4" strokeDasharray={right ? '3 4' : '0'} className={`transition-colors duration-500 ${right ? 'stroke-white/15' : 'stroke-orange'}`} />
        <path d="M92 0 C92 18, 50 14, 50 32" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1.4" strokeDasharray={right ? '0' : '3 4'} className={`transition-colors duration-500 ${right ? 'stroke-orange' : 'stroke-white/15'}`} />
      </svg>

      <div className="rounded-2xl border border-white/[0.08] bg-[#120e0b] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,.9)]">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone/60">
            <Icon className="h-3 w-3 text-orange">
              <rect width="18" height="11" x="3" y="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </Icon>
            Your context
          </span>
          <span key={tick} className="flex items-center gap-1 rounded-full bg-[#22c55e]/15 px-2 py-0.5 font-mono text-[10px] text-[#86efac] animate-[row-in_.5s_var(--ease-out)_both]">
            <Icon className="h-2.5 w-2.5">
              <path d="M20 6 9 17l-5-5" />
            </Icon>
            Carried over
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-2">
          {CONTEXT.map(([label, icon], i) => (
            <li
              key={`${label}-${tick}`}
              className="flex flex-col items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
              style={{ animation: tick ? `mem-pulse 1.1s ${0.15 + i * 0.12}s var(--ease-out) both` : undefined }}
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-orange/15 text-orange">
                <Icon className="h-3.5 w-3.5">{icon}</Icon>
              </span>
              <span className="text-[11.5px] font-medium text-[#e4e4e7]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Token Optimization: the router picks the leanest capable route ---------- */
const ROUTES = [
  ['Claude Opus 5', 'claude'],
  ['GPT 5.1', 'gpt'],
  ['Deepseek V4 Flash', 'deepseek'],
];
// Token cost of each route for three different tasks; the router takes the lowest.
const TASKS = [
  [86, 72, 34],
  [64, 38, 70],
  [40, 78, 66],
];

function TokensVisual() {
  const ref = useRef(null);
  const tick = useTicker(ref, 2600);
  const costs = TASKS[tick % TASKS.length];
  const best = costs.indexOf(Math.min(...costs));
  return (
    <div ref={ref} className="flex h-full flex-col justify-center gap-3 px-6 sm:px-7">
      {ROUTES.map(([name, kind], i) => {
        const on = i === best;
        return (
          <div key={name} className={`rounded-xl border px-3 py-2.5 transition-colors duration-500 ${on ? 'border-orange/50 bg-orange/[0.08]' : 'border-white/[0.07] bg-white/[0.025]'}`}>
            <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#e4e4e7]">
              <ModelMark kind={kind} name={name} className="h-3.5 w-3.5" />
              <span className="flex-1 truncate">{name}</span>
              <span className={`grid h-4 w-4 place-items-center rounded-full transition-all duration-500 ${on ? 'scale-100 bg-orange text-black' : 'scale-50 opacity-0'}`}>
                <Icon className="h-2.5 w-2.5">
                  <path d="M20 6 9 17l-5-5" />
                </Icon>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <span
                className={`block h-full rounded-full transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${on ? 'bg-orange' : 'bg-white/25'}`}
                style={{ width: `${costs[i]}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Agentic AI + x402: an agent run, with payments kept inside a limit ---------- */
const STEPS = [
  ['Search', <><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></>],
  ['Run code', <><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></>],
  ['Paid API call', <><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></>, true],
];

function Spinner() {
  return <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-orange/25 border-t-orange" />;
}

function AgentVisual() {
  const ref = useRef(null);
  const tick = useTicker(ref, 1100);
  // 0–2: step i running · 3: payment settled · 4–5: hold the finished run, then repeat
  const phase = tick % 6;
  const paid = phase >= 3;

  return (
    <div ref={ref} className="flex h-full items-center px-5 sm:px-6">
      <div className="w-full rounded-2xl border border-white/[0.08] bg-[#120e0b] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,.9)]">
        <div className="flex items-center gap-2.5 px-1 pb-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#ff8a4a] to-[#e04000] text-black shadow-[0_6px_18px_-6px_rgba(255,85,0,.8)]">
            <Icon className="h-4 w-4">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
            </Icon>
          </span>
          <span className="text-[13px] font-medium text-[#f4f4f5]">Agent</span>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/55">
            <span className={`h-1.5 w-1.5 rounded-full ${phase < 3 ? 'animate-pulse bg-orange' : 'bg-[#86efac]'}`} />
            {phase < 3 ? 'Running' : 'Done'}
          </span>
        </div>

        <ul className="space-y-1.5">
          {STEPS.map(([label, icon, pay], i) => {
            const done = phase > i;
            const running = phase === i;
            return (
              <li
                key={label}
                className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-all duration-500 ${
                  running ? 'border-orange/40 bg-orange/[0.07]' : 'border-white/[0.06] bg-white/[0.025]'
                } ${phase < i ? 'opacity-40' : 'opacity-100'}`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors ${done || running ? 'bg-orange/15 text-orange' : 'bg-white/[0.05] text-bone/40'}`}>
                  <Icon className="h-3.5 w-3.5">{icon}</Icon>
                </span>
                <span className="text-[12px] font-medium text-[#e4e4e7]">{label}</span>
                {pay && <span className="rounded-md bg-white/[0.06] px-1.5 py-[1px] font-mono text-[10px] text-orange-amber ring-1 ring-orange/25">x402</span>}
                <span className="ml-auto flex items-center">
                  {running && <Spinner />}
                  {done && (
                    <span className={`flex items-center gap-1 font-mono text-[10px] ${pay ? 'text-[#86efac]' : 'text-bone/50'} animate-[row-in_.4s_var(--ease-out)_both]`}>
                      {pay && 'Paid'}
                      <Icon className="h-3 w-3">
                        <path d="M20 6 9 17l-5-5" />
                      </Icon>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Spend stays inside the limit the user set */}
        <div className="mt-2.5 px-1">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
            <span className="text-bone/50">Spend limit</span>
            <span className={`transition-colors duration-500 ${paid ? 'text-[#86efac]' : 'text-bone/30'}`}>Within limit</span>
          </div>
          <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange to-orange-amber transition-[width] duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: paid ? '22%' : '6%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Uncensored AI: the question goes straight through ---------- */
function UncensoredVisual() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6 sm:px-7">
      <div className="ml-auto w-[78%] rounded-2xl rounded-br-md bg-white/[0.08] px-3.5 py-3">
        <span className="block h-1.5 w-full rounded-full bg-white/40" />
        <span className="mt-2 block h-1.5 w-[60%] rounded-full bg-white/40" />
      </div>
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 border-t border-dashed border-white/15" />
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.05] text-bone/40 ring-1 ring-white/10">
          <Icon className="h-4 w-4">
            <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
            <path d="m16.5 3.5 5 5" />
            <path d="m21.5 3.5-5 5" />
          </Icon>
        </span>
        <span className="h-px flex-1 border-t border-dashed border-white/15" />
      </div>
      <div className="w-[88%] rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.03] px-3.5 py-3">
        <span className="flex items-center gap-2">
          <ModelMark kind="gemini" name="Gemma" className="h-3.5 w-3.5 text-[#e4e4e7]" />
          <span className="min-w-0 truncate text-[12px] font-medium text-[#e4e4e7]">Gemma 4 26b Uncensored</span>
          <Tag>uncensored</Tag>
        </span>
        <span className="mt-3 block h-1.5 w-full rounded-full bg-orange-amber/60" />
        <span className="mt-2 block h-1.5 w-[82%] rounded-full bg-orange-amber/60" />
        <span className="mt-2 block h-1.5 w-[55%] rounded-full bg-orange-amber/60" />
      </div>
    </div>
  );
}

const cards = [
  {
    label: 'Multi-Model',
    title: '200+ models. One private experience.',
    body: 'Every leading provider, routed privately.',
    Visual: ModelsVisual,
    span: 'md:col-span-2 lg:col-span-7',
  },
  {
    label: 'Universal Memory',
    title: 'Switch models. Keep your context.',
    body: 'Your memory moves with you. You decide what each model sees.',
    Visual: MemoryVisual,
    span: 'lg:col-span-5',
  },
  {
    label: 'Token Optimization',
    title: 'Smarter requests. Less overhead.',
    body: 'The right model for the job, with fewer wasted tokens.',
    Visual: TokensVisual,
    span: 'lg:col-span-4',
  },
  {
    label: 'Agentic AI + x402',
    title: 'Capabilities, not a blank check.',
    body: 'Connect agents to tools and services, with x402 for controlled, automated transactions.',
    Visual: AgentVisual,
    span: 'lg:col-span-4',
  },
  {
    label: 'Uncensored AI',
    title: 'Your questions. Unfiltered.',
    body: 'Uncensored models, with no extra platform filtering on supported routes.',
    Visual: UncensoredVisual,
    span: 'lg:col-span-4',
  },
];

export default function Stack() {
  return (
    <section id="stack" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.3" className="ember-glow left-[-10%] top-[30%] h-[460px] w-[560px] opacity-40" aria-hidden="true" />
      <div data-speed="-0.25" className="ember-glow right-[-6%] top-[62%] h-[380px] w-[460px] opacity-35" aria-hidden="true" />
      <div data-speed="0.2" className="absolute inset-x-0 top-[6%] h-[45%] opacity-70">
        <WaveField tone="dark" lines={36} y={0.5} tilt={-0.18} amplitude={0.1} spread={0.36} speed={0.6} />
      </div>

      <div className="shell relative">
        <SectionHead label="The OpenLedger AI Stack" title={<>Every model, <span className="text-orange">privately yours.</span></>}>
          One memory that follows you from model to model, so you never start over or overshare.
        </SectionHead>

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {cards.map(({ label, title, body, Visual, span }) => (
            <li
              key={label}
              data-reveal
              className={`glass glass-dark group flex flex-col overflow-hidden rounded-[28px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 ${span}`}
            >
              <div className="relative h-[264px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)]" aria-hidden="true">
                <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]" />
                <div className="relative h-full">
                  <Visual />
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-white/[0.07] px-7 pb-7 pt-6 sm:px-8">
                <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">{label}</p>
                <h3 className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.02em] text-fg sm:text-[24px]">{title}</h3>
                <p className="mt-2.5 max-w-[520px] text-[15.5px] leading-relaxed text-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
