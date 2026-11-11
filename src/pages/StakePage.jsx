import { useEffect, useRef, useState } from 'react';

/**
 * Staking $OPEN.
 *
 * Ported from the finalised Hey Open stake page, section for section, in
 * this site's own design. Six sections: the hero, what a stake is worth
 * and what it unlocks, where the revenue comes from, where the stake is
 * actually deployed and what comes back, the proposed token policy, and
 * the close.
 *
 * ------------------------------------------------------------------
 * TWO FIGURES, AND THE DIFFERENCE BETWEEN THEM IS THE POINT. 6% is the
 * base annual staking rate, paid from the staking contract whatever the
 * period did. The 40% to 50% band is a target for the enterprise compute
 * strategy, NOT a staking return, and any distribution to stakers depends
 * on that programme's published terms. Every place the band appears it is
 * qualified. If the two are ever merged into one number, the page has
 * failed and so has the disclosure.
 *
 * SEVERAL OF THESE ARE PROPOSALS, not live features, and the lede says so
 * rather than leaving a reader to work it out from the smallprint.
 *
 * NO VALUE AXIS ON THE POLICY CHART, and none implied. What the business
 * earns and what it would buy back are not settled anywhere, so the chart
 * carries gridlines a reader can measure the shape against but never a
 * quantity.
 * ------------------------------------------------------------------
 */

const RATES = {
  base: '6.00%',
  base_short: '6%',
  total: '40% to 50%',
  threshold: '100 $OPEN',
};

const APP = 'https://ais.openledger.xyz/chat';
const LINKS = { buy: '#', stake: '#' };

/* ------------------------------------------------------------------ */
/* Marks, matching the inline Icon used in Stack.jsx                    */
/* ------------------------------------------------------------------ */

const PATHS = {
  lock: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 018 0v3" /></>,
  chip: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" /></>,
  chart: <><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M21 20H3" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></>,
  shield: <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z" />,
  rise: <><path d="M3 17l6-6 4 4 7-7" /><path d="M14 8h6v6" /></>,
  cycle: <><path d="M20 12a8 8 0 11-2.3-5.6" /><path d="M20 4v4h-4" /></>,
  code: <><path d="M9 17l-5-5 5-5" /><path d="M15 7l5 5-5 5" /></>,
};

