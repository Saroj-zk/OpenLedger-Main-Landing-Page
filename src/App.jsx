import { useRef } from 'react';
import Nav from '@/sections/Nav';
import Hero from '@/sections/Hero';
import Privacy from '@/sections/Privacy';
import Stack from '@/sections/Stack';
import UseCases from '@/sections/UseCases';
import HeyOpen from '@/sections/HeyOpen';
import Ecosystem from '@/sections/Ecosystem';
import Backers from '@/sections/Backers';
import { Cta, Footer } from '@/sections/Closing';
import { useGlassSheen, useScrollScene, useSmoothScroll } from '@/lib/motion';
import { useLiquidGlass } from '@/lib/liquid';

export default function App() {
  const root = useRef(null);
  useSmoothScroll();
  useScrollScene(root);
  useLiquidGlass(root);
  useGlassSheen();

  return (
    <div ref={root} className="relative">
      <Nav />
      <main id="main">
        <Hero />
        <Privacy />
        <Stack />
        <HeyOpen />
        <Ecosystem />
        {/* Use cases replace the Protocol section (BuiltForAI.jsx), which is kept but hidden for now */}
        <UseCases />
        <Backers />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
