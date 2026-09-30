import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

/*
 * A faithful, scaled copy of the HeyOpen chat home (ais.openledger.xyz/chat):
 * icon rail, "Ask anything." hero, composer with model picker, prompt chips.
 * It is laid out at the product's own pixel sizes and scaled to fit, so type
 * and spacing keep the real proportions. The model picker opens on a loop and
 * steps through real models to show switching without losing the session.
 */

const MODELS = [
  { name: 'GPT 3.5 Turbo', icon: '/heyopen/Chatgpt.svg', mono: true, tags: ['Incognito'] },
  { name: 'Claude Sonnet 5', icon: '/heyopen/Claude_AI_symbol.svg', tags: ['Incognito'] },
  { name: 'Deepseek V4 Pro', icon: '/heyopen/deepseek-color.svg', tags: ['Incognito', 'web'] },
  { name: 'Gemini 2.5 Pro', icon: '/heyopen/Gemini.svg', mono: true, tags: ['Incognito', 'web'] },
];

const CHIPS = [
  ['Weather', <><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" /></>],
  ['Code', <><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></>],
  ['Write', <><path d="M13 21h8" /><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></>],
  ['Analyze', <><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>],
  ['Brainstorm', <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>],
];

const RAIL_TOP = [
  { mask: '/heyopen/Chat.svg' },
  { svg: <><path d="M12 3v18" /><path d="m19 8 3 8a5 5 0 0 1-6 0zV7" /><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" /><path d="m5 8 3 8a5 5 0 0 1-6 0zV7" /><path d="M7 21h10" /></> },
  { mask: '/heyopen/Home.svg' },
  { mask: '/heyopen/Agents.svg' },
  { mask: '/heyopen/Feed.svg' },
];
const RAIL_BOTTOM = [
  <><path d="M12 16h.01" /><path d="M16 16h.01" /><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" /><path d="M8 16h.01" /></>,
  <><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" /><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" /></>,
  <><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></>,
  <><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" /><path d="M15 6h1v4" /><path d="m6.134 14.768.866-.5 2 3.464" /><circle cx="16" cy="8" r="6" /></>,
];

function Icon({ children, className = 'h-[18px] w-[18px]' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

function Mask({ src, className = 'h-[18px] w-[18px]' }) {
  return (
    <span
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{ WebkitMask: `url(${src}) center / contain no-repeat`, mask: `url(${src}) center / contain no-repeat` }}
    />
  );
}

function ModelMark({ model, className = 'h-4 w-4' }) {
  return model.mono ? <Mask src={model.icon} className={className} /> : <img src={model.icon} alt="" className={className} />;
}

function Tag({ children }) {
  const incognito = children === 'Incognito';
  return (
    <span className={`rounded-full px-2 py-[1px] text-[10px] font-medium ${incognito ? 'bg-[#a855f7]/20 text-[#d8b4fe] ring-1 ring-[#a855f7]/40' : 'bg-white/10 text-[#a1a1aa]'}`}>
      {children}
    </span>
  );
}

/** Lays children out at a fixed design size and scales them to the container width. */
function Scaled({ width, height, children }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${width} / ${height}` }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function useModelLoop() {
  const [state, setState] = useState({ active: 0, hover: 0, open: false });
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const cycle = () => {
      setState((s) => ({ ...s, open: true, hover: s.active }));
      at(700, () => setState((s) => ({ ...s, hover: (s.active + 1) % MODELS.length })));
      at(1500, () => setState((s) => ({ ...s, active: s.hover })));
      at(1900, () => setState((s) => ({ ...s, open: false })));
    };
    const first = setTimeout(cycle, 1400);
    const id = setInterval(cycle, 4200);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, []);
  return state;
}

export default function HeyOpenProduct() {
  const { active, hover, open } = useModelLoop();
  const [compact, setCompact] = useState(false);
  const wrap = useRef(null);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < 640));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  const W = compact ? 560 : 1120;
  const H = compact ? 620 : 680;
  const model = MODELS[active];

  return (
    <div
      ref={wrap}
      role="img"
      aria-label={`HeyOpen chat: the model picker switching to ${model.name}, in Incognito mode`}
      className="overflow-hidden rounded-[22px] shadow-[0_60px_120px_-50px_rgba(60,25,5,.6),0_0_0_1px_rgba(0,0,0,.85),inset_0_1px_0_rgba(255,255,255,.08)] sm:rounded-[26px]"
    >
      <Scaled width={W} height={H}>
        <div aria-hidden="true" className="flex h-full w-full bg-[#09090b] font-sans text-[#dcdcdc]">
          {/* Icon rail */}
          {!compact && (
            <div className="flex w-[80px] shrink-0 flex-col items-center gap-[14px] py-[18px] text-[#a1a1aa]">
              <Mask src="/heyopen/openchat_icon_mark.svg" className="mb-[8px] h-[26px] w-[26px] text-[#dcdcdc]" />
              <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#18181b] text-[#dcdcdc]">
                <Icon className="h-[16px] w-[16px]"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></Icon>
              </span>
              <span className="grid h-[36px] w-[36px] place-items-center rounded-full border border-[#3f3f46] text-[#dcdcdc]">
                <Icon className="h-[16px] w-[16px]"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></Icon>
              </span>
              {RAIL_TOP.map((it, i) => (
                <span key={i} className="grid h-[28px] w-[28px] place-items-center">
                  {it.mask ? <Mask src={it.mask} /> : <Icon>{it.svg}</Icon>}
                </span>
              ))}
              <span className="my-[2px] h-px w-[32px] bg-[#27272a]" />
              {RAIL_BOTTOM.map((p, i) => (
                <span key={i} className="grid h-[28px] w-[28px] place-items-center">
                  <Icon>{p}</Icon>
                </span>
              ))}
              <span className="mt-auto grid h-[36px] w-[36px] place-items-center rounded-full border border-[#3f3f46]">
                <Icon className="h-[16px] w-[16px]"><path d="m10 17 5-5-5-5" /><path d="M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></Icon>
              </span>
            </div>
          )}

          {/* Main panel */}
          <div className={`relative flex flex-1 flex-col overflow-hidden rounded-[16px] border border-[#27272a] bg-[#0a0a0c] ${compact ? 'm-[8px]' : 'my-[8px] mr-[8px]'}`}>
            <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[#27272a] px-[14px]">
              {compact ? <Mask src="/heyopen/openchat_icon_mark.svg" className="h-[24px] w-[24px]" /> : <span />}
              <span className="flex h-[36px] items-center gap-[8px] rounded-full bg-white px-[16px] text-[14px] font-medium text-[#09090b]">
                <Icon className="h-[16px] w-[16px]"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></Icon>
                Connect wallet
              </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-[24px] pb-[40px]">
              <h3 className="text-center font-fraunces text-[46px] font-medium leading-[1.08] tracking-[-1.2px] text-[#dcdcdc]">
                Ask anything.
                <br />
                <span className="italic">Think in the open.</span>
              </h3>
              <p className="mt-[18px] text-center text-[14.5px] leading-[1.7] text-[#a1a1aa]">
                A private, multi-model AI experience
                <br />
                with no account required to start.
              </p>

              {/* Composer */}
              <div className="relative mt-[34px] w-full max-w-[620px]">
                {/* Model picker */}
                <div
                  className={`absolute bottom-[calc(100%+10px)] left-0 z-10 w-[380px] origin-bottom-left rounded-[18px] border border-[#3f3f46] bg-[#18181b]/95 p-[6px] shadow-[0_24px_60px_-12px_rgba(0,0,0,.8)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
                    open ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-[6px] scale-[.97] opacity-0'
                  }`}
                >
                  <div className="mb-[4px] flex items-center gap-[8px] rounded-[12px] bg-[#27272a]/70 px-[12px] py-[9px] text-[13px] text-[#71717a]">
                    <Icon className="h-[14px] w-[14px]"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></Icon>
                    Search models…
                  </div>
                  {MODELS.map((m, i) => (
                    <div
                      key={m.name}
                      className={`flex items-center gap-[10px] rounded-[12px] px-[10px] py-[8px] transition-colors duration-200 ${i === hover ? 'bg-white/[0.07] ring-1 ring-white/10' : ''}`}
                    >
                      <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-white/[0.06]">
                        <ModelMark model={m} className="h-[15px] w-[15px]" />
                      </span>
                      <span className="flex-1 text-[13.5px] font-medium text-[#e4e4e7]">
                        {m.name}
                        {i === active && <span className="ml-[6px] text-[#a1a1aa]">✓</span>}
                      </span>
                      <span className="flex gap-[4px]">
                        {m.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-[20px] border border-[#3f3f46] bg-[#18181b] shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#27272a] px-[16px] py-[16px]">
                    <span className="text-[15px] text-[#71717a]">Send a message…&nbsp; (@ to mention, / for commands)</span>
                    <Icon className="h-[16px] w-[16px] text-[#a1a1aa]"><path d="M15 3h6v6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /><path d="M9 21H3v-6" /></Icon>
                  </div>
                  <div className="flex items-center justify-between px-[16px] py-[10px]">
                    <span className={`flex h-[32px] items-center gap-[8px] rounded-full px-[4px] text-[14px] font-medium transition-colors ${open ? 'bg-white/[0.06] pl-[10px] pr-[10px]' : ''}`}>
                      <ModelMark model={model} className="h-[16px] w-[16px]" />
                      <span key={model.name} className="animate-[row-in_.45s_var(--ease-out)_both]">
                        {model.name}
                      </span>
                      <Icon className={`h-[14px] w-[14px] text-[#a1a1aa] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></Icon>
                    </span>
                    <span className="flex items-center gap-[14px]">
                      <Icon className="h-[16px] w-[16px] text-[#a1a1aa]"><path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" /></Icon>
                      <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-white text-[#09090b]">
                        <Icon className="h-[16px] w-[16px]"><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></Icon>
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-[16px] flex flex-wrap justify-center gap-[8px]">
                {(compact ? CHIPS.slice(0, 3) : CHIPS).map(([label, paths]) => (
                  <span key={label} className="flex h-[38px] items-center gap-[8px] rounded-full border border-[#3f3f46] bg-[#18181b] px-[14px] text-[14px] font-medium text-[#dcdcdc]">
                    <Icon className="h-[15px] w-[15px]">{paths}</Icon>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Scaled>
    </div>
  );
}
