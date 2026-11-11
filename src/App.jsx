import { useLayoutEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import Privacy from '@/sections/Privacy';
import Stack from '@/sections/Stack';
import UseCases from '@/sections/UseCases';
import HeyOpen from '@/sections/HeyOpen';
import HowYouPay from '@/sections/HowYouPay';
import RevenueBurn from '@/sections/RevenueBurn';
import Ecosystem from '@/sections/Ecosystem';
import Backers from '@/sections/Backers';
import { Cta, Footer } from '@/sections/Closing';
import StakePage from '@/pages/StakePage';
import EnterprisePage from '@/pages/EnterprisePage';
import { useGlassSheen, useScrollScene, useSmoothScroll } from '@/lib/motion';
import { useLiquidGlass } from '@/lib/liquid';

function Home() {
  return (
    <>
      <Hero />
      <Privacy />
      <Stack />
      <HeyOpen />
      {/* How you settle the bill, which follows "what does it cost". */}
      <HowYouPay />
      {/* And where that money goes once it is spent. */}
      <RevenueBurn />
      {/* Use cases replace the Protocol section (BuiltForAI.jsx), which is kept but hidden for now */}
      <UseCases />
      <Ecosystem />
      <Backers />
      <Cta />
    </>
  );
}

/**
 * The shell every route shares: nav, footer, smooth scroll, the scroll
 * scene and the glass effects.
 *
 * The motion hooks are keyed on the pathname. They run once on mount and
 * register ScrollTrigger against whatever is in the tree at that moment,
 * so without the key a route change would leave triggers pointing at the
 * previous page's elements and the new one would never reveal.
 */
function Shell() {
  const root = useRef(null);

  /* Where a freshly mounted page starts.
     Without a hash, at the top: this runs before the smooth-scroll
     instance is created, so Lenis initialises from zero rather than from
     wherever the previous page was left.
     With one -- arriving at /#privacy from one of the subpages -- the
     browser's own anchor jump is lost, because the target does not exist
     until React has rendered and Lenis takes the scroll position over. So
     the jump is made again once the section is in the tree, and once more
     after load, when images have settled the layout. */
  useLayoutEffect(() => {
    const { hash } = window.location;
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const jump = () => {
      const target = document.querySelector(hash);
      if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY);
    };
    const frame = requestAnimationFrame(jump);
    window.addEventListener('load', jump);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', jump);
    };
  }, []);

  useSmoothScroll();
  useScrollScene(root);
  useLiquidGlass(root);
  useGlassSheen();

  return (
    <div ref={root} className="relative">
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Subpages, brought over from the Hey Open site. */}
          <Route path="/stake" element={<StakePage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          {/* Every path serves index.html, so an unknown one would
              otherwise render the shell around an empty main. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

/* Remount the shell on every route change, so the motion hooks re-run
   against the page that is actually on screen. */
function KeyedShell() {
  const { pathname } = useLocation();
  return <Shell key={pathname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <KeyedShell />
    </BrowserRouter>
  );
}
