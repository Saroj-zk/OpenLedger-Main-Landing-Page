# OpenLedger — Landing Page

The marketing site for OpenLedger: *Open by choice. Private by design.*

Built with React 19, Vite, Tailwind CSS 3, GSAP (ScrollTrigger) and Lenis smooth scrolling.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Structure

| Path | What it is |
| --- | --- |
| `src/sections/` | One file per page section: Hero, Built for AI, AI Stack, HeyOpen, Ecosystem, Backers, CTA + footer |
| `src/components/WaveField.jsx` | Canvas wave-line background used across sections |
| `src/components/HeyOpenProduct.jsx` | Scaled, animated replica of the HeyOpen chat home |
| `src/components/PixelScreen.jsx` | Pixel-grid renderer for the small animated illustrations |
| `src/components/ui.jsx` | Logo (octopus mark), arrow, section heading |
| `src/lib/motion.js` | Smooth scroll, parallax (`data-speed`), reveals (`data-reveal`) |
| `src/lib/liquid.js` | Liquid-glass edge refraction for `data-liquid` elements (Chromium) |
| `src/lib/links.js` | External links, e.g. the HeyOpen app URL |
| `public/ecosystem/`, `public/backers/` | Partner and investor logos |

## Theming

Sections alternate black and paper. Add `theme-dark` or `theme-light` plus a matching
`data-theme` attribute to a section; colours, glass and chips follow automatically, and the
nav bar switches to match the section beneath it. Tokens live at the top of `src/index.css`.
