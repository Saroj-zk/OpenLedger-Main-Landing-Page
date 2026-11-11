import { useCallback, useEffect, useRef, useState, forwardRef } from 'react';
import ComputeOptionsFigure from '@/components/ComputeOptionsFigure';

/**
 * Where the money goes: revenue, costs, net, buyback, burn.
 *
 * Ported from the Hey Open site. The measurement and the drawn channel are
 * unchanged, because they are plain React and SVG; everything that was MUI
 * styling is now this site's own, so the section uses .shell, .eyebrow,
 * .display, .glass and data-reveal.
 *
 * ------------------------------------------------------------------
 * THE SHAPE IS THE ARGUMENT. Each stage is narrower than the one above
 * it, and the channel drawn behind them is measured from the real boxes
 * rather than drawn by hand, so it stays honest at any width and in any
 * font. Revenue arrives wide, costs come out, what is left is narrower,
 * the buyback is narrower still, and the burn is the narrowest thing on
 * the page.
 *
 * NOTHING HERE IS TO SCALE. There are no figures for any of it, and a
 * funnel drawn to proportion would imply there are. The widths are a
 * reading order, not a measurement.
 *
 * ------------------------------------------------------------------
 * THE FIGURES HAVE NOT BEEN REVIEWED. The four revenue lines and the four
 * deductions were given as names; the second line under each is a gloss,
 * kept to the shortest thing that is true. Check them against what the
 * protocol actually does before this is quoted anywhere.
 * ------------------------------------------------------------------
 */

const REVENUE = [
  'Enterprise inference & API',
  'Hey Open subscriptions',
  'Pay-as-you-go inference',
  'Compute Agent marketplace',
];

const COSTS = [
  { k: 'Inference', s: 'The compute behind every call' },
  { k: 'Platform Costs', s: 'Costs of running the platform' },
  { k: '$HEY credits', s: 'Compute already claimed' },
  { k: 'Reserves', s: 'Held back, not spent' },
];

/* What the reduction does, in the order it does it. Cost is the only one
   that goes down, and the other two go up because of it. */
const CHAIN = [
  { dir: 'down', k: 'Cost' },
  { dir: 'up', k: 'Net' },
  { dir: 'up', k: '$OPEN burned' },
];

/* How far the channel stands off the stages it wraps. */
const CLEAR = 9;

