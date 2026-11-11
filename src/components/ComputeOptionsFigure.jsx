/**
 * Compute-price options, drawn.
 *
 * Ported from the Hey Open site. The series and the crossing solve are
 * unchanged; the styling is this site's own.
 *
 * ------------------------------------------------------------------
 * A rental price over a term, and a ceiling bought against it. Lower y is
 * a higher price, so the line climbing is the bill climbing, and the
 * shaded area above the ceiling is the part that stops being the buyer's
 * problem.
 *
 * NOTHING IS TO SCALE and there is no value axis. The only claim the
 * shape makes is that the price moves and that one crossing is enough to
 * matter. NO INDEX LEVEL, PREMIUM OR PAYOUT is quoted, because none of it
 * is settled.
 *
 * Strokes are fixed in pixels via vector-effect, because this chart is
 * about 300px wide on a phone and 700 on a desktop and anything measured
 * in user units doubles across that range. The ceiling label is HTML over
 * the top for the same reason, placed by a percentage worked out from the
 * crop so the two cannot drift.
 * ------------------------------------------------------------------
 */

/* A rental price over a term. */
const PRICE = [
  [38, 120], [62, 114], [85, 122], [109, 109], [133, 101], [156, 107],
  [180, 94], [204, 83], [227, 70], [251, 76], [275, 59], [298, 65], [322, 52],
];

const CEILING = 86;
const VIEW_TOP = 36;
const VIEW_H = 124;
const CEILING_PCT = ((CEILING - VIEW_TOP) / VIEW_H) * 100;

/* Where the price first gets above the ceiling, solved on the segment that
   does it rather than guessed, so the fill starts exactly on the line. */
const CROSS = (() => {
  for (let i = 1; i < PRICE.length; i += 1) {
    const [x0, y0] = PRICE[i - 1];
    const [x1, y1] = PRICE[i];
    if (y0 >= CEILING && y1 < CEILING) {
      return x0 + ((y0 - CEILING) / (y0 - y1)) * (x1 - x0);
    }
  }
  return PRICE[0][0];
})();

const above = PRICE.filter(([, y]) => y < CEILING);
const pricePath = `M${PRICE.map(([x, y]) => `${x} ${y}`).join(' L')}`;
const coveredPath = `M${CROSS} ${CEILING} ${above
  .map(([x, y]) => `L${x} ${y}`)
  .join(' ')} L${above[above.length - 1][0]} ${CEILING} Z`;

export default function ComputeOptionsFigure() {
  return (
    <>
      {/* Wraps, because in a side column the title and the badge do not
          both fit on one line and space-between alone would let them
          collide rather than stack. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="eyebrow !text-[10px] !tracking-[0.14em]">Cloud price index</div>

        <span className="inline-flex shrink-0 items-center gap-[7px] rounded-full border border-orange/30 bg-orange/[0.08] px-[11px] py-[6px]">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="block h-[13px] w-[13px] text-orange">
            <path
              d="M10 16V4M10 4 5 9M10 4l5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="eyebrow !text-[10px] !tracking-[0.14em] text-orange">Protected</span>
        </span>
      </div>

      <div className="relative mt-6">
        <svg viewBox={`0 ${VIEW_TOP} 340 ${VIEW_H}`} className="block w-full md:h-[210px]">
          <defs>
            <linearGradient id="computeOptionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,85,0,0.36)" />
              <stop offset="100%" stopColor="rgba(255,85,0,0.06)" />
            </linearGradient>
          </defs>

          {[3, 4, 5].map((g) => {
            const y = 114 - (g - 2) * 25;
            return (
              <line
                key={g}
                x1="38"
                y1={y}
                x2="322"
                y2={y}
                stroke="var(--line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* Everything above the ceiling is the option's problem. */}
          <path d={coveredPath} fill="url(#computeOptionsFill)" />

          <line
            x1="38"
            y1={CEILING}
            x2="322"
            y2={CEILING}
            stroke="var(--orange)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d={pricePath}
            fill="none"
            stroke="rgb(var(--fg-rgb))"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="eyebrow !text-[10px] !tracking-[0.14em] pointer-events-none absolute -mt-[5px] text-orange"
          style={{ left: '11.2%', top: `${CEILING_PCT}%`, transform: 'translateY(-100%)' }}
        >
          Hedged ceiling
        </div>
      </div>

      <div className="hair mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t pt-4">
        {[
          ['Rental price', 'rgb(var(--fg-rgb))', false],
          ['Hedged ceiling', 'var(--orange)', true],
        ].map(([k, c, dash]) => (
          <span key={k} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0 w-4 shrink-0"
              style={{ borderTop: `2px ${dash ? 'dashed' : 'solid'} ${c}` }}
            />
            <span className="text-[12.5px] font-semibold text-soft">{k}</span>
          </span>
        ))}

        <p className="mt-1 flex-[1_1_100%] text-[12px] leading-relaxed text-soft">
          Illustrative. No index level, premium or payout is quoted here.
        </p>
      </div>
    </>
  );
}
