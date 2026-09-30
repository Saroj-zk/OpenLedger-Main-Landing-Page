import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/**
 * One Lenis instance for the whole page, driven by GSAP's ticker so
 * ScrollTrigger and smooth scrolling read the same frame.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: { offset: -84 } });
    lenisInstance = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/**
 * Scroll-linked parallax and reveals, declared in markup:
 *   data-speed="0.3"       – drifts at a different rate than the page while its section is in view
 *   data-drift="12"        – slides horizontally from -12% to 12% of its width across the section
 *   data-hero-exit         – lifts and fades as the hero scrolls away
 *   data-reveal            – fades up once when it enters the viewport
 *   data-scale-in          – grows from 0.92 to 1 while scrolling into view
 */
export function useScrollScene(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.utils.toArray('[data-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0;
        const trigger = el.closest('[data-parallax-root]') || el.parentElement;
        gsap.fromTo(
          el,
          { y: () => -speed * window.innerHeight * 0.5 },
          {
            y: () => speed * window.innerHeight * 0.5,
            ease: 'none',
            scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      gsap.utils.toArray('[data-drift]').forEach((el) => {
        const drift = parseFloat(el.dataset.drift) || 0;
        gsap.fromTo(
          el,
          { xPercent: -drift },
          {
            xPercent: drift,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('[data-parallax-root]') || el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });

      gsap.utils.toArray('[data-hero-exit]').forEach((el) => {
        gsap.to(el, {
          yPercent: -18,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('section'), start: 'top top', end: 'bottom 25%', scrub: true },
        });
      });

      gsap.utils.toArray('[data-scale-in]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.92, rotateX: 8, transformPerspective: 1400, transformOrigin: '50% 100%' },
          {
            scale: 1,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 35%', scrub: true },
          },
        );
      });

      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, y: 28, filter: 'blur(6px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'filter' },
          ),
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, [rootRef]);
}

/** Pointer-driven depth for elements marked data-depth, scoped to one container. */
export function usePointerDepth(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const layers = [...el.querySelectorAll('[data-depth]')].map((node) => ({
      node,
      depth: parseFloat(node.dataset.depth) || 0,
      x: gsap.quickTo(node, '--px', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(node, '--py', { duration: 1.1, ease: 'power3.out' }),
    }));
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.depth * 60);
        l.y(ny * l.depth * 40);
      });
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [ref]);
}

/** Specular highlight that tracks the pointer across every .glass surface. */
export function useGlassSheen() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    let frame = 0;
    const onMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const target = e.target instanceof Element ? e.target.closest('.glass') : null;
        if (!target) return;
        const r = target.getBoundingClientRect();
        target.style.setProperty('--mx', `${e.clientX - r.left}px`);
        target.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
}
