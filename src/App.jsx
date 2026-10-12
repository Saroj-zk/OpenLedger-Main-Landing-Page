import { useRef } from 'react';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import Privacy from '@/sections/Privacy';
import Stack from '@/sections/Stack';
import BuiltForAI from '@/sections/BuiltForAI';
import HeyOpen from '@/sections/HeyOpen';
import Ecosystem from '@/sections/Ecosystem';
import Backers from '@/sections/Backers';
import { Cta, Footer } from '@/sections/Closing';
import { useGlassSheen, useScrollScene, useSmoothScroll } from '@/lib/motion';
import { useLiquidGlass } from '@/lib/liquid';
import CopySwitcher from '@/components/CopySwitcher';
import { useCopy } from '@/content/context';

export default function App() {
  const root = useRef(null);
  const { signature } = useCopy();
  useSmoothScroll();
  // A copy switch remounts the page (key below) and re-runs the scroll scene,
  // so headings are re-split and reveals re-armed for the new text.
  useScrollScene(root, signature);
  useLiquidGlass(root, signature);
  useGlassSheen();

  return (
    <div ref={root} key={signature} className="relative">
      <Nav />
      <main id="main">
        <Hero />
        <Privacy />
        <Stack />
        <HeyOpen />
        <Ecosystem />
        <BuiltForAI />
        <Backers />
        <Cta />
      </main>
      <Footer />
      <CopySwitcher />
    </div>
  );
}