function column(points) {
  return points
    .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

/**
 * The channel behind the stages.
 *
 * Measures every stage and returns one path that hugs them, so the taper
 * follows the real boxes instead of a guess. A ResizeObserver watches the
 * wrapper and each stage, which is what keeps it correct when the font
 * loads or the column changes width.
 */
function useChannel(stageCount) {
  const wrapRef = useRef(null);
  const stageRefs = useRef([]);
  const [shape, setShape] = useState(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const measure = () => {
      const stages = stageRefs.current.filter(Boolean);
      if (stages.length < 2) return;

      const box = wrap.getBoundingClientRect();
      if (!box.width) return;

      const rows = stages.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left - box.left,
          right: r.right - box.left,
          mid: r.top - box.top + r.height / 2,
        };
      });

      const first = rows[0];
      const last = rows[rows.length - 1];

      const left = [
        { x: first.left - CLEAR, y: 0 },
        ...rows.map((r) => ({ x: r.left - CLEAR, y: r.mid })),
        { x: last.left - CLEAR, y: box.height },
      ];
      const right = [
        { x: last.right + CLEAR, y: box.height },
        ...rows.map((r) => ({ x: r.right + CLEAR, y: r.mid })).reverse(),
        { x: first.right + CLEAR, y: 0 },
      ];

      setShape({
        w: box.width,
        h: box.height,
        d: `${column(left)} L${right[0].x.toFixed(1)} ${right[0].y.toFixed(1)} ${column(right).slice(1)} Z`,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    stageRefs.current.filter(Boolean).forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [stageCount]);

  const setStage = useCallback((i) => (el) => {
    stageRefs.current[i] = el;
  }, []);

  return { wrapRef, setStage, shape };
}

/* ------------------------------------------------------------------ */
/* Parts                                                               */
/* ------------------------------------------------------------------ */

/** A joint. `op` puts the arithmetic sign on the axis. */
function Joint({ op }) {
  const stem = op ? 'h-[9px] md:h-[11px]' : 'h-[15px] md:h-[17px]';

  return (
    <div aria-hidden="true" className="flex flex-col items-center py-1.5">
      <div className={`${stem} border-l-[1.5px] border-dashed border-[--line-2]`} />
      {op && (
        <>
          <div className="glass my-1.5 flex h-[30px] w-[30px] items-center justify-center rounded-full text-[17px] font-bold leading-none text-fg">
            {op}
          </div>
          <div className={`${stem} border-l-[1.5px] border-dashed border-[--line-2]`} />
        </>
      )}
      <div className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-[--line-2]" />
    </div>
  );
}

/* Each stage's own treatment. Plain stages are held by the channel behind
   them rather than by a shadow of their own; the last two carry the weight,
   because they are the two the section is about. */
const TONE = {
  plain: 'glass text-fg',
  net: 'glass glass-orange text-fg',
  orange: 'bg-gradient-to-br from-orange-ember via-orange to-[#e85900] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_18px_34px_-22px_rgba(232,89,0,0.8)]',
  ink: 'bg-gradient-to-br from-[#262b36] via-[#141820] to-[#090c12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_20px_38px_-24px_rgba(20,24,32,0.85)]',
};

const LABEL_TONE = {
  plain: 'text-soft',
  net: 'text-orange',
  orange: 'text-white/80',
  ink: 'text-white/60',
};

/** One stage of the funnel. */
const Stage = forwardRef(function Stage(
  { width, label, tone = 'plain', icon, note, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`relative mx-auto rounded-[16px] px-5 py-4 text-center md:px-7 md:py-5 ${TONE[tone]}`}
      style={{ width }}
    >
      {icon}
      <div className={`eyebrow !text-[10px] !tracking-[0.14em] ${LABEL_TONE[tone]}`}>{label}</div>
      <div className="mt-1.5 font-sans text-[16px] font-semibold leading-snug tracking-tight md:text-[18px]">
        {children}
      </div>
      {note && (
        <div className={`mt-1 text-[12px] leading-snug md:text-[13px] ${LABEL_TONE[tone]}`}>
          {note}
        </div>
      )}
    </div>
  );
});

