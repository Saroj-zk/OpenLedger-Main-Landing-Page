import { useEffect, useState } from 'react';

/**
 * Enterprise: custom-branded AI, and the compute protection behind it.
 *
 * Ported from the Hey Open site, where it was built on MUI. The copy and
 * the argument are unchanged; the styling is this site's own, so it uses
 * .shell, .eyebrow, .display, .lead, .glass, .chip and .btn, and the
 * sections alternate light and dark the way the home page does.
 *
 * ------------------------------------------------------------------
 * THE ORDER IS THE ARGUMENT. What the business is, then what it sells,
 * then the one thing that makes selling it possible: a business that
 * simply pays the market cannot quote anyone a stable rate.
 *
 * NO PRICES, NO RATES, NO PREMIUMS anywhere on this page. What a hedge
 * costs and what an enterprise is quoted are commercial terms, and a
 * figure here reads as an offer.
 *
 * IF ENTERPRISE ENQUIRIES SHOULD LAND SOMEWHERE ELSE, CONTACT below is
 * the one line to change.
 * ------------------------------------------------------------------
 */

const CONTACT = 'mailto:marketing@heyopen.ai?subject=Enterprise%20enquiry';

/* One ledger row: the operator, the name, and what it means. Three columns
   from sm up, so a row fills its width instead of leaving the right two
   thirds of the card empty; stacked below that, where it cannot. */
const ROW =
  'grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[1.5rem_minmax(0,15rem)_minmax(0,1fr)] sm:items-baseline';

/* One platform, three businesses. The tabs name the three things, so they
   cannot be dropped: they are the control, and an unlabelled one is not a
   choice. */
const STACK = [
  {
    id: 'api',
    tab: 'Inference APIs',
    name: 'Enterprise Model API',
    chrome: 'Your enterprise API',
    k: 'POST /v1/inference',
    mono: true,
    s: 'Model access. Usage metering. Scalable compute.',
  },
  {
    id: 'agents',
    tab: 'AI Agents',
    name: 'Enterprise Agent Platform',
    chrome: 'Your enterprise agents',
    k: 'Automate complex workflows',
    s: 'AI agents. Tools. Managed execution.',
  },
];

const STACK_PROOF = [
  ['Custom Branded', 'The product ships under their name.'],
  ['Prepaid compute', 'Committed usage, clear billing.'],
  ['Scalable inference', 'Infrastructure that grows with demand.'],
];

/* The revenue statement: a source, what comes out of it, what is left,
   and where that is allocated. THE ALLOCATION SHARE IS NOT QUOTED. */
const SOURCE = {
  t: 'Enterprise revenue',
  s: 'Custom-branded solutions and AI usage.',
};

const DEDUCTIONS = [
  { op: '−', t: 'Compute capacity', s: 'Fund the infrastructure serving enterprise workloads.' },
  { op: '−', t: 'Options and protection', s: 'Fund hedging premiums to manage price exposure.' },
];

const REMAINDER = {
  t: 'Available revenue after costs',
  s: 'After service delivery, obligations and reserves.',
};

const ALLOCATED = [
  { t: 'Reinvest and scale', s: 'Expand compute capacity to serve future demand.' },
  { t: '$OPEN economy', s: 'Support proposed buybacks and burns under the policy.', accent: true },
];

/* The first line is not the supplied one. "Their brand. Our technology."
   was the same sentence as the headline above it, which reads as a copy
   bug rather than as a bookend. The other two are verbatim. */
const HEDGE_PROOF = [
  ['Source', 'Secure the compute capacity.'],
  ['Protect', 'Hedge the price exposure on it.'],
  ['Deliver', 'Quote enterprises a contracted rate.'],
];

/* A market that moves, and a contracted rate that does not. Nothing is to
   scale and no level is quoted: the only claim is that one line moves and
   the other does not. */
const HISTORY = [2.4, 2.62, 2.55, 3.1, 3.42, 3.28, 3.8];
const MKT = { min: 2, max: 6, step: 0.1, start: 4.5 };
/* The drawing is proportioned for the box it is in. The plate runs the
   full width of the page, so on a desktop a tall box would make a figure
   half a screen high, and on a phone a wide one would squash it to a
   strip with unreadable labels. Two boxes, one picked at the width where
   the plate stops being wide. */
