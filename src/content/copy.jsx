import { useCallback, useEffect, useMemo, useState } from 'react';
import { CopyContext } from '@/content/context';
import { DEFAULT_VERSION, VERSIONS, VERSION_IDS } from '@/content/versions';

/*
 * Which copy variation is showing. Read from ?copy= first (so a link can point
 * at a specific variation), then from the last choice in this browser.
 */
function initialVersion() {
  const fromUrl = new URLSearchParams(window.location.search).get('copy');
  if (VERSION_IDS.includes(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem('ol-copy');
    if (VERSION_IDS.includes(saved)) return saved;
  } catch {
    /* storage unavailable: fall back to the default */
  }
  return DEFAULT_VERSION;
}

export function CopyProvider({ children }) {
  const [version, setVersionState] = useState(initialVersion);

  const setVersion = useCallback((id) => {
    if (!VERSION_IDS.includes(id)) return;
    setVersionState(id);
    try {
      window.localStorage.setItem('ol-copy', id);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set('copy', id);
    window.history.replaceState(null, '', url);
  }, []);

  useEffect(() => {
    document.title = VERSIONS[version].title;
  }, [version]);

  const value = useMemo(() => ({ version, setVersion, copy: VERSIONS[version] }), [version, setVersion]);
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
