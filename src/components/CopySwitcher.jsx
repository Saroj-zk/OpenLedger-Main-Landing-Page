import { useCopy } from '@/content/context';
import { VERSIONS, VERSION_IDS } from '@/content/versions';

/*
 * TEMPORARY: flips between the copy variations in src/content/versions.js.
 * Remove this component (and its line in App.jsx) once one is chosen.
 *
 * Sits on the page's content edge (same inset as .shell) rather than the
 * screen corner, so it lines up with the text above it.
 */
export default function CopySwitcher() {
  const { version, setVersion } = useCopy();

  return (
    <div
      role="radiogroup"
      aria-label="Copy variation"
      className="theme-dark fixed bottom-5 left-5 z-[70] flex items-center gap-0.5 rounded-full bg-[#0c0a09]/90 p-1 shadow-[0_12px_30px_-10px_rgba(0,0,0,.8),0_0_0_1px_rgba(255,255,255,.1)] backdrop-blur-xl md:left-[max(40px,calc((100vw-1320px)/2+40px))]"
    >
      {VERSION_IDS.map((id) => {
        const on = id === version;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`Copy variation ${id}: ${VERSIONS[id].name}`}
            title={VERSIONS[id].name}
            onClick={() => setVersion(id)}
            className={`grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] font-semibold leading-none transition-colors ${
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
