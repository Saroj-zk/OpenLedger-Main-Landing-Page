import { useEffect, useRef, useState } from 'react';
import WaveField from '@/components/WaveField';
import { SectionSwitch } from '@/components/CopySwitcher';
import { SectionHead } from '@/components/ui';
import { prefersReducedMotion } from '@/lib/motion';
import { Headline } from '@/content/copy';
import { useCopy } from '@/content/context';

/*
 * The OpenLedger AI stack. Each capability gets a small, live piece of the
 * HeyOpen product rather than an abstract illustration: the real model
 * picker, the model switch that keeps your memory, per-model context sharing,
 * token-aware routing, an agent paying a tool over x402, and an uncensored route.
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

function MemoryVisual() {
  const ref = useRef(null);
  const tick = useTicker(ref, 2400);
  const [name, kind] = SWITCH[tick % SWITCH.length];
  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <span className="flex h-10 items-center gap-2.5 rounded-full border border-[#3f3f46] bg-[#18181b] pl-3 pr-4 text-[13.5px] font-medium text-[#e4e4e7] shadow-[0_12px_30px_-12px_rgba(0,0,0,.9)]">
        <ModelMark kind={kind} name={name} />
        <span key={name} className="animate-[row-in_.45s_var(--ease-out)_both]">
          {name}
        </span>
        <Icon className="h-3.5 w-3.5 text-[#a1a1aa]">
          <path d="m7 15 5 5 5-5" />
          <path d="m7 9 5-5 5 5" />
        </Icon>
      </span>
      <span className="h-5 w-px bg-gradient-to-b from-orange/70 to-orange/10" aria-hidden="true" />
      <ul className="w-full max-w-[300px] space-y-2">
        {[78, 62, 70].map((w, i) => (
          <li
            key={`${i}-${tick}`}
            className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
            style={{ animation: tick ? `mem-pulse 1s ${i * 0.1}s var(--ease-out) both` : undefined }}
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-orange/15 text-orange">
              <Icon className="h-3 w-3">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </Icon>
            </span>
            <span className="h-1.5 rounded-full bg-white/25" style={{ width: `${w}%` }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Private Context: you choose what each model can read ---------- */
const CONTEXT = ['Projects', 'Writing style', 'Health notes'];
// What's shared with each model, as on/off per CONTEXT item.
const SHARING = [
  ['Claude Sonnet 5', 'claude', [1, 1, 0]],
  ['Deepseek V4 Flash E2ee', 'deepseek', [1, 1, 1]],
  ['GPT 5.1', 'gpt', [1, 0, 0]],
];

function ContextVisual() {
  const ref = useRef(null);
  const tick = useTicker(ref, 2600);
  const [name, kind, on] = SHARING[tick % SHARING.length];
  return (
    <div ref={ref} className="flex h-full items-center px-5 sm:px-6">
      <div className="w-full rounded-2xl border border-white/[0.08] bg-[#120e0b] p-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,.9)]">
        <div className="flex items-center gap-2 px-1 pb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone/50">Shared with</span>
          <span className="ml-auto flex h-7 items-center gap-2 rounded-full border border-[#3f3f46] bg-[#18181b] pl-2 pr-3 text-[12px] font-medium text-[#e4e4e7]">
            <ModelMark kind={kind} name={name} className="h-3.5 w-3.5" />
            <span key={name} className="animate-[row-in_.45s_var(--ease-out)_both]">
              {name}
            </span>
          </span>
        </div>
        <ul className="space-y-1.5">
          {CONTEXT.map((item, i) => (
            <li key={item} className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2">
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors duration-500 ${on[i] ? 'bg-orange/15 text-orange' : 'bg-white/[0.05] text-bone/35'}`}>
                <Icon className="h-3.5 w-3.5">
                  <rect width="18" height="11" x="3" y="11" rx="2" />
                  <path d={on[i] ? 'M7 11V7a5 5 0 0 1 9.9-1' : 'M7 11V7a5 5 0 0 1 10 0v4'} />
                </Icon>
              </span>
              <span className={`text-[12px] font-medium transition-colors duration-500 ${on[i] ? 'text-[#e4e4e7]' : 'text-bone/40'}`}>{item}</span>
              {/* Share toggle */}
              <span className={`relative ml-auto h-4 w-7 shrink-0 rounded-full transition-colors duration-500 ${on[i] ? 'bg-orange' : 'bg-white/[0.12]'}`}>
                <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-[left] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${on[i] ? 'left-[14px]' : 'left-0.5'}`} />
              </span>
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

        {/* The paid call settles over x402 without the user stepping in */}
        <div className="mt-2.5 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.12em]">
          <span className="text-bone/50">x402 settlement</span>
          <span className={`flex items-center gap-1.5 transition-colors duration-500 ${paid ? 'text-[#86efac]' : 'text-bone/30'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${paid ? 'bg-[#86efac]' : 'animate-pulse bg-bone/30'}`} />
            {paid ? 'Settled' : 'Pending'}
          </span>
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

const VISUALS = {
  models: ModelsVisual,
  memory: MemoryVisual,
  context: ContextVisual,
  tokens: TokensVisual,
  agents: AgentVisual,
  uncensored: UncensoredVisual,
};

// Bento spans on the 12-column grid, by how many cards the copy has.
const SPANS = {
  5: ['md:col-span-2 lg:col-span-7', 'lg:col-span-5', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4'],
  6: ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7', 'lg:col-span-6', 'lg:col-span-6'],
};

export default function Stack() {
  const { copy } = useCopy();
  const c = copy.platform;
  const spans = SPANS[c.cards.length];
  return (
    <section id="stack" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-28 lg:py-40">
      <SectionSwitch section="platform" />
      <div data-speed="0.3" className="ember-glow left-[-10%] top-[30%] h-[460px] w-[560px] opacity-40" aria-hidden="true" />
      <div data-speed="-0.25" className="ember-glow right-[-6%] top-[62%] h-[380px] w-[460px] opacity-35" aria-hidden="true" />
      <div data-speed="0.2" className="absolute inset-x-0 top-[6%] h-[45%] opacity-70">
        <WaveField tone="dark" lines={36} y={0.5} tilt={-0.18} amplitude={0.1} spread={0.36} speed={0.6} />
      </div>

      <div className="shell relative">
        <SectionHead label={c.label} title={<Headline h={c.h} />}>
          {c.sub}
        </SectionHead>

        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12">
          {c.cards.map(({ visual, label, title, body }, i) => {
            const Visual = VISUALS[visual];
            return (
            <li
              key={visual}
              data-reveal
              className={`glass glass-dark group flex flex-col overflow-hidden rounded-[28px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1 ${spans[i]}`}
            >
              <div className="relative h-[264px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)]" aria-hidden="true">
                <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]" />
                <div className="relative h-full">
                  <Visual />
                </div>
              </div>
              <div className="flex flex-1 flex-col border-t border-white/[0.07] px-7 pb-7 pt-6 sm:px-8">
                {label && <p className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">{label}</p>}
                <h3 className="text-[22px] font-medium leading-tight tracking-[-0.02em] text-fg sm:text-[24px]">{title}</h3>
                <p className="mt-2.5 max-w-[520px] text-[15.5px] leading-relaxed text-soft">{body}</p>
              </div>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