/** Where the money comes from. Four columns of one row, divided, not boxed. */
const Sources = forwardRef(function Sources(props, ref) {
  return (
    <div ref={ref} className="glass relative rounded-[16px] px-4 py-5 md:px-6">
      <div className="eyebrow !text-[10px] !tracking-[0.14em] mb-4 text-center">Revenue</div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-4 md:gap-0">
        {REVENUE.map((line, i) => (
          <div
            key={line}
            className={`text-center md:px-5 ${i === 0 ? '' : 'md:border-l md:border-[--line]'}`}
          >
            <div className="eyebrow !text-[10px] mb-2 text-orange">{`0${i + 1}`}</div>
            <div className="font-sans text-[13px] font-semibold leading-snug tracking-tight text-fg md:text-[14px]">
              {line}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/** What it costs to run, itemised, and what is being done about it. */
const Cost = forwardRef(function Cost(props, ref) {
  return (
    <div ref={ref} className="glass relative mx-auto w-full rounded-[16px] px-4 py-5 md:w-[88%] md:px-7">
      <div className="eyebrow !text-[10px] !tracking-[0.14em] text-center">Taken out of revenue</div>

      <div className="mb-5 mt-2 text-balance text-center font-sans text-[16px] font-semibold leading-snug tracking-tight text-fg md:text-[18px]">
        Reduced operating costs
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-4 md:gap-0">
        {COSTS.map((cost, i) => (
          <div
            key={cost.k}
            className={`text-center md:px-5 ${i === 0 ? '' : 'md:border-l md:border-[--line]'}`}
          >
            <div className="font-sans text-[14px] font-semibold leading-snug tracking-tight text-fg">
              {cost.k}
            </div>
            <div className="mt-1 text-[11.5px] leading-snug text-soft">{cost.s}</div>
          </div>
        ))}
      </div>

      {/* What the reduction does. Cost falls, and the other two rise because
          of it, which is the whole reason the deductions are on the page. */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-[12px] border border-orange/20 bg-orange/[0.07] px-4 py-3 md:px-6">
        {CHAIN.map((step, i) => (
          <div key={step.k} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="mr-3 text-[--line-2]">—</span>}
            <span
              aria-hidden="true"
              className={`text-[13px] leading-none ${step.dir === 'down' ? 'text-soft' : 'text-orange'}`}
            >
              {step.dir === 'down' ? '↓' : '↑'}
            </span>
            <span className="font-sans text-[13px] font-semibold tracking-tight text-fg">
              {step.k}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */

export default function RevenueBurn() {
  const { wrapRef, setStage, shape } = useChannel(5);

  return (
    <section
      id="burn"
      data-theme="light"
      data-parallax-root
      aria-labelledby="burn-title"
      className="theme-light relative overflow-hidden py-28 lg:py-40"
    >
      <div className="shell">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 max-w-[820px] lg:mb-12" data-reveal>
            <p className="eyebrow">Where your money goes</p>
            <h2 id="burn-title" className="display mt-5 text-[38px] sm:text-[52px] lg:text-[64px]">
              You use AI. <span className="text-orange">$OPEN burns.</span>
            </h2>
          </div>

          <div className="flex flex-col items-stretch gap-6 lg:flex-row" data-reveal>
            {/* ---- the funnel ---- */}
            <div
              data-liquid
              data-bezel="24"
              data-blur="10"
              className="glass min-w-0 rounded-[28px] px-4 py-7 md:px-8 lg:flex-[1_1_66.667%]"
            >
              <div ref={wrapRef} className="relative">
                {/* The channel the stages sit in, measured from them. */}
                {shape && (
                  <svg
                    aria-hidden="true"
                    viewBox={`0 0 ${shape.w} ${shape.h}`}
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                  >
                    <defs>
                      <linearGradient id="burnChannel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                        <stop offset="62%" stopColor="rgba(255,85,0,0.06)" />
                        <stop offset="100%" stopColor="rgba(255,85,0,0.12)" />
                      </linearGradient>
                    </defs>
                    <path
                      d={shape.d}
                      fill="url(#burnChannel)"
                      stroke="var(--line)"
                      strokeWidth="1"
                    />
                  </svg>
                )}

                <div className="relative">
                  <Sources ref={setStage(0)} />

                  <Joint op="−" />
                  <Cost ref={setStage(1)} />

                  <Joint op="=" />
                  <Stage
                    ref={setStage(2)}
                    width="56%"
                    label="Net"
                    tone="net"
                    note="A portion of it goes to the buyback"
                  >
                    Revenue after costs
                  </Stage>

                  <Joint />
                  <Stage
                    ref={setStage(3)}
                    width="44%"
                    label="Buyback"
                    tone="orange"
                    note="On the open market"
                  >
                    Buy $OPEN
                  </Stage>

                  <Joint />
                  <Stage
                    ref={setStage(4)}
                    width="38%"
                    label="Burn"
                    tone="ink"
                    note="Supply has one direction"
                    icon={
                      <span
                        aria-hidden="true"
                        className="mx-auto mb-1 block text-[18px] leading-none"
                      >
                        🔥
                      </span>
                    }
                  >
                    $OPEN, gone for good
                  </Stage>
                </div>
              </div>
            </div>

            {/* ---- enterprise: one of the things producing revenue line 01 ----

                The pair reads as a source and a destination: the funnel is
                where the money goes, and this is one of the places it comes
                from.

                NO RATE, NO PREMIUM, NO INDEX LEVEL. What a compute-price
                option costs or pays is not settled anywhere yet. */}
            <div
              data-liquid
              data-bezel="24"
              data-blur="10"
              className="glass flex min-w-0 flex-col justify-center rounded-[28px] px-6 py-7 md:px-8 lg:flex-[1_1_33.333%]"
            >
              <p className="eyebrow text-orange">Enterprise financial products</p>
              <h3 className="mt-4 text-balance font-sans text-[22px] font-semibold leading-tight tracking-tight text-fg md:text-[25px]">
                <span className="block">Compute options.</span>
                <span className="block text-orange">Predictable AI costs.</span>
              </h3>
              <p className="mb-7 mt-4 text-pretty text-[14px] leading-relaxed text-soft md:text-[15px]">
                Enterprises can hedge future GPU rental price exposure using compute-price
                options. Not another GPU rental platform.
              </p>

              <ComputeOptionsFigure />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