function Mark({ name, className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* What each section says                                              */
/* ------------------------------------------------------------------ */

/* What a staked position is worth: four figures. No mark, because at this
   size an icon above three lines of type is decoration sitting where the
   eye wants the figure. */
const WORTH = [
  { k: RATES.base_short, t: 'Annual staking rewards', s: 'Earn annual rewards on eligible staked $OPEN.' },
  { k: 'Hey Open Pro', t: 'Premium AI access', s: `Stake ${RATES.threshold} to unlock unlimited supported text and image models.` },
  { k: `${RATES.total} APY`, t: 'Compute strategy target', s: 'Explore targeted returns through enterprise compute and options strategies.' },
  { k: '$OPEN economy', t: 'Buybacks and burns', s: 'A proposed net revenue model designed to buy back and burn $OPEN.' },
];

/* And what it opens up. Title and line, not figure, because none of these
   four are quantities. */
const UNLOCKS = [
  ['Compute-credit collateral', 'Proposed $HEY is issued against $OPEN locked under staking.'],
  ['AI agent access', 'Access premium agents, developer tools and potential agent marketplace payment flows.'],
  ['Member advantages', 'Proposed discounts, priority routing, advanced memory and higher service tiers.'],
  ['Community voting', 'Vote on protocol rules, incentives and ecosystem direction. New features are released based on what the community votes for.'],
];

/* Four lines of revenue, each with the kind of revenue it is. Naming the
   kind is what stops the four reading as four words for the same thing. */
const REVENUE = [
  ['cycle', 'Hey Open subscriptions', 'Monthly and annual plans for private multi-model AI, expanded usage and premium features.', 'Consumer recurring revenue'],
  ['code', 'Developer AI APIs', 'Inference usage through one API layer, with margin on model routing and access.', 'Usage-based API margin'],
  ['shield', 'Enterprise private AI', 'Private inference, managed deployments, governance controls and white-label contracts.', 'Enterprise contracts'],
  ['rise', 'Compute options fees', 'Hedging, structuring, transaction and settlement services for GPU and cloud-price risk.', 'Financial marketplace fees'],
];

/* The three places the stake is deployed. */
const DEPLOY = [
  ['chip', 'Compute capital', 'Capacity the network runs on'],
  ['chart', 'Options', 'Positions run against the book'],
  ['layers', 'AI infrastructure', 'The rails underneath the models'],
];

/* And the two different kinds of thing that come back. */
const RETURNS = [
  {
    tag: 'Owed to you',
    k: RATES.base,
    s: 'Paid from the staking contract whatever the period did. It does not wait on the book.',
    mark: 'shield',
    big: true,
  },
  {
    tag: 'Aimed at',
    k: 'Everything above it',
    s: 'What the book makes on top of it. Reported once a period has closed, never promised before.',
    mark: 'rise',
  },
];

/* Three readings of the same promise, under the figure that makes it. */
const PROOF = [
  ['The floor is a contract rate', 'The floor is set in the staking contract. It pays on schedule, and anyone can read it without asking us.'],
  ['The stake stays yours', 'Staking does not sell your $OPEN or move it beyond your reach. You can unstake, and the balance is visible the whole time.'],
  ['The target is reported after', 'Each period ends with the figure that was actually returned, published against the band rather than compared with it later.'],
];

/* ------------------------------------------------------------------ */
/* The token policy figure                                             */
/* ------------------------------------------------------------------ */

/* Revenue climbs as a curve, because it accrues continuously; supply
   comes down in steps, because a burn is an event and not a drift. They
   cross, which is the headline said without words. */
const PX0 = 20;
const PX1 = 326;
const P_TOP = 18;
const P_BASE = 118;

const P_REVENUE = [
  [20, 108], [45.5, 105], [71, 101], [96.5, 96], [122, 90], [147.5, 83],
  [173, 75], [198.5, 67], [224, 59], [249.5, 51], [275, 43], [300.5, 34], [326, 26],
];

/* Each entry is where a level begins and what that level is. Eight, so the
   staircase reads as a series of events rather than as one drop. */
const P_SUPPLY = [
  [20, 30], [58, 36], [96, 44], [134, 54], [172, 64], [210, 76], [248, 88], [286, 98],
];

const P_SUPPLY_PATH =
  P_SUPPLY.map(([x, y], i) => (i === 0 ? `M${x} ${y}` : `H${x} V${y}`)).join(' ') + ` H${PX1}`;

/* The drop at the start of every level after the first: the burns, the
   only thing on this chart that is an event rather than a trend. */
const P_BURNS = P_SUPPLY.slice(1);

const P_LINE = `M${P_REVENUE.map(([x, y]) => `${x} ${y}`).join(' L')}`;

/* Where revenue first reaches supply, walked along the polyline against
   the step function rather than read off by eye. Supply is piecewise
   constant, so there is no closed form: the segment is sampled finely
   enough that the marker sits on the lines rather than near them. */
const P_CROSS = (() => {
  const levelAt = (x) => {
    let level = P_SUPPLY[0][1];
    P_SUPPLY.forEach(([sx, y]) => {
      if (x >= sx) level = y;
    });
    return level;
  };
  for (let i = 1; i < P_REVENUE.length; i += 1) {
    const [x0, y0] = P_REVENUE[i - 1];
    const [x1, y1] = P_REVENUE[i];
    for (let j = 1; j <= 80; j += 1) {
      const t = j / 80;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      if (y <= levelAt(x)) return [x, y];
    }
  }
  return null;
})();

/**
 * The figure plate.
 *
 * A dark island inside a light section, which is how this site draws its
 * figures: the plate carries `theme-dark`, so the custom properties flip
 * inside it and the chart's strokes, rules and labels come out light
 * without a single colour being hard-coded against the theme. The orange
 * bloom from the top edge and the masked dot grid are the same treatment
 * Stack.jsx gives its visuals, and the legend sits under a hairline in a
 * footer rather than floating under the drawing.
 */
function PolicyFigure() {
  return (
    <div
      data-liquid
      data-bezel="28"
      data-blur="10"
      className="theme-dark glass glass-dark group overflow-hidden rounded-[28px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1"
    >
      {/* the drawing, on its own ground */}
      <div
        className="relative bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)] px-6 pb-4 pt-7 sm:px-8"
      >
        <div
          aria-hidden="true"
          className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]"
        />
        <div className="relative">
      <svg viewBox="0 0 340 172" className="block w-full">
        <defs>
          <linearGradient id="policyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,85,0,0.30)" />
            <stop offset="100%" stopColor="rgba(255,85,0,0.02)" />
          </linearGradient>
        </defs>

        {/* The frame a reader measures the shape against. No value axis
            and no numbers on it, because none of this is settled. */}
        {[0, 1, 2, 3, 4].map((g) => {
          const y = P_TOP + ((P_BASE - P_TOP) / 5) * (g + 1);
          return (
            <line
              key={g}
              x1={PX0}
              y1={y}
              x2={PX1}
              y2={y}
              stroke="var(--line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        <line
          x1={PX0}
          y1={P_BASE}
          x2={PX1}
          y2={P_BASE}
          stroke="var(--line-2)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Revenue, accruing continuously. */}
        <path
          d={`${P_LINE} L${PX1} ${P_BASE} L${PX0} ${P_BASE} Z`}
          fill="url(#policyFill)"
          stroke="none"
        />
        <path
          d={P_LINE}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Supply, stepping down. A burn is an event, not a drift. */}
        <path
          d={P_SUPPLY_PATH}
          fill="none"
          stroke="rgb(var(--fg-rgb))"
          strokeWidth="1.8"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Each period, named along the bottom. */}
        {P_SUPPLY.map(([x], i) => (
          <text
            key={x}
            x={x}
            y={P_BASE + 20}
            textAnchor="middle"
            className="font-mono"
            fontSize="7.5"
            letterSpacing="0.06em"
            fill="rgb(var(--soft-rgb))"
          >
            {`0${i + 1}`}
          </text>
        ))}

        {/* Each burn: a ring, so the plate reads through it. */}
        {P_BURNS.map(([x, y]) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r="3"
            fill="var(--bg)"
            stroke="rgb(var(--fg-rgb))"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* The crossing, called out rather than left to be spotted. */}
        {P_CROSS && (
          <g>
            <line
              x1={P_CROSS[0]}
              y1={P_CROSS[1]}
              x2={P_CROSS[0]}
              y2={P_BASE}
              stroke="var(--orange)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={P_CROSS[0] - 6}
              y={P_CROSS[1] - 12}
              textAnchor="end"
              className="font-mono"
              fontSize="7.5"
              letterSpacing="0.1em"
              fill="var(--orange)"
            >
              CROSSOVER
            </text>
            <circle
              cx={P_CROSS[0]}
              cy={P_CROSS[1]}
              r="5"
              fill="var(--bg)"
              stroke="var(--orange)"
              strokeWidth="2.2"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>
        </div>
      </div>

      {/* the legend, in a footer rather than floating under the drawing */}
      <div className="border-t border-white/[0.07] px-6 pb-7 pt-5 sm:px-8">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">
          The proposed policy
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {[
            ['Revenue', 'var(--orange)', 'line'],
            ['Supply', 'rgb(var(--fg-rgb))', 'line'],
            ['Burn', 'rgb(var(--fg-rgb))', 'dot'],
          ].map(([k, c, kind]) => (
            <span key={k} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={
                  kind === 'dot'
                    ? 'h-2.5 w-2.5 shrink-0 rounded-full border-2'
                    : 'h-0 w-4 shrink-0 border-t-2'
                }
                style={{ borderColor: c }}
              />
              <span className="text-[13px] text-soft">{k}</span>
            </span>
          ))}
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-soft">
          Illustrative. No revenue figure, supply level or burn amount is quoted here.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The flow diagram                                                     */
/* ------------------------------------------------------------------ */

/* Three rows of height H and two gaps of G put the card centres at H/2,
   1.5H+G and 2.5H+2G. The fan column stretches to the row's height, so
   those three numbers are where the branches have to land. Arithmetic
   rather than eyeballing is what keeps them on the cards when the cards
   change height. */
const FAN_GAP = 12;
const FAN_W = 64;

/* An elbow with rounded corners: out along the middle, down or up the
   spine, then out again. A straight run when there is no corner to turn. */
function elbow(w, from, to) {
  const x = w / 2;
  const r = Math.min(9, Math.abs(to - from) / 2);
  if (r < 1) return `M0 ${from} H${w}`;
  const dir = to > from ? 1 : -1;
  return [
    `M0 ${from}`,
    `H${x - r}`,
    `Q${x} ${from} ${x} ${from + r * dir}`,
    `V${to - r * dir}`,
    `Q${x} ${to} ${x + r} ${to}`,
    `H${w}`,
  ].join(' ');
}

/**
 * One node splitting into three, or three converging into one.
 *
 * SVG rather than CSS borders, for two reasons: corners can be turned
 * with a curve instead of a right angle, and a dash can be made to
 * travel, which is the stake visibly moving along the route rather than
 * a diagram of it having moved.
 */
function Fan({ dir }) {
  const ref = useRef(null);
  const [h, setH] = useState(300);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => setH(el.clientHeight || 300);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rowH = (h - FAN_GAP * 2) / 3;
  const centres = [rowH * 0.5, rowH * 1.5 + FAN_GAP, rowH * 2.5 + FAN_GAP * 2];
  const mid = h / 2;
  const out = dir === 'out';
  const routes = out
    ? centres.map((c) => elbow(FAN_W, mid, c))
    : centres.map((c) => elbow(FAN_W, c, mid));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative hidden w-16 self-stretch lg:block"
    >
      <svg
        width={FAN_W}
        height={h}
        viewBox={`0 0 ${FAN_W} ${h}`}
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <marker
            id={`flow-tip-${dir}`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0 L8 4 L0 8 z" fill="var(--line-2)" />
          </marker>
        </defs>

        {routes.map((d, i) => (
          <g key={d}>
            {/* the route */}
            <path
              d={d}
              fill="none"
              stroke="var(--line-2)"
              strokeWidth="1.5"
              markerEnd={`url(#flow-tip-${dir})`}
            />
            {/* and what is moving along it */}
            <path
              d={d}
              fill="none"
              stroke="var(--orange)"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="flow-run"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** What the fan collapses to below lg, where there is no room to branch. */
function Down() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center py-3 lg:hidden">
      <svg width="12" height="34" viewBox="0 0 12 34" className="overflow-visible">
        <path
          d="M6 0 V26"
          fill="none"
          stroke="var(--line-2)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
        />
        <path d="M2 25 L6 32 L10 25 z" fill="var(--line-2)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Head({ eyebrow, title, lede, center, id, wide }) {
  return (
    <div
      className={center ? 'mx-auto max-w-[760px] text-center' : wide ? '' : 'max-w-[760px]'}
      data-reveal
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="display mt-5 text-[32px] sm:text-[42px] lg:text-[52px]">
        {title}
      </h2>
      {lede && <p className={`lead mt-6 ${center ? 'mx-auto max-w-[620px]' : 'max-w-[620px]'}`}>{lede}</p>}
    </div>
  );
}

export default function StakePage() {
  return (
    <>
      {/* ---------- 01. the hero ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="stake-title"
        /* Full screen on arrival, the same way Hero.jsx does it: svh so a
           phone's collapsing address bar does not change the height
           mid-scroll, and the top padding clears the fixed nav. */
        className="theme-light relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-[140px] lg:min-h-[max(100svh,800px)]"
      >
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
        <div className="shell relative z-10 w-full">
          <div className="mx-auto max-w-[860px] text-center" data-reveal>
            {/* The page is "$OPEN" in the nav, so it says so on arrival. */}
            <p className="eyebrow">$OPEN</p>
            <h1 id="stake-title" className="display mt-5 text-[38px] sm:text-[52px] lg:text-[62px]">
              The Gateway for Unrestricted AI
            </h1>
            <p className="lead mx-auto mt-7 max-w-[560px]">
              $OPEN is the capital asset of Hey Open. Stake it to earn yield, mint $HEY, and get
              Hey Open Pro free at {RATES.threshold} staked.
            </p>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href={LINKS.stake} className="btn btn-primary btn-lg w-full sm:w-auto">
                Stake $OPEN
              </a>
              <a href={LINKS.buy} className="btn btn-light btn-lg w-full sm:w-auto">
                Buy $OPEN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 02. what a stake is worth, and what it unlocks ---------- */}
      <section
        data-theme="dark"
        data-parallax-root
        aria-labelledby="utility-title"
        className="theme-dark relative overflow-hidden py-28 lg:py-36"
      >
        <div className="shell">
          <Head
            id="utility-title"
            eyebrow="The utility of $OPEN"
            title={
              <>
                One token.
                <br />
                <span className="text-orange">More ways to benefit.</span>
              </>
            }
            lede="What a single staked position is worth, and what it opens up. Several of these are proposals rather than live features."
          />

          {/* the figures */}
          <p className="eyebrow mt-12" data-reveal>
            What a stake is worth
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORTH.map((b) => (
              <div
                key={b.t}
                data-reveal
                data-liquid
                data-bezel="20"
                data-blur="10"
                className="glass flex flex-col rounded-[20px] p-6"
              >
                <p className="font-sans text-[22px] font-semibold tracking-tight text-orange">
                  {b.k}
                </p>
                <p className="mt-3 font-sans text-[14px] font-semibold tracking-tight text-fg">
                  {b.t}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-soft">{b.s}</p>
              </div>
            ))}
          </div>

          {/* and what it opens up */}
          <p className="eyebrow mt-12" data-reveal>
            What a stake unlocks
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UNLOCKS.map(([k, s]) => (
              <div
                key={k}
                data-reveal
                data-liquid
                data-bezel="20"
                data-blur="10"
                className="glass flex flex-col rounded-[20px] p-6"
              >
                <p className="font-sans text-[15px] font-semibold tracking-tight text-fg">{k}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-soft">{s}</p>
              </div>
            ))}
          </div>

          {/* the ask, on the same ground as the cards above it */}
          <div
            data-reveal
            data-liquid
            data-bezel="20"
            data-blur="10"
            className="glass mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[20px] p-6 sm:p-7"
          >
            <p className="font-sans text-[16px] font-semibold tracking-tight text-fg">
              Earn rewards. Unlock premium AI. Explore the compute economy.
            </p>
            <a href={LINKS.stake} className="btn btn-primary shrink-0">
              Stake $OPEN →
            </a>
          </div>

          <p className="mt-6 text-[12.5px] leading-relaxed text-soft" data-reveal>
            The {RATES.total} remains a strategy target, not a guaranteed additional staking
            payout.
          </p>
        </div>
      </section>

      {/* ---------- 03. where the revenue comes from ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="revenue-title"
        className="theme-light relative overflow-hidden py-28 lg:py-36"
      >
        <div className="shell">
          <Head
            id="revenue-title"
            eyebrow="Revenue, not speculation"
            title="Four ways the network earns."
            lede="Not all revenue needs to come from speculation. The ecosystem is designed around payments for useful products and financial services."
          />

          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {REVENUE.map(([mark, k, body, tag]) => (
              <li
                key={k}
                data-reveal
                data-liquid
                data-bezel="28"
                data-blur="10"
                className="theme-dark glass glass-dark group flex flex-col overflow-hidden rounded-[28px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1"
              >
                {/* The mark gets its own ground, lit from the top edge,
                    the way every visual on this site is presented. */}
                <div
                  aria-hidden="true"
                  className="relative h-[120px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)]"
                >
                  <div className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]" />
                  <div className="relative grid h-full place-items-center text-orange">
                    <Mark name={mark} className="h-7 w-7" />
                  </div>
                </div>

                {/* Label first, then the name, then what it is. */}
                <div className="flex flex-1 flex-col border-t border-white/[0.07] px-6 pb-7 pt-6">
                  <p className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-orange">
                    {tag}
                  </p>
                  <h3 className="mt-3 text-[18px] font-medium leading-tight tracking-[-0.02em] text-fg">
                    {k}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-soft">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 04. where the stake actually works ----------

          Left to right: the stake, the three places what it backs is
          deployed, and the two different kinds of thing that come back.
          The connectors are drawn with borders rather than SVG so they
          reflow with the columns instead of needing re-measuring. */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="work-title"
        className="theme-light relative overflow-hidden py-28 lg:py-36"
      >
        <div className="shell">
          <Head
            id="work-title"
            eyebrow="Where the stake works"
            title="Where the work actually happens."
            lede="Your $OPEN does not leave your wallet. What it backs is deployed across three places, and two different kinds of thing come back: the rate the staking contract owes you either way, and whatever the strategy makes on top of it."
          />

          {/* A flow, left to right: the stake, the three places what it
              backs is deployed, and the two kinds of thing that come
              back. The fans branch and converge; below lg there is no room
              to branch, so they collapse to a single chevron. */}
          <div
            data-reveal
            data-liquid
            data-bezel="28"
            data-blur="10"
            /* One dark plate for the whole flow, lit from the top edge with
               a masked dot grid behind it: the treatment Stack.jsx gives its
               visuals. theme-dark flips the custom properties inside, so the
               cards, rules and connectors take their colours from the plate
               rather than from the light section around it. */
            className="theme-dark glass glass-dark relative mt-12 overflow-hidden rounded-[28px] bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,110,40,.13),transparent_62%)] px-6 py-8 sm:px-8"
          >
            <div
              aria-hidden="true"
              className="dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_50%_40%,#000,transparent_75%)]"
            />
            <div className="relative flex flex-col items-stretch lg:flex-row lg:gap-0">
            {/* the stake */}
            <div className="flex lg:flex-[0_1_260px]">
              <div
                data-liquid
                data-bezel="20"
                data-blur="10"
                className="glass glass-orange flex flex-1 flex-col rounded-[20px] p-6"
              >
                <span className="flex items-center gap-2 text-orange">
                  <Mark name="lock" />
                  <span className="eyebrow">The stake</span>
                </span>
                <p className="mt-5 font-sans text-[18px] font-semibold tracking-tight text-fg">
                  Staked $OPEN
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-soft">
                  Locked as collateral, still yours, visible the whole time. You can unstake.
                </p>
              </div>
            </div>

            <Fan dir="out" />
            <Down />

            {/* what it backs */}
            <div className="grid gap-3 lg:flex-1 lg:grid-rows-3 lg:gap-3">
              {DEPLOY.map(([mark, k, s]) => (
                <div
                  key={k}
                  data-liquid
                  data-bezel="16"
                  data-blur="8"
                  className="glass flex items-start gap-3 rounded-[16px] p-5"
                >
                  <span className="mt-0.5 shrink-0 text-orange">
                    <Mark name={mark} />
                  </span>
                  <div>
                    <p className="font-sans text-[14px] font-semibold tracking-tight text-fg">{k}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-soft">{s}</p>
                  </div>
                </div>
              ))}
            </div>

            <Fan dir="in" />
            <Down />

            {/* what comes back */}
            <div className="grid gap-3 lg:flex-1 lg:grid-rows-2 lg:gap-3">
              {RETURNS.map((r) => (
                <div
                  key={r.tag}
                  data-liquid
                  data-bezel="16"
                  data-blur="8"
                  /* The owed figure was the dark card among light ones.
                     On a dark plate that reads as nothing, so it takes the
                     brighter panel and an orange rim instead. */
                  className={`glass flex flex-col justify-center rounded-[16px] p-5 ${
                    r.big ? 'glass-strong ring-1 ring-orange/30' : ''
                  }`}
                >
                  <span className="flex items-center gap-2 text-orange">
                    <Mark name={r.mark} />
                    <span className="eyebrow">{r.tag}</span>
                  </span>
                  <p
                    className={`mt-3 font-sans font-semibold tracking-tight text-fg ${
                      r.big ? 'text-[30px]' : 'text-[20px]'
                    }`}
                  >
                    {r.k}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-snug text-soft">{r.s}</p>
                </div>
              ))}
            </div>
            </div>
          </div>

          <dl className="mt-10 grid gap-6 md:grid-cols-3">
            {PROOF.map(([k, s]) => (
              <div key={k} className="hair border-t pt-5" data-reveal>
                <dt className="font-sans text-[15px] font-semibold tracking-tight text-fg">{k}</dt>
                <dd className="mt-2 text-[13px] leading-relaxed text-soft">{s}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- 05. the proposed token policy ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="policy-title"
        className="theme-light relative overflow-hidden py-28 lg:py-36"
      >
        {/* The warmth behind the plate, drifting at its own rate, the same
            way every other section on this site is lit. */}
        <div
          data-speed="0.28"
          aria-hidden="true"
          className="ember-glow right-[-8%] top-[20%] h-[420px] w-[560px] opacity-25"
        />
        <div className="shell relative">
          <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <Head
              wide
              id="policy-title"
              eyebrow="The proposed token policy"
              title={
                <>
                  Revenue grows.
                  <br />
                  <span className="text-orange">Supply can shrink.</span>
                </>
              }
              lede="As Hey Open generates revenue, the treasury would fund $OPEN buybacks and permanent on-chain burns."
            />
            <div data-reveal>
              <PolicyFigure />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 06. the close ---------- */}
      <section
        data-theme="light"
        data-parallax-root
        aria-labelledby="stake-cta-title"
        className="theme-light relative overflow-hidden py-28 lg:py-36"
      >
        <div className="shell">
          <div className="mx-auto max-w-[760px] text-center" data-reveal>
            <h2 id="stake-cta-title" className="display text-[34px] sm:text-[46px] lg:text-[56px]">
              Your $OPEN.
              <br />
              <span className="text-orange">More than a holding.</span>
            </h2>
            <p className="lead mx-auto mt-6 max-w-[560px]">
              Earn staking rewards, unlock Hey Open Pro, and take part in an AI ecosystem powered
              by real products and enterprise demand.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={LINKS.stake} className="btn btn-primary btn-lg">
                Stake $OPEN →
              </a>
              <a href={APP} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-lg">
                Try the app first
              </a>
            </div>

            <p className="mx-auto mt-12 max-w-[72ch] font-mono text-[11.5px] leading-[1.85] text-soft">
              Staking rewards are not a guarantee. {RATES.base} is the base annual staking rate.
              The {RATES.total} band is a target for the enterprise compute strategy, not a staking
              return, and any distribution to stakers depends on that programme&rsquo;s published
              terms. Nothing here is investment advice. Read the terms before you stake.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
