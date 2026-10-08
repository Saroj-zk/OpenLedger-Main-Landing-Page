import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lets CSS hold animated elements in their start state before the first paint (see index.css),
// so nothing flashes visible and then jumps to hidden when its animation begins.
if (typeof document !== 'undefined' && !prefersReducedMotion()) document.documentElement.classList.add('js-motion');

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/*
 * Decorative canvases (waves, pixel art) skip drawing while the page is
 * scrolling and resume once it settles. Parallax still moves them, so the
 * pause is invisible, but it frees the main thread for smooth scrolling.
 */
let scrollingUntil = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { scrollingUntil = performance.now() + 150; }, { passive: true });
}
export const isScrolling = () => performance.now() < scrollingUntil;

/**
 * One Lenis instance for the whole page, driven by GSAP's ticker so
 * ScrollTrigger and smooth scrolling read the same frame.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -84 } });
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
 *   data-reveal            – fades up once when it enters the viewport (staggered with its neighbours)
 *   data-scale-in          – grows from 0.92 to 1 while scrolling into view
 *   data-intro             – part of the hero's entrance on page load
 * Every h1/h2 with the .display class rises line by line from behind a mask.
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

      // Headings: each line slides up from behind its own mask. autoSplit re-splits when the
      // pixel font finishes loading or the width changes, so line breaks always match the layout.
      gsap.utils.toArray('h1.display, h2.display').forEach((heading) => {
        const hero = heading.tagName === 'H1';
        SplitText.create(heading, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit(self) {
            // Masks clip at the line box, but the pixel font's descenders (p, y, g) hang below it.
            // Grow each mask downward and pull the next line back up so layout doesn't shift.
            self.masks.forEach((m) => {
              m.style.paddingBottom = '0.22em';
              m.style.marginBottom = '-0.22em';
            });
            gsap.set(heading, { autoAlpha: 1 });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: hero ? 1.25 : 1.05,
              ease: 'expo.out',
              stagger: 0.1,
              delay: hero ? 0.15 : 0,
              scrollTrigger: hero ? undefined : { trigger: heading, start: 'top 88%', once: true },
            });
          },
        });
      });

      // Hero entrance: label, copy, button and tagline follow the headline in.
      gsap.fromTo(
        '[data-intro]',
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.55 },
      );

      ScrollTrigger.batch('[data-reveal]:not(.display)', {
        start: 'top 90%',
        once: true,
        onEnter: (els) => {
          // A fast jump (nav link, deep link) enters many sections in one batch. Staggering
          // all of them would leave the ones on screen waiting seconds for their turn, so
          // only what's in view animates; anything already scrolled past just appears.
          const inView = els.filter((el) => el.getBoundingClientRect().bottom > 0);
          const passed = els.filter((el) => !inView.includes(el));
          if (passed.length) gsap.set(passed, { autoAlpha: 1, y: 0 });
          gsap.fromTo(inView, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
        },
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
