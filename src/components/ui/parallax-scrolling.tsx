'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

interface ParallaxComponentProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  layerImages?: string[];
}

export function ParallaxComponent({
  title = "OPEN INTELLIGENCE",
  subtitle,
  children,
  layerImages
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Fallback high-res Unsplash stock images if none provided
  const images = layerImages || [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop", // Abstract 3D deep wave
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1920&auto=format&fit=crop", // Glowing neon ring layer
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop"  // Deep particle layer
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up GSAP and ScrollTrigger instances
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) {
        gsap.killTweensOf(triggerElement);
      }
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax relative overflow-hidden" ref={parallaxRef}>
      <section className="parallax__header relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="parallax__visuals absolute inset-0 w-full h-full">
          <div className="parallax__black-line-overflow absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
          
          <div data-parallax-layers className="parallax__layers relative w-full h-full min-h-screen flex items-center justify-center">
            {/* Layer 1 - Deep Background */}
            <img 
              src={images[0]} 
              loading="eager" 
              data-parallax-layer="1" 
              alt="Parallax Background Layer 1" 
              className="parallax__layer-img absolute inset-0 w-full h-full object-cover opacity-50 scale-110 filter brightness-75" 
            />
            
            {/* Layer 2 - Midground Accent */}
            <img 
              src={images[1]} 
              loading="eager" 
              data-parallax-layer="2" 
              alt="Parallax Accent Layer 2" 
              className="parallax__layer-img absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40 scale-105" 
            />
            
            {/* Layer 3 - Hero Foreground Content / Title */}
            <div data-parallax-layer="3" className="parallax__layer-title relative z-20 w-full max-w-[1280px] mx-auto px-5 lg:px-[75px] text-center pt-24 pb-16">
              {children ? (
                children
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="group mb-8 inline-flex max-w-full items-center gap-2 rounded-full bg-black/60 border border-white/[0.15] py-1 pl-1 pr-4 text-[14px] backdrop-blur-md shadow-2xl">
                    <span className="shrink-0 rounded-full bg-gradient-to-r from-[#ff5500] to-[#ff8800] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-white">
                      01. HERO
                    </span>
                    <span className="truncate font-medium text-[#ffa24a]">
                      OPEN INTELLIGENCE
                    </span>
                  </div>

                  <h1 className="parallax__title text-5xl leading-[1.1] tracking-[-0.03em] sm:text-6xl sm:!leading-[74px] lg:text-[80px] font-bold text-white max-w-4xl drop-shadow-md">
                    <span>Your AI. Your context.</span>
                    <span className="relative inline-block pb-[0.08em] mt-1">
                      <span className="bg-gradient-to-r from-[#ff5500] via-[#ffa24a] to-[#ff5500] bg-clip-text text-transparent">
                        Your choice.
                      </span>
                    </span>
                  </h1>

                  <p className="mt-7 max-w-[620px] text-[18px] leading-[160%] text-white/80 lg:mt-8 lg:max-w-[720px] lg:text-[21px] font-light drop-shadow">
                    {subtitle || "The models you want, memory that stays with you, and privacy built in."}
                  </p>

                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <a 
                      href="#heyopen" 
                      className="inline-flex items-center justify-center rounded-full bg-[#ff5500] px-8 py-[15px] text-[16px] font-medium text-white hover:bg-[#ff6a1a] transition-all shadow-[0_0_25px_rgba(255,85,0,0.5)]"
                    >
                      Try HeyOpen
                    </a>
                    <a 
                      href="#about" 
                      className="inline-flex items-center justify-center rounded-full bg-black/50 border border-white/[0.18] px-8 py-[15px] text-[16px] font-medium text-white hover:bg-black/70 transition-all backdrop-blur-md shadow-xl"
                    >
                      Explore OpenLedger
                    </a>
                  </div>

                  <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3.5 px-7 rounded-full bg-black/60 border border-white/[0.12] text-sm text-white/80 font-mono backdrop-blur-md shadow-2xl">
                    <span className="text-white font-medium">Multi-Model</span>
                    <span className="text-white/25">·</span>
                    <span className="text-white font-medium">Universal Memory</span>
                    <span className="text-white/25">·</span>
                    <span className="text-white font-medium">Private AI</span>
                    <span className="text-white/25">·</span>
                    <span className="text-white font-medium">Agents</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Layer 4 - Foreground Atmosphere / Gradient Glow */}
            <div 
              data-parallax-layer="4" 
              className="parallax__layer-overlay absolute inset-0 pointer-events-none bg-gradient-to-t from-[#060709] via-transparent to-transparent z-25"
            ></div>
          </div>

          {/* Fade transition to next section */}
          <div className="parallax__fade absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060709] to-transparent z-30 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
export default ParallaxComponent;
