import React from 'react';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxComponent />
      <div className="osmo-credits py-6 text-center text-xs text-white/40">
        <p className="osmo-credits__p">
          Resource by <a target="_blank" rel="noreferrer" href="https://www.osmo.supply/" className="osmo-credits__p-a text-[#ff7722] hover:underline">Osmo</a>
        </p>
      </div>
    </>
  );
}
