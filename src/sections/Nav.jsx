import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui';
import { heyOpenLink } from '@/lib/links';

const links = [
  ['Built for AI', '#built'],
  ['AI Stack', '#stack'],
  ['HeyOpen', '#heyopen'],
  ['Ecosystem', '#ecosystem'],
];

// The bar floats over alternating black and paper sections, so it takes the
// theme of whichever section is currently underneath it.
function useThemeUnder(y) {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const sections = document.querySelectorAll('[data-theme]');
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) {
          setTheme(s.dataset.theme);
          return;
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [y]);
  return theme;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useThemeUnder(44);
  const light = theme === 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a href="#main" className="btn btn-light sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
        Skip to content
      </a>

      <header className={`fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6 ${light ? 'theme-light !bg-transparent' : 'theme-dark !bg-transparent'}`}>
        <nav
          aria-label="Primary"
          data-liquid
          data-bezel="18"
          data-blur="8"
          className={`glass mx-auto flex items-center justify-between rounded-[20px] pl-4 pr-2 transition-[max-width,height,background-color] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${
            light ? '' : 'glass-dark'
          } ${scrolled ? 'h-[58px] max-w-[1040px]' : 'h-[64px] max-w-[1320px]'}`}
        >
          <a href="#top" className="flex items-center gap-2.5" aria-label="OpenLedger home">
            <Logo className="h-7 w-7" />
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-fg">OpenLedger</span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="rounded-lg px-3.5 py-2 text-[14px] text-fg/65 transition-colors hover:bg-fg/[0.06] hover:text-fg">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a {...heyOpenLink} className="btn btn-primary hidden !h-[42px] sm:inline-flex">
              Meet HeyOpen
            </a>
            <button
              type="button"
              className="grid h-[42px] w-[42px] place-items-center rounded-xl text-fg hover:bg-fg/[0.06] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d={open ? 'M4 4l10 10M14 4 4 14' : 'M2 5h14M2 13h14'} stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={`glass mx-auto mt-2 max-w-[1320px] overflow-hidden rounded-[20px] transition-all duration-500 lg:hidden ${light ? '' : 'glass-dark'} ${
            open ? 'max-h-[420px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <ul className="p-2">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3.5 text-[16px] text-fg/85 hover:bg-fg/[0.06]">
                  {label}
                </a>
              </li>
            ))}
            <li className="p-2">
              <a {...heyOpenLink} onClick={() => setOpen(false)} className="btn btn-primary w-full">
                Meet HeyOpen
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
