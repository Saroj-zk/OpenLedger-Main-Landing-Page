import { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyContext } from '@/content/context';
import { DEFAULT_VERSION, SECTIONS, VERSIONS, VERSION_IDS } from '@/content/versions';

/*
 * Which copy variation each section shows, so reviewers can mix and match.
 *
 * The choice lives in ?copy= so a link reproduces it: one digit sets every
 * section (?copy=2), one digit per section in SECTIONS order sets each
 * (?copy=12311221). Without a URL choice, the last one made in this browser.
 */
const STORAGE_KEY = 'ol-copy';

function parse(code) {
  if (!code) return null;
  if (VERSION_IDS.includes(code)) return Object.fromEntries(SECTIONS.map(({ key }) => [key, code]));
  if (code.length === SECTIONS.length && [...code].every((c) => VERSION_IDS.includes(c))) {
    return Object.fromEntries(SECTIONS.map(({ key }, i) => [key, code[i]]));
  }
  return null;
}

function encode(picks) {
  const ids = SECTIONS.map(({ key }) => picks[key]);
  return ids.every((id) => id === ids[0]) ? ids[0] : ids.join('');
}

function initialPicks() {
  const fromUrl = parse(new URLSearchParams(window.location.search).get('copy'));
  if (fromUrl) return fromUrl;
  try {
    const saved = parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch {
    /* storage unavailable: fall back to the default */
  }
  return parse(DEFAULT_VERSION);
}

/** The page's copy, each section taken from its own variation. */
function compose(picks) {
  const from = (key) => VERSIONS[picks[key]];
  const copy = Object.fromEntries(SECTIONS.map(({ key }) => [key, from(key)[key]]));
  // Nav and footer labels follow the section they point at; the nav button follows the hero.
  copy.nav = {
    privacy: from('privacy').nav.privacy,
    stack: from('platform').nav.stack,
    heyopen: from('heyopen').nav.heyopen,
    ecosystem: from('ecosystem').nav.ecosystem,
    built: from('protocol').nav.built,
    backed: from('investors').nav.backed,
    cta: from('hero').nav.cta,
  };
  copy.title = from('hero').title;
  return copy;
}

export function CopyProvider({ children }) {
  const [picks, setPicks] = useState(initialPicks);

  const update = useCallback((next) => {
    setPicks(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, encode(next));
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set('copy', encode(next));
    window.history.replaceState(null, '', url);
  }, []);

  /** Pick a variation for one section, or for every section when `section` is omitted. */
  const pick = useCallback(
    (id, section) => {
      if (!VERSION_IDS.includes(id)) return;
      update(section ? { ...picks, [section]: id } : parse(id));
    },
    [picks, update],
  );

  const copy = useMemo(() => compose(picks), [picks]);

  useEffect(() => {
    document.title = copy.title;
  }, [copy.title]);

  const value = useMemo(() => ({ picks, pick, copy, signature: encode(picks) }), [picks, pick, copy]);
  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
}

/** A heading in two parts: `a` plain, `b` orange, on one line or two. */
export function Headline({ h }) {
  return (
    <>
      {h.a}
      {h.br ? <br /> : ' '}
      <span className="text-orange">{h.b}</span>
    </>
  );
}