const WIDE = { w: 760, h: 166, x0: 16, x1: 744, y0: 18, y1: 128, tick: 24 };
const TALL = { w: 340, h: 184, x0: 12, x1: 328, y0: 14, y1: 136, tick: 22 };

function useBox() {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
  );
  useEffect(() => {
    const q = window.matchMedia('(min-width: 640px)');
    const on = () => setWide(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);
  return wide ? WIDE : TALL;
}

function plot(values, max, box) {
  const span = box.x1 - box.x0;
  return values.map((v, i) => {
    const x = box.x0 + (span * i) / (values.length - 1);
    const y = box.y1 - ((v - MKT.min) / (max - MKT.min)) * (box.y1 - box.y0);
    return [x, y];
  });
}

/**
 * The market against the rate the enterprise actually pays.
 *
 * Presented the way every other figure on this site is: a dark plate lit
 * from its top edge with the masked dot grid behind it, mono labels, and
 * hairlines between the parts. The shaded band is the gap the business
 * absorbs, which is the whole claim of the section.
 */
function Protection() {
  const [market, setMarket] = useState(MKT.start);
  const box = useBox();

  const series = [...HISTORY, market];
  const points = plot(series, MKT.max, box);
  const line = `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;

  /* The contracted rate is flat by definition: that is the whole point. */
  const contracted = HISTORY[0] * 1.08;
  const cy = box.y1 - ((contracted - MKT.min) / (MKT.max - MKT.min)) * (box.y1 - box.y0);

  const over = market > contracted;
  const last = points[points.length - 1];

  return (
    <div
      data-liquid
      data-bezel="28"
      data-blur="10"
      className="theme-dark glass glass-dark overflow-hidden rounded-[28px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-6 py-4 sm:px-8">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">
          Market rate vs contracted rate
        </p>
        <span className="chip shrink-0">{over ? 'Exposure absorbed' : 'Within contract'}</span>
      </div>

      <div className="relative bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)] px-6 pb-7 pt-8 sm:px-8">
        <div
          aria-hidden="true"
          className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]"
        />

        <svg viewBox={`0 0 ${box.w} ${box.h}`} className="relative block w-full">
          <defs>
            <linearGradient id="entExposure" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,85,0,0.34)" />
              <stop offset="100%" stopColor="rgba(255,85,0,0.03)" />
            </linearGradient>
          </defs>

          {[0, 1, 2].map((g) => {
            const y = box.y0 + ((box.y1 - box.y0) / 3) * (g + 1);
            return (
              <line
                key={g}
                x1={box.x0}
                y1={y}
                x2={box.x1}
                y2={y}
                stroke="var(--line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* The gap between what the market asks and what the enterprise
              pays: the part the business carries. */}
          <path
            d={`${line} L${box.x1} ${cy.toFixed(1)} L${box.x0} ${cy.toFixed(1)} Z`}
            fill="url(#entExposure)"
            stroke="none"
          />

          {/* What the enterprise is charged, which does not move. */}
          <line
            x1={box.x0}
            y1={cy}
            x2={box.x1}
            y2={cy}
            stroke="var(--orange)"
            strokeWidth="1.6"
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />

          {/* What the market does. */}
          <path
            d={line}
            fill="none"
            stroke="rgb(var(--fg-rgb))"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Each period named along the bottom, so the line reads as a
              run of events rather than as a shape. */}
          {points.map(([x], i) => (
            <text
              key={x}
              x={x}
              y={box.y1 + box.tick}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              letterSpacing="0.06em"
              fill="rgb(var(--soft-rgb))"
            >
              {`0${i + 1}`}
            </text>
          ))}

          <line
            x1={last[0]}
            y1={last[1]}
            x2={last[0]}
            y2={cy}
            stroke="var(--orange)"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.6"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={last[0]}
            cy={last[1]}
            r="4"
            fill="var(--bg)"
            stroke="var(--orange)"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <label className="block border-t border-white/[0.07] px-6 py-6 sm:px-8">
        <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-soft">
          Drag the market rate
        </span>
        <input
          type="range"
          min={MKT.min}
          max={MKT.max}
          step={MKT.step}
          value={market}
          onChange={(e) => setMarket(Number(e.target.value))}
          aria-label="Market compute rate"
          className="range-orange mt-4 w-full"
        />
      </label>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.07] px-6 py-5 sm:px-8">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0 w-4 shrink-0 border-t-2 border-solid"
            style={{ borderColor: 'rgb(var(--fg-rgb))' }}
          />
          <span className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-soft">
            Market rate
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-0 w-4 shrink-0 border-t-2 border-dashed"
            style={{ borderColor: 'var(--orange)' }}
          />
          <span className="font-mono text-[11.5px] uppercase tracking-[0.08em] text-soft">
            Contracted rate
          </span>
        </span>
        <p className="flex-[1_1_100%] text-[12px] leading-relaxed text-soft">
          Illustrative. No rate, premium or contract term is quoted here.
        </p>
      </div>
    </div>
  );
}

export default function EnterprisePage() {
  const [active, setActive] = useState(0);
  const current = STACK[active];

  return (
    <>
      {/* ---------- what this page is ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="ent-title"
        /* Full screen on arrival, matching Hero.jsx and the stake page. */
        className="theme-light relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[140px] lg:min-h-[max(100svh,800px)]"
      >
        {/* The sky behind the opening screen: warm at the edges, open in
            the middle, so the headline sits in the open part. Decorative,
            so aria-hidden, and it never takes a pointer. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(243,240,235,0.42) 0%, rgba(243,240,235,0.5) 38%, rgba(243,240,235,0.86) 74%, var(--paper) 100%), url(/images/stake-sky.webp)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center 32%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Centred, the way the home page opens. Left-aligned at this
            type size left the right half of the screen empty, and the
            headline is two short clauses rather than a paragraph, so it
            has nothing to sit beside. */}
        <div className="shell relative z-10 w-full">
          <div className="mx-auto max-w-[1000px] text-center" data-reveal>
            <p className="eyebrow">Enterprise</p>
            <h1 id="ent-title" className="display mt-5 text-[36px] sm:text-[56px] lg:text-[72px]">
              Real AI demand.
              <br />
              <span className="text-orange">A stronger $OPEN economy.</span>
            </h1>
            <p className="lead mx-auto mt-8 max-w-[640px]">
              Hey Open powers custom-branded AI products for enterprises, with compute protection
              designed to keep costs predictable. As the business grows, its revenue model connects
              real AI usage to $OPEN buybacks and burns.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href={CONTACT} className="btn btn-primary btn-lg">
                Talk to us
              </a>
              <a href="/stake" className="btn btn-dark btn-lg">
                Stake $OPEN
              </a>
            </div>

            <ul
              className="mt-10 flex flex-col items-center justify-center gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.12em] text-soft sm:flex-row"
              aria-label="What enterprises get"
            >
              {['Launched under their brand.', 'Run on our infrastructure.'].map((t, i) => (
                <li key={t} className="flex items-center gap-x-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden h-1.5 w-1.5 rounded-[2px] bg-orange sm:block"
                    />
                  )}
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- what it sells ---------- */}
      <section
        data-theme="dark"
        data-parallax-root
        aria-labelledby="stack-title"
        className="theme-dark relative overflow-hidden py-28 lg:py-40"
      >
        <div className="shell">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            <div className="lg:flex-[0_1_460px]" data-reveal>
              <h2 id="stack-title" className="display text-[32px] sm:text-[40px] lg:text-[46px]">
                Their brand.
                <br />
                <span className="text-orange">Our infrastructure.</span>
              </h2>
              <p className="lead mt-6">
                Hey Open powers custom-branded AI products for businesses. From inference APIs to
                complete applications, enterprises launch under their own brand while we run what
                is underneath.
              </p>

              <dl className="mt-10">
                {STACK_PROOF.map(([title, body], i) => (
                  <div key={title} className={`py-4 ${i ? 'border-t border-white/[0.07]' : ''}`}>
                    <dt className="font-sans text-[15px] font-semibold tracking-tight text-fg">
                      {title}
                    </dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-soft">{body}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The three things, shown rather than listed. */}
            <div className="min-w-0 flex-1" data-reveal>
              <div role="tablist" aria-label="What enterprises launch" className="flex flex-wrap gap-2">
                {STACK.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => setActive(i)}
                    /* A control needs a state you can see at a glance,
                       not a colour shift of three words. */
                    className={`chip cursor-pointer transition-colors ${
                      i === active
                        ? 'text-orange ring-1 ring-orange/40 bg-orange/10'
                        : 'text-soft hover:text-fg'
                    }`}
                  >
                    {item.tab}
                  </button>
                ))}
              </div>

              {/* The product, shown under the customer's own chrome.
                  A fixed floor so the panel does not collapse around
                  whichever of the three is selected, and the same bloom
                  and masked dot grid every other figure on this site
                  carries. */}
              <div
                data-liquid
                data-bezel="28"
                data-blur="10"
                className="glass glass-dark mt-5 overflow-hidden rounded-[28px]"
              >
                <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-3.5">
                  <span aria-hidden="true" className="flex gap-1.5">
                    <i className="block h-2 w-2 rounded-full bg-white/15" />
                    <i className="block h-2 w-2 rounded-full bg-white/15" />
                    <i className="block h-2 w-2 rounded-full bg-white/15" />
                  </span>
                  <span className="ml-2 font-mono text-[11.5px] text-soft">{current.chrome}</span>
                </div>

                <div className="relative flex min-h-[320px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)] sm:min-h-[360px]">
                  <div
                    aria-hidden="true"
                    className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]"
                  />
                  {/* flex-1 rather than h-full: h-full cannot resolve
                      against a min-height parent, so the content would sit
                      at the top of the panel instead of in the middle. */}
                  <div className="relative flex flex-1 flex-col justify-center px-7 py-12 sm:px-10">
                    <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">
                      {current.name}
                    </p>
                    <p
                      className={`mt-5 leading-snug tracking-tight text-fg ${
                        current.mono
                          ? 'font-mono text-[19px] sm:text-[22px]'
                          : 'text-[24px] font-medium sm:text-[30px]'
                      }`}
                    >
                      {current.k}
                    </p>
                    <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-soft">
                      {current.s}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the thing that makes it sellable ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="hedge-title"
        className="theme-light relative overflow-hidden py-28 lg:py-40"
      >
        <div className="shell">
          <div className="max-w-[760px]" data-reveal>
            <p className="eyebrow">Compute protection</p>
            <h2 id="hedge-title" className="display mt-5 text-[32px] sm:text-[42px] lg:text-[50px]">
              Compute prices move.
              <br />
              <span className="text-orange">We manage the exposure.</span>
            </h2>
            <p className="lead mt-6">
              A business that simply pays the market cannot quote anyone a stable rate. Compute is
              bought and its price exposure hedged, which is what makes a contracted rate possible.
            </p>
          </div>

          <div className="mt-12 lg:mt-16" data-reveal>
            <Protection />
          </div>

          {/* The three steps, numbered, because they happen in this order:
              nothing can be quoted until the exposure on bought compute
              has been hedged. */}
          <dl className="mt-10 grid gap-x-8 sm:grid-cols-3" data-reveal>
            {HEDGE_PROOF.map(([title, body], i) => (
              <div key={title} className="hair border-t pt-6">
                <p className="font-mono text-[11.5px] tracking-[0.1em] text-orange">{`0${i + 1}`}</p>
                <dt className="mt-4 font-sans text-[17px] font-semibold tracking-tight text-fg">
                  {title}
                </dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-soft">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- where the money goes ----------

          A statement, not a diagram: a source, two deductions, what is
          left, and where that is allocated. Ruled rows with the operator
          in its own column, so the arithmetic reads down the page.

          THE ALLOCATION BAND IS NOT QUOTED. What share reaches the token
          is policy, and a percentage here would read as a commitment. */}
      <section
        data-theme="dark"
        data-parallax-root
        aria-labelledby="flow-title"
        className="theme-dark relative overflow-hidden py-28 lg:py-40"
      >
        <div className="shell">
          <div className="max-w-[760px]" data-reveal>
            <p className="eyebrow">Where the money goes</p>
            <h2 id="flow-title" className="display mt-5 text-[32px] sm:text-[42px] lg:text-[50px]">
              Revenue, costs, and what is left.
            </h2>
          </div>

          <div
            data-reveal
            data-liquid
            data-bezel="24"
            data-blur="10"
            className="glass mt-12 rounded-[28px] p-7 sm:p-10"
          >
            {/* the source */}
            <div className={ROW}>
              <span
                aria-hidden="true"
                className="font-mono text-[15px] leading-6 text-orange sm:text-center"
              >
                +
              </span>
              <p className="font-sans text-[17px] font-semibold leading-6 tracking-tight text-fg">
                {SOURCE.t}
              </p>
              <p className="text-[13.5px] leading-relaxed text-soft sm:pt-0.5">{SOURCE.s}</p>
            </div>

            {/* what comes out of it */}
            {DEDUCTIONS.map((d) => (
              <div key={d.t} className={`hair border-t ${ROW}`}>
                <span
                  aria-hidden="true"
                  className="font-mono text-[15px] leading-6 text-soft sm:text-center"
                >
                  {d.op}
                </span>
                <p className="font-sans text-[15px] font-semibold leading-6 tracking-tight text-fg">
                  {d.t}
                </p>
                <p className="text-[13.5px] leading-relaxed text-soft sm:pt-0.5">{d.s}</p>
              </div>
            ))}

            {/* what is left */}
            <div className={`hair border-t ${ROW}`}>
              <span
                aria-hidden="true"
                className="font-mono text-[15px] leading-6 text-orange sm:text-center"
              >
                =
              </span>
              <p className="font-sans text-[17px] font-semibold leading-6 tracking-tight text-fg">
                {REMAINDER.t}
              </p>
              <p className="text-[13.5px] leading-relaxed text-soft sm:pt-0.5">{REMAINDER.s}</p>
            </div>

            {/* and where it goes */}
            <div className="hair mt-2 grid gap-4 border-t pt-7 sm:grid-cols-2">
              {ALLOCATED.map((a) => (
                <div
                  key={a.t}
                  className={`rounded-[18px] p-5 ${a.accent ? 'glass glass-orange' : 'glass'}`}
                >
                  <p
                    className={`font-sans text-[15px] font-semibold tracking-tight ${
                      a.accent ? 'text-orange' : 'text-fg'
                    }`}
                  >
                    {a.t}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-soft">{a.s}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-[12.5px] leading-relaxed text-soft" data-reveal>
            Illustrative. No allocation share, rate or contract term is quoted here.
          </p>
        </div>
      </section>

      {/* ---------- close ----------

          The page opens by selling custom-branded AI and then spends three
          sections on the business behind it, so it closes with the ask for
          the audience it opened with rather than with a token ask. The
          three products are named again because a reader arriving here has
          been reading about treasury policy for two screens. */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="ent-cta-title"
        className="theme-light relative overflow-hidden py-28 lg:py-40"
      >
        <div className="shell">
          <div className="mx-auto max-w-[720px] text-center" data-reveal>
            <p className="eyebrow text-orange">For enterprises</p>
            <h2
              id="ent-cta-title"
              className="display mt-5 text-[32px] sm:text-[42px] lg:text-[50px]"
            >
              Run it under your own name.
            </h2>
            <p className="lead mx-auto mt-6 max-w-[520px]">
              Tell us the workload, the volume and the constraints, and we will come back with what
              it takes to run it.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href={CONTACT} className="btn btn-primary btn-lg">
                Enterprise enquiries →
              </a>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {STACK.map((s) => (
                <span key={s.id} className="chip">
                  {s.tab}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
