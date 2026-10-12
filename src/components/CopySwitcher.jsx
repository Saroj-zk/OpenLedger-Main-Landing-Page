import { useCopy } from '@/content/context';
import { SECTIONS, VERSIONS, VERSION_IDS } from '@/content/versions';

/*
 * TEMPORARY: flips between the copy variations in src/content/versions.js.
 * Each section carries its own switch, and the fixed one in the corner sets
 * every section at once. Remove this file, its uses, and src/content once
 * the copy is settled.
 */
function Pill({ label, current, onPick, className = '' }) {
  return (
    <div
      role="radiogroup"
      aria-label={`${label} copy variation`}
      className={`theme-dark flex items-center gap-0.5 rounded-full bg-[#0c0a09]/90 p-1 shadow-[0_12px_30px_-10px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.12),0_0_0_3px_rgba(255,85,0,.18)] backdrop-blur-xl ${className}`}
    >
      <span className="px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/55">{label}</span>
      {VERSION_IDS.map((id) => {
        const on = id === current;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`${label}: variation ${id}`}
            title={VERSIONS[id].name}
            onClick={() => onPick(id)}
            className={`grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-semibold leading-none transition-colors ${
              on ? 'bg-orange text-black' : 'text-bone/60 hover:bg-white/[0.08] hover:text-bone'
            }`}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}

/** One section's switch, pinned to the section's bottom-right, clear of the floating nav. */
export function SectionSwitch({ section }) {
  const { picks, pick } = useCopy();
  const { label } = SECTIONS.find((s) => s.key === section);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30">
      <div className="shell flex justify-end">
        <Pill label={label} current={picks[section]} onPick={(id) => pick(id, section)} className="pointer-events-auto" />
      </div>
    </div>
  );
}

/** Sets every section at once. Shows a variation as active only when the whole page uses it. */
export default function CopySwitcher() {
  const { picks, pick } = useCopy();
  const ids = Object.values(picks);
  const all = ids.every((id) => id === ids[0]) ? ids[0] : null;
  return (
    <Pill
      label="All"
      current={all}
      onPick={(id) => pick(id)}
      className="fixed bottom-5 left-5 z-[70] md:left-[max(40px,calc((100vw-1320px)/2+40px))]"
    />
  );
}
