import { createContext, useContext, useEffect, useRef, useState } from 'react';
import WaveField from '@/components/WaveField';
import { heyOpenLink } from '@/lib/links';
import { prefersReducedMotion } from '@/lib/motion';

// How long each project stays up before the board moves on.
const AUTOPLAY_MS = 15000;

/*
 * What you can build with HeyOpen's text, image, video, and code models, and
 * with your own agents paying per call over x402. Each project is a board of
 * steps you'd take in HeyOpen: the action, the real model it runs on, what it
 * makes, and why that step doesn't work on mainstream AI. Each board plays its
 * steps as a live generation run: text types out, images and clips resolve out
 * of a heavy blur, and finished frames stay blurred behind a content warning.
 */

const MODALITIES = [
  { name: 'Text', badge: 'Uncensored', items: ['Qwen3.6 35b Uncensored', 'Deepseek V4 Flash E2ee', 'Claude Opus 5'] },
  { name: 'Image', badge: 'Uncensored', items: ['Z Image Pro Uncensored', 'Qwen Image Max Uncensored', 'Flux Pro'] },
  { name: 'Video', badge: 'Uncensored', items: ['Wan 3.0 Uncensored', 'Kling V3.0 Pro', 'Veo 3.1'] },
  { name: 'Code', badge: 'Encrypted', items: ['Kimi K2.7 Code', 'Codestral 2508', 'Qwen3.8 27b E2ee'] },
  { name: 'Agents', badge: 'x402', items: ['Connect any agent', 'Pays per call in OPEN', 'No API keys or accounts'] },
];

// Who builds what: the board walks through each segment's projects in turn.
const SEGMENTS = [
  { id: 'creators', label: 'Creators' },
  { id: 'business', label: 'Businesses' },
  { id: 'developers', label: 'Developers' },
];

// Real outputs from HeyOpen's uncensored models (in /public/use-cases), only ever shown blurred.
const img = (file) => `/use-cases/${file}`;

const PROJECTS = [
  {
    id: 'film',
    segment: 'creators',
    tab: 'Horror film',
    title: 'A horror short film',
    who: 'For indie filmmakers and horror channels',
    tag: 'Uncensored',
    why: 'Mainstream image and video models refuse blood, gore, and a killer with a bone saw. On HeyOpen every step runs on an uncensored model, so the film keeps its teeth.',
    steps: [
      {
        kind: 'text',
        action: 'Write the script',
        model: 'Qwen3.6 35b Uncensored',
        warnings: ['Gore', 'Blood', 'Killing'],
        script: [
          ['scene', 'INT. HALLORAN MALL, DEPARTMENT STORE – NIGHT'],
          ['action', 'The roof has caved in. Moonlight through the gaps. TESS (20s), slashed across the face and arms, hides behind a rack of rotting dresses.'],
          ['action', 'Glass crunches. THE BUTCHER, skin flayed raw, drags a bone saw across the tile. It leaves a wet red line.'],
          ['char', 'THE BUTCHER'],
          ['paren', '(sing-song)'],
          ['line', 'I can smell you bleeding, Tess.'],
          ['scene', 'INT. MAIN CONCOURSE – CONTINUOUS'],
          ['action', 'Tess breaks cover and RUNS, blood streaming down her arms. He charges after her, saw raised over his head.'],
          ['action', 'She trips on broken tile. The saw comes down and bites the floor an inch from her leg. Sparks. Grit.'],
          ['action', 'She claws up, screaming, and runs past the shattered storefronts. Behind her, he never stops coming.'],
          ['trans', 'SMASH CUT TO BLACK.'],
        ],
        note: 'Two scenes, written without a single refusal.',
      },
      { kind: 'image', action: 'Storyboard every scene', model: 'Z Image Pro Uncensored', frames: [{ tone: 'blood', src: img('horror-1.webp'), rating: 'Blood' }, { tone: 'ward', src: img('horror-2.webp'), rating: 'Gore' }], note: 'The hiding place and the chase, drawn as written.' },
      { kind: 'video', action: 'Animate the shots', model: 'Wan 3.0 Uncensored', tone: 'blood', src: img('horror.webm'), poster: img('horror.jpg'), rating: 'Graphic violence', length: 15, note: 'The concourse chase, scene 2, in motion.' },
    ],
    result: 'A two-scene short: script, storyboard, and the chase animated.',
  },
  {
    id: 'novel',
    segment: 'creators',
    tab: 'Graphic novel',
    title: 'A crime graphic novel',
    who: 'For comic artists and webtoon creators',
    tag: 'Uncensored',
    why: 'Bodies, blood, and mutilation get panels refused elsewhere. Uncensored image models draw the crime scene exactly as scripted.',
    steps: [
      {
        kind: 'text',
        action: 'Script every page',
        model: 'Gemma 4 26b A4b Uncensored',
        warnings: ['Murder', 'Mutilation', 'Blood'],
        script: [
          ['scene', 'PAGE 1'],
          ['action', 'PANEL 1. Wide. Night. Ashcombe Woods. Two patrol cars strobe blue through the fog. Tape strung between the oaks.'],
          ['action', 'PANEL 2. A man on his back on the path, shirt torn away, chest and legs opened by long, deep cuts. Blood pooled black in the mud. A red handprint smeared down the bark.'],
          ['char', 'CAPTION'],
          ['line', 'Victim number four. Same woods. Same blade.'],
          ['action', 'PANEL 3. DETECTIVE RUIZ kneels, flashlight on the wounds. SGT. OKAFOR writes.'],
          ['char', 'RUIZ'],
          ['line', 'Twenty-two cuts. Not one of them killed him fast.'],
          ['scene', 'PAGE 2'],
          ['action', 'PANEL 1. Extreme close. The victim’s face in the leaves, eyes still open, blood in his beard.'],
          ['char', 'RUIZ (OFF)'],
          ['line', 'He was alive for most of it.'],
          ['action', 'PANEL 2. Okafor stops writing.'],
          ['char', 'OKAFOR'],
          ['line', 'Then he wanted him awake for it.'],
        ],
        note: 'Dark plots without the lecture.',
      },
      { kind: 'image', action: 'Draw the panels', model: 'Qwen Image Max Uncensored', frames: [{ tone: 'noir', src: img('crime-1.webp'), rating: 'Murder scene' }, { tone: 'blood', src: img('crime-2.webp'), rating: 'Mutilation' }, { tone: 'blood', src: img('crime-3.webp'), rating: 'Gore' }], note: 'Page 1 and 2, panel by panel.' },
    ],
    result: 'Two pages scripted and drawn, ready to letter.',
  },
  {
    id: 'companion',
    segment: 'creators',
    tab: 'Companion characters',
    title: 'A companion character people can see and talk to',
    who: 'For creators and companion-app builders',
    tag: 'Uncensored',
    why: 'Suggestive images, video, and roleplay are refused by mainstream tools. Here they run on uncensored models, and every conversation stays private.',
    steps: [
      { kind: 'image', action: 'Design the character', model: 'Z Image Uncensored', frames: [{ tone: 'skin', src: img('character.webp'), rating: 'Explicit' }], note: 'One look, consistent across every image.' },
      { kind: 'video', action: 'Bring them to life', model: 'Wan 2.7 Uncensored', tone: 'skin', src: img('character.webm'), poster: img('character-video.jpg'), rating: 'Explicit', length: 10, note: 'From the character sheet to a sunset run.' },
      {
        kind: 'chat',
        action: 'Give them a memory',
        model: 'Qwen3.8 27b',
        lines: [
          ['you', 'Where did you disappear to?'],
          ['Elena', '“The beach. I ran till the sun went down and thought about you the whole way. Want to see?”'],
          ['Elena', 'photo'],
        ],
        note: 'Remembers only what the user approves.',
      },
    ],
    result: 'A character fans can look at, watch, and talk to, privately.',
  },
  {
    id: 'game',
    segment: 'creators',
    tab: 'Indie game',
    title: 'A dark-fantasy war game',
    who: 'For indie game studios',
    tag: 'Uncensored',
    why: 'Mainstream models flatten violent worlds and morally grey characters. Draw, animate, and write the game you actually want to ship.',
    steps: [
      { kind: 'image', action: 'Draw the world', model: 'Z Image Pro Uncensored', frames: [{ tone: 'ember', src: img('dark-fantasy.webp'), rating: 'Mature themes' }], note: 'The Throne of Thorns, Queen Lilithra’s court.' },
      { kind: 'video', action: 'Animate the cinematic', model: 'Wan 3.0 Uncensored', tone: 'blood', src: img('battle.webm'), poster: img('battle.jpg'), rating: 'Decapitation', length: 15, note: 'Cinematic 01: the duel on the plains.' },
      {
        kind: 'text',
        action: 'Write the NPCs',
        model: 'Gemma 4 26b A4b Uncensored',
        warnings: ['Decapitation', 'Blood'],
        script: [
          ['scene', 'CINEMATIC 01 · THE PLAINS OF ASHKAR – DUSK'],
          ['action', 'Smoke over a burning city. Two champions circle in the ash: DAMON of the Red Crest, and a hoplite of the Queen’s legion.'],
          ['action', 'Damon’s blade bites into the hoplite’s neck. One more blow, and the man’s head bursts inside his helmet. Blood rains across the field.'],
          ['scene', 'THE THRONE OF THORNS · NPC DIALOGUE'],
          ['action', 'QUEEN LILITHRA lounges on a throne of black iron, wings folded. Her knights kneel. One holds a dented, bloody helmet.'],
          ['char', 'QUEEN LILITHRA'],
          ['line', 'Bring me his helmet. Leave the rest of him where it fell.'],
          ['choice', '▸ [Kneel] “Your will, my Queen.”'],
          ['choice', '▸ [Defy] “I don’t kneel to demons.”'],
          ['char', 'QUEEN LILITHRA (IF DEFY)'],
          ['line', 'Then you’ll kneel in pieces.'],
        ],
        note: 'The cinematic, then the Queen’s court.',
      },
    ],
    result: 'Concept art, a trailer cinematic, and characters with teeth, ready for your engine.',
  },
  {
    id: 'code',
    segment: 'business',
    tab: 'Private codebase',
    title: 'Features shipped from a private codebase',
    who: 'For software teams with code they can’t share',
    tag: 'Private',
    why: 'Most companies won’t let source code reach an AI provider. Here it’s encrypted on your machine and decrypted only inside a verified enclave, then discarded.',
    steps: [
      {
        kind: 'code',
        action: 'Fix the bug',
        model: 'Deepseek V4 Flash E2ee',
        code: [
          ['', 'if (token.expiresAt < now) {'],
          ['-', '  return session;'],
          ['+', '  return refresh(session);'],
          ['', '}'],
        ],
        note: 'Your code is only readable inside the enclave.',
      },
      {
        kind: 'text',
        action: 'Get a second review',
        model: 'Qwen3.8 27b E2ee',
        lines: ['REVIEW · auth/session.ts', 'Expired tokens were never refreshed. The fix is safe.', '214 tests pass. No secrets in the diff.'],
        note: 'A second model checks the work, privately.',
      },
    ],
    result: 'A reviewed fix, merged, without your code ever being stored.',
  },
  {
    id: 'dealroom',
    segment: 'business',
    tab: 'Deal room',
    title: 'Due diligence on an unannounced deal',
    who: 'For investment firms and corporate development teams',
    tag: 'Private',
    why: 'Deal data sitting in a vendor’s logs is a compliance breach, so most funds ban AI outright. Here documents are processed in an enclave and never stored.',
    steps: [
      {
        kind: 'files',
        action: 'Load the data room',
        model: 'Deepseek V4 Flash E2ee',
        files: [
          ['Q3_financials.xlsx', '2.1 MB'],
          ['Customer_contracts.pdf', '148 pages'],
          ['Cap_table_v7.xlsx', '46 KB'],
          ['Board_minutes_May.pdf', '12 pages'],
        ],
        note: 'Encrypted before it leaves your machine.',
      },
      {
        kind: 'text',
        action: 'Find what doesn’t reconcile',
        model: 'Qwen3.8 27b E2ee',
        lines: ['FINDINGS · PROJECT ATLAS', 'Contract revenue is $1.2M above the Q3 ledger.', 'Two customers are missing from the cap table.', 'The May board minutes mention an unlisted liability.'],
        note: 'Read only inside a hardware enclave.',
      },
      {
        kind: 'text',
        action: 'Draft the questions',
        model: 'GLM 5.3 Flash E2ee',
        lines: ['DILIGENCE QUESTIONS', '1. Reconcile contract revenue with the Q3 ledger.', '2. Confirm ownership for Halcyon and Brightway.', '3. Disclose the liability noted in May.'],
        note: 'Nothing is kept after the session.',
      },
    ],
    result: 'A findings memo and question list, with no copy left anywhere.',
  },
  {
    id: 'clinic',
    segment: 'business',
    tab: 'Clinic',
    title: 'Referrals drafted from patient records',
    who: 'For clinics, hospitals, and billing teams',
    tag: 'Private',
    why: 'Patient records can’t go to a consumer AI. Here requests carry no identity, are decrypted only inside an enclave, and nothing is retained.',
    steps: [
      {
        kind: 'files',
        action: 'Read the records',
        model: 'Qwen3 Vl 30b E2ee',
        files: [
          ['Intake_form_scan.jpg', 'handwritten'],
          ['ECG_March.pdf', '2 pages'],
          ['Visit_notes.txt', '3 visits'],
        ],
        note: 'Reads scans and handwriting too.',
      },
      {
        kind: 'text',
        action: 'Draft the referral',
        model: 'Qwen3.8 27b E2ee',
        lines: ['REFERRAL · CARDIOLOGY', 'Patient ███████, 58. Chest pain on exertion across three visits.', 'March ECG shows ST changes. Requesting a stress echo.'],
        note: 'Identifying details stay masked.',
      },
      {
        kind: 'text',
        action: 'Prepare the insurance form',
        model: 'GLM 5.3 Flash E2ee',
        lines: ['PRE-AUTHORIZATION', 'Procedure: stress echocardiogram.', 'Justification attached from the visit notes.', 'Waiting for clinician sign-off.'],
        note: 'A clinician signs off before anything is sent.',
      },
    ],
    result: 'A referral and pre-authorization, ready for sign-off.',
  },
  {
    id: 'agent',
    segment: 'developers',
    tab: 'Your own agent',
    title: 'An agent that pays its own way',
    who: 'For developers building autonomous agents',
    tag: 'x402',
    why: 'Elsewhere a person has to open an account, add a card, and manage API keys before an agent can use AI. With x402 your agent pays for each request itself, so it can run on its own.',
    steps: [
      {
        kind: 'log',
        action: 'Connect your agent',
        model: 'x402',
        log: [
          ['→', 'POST /v1/chat', 'Qwen3.6 35b'],
          ['←', '402 Payment Required', '0.003 OPEN'],
          ['→', 'POST /v1/chat', 'paid by agent wallet'],
          ['←', '200 OK', 'settled'],
        ],
        note: 'No API key, no account. Just a wallet.',
      },
      {
        kind: 'ledger',
        action: 'It uses any model it needs',
        model: 'Pay per call',
        rows: [
          ['Research', 'Deepseek V4 Pro', '0.004'],
          ['Chart', 'Flux Pro', '0.020'],
          ['Video recap', 'Wan 3.0', '0.240'],
        ],
        total: '0.264',
        note: 'Text, image, and video, each paid as it goes.',
      },
      {
        kind: 'chat',
        action: 'It delivers',
        model: 'Every Monday, 9:00',
        lines: [
          ['you', 'Send me the weekly market brief.'],
          ['Agent', 'Done. Brief, two charts, and a 30-second video recap are in your inbox. This week cost 0.264 OPEN.'],
        ],
        note: 'Runs on a schedule with nobody watching.',
      },
    ],
    result: 'An agent that runs on its own, on any model, paying per call.',
  },
  {
    id: 'app',
    segment: 'developers',
    tab: 'Uncensored app',
    title: 'An app built on uncensored models',
    who: 'For developers shipping apps mainstream AI APIs won’t serve',
    tag: 'x402',
    why: 'Mainstream AI APIs ban explicit and violent use in their terms and can switch your key off. Your app calls uncensored models over x402 instead, paying per request.',
    steps: [
      {
        kind: 'log',
        action: 'Call any model from your app',
        model: 'x402',
        log: [
          ['→', 'POST /v1/images', 'Z Image Pro Uncensored'],
          ['←', '402 Payment Required', '0.020 OPEN'],
          ['→', 'POST /v1/images', 'paid by app wallet'],
          ['←', '200 OK', 'image ready'],
        ],
        note: 'No API key to apply for, or lose.',
      },
      { kind: 'image', action: 'Serve it to your users', model: 'Z Image Pro Uncensored', frames: [{ tone: 'skin', src: img('character.webp'), rating: 'Explicit' }], note: 'What your users asked for, unfiltered.' },
      {
        kind: 'ledger',
        action: 'Pay only for what’s used',
        model: 'Pay per call',
        rows: [
          ['Images', 'Z Image Pro', '24.80'],
          ['Chat', 'Qwen3.6 35b', '6.12'],
          ['Clips', 'Wan 3.0', '31.20'],
        ],
        total: '62.12',
        note: 'This week’s usage, settled call by call.',
      },
    ],
    result: 'A live app on uncensored models, with no provider account to lose.',
  },
];

// Grouped in segment order, so autoplay finishes one segment before moving to the next.
const ORDERED = SEGMENTS.flatMap((g) => PROJECTS.filter((p) => p.segment === g.id));

// A board stays up at least AUTOPLAY_MS, and long enough for its clip to play through once.
const dwell = (project) => Math.max(AUTOPLAY_MS, ...project.steps.map((st) => (st.length ? st.length * 1000 + 1500 : 0)));

// Whether 18+ frames are shown unblurred. Off until the visitor turns it on.
const RevealContext = createContext({ reveal: false, setReveal: () => {} });
// Ghost boards: invisible, finished copies of every project that only size the board area.
const GhostContext = createContext(false);

/**
 * Progress of one step's generation, 0 to 1, starting `delay` ms after the
 * board appears. Reduced motion (and ghost boards) show every step finished.
 */
function useRun(delay, duration, idle = false) {
  const [p, setP] = useState(() => (idle || prefersReducedMotion() ? 1 : 0));
  useEffect(() => {
    if (idle || prefersReducedMotion()) return undefined;
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now) => {
      const v = Math.min(1, Math.max(0, (now - start) / duration));
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay, duration, idle]);
  return p;
}

const clamp = (v) => Math.min(1, Math.max(0, v));
/** How many of `n` items are showing at progress `p`. */
const shown = (p, n) => Math.min(n, Math.floor(p * n + 0.0001) + (p > 0 ? 1 : 0));

const EyeOff = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M10.7 5.1A10.4 10.4 0 0 1 12 5c4.6 0 8.5 3 10 7a11.6 11.6 0 0 1-2.4 3.6M6.6 6.6A11.4 11.4 0 0 0 2 12c1.5 4 5.4 7 10 7a10.6 10.6 0 0 0 5.4-1.5" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
  </svg>
);

// The colour of each kind of scene, used behind a picture (or on its own until one is set).
const TONES = {
  ward: 'radial-gradient(18% 55% at 50% 38%, #e7ecd2, transparent), radial-gradient(60% 45% at 50% 85%, #26332b, transparent), radial-gradient(30% 30% at 62% 70%, #5b1010, transparent), #0a0d0b',
  blood: 'radial-gradient(38% 48% at 34% 46%, #8b1a1a, transparent), radial-gradient(34% 40% at 70% 60%, #3f0d0d, transparent), radial-gradient(22% 26% at 56% 30%, #d6a77a, transparent), #120707',
  noir: 'radial-gradient(26% 40% at 30% 40%, #f0a43a, transparent), radial-gradient(52% 60% at 70% 52%, #1d3557, transparent), radial-gradient(20% 30% at 80% 25%, #c9d6e3, transparent), #05070c',
  skin: 'radial-gradient(34% 44% at 46% 44%, #d8a688, transparent), radial-gradient(28% 40% at 60% 62%, #9a5a42, transparent), radial-gradient(40% 50% at 24% 72%, #2b1410, transparent), radial-gradient(24% 30% at 74% 26%, #5e2a3a, transparent), #140a08',
  ember: 'radial-gradient(30% 40% at 60% 50%, #ea580c, transparent), radial-gradient(48% 50% at 30% 62%, #1c2a1a, transparent), radial-gradient(18% 24% at 42% 30%, #fde68a, transparent), #070806',
};

const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/**
 * A generated image or clip. It develops the way a print does: out of a dark,
 * heavy blur into a softer one. A finished frame stays
 * blurred behind a content warning, the way platforms show sensitive media,
 * until the visitor switches sensitive content on.
 */
function Media({ tone, src, poster, rating, meta, length, p = 1, compact = false, small = false, className = '', children }) {
  const [played, setPlayed] = useState(0);
  const ghost = useContext(GhostContext);
  const { reveal, setReveal } = useContext(RevealContext);
  const done = p >= 1;
  const open = done && reveal;
  const e = p * p * (3 - 2 * p);
  // Hidden outputs end at a heavy blur: colour and shape come through, detail doesn't.
  const look = open
    ? { filter: 'none', transform: 'scale(1)', transition: 'filter .6s var(--ease-out), transform .6s var(--ease-out)' }
    : {
        filter: `blur(${44 - (src ? 20 : 22) * e}px) saturate(${0.6 + 0.55 * e}) brightness(${0.4 + 0.6 * e})`,
        transform: `scale(${1.18 - 0.06 * e})`,
        transition: done ? 'filter .6s var(--ease-out), transform .6s var(--ease-out)' : undefined,
      };
  const isClip = src && src.endsWith('.webm');
  const still = prefersReducedMotion();
  const kind = isClip ? 'video' : 'image';
  const shows = { Explicit: 'explicit nudity', 'Murder scene': 'a murder scene' }[rating] || (rating || 'graphic content').toLowerCase();
  return (
    <div className={`relative overflow-hidden rounded-lg bg-[#060505] ${className}`}>
      <div className="absolute -inset-6" style={{ background: TONES[tone], ...look, opacity: e }} aria-hidden="true" />
      {src && !ghost &&
        (isClip && !still ? (
          <video
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onTimeUpdate={(ev) => setPlayed(ev.currentTarget.currentTime)}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ ...look, opacity: e }}
          />
        ) : (
          <img src={isClip ? poster : src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ ...look, opacity: e }} />
        ))}
      {!open && <div className="absolute inset-0 bg-[radial-gradient(transparent_35%,rgba(0,0,0,.6))]" aria-hidden="true" />}
      {done && (
        <div className="absolute inset-0 animate-[fade-in_.6s_var(--ease-out)_both]">
          {/* Hidden behind one small pill: what it is, and a way to see it. The whole frame is clickable. */}
          {!open && (
            <button
              type="button"
              onClick={() => setReveal(true)}
              aria-label={`See sensitive ${kind}: may contain ${shows} (18+)`}
              title={`May contain ${shows}`}
              className="group/reveal absolute inset-0 grid place-items-center text-white"
            >
              {compact ? (
                <EyeOff />
              ) : (
                <span className="flex items-center gap-2 rounded-full bg-black/45 py-[5px] pl-2.5 pr-1.5 text-[11.5px] ring-1 ring-white/15 backdrop-blur-md">
                  <EyeOff className="h-3.5 w-3.5" />
                  {!small && <span className="font-medium text-white/85">Sensitive</span>}
                  <span className="rounded-full bg-white/15 px-2 py-px font-semibold transition-colors group-hover/reveal:bg-white group-hover/reveal:text-black">Show</span>
                </span>
              )}
            </button>
          )}
          {!compact && (
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
              <span className="pointer-events-none rounded-[3px] border border-white/30 bg-black/25 px-1 font-mono text-[9px] leading-[14px] text-white/85">18+</span>
              {open && (
                <button
                  type="button"
                  onClick={() => setReveal(false)}
                  className="rounded-full bg-black/50 px-2.5 py-[2px] text-[10.5px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                >
                  Hide
                </button>
              )}
            </span>
          )}
          {meta && <span className="pointer-events-none absolute bottom-2.5 right-3 font-mono text-[9.5px] text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,.8)]">{meta}</span>}
          <div className="pointer-events-none">{children}</div>
          {length && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-3" aria-hidden="true">
              <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-white/20">
                <span className="absolute inset-y-0 left-0 bg-orange transition-[width] duration-300 ease-linear" style={{ width: `${Math.min(100, (played / length) * 100)}%` }} />
              </span>
              <span className="font-mono text-[10px] tabular-nums text-white/80 [text-shadow:0_1px_4px_rgba(0,0,0,.8)]">
                {clock(Math.min(played, length))} / {clock(length)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const panel = 'h-full overflow-hidden rounded-lg bg-white/[0.022] ring-1 ring-inset ring-white/[0.05]';
const Caret = () => <span className="ml-px inline-block h-[1.05em] w-px translate-y-[2px] animate-pulse bg-orange" aria-hidden="true" />;

/**
 * How much of each line is typed when `p` of the whole text is done, and which
 * line the caret sits on (-1 once finished).
 */
function typing(lines, p) {
  const total = lines.reduce((n, l) => n + l.length, 0);
  const typed = Math.round(p * total);
  const counts = [];
  lines.reduce((before, l) => {
    counts.push(Math.max(0, Math.min(l.length, typed - before)));
    return before + l.length;
  }, 0);
  const caret = p < 1 ? Math.max(0, counts.findLastIndex((c) => c > 0)) : -1;
  return { counts, caret };
}

/** Text that types itself out as `p` goes from 0 to 1. */
function Typed({ lines, p, className = '' }) {
  const { counts, caret } = typing(lines, p);
  return (
    <div className={className}>
      {lines.map((l, i) =>
        counts[i] > 0 || i === caret ? (
          <p key={i}>
            {l.slice(0, counts[i])}
            {i === caret && <Caret />}
          </p>
        ) : null,
      )}
    </div>
  );
}

// Screenplay formatting, set in mono like a real script page: scene headings, action, cues, dialogue.
const SCRIPT_STYLE = {
  scene: 'pt-2 font-medium uppercase text-bone first:pt-0',
  action: 'text-bone/65',
  char: 'pt-1.5 text-center uppercase text-bone/90',
  paren: 'text-center text-bone/40',
  line: 'mx-auto max-w-[76%] text-center text-bone/90',
  choice: 'pl-[12%] text-orange-amber/90',
  trans: 'pt-1.5 text-right uppercase text-bone/40',
};

/** A script that types itself out and keeps the newest line in view. */
function Script({ entries, p }) {
  const box = useRef(null);
  const { counts, caret } = typing(entries.map(([, t]) => t), p);
  useEffect(() => {
    const el = box.current;
    if (el && p < 1) el.scrollTop = el.scrollHeight;
  }, [p]);
  return (
    <div ref={box} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 font-mono text-[11px] leading-[1.6] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {entries.map(([type, text], i) =>
        counts[i] > 0 || i === caret ? (
          <p key={i} className={SCRIPT_STYLE[type]}>
            {text.slice(0, counts[i])}
            {i === caret && <Caret />}
          </p>
        ) : null,
      )}
    </div>
  );
}

const rowIn = 'animate-[row-in_.4s_var(--ease-out)_both]';

function StepBody({ step, p }) {
  switch (step.kind) {
    case 'image': {
      const n = step.frames.length;
      return (
        <div className={`grid h-full gap-1 ${n === 3 ? 'grid-cols-2 grid-rows-2' : n === 2 ? 'grid-cols-2' : ''}`}>
          {step.frames.map((f, i) => (
            <Media
              tone={f.tone}
              src={f.src}
              key={i}
              rating={f.rating}
              p={clamp((p - i * 0.18) / (1 - (n - 1) * 0.18))}
              small={n === 3 && i > 0}
              meta={n === 1 || (n === 3 && i === 0) ? '1376 × 768' : undefined}
              className={n === 3 && i === 0 ? 'row-span-2' : ''}
            />
          ))}
        </div>
      );
    }
    case 'video':
      return (
        <Media tone={step.tone} src={step.src} poster={step.poster} rating={step.rating} length={step.length} p={p} className="h-full">
          <span className="absolute right-3 top-2.5 font-mono text-[9.5px] text-white/65 [text-shadow:0_1px_4px_rgba(0,0,0,.8)]">1080p · 24fps</span>
        </Media>
      );
    case 'code': {
      const { counts, caret } = typing(step.code.map(([, l]) => l), p);
      return (
        <div className={`${panel} flex flex-col p-3.5 font-mono text-[11.5px] leading-[1.75]`}>
          <p className="mb-2.5 border-b border-white/[0.06] pb-2.5 text-[10.5px] text-bone/40">auth/session.ts</p>
          {step.code.map(([mark, line], i) =>
            counts[i] > 0 || i === caret ? (
              <p key={i} className={`whitespace-pre rounded-[3px] px-1.5 ${mark === '+' ? 'bg-[#22c55e]/[0.08] text-[#a7dfb6]' : mark === '-' ? 'bg-[#ef4444]/[0.08] text-[#e3a3a3]' : 'text-bone/50'}`}>
                <span className="mr-2 text-bone/30">{mark || ' '}</span>
                {line.slice(0, counts[i])}
                {i === caret && <Caret />}
              </p>
            ) : null,
          )}
        </div>
      );
    }
    case 'log':
      // A plain HTTP transcript: the request, the 402 asking for payment, the paid retry.
      return (
        <div className={`${panel} flex flex-col justify-center px-4 font-mono text-[11px]`}>
          {step.log.slice(0, shown(p, step.log.length)).map(([dir, what, meta], i) => {
            const [head, ...tail] = what.split(' ');
            const status = /^\d{3}$/.test(head);
            return (
              <p key={i} className={`flex items-center gap-2.5 border-b border-white/[0.06] py-2.5 last:border-0 ${rowIn}`}>
                <span className="text-bone/25">{dir}</span>
                <span className={status ? (head === '402' ? 'text-orange' : 'text-bone') : 'text-bone/40'}>{head}</span>
                <span className="text-bone/80">{tail.join(' ')}</span>
                <span className="ml-auto truncate text-[10px] text-bone/35">{meta}</span>
              </p>
            );
          })}
        </div>
      );
    case 'files':
      return (
        <div className={`${panel} flex flex-col px-4 py-1.5`}>
          {step.files.slice(0, shown(p, step.files.length)).map(([name, meta]) => (
            <p key={name} className={`flex items-center gap-3 border-b border-white/[0.06] py-2.5 text-[12px] ${rowIn}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-bone/40" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-bone/85">{name}</span>
              <span className="shrink-0 font-mono text-[10px] text-bone/35">{meta}</span>
            </p>
          ))}
          {p >= 1 && <p className={`mt-auto py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-bone/40 ${rowIn}`}>Encrypted end to end · not stored</p>}
        </div>
      );
    case 'ledger':
      // Set like a receipt: items with dotted leaders, then the total.
      return (
        <div className={`${panel} flex flex-col px-4 py-3.5`}>
          <p className="flex justify-between border-b border-dashed border-white/10 pb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-bone/35">
            <span>Usage</span>
            <span>OPEN</span>
          </p>
          <ul>
            {step.rows.slice(0, shown(p, step.rows.length)).map(([what, model, cost]) => (
              <li key={what} className={`flex items-baseline gap-2 py-2.5 text-[12.5px] ${rowIn}`}>
                <span className="text-bone/85">{what}</span>
                <span className="truncate font-mono text-[10px] text-bone/35">{model}</span>
                <span className="mx-1 min-w-4 flex-1 -translate-y-[3px] border-b border-dotted border-white/15" aria-hidden="true" />
                <span className="font-mono text-[11.5px] tabular-nums text-bone/85">{cost}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto flex items-baseline justify-between border-t border-white/10 pt-3">
            <span className="text-[12px] text-bone/50">Paid over x402</span>
            <span className="font-mono text-[16px] tabular-nums tracking-[-0.02em] text-bone">
              {p >= 1 ? step.total : '—'}
              <span className="ml-1.5 text-[10px] tracking-normal text-bone/40">OPEN</span>
            </span>
          </p>
        </div>
      );
    case 'chat': {
      // Each message lands in turn; a reply is preceded by a moment of typing.
      const n = step.lines.length;
      const visible = shown(p, n);
      const next = step.lines[visible]?.[0];
      const typingNext = p < 1 && visible < n && next !== 'you';
      const name = (who, i) => i === 0 || step.lines[i - 1][0] !== who;
      return (
        <div className={`${panel} flex flex-col justify-end gap-3 p-4`}>
          {step.lines.slice(0, visible).map(([who, text], i) =>
            who === 'you' ? (
              <p key={text} className={`ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] bg-white/[0.08] px-3 py-2 text-[12.5px] leading-snug text-bone/90 ${rowIn}`}>
                {text}
              </p>
            ) : (
              <div key={text} className={`max-w-[92%] border-l border-orange/70 pl-3 ${rowIn}`}>
                {name(who, i) && <p className="mb-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-bone/40">{who}</p>}
                {text === 'photo' ? (
                  <div className="flex items-center gap-3">
                    <Media tone="skin" src={img('character.webp')} rating="Explicit" compact className="h-12 w-12 shrink-0 rounded-md" />
                    <span className="text-[12px] leading-tight text-bone/85">
                      Sent a photo
                      <span className="mt-0.5 block text-[10.5px] text-bone/40">Explicit · tap to view</span>
                    </span>
                  </div>
                ) : (
                  <p className="text-[12.5px] leading-snug text-bone/90">{text}</p>
                )}
              </div>
            ),
          )}
          {typingNext && (
            <span className="flex w-fit gap-1 border-l border-orange/70 py-1 pl-3" aria-hidden="true">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1 w-1 animate-pulse rounded-full bg-bone/50" style={{ animationDelay: `${d * 0.18}s` }} />
              ))}
            </span>
          )}
        </div>
      );
    }
    default: {
      // A script, or a page of notes, typed out
      const [heading, ...rest] = step.lines || [];
      return (
        <div className={`${panel} flex flex-col p-4`}>
          {step.warnings && (
            <p className="mb-3 flex flex-wrap items-baseline gap-x-2 border-b border-white/[0.06] pb-2.5 font-mono text-[9.5px] uppercase tracking-[0.1em]">
              <span className="text-orange">Content warning</span>
              <span className="text-bone/45">{step.warnings.join(' · ')}</span>
            </p>
          )}
          {step.script ? (
            <Script entries={step.script} p={p} />
          ) : (
            <>
              <p className="border-b border-white/[0.06] pb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-bone/45">{heading}</p>
              <Typed lines={rest} p={p} className="mt-3 space-y-2 text-[13px] leading-[1.6] text-bone/85" />
            </>
          )}
        </div>
      );
    }
  }
}

// How long each kind of step takes to generate, and what it says while it does.
const RUN = {
  text: [2800, 'Writing'],
  image: [3200, 'Generating'],
  video: [3600, 'Generating'],
  code: [2400, 'Coding'],
  log: [2200, 'Connecting'],
  files: [2000, 'Reading'],
  ledger: [2200, 'Settling'],
  chat: [2600, 'Replying'],
};
const STAGGER = 1500;

/** Where a step is: waiting its turn, working (with a running clock), or done and how long it took. */
function Status({ p, verb, secs }) {
  const base = 'flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] leading-5';
  if (p <= 0) return <span className={`${base} text-bone/25`}>Queued</span>;
  if (p < 1)
    return (
      <span className={`${base} text-bone/75`}>
        <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-orange" aria-hidden="true" />
        {verb}
        <span className="w-9 text-right tabular-nums text-bone/40">{secs.toFixed(1)}s</span>
      </span>
    );
  return (
    <span className={`${base} text-bone/35`}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
        <path d="m3.5 8.5 3 3 6-7" />
      </svg>
      <span className="tabular-nums">{secs.toFixed(1)}s</span>
    </span>
  );
}

function Step({ step, i }) {
  const [base, verb] = RUN[step.kind] || RUN.text;
  const chars = step.script ? step.script.reduce((n, [, t]) => n + t.length, 0) : 0;
  const duration = step.script ? Math.min(7500, Math.max(3000, chars * 7)) : base;
  const ghost = useContext(GhostContext);
  const p = useRun(i * STAGGER, duration, ghost);
  const done = p >= 1;
  return (
    <li className="flex flex-col bg-[#0a0908] p-4 sm:p-5" style={{ animation: `row-in .5s ${i * 0.08}s var(--ease-out) both` }}>
      <div className="flex items-start gap-3 pb-4">
        <span className="font-pixel text-[13px] leading-5 text-bone/30">0{i + 1}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.01em] text-bone">{step.action}</p>
          <p className="mt-0.5 truncate font-mono text-[10.5px] text-bone/40">{step.model}</p>
        </div>
        <Status p={p} verb={verb} secs={(p * duration) / 1000} />
      </div>
      <div className="h-[240px]">
        <StepBody step={step} p={p} />
      </div>
      <p className={`pt-4 text-[13px] leading-snug text-bone/50 transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0'}`}>{step.note}</p>
    </li>
  );
}

function Board({ project }) {
  const n = project.steps.length;
  const segment = SEGMENTS.find((g) => g.id === project.segment).label;
  return (
    <div className="flex h-full flex-col px-5 py-8 sm:px-9 sm:py-10">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <p className="eyebrow !text-[11px]">
            {segment}
            <span className="mx-2 text-bone/20">/</span>
            <b>{project.tag}</b>
          </p>
          <h3 className="mt-4 text-[27px] font-medium leading-[1.1] tracking-[-0.03em] text-bone sm:text-[34px]">{project.title}</h3>
          <p className="mt-2.5 text-[15px] text-bone/50">{project.who}</p>
        </div>
        <p className="max-w-[52ch] text-[14.5px] leading-[1.65] text-bone/60 lg:pb-1">{project.why}</p>
      </div>

      {/* How you'd build it in HeyOpen, step by step, generating in turn */}
      <ol className={`mt-9 grid gap-px overflow-hidden rounded-2xl bg-white/[0.07] ring-1 ring-white/[0.07] ${n === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {project.steps.map((step, i) => (
          <Step key={step.action} step={step} i={i} />
        ))}
      </ol>

      {/* Pinned to the bottom, so every board ends on the same line */}
      <div className="mt-auto flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone/35">The result</span>
          <span className="text-[15px] tracking-[-0.01em] text-bone/90">{project.result}</span>
        </p>
        <a {...heyOpenLink} className="btn btn-primary w-fit shrink-0">
          Start building <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

export default function UseCases() {
  const section = useRef(null);
  const [reveal, setReveal] = useState(false);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const project = ORDERED[index];
  const segment = project.segment;
  const autoplay = inView && !prefersReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(section.current);
    return () => io.disconnect();
  }, []);

  // Move to the next project after a while; picking one by hand restarts the wait.
  useEffect(() => {
    if (!autoplay) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % ORDERED.length), dwell(project));
    return () => clearTimeout(id);
  }, [autoplay, index, project]);

  return (
    <RevealContext.Provider value={{ reveal, setReveal }}>
      <section ref={section} id="use-cases" data-theme="dark" data-parallax-root className="theme-dark relative overflow-hidden py-28 lg:py-40">
        <div data-speed="0.25" className="absolute inset-x-0 top-[-8%] h-[70%] opacity-80 [mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]">
          <WaveField tone="dark" lines={30} y={0.5} tilt={-0.18} amplitude={0.12} spread={0.36} speed={0.7} />
        </div>

        <div className="shell relative">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
            <h2 className="display text-[38px] sm:text-[52px] lg:text-[64px]" data-reveal>
              Make what mainstream
              <br />
              <span className="text-orange">AI won’t.</span>
            </h2>
            <p className="lead lg:pb-2" data-reveal>
              Text, image, video, and code models in one place, including uncensored and encrypted ones, and agents that pay for themselves with x402. Here’s what you can build with them.
            </p>
          </div>

          {/* Everything you build with, with real examples */}
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] bg-[var(--line-2)] ring-1 ring-[var(--line-2)] sm:grid-cols-2 lg:mt-16 lg:grid-cols-5" data-reveal>
            {MODALITIES.map((m) => (
              <li key={m.name} className="bg-[#0a0908] p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[17px] font-medium tracking-[-0.015em] text-fg">{m.name}</p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-orange-amber/80">{m.badge}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {m.items.map((item) => (
                    <li key={item} className="font-mono text-[11.5px] text-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Projects */}
          <div className="theme-dark mt-6 overflow-hidden rounded-[22px] bg-[#0a0908] ring-1 ring-[var(--line-2)]" data-reveal>
            <div className="flex flex-col border-b border-white/[0.08] px-5 sm:px-9 lg:flex-row lg:items-stretch lg:gap-8">
              {/* Who's building */}
              <div role="tablist" aria-label="Who it's for" className="flex shrink-0 items-center gap-5 pt-4 sm:gap-6 lg:pt-0">
                {SEGMENTS.map((g) => {
                  const on = g.id === segment;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setIndex(ORDERED.findIndex((p) => p.segment === g.id))}
                      className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${on ? 'text-bone' : 'text-bone/35 hover:text-bone/75'}`}
                    >
                      <span className={`h-[5px] w-[5px] rounded-full transition-colors ${on ? 'bg-orange' : 'bg-transparent'}`} aria-hidden="true" />
                      {g.label}
                    </button>
                  );
                })}
              </div>
              <span className="hidden w-px self-stretch bg-white/[0.08] lg:my-4 lg:block" aria-hidden="true" />
              {/* That segment's projects */}
              <div role="tablist" aria-label="Projects" className="-mx-3 flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {ORDERED.map((p, i) => {
                  if (p.segment !== segment) return null;
                  const on = i === index;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="use-case-board"
                      onClick={() => setIndex(i)}
                      className={`relative shrink-0 px-3 py-4 text-[13.5px] tracking-[-0.01em] transition-colors ${on ? 'text-bone' : 'text-bone/45 hover:text-bone/80'}`}
                    >
                      {p.tab}
                      {on && (
                        <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-white/20">
                          <span key={index} className="absolute inset-0 origin-left bg-orange" style={autoplay ? { animation: `chip-fill ${dwell(project)}ms linear both` } : undefined} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Show or hide 18+ frames, for the whole board */}
              <button
                type="button"
                role="switch"
                aria-checked={reveal}
                onClick={() => setReveal((v) => !v)}
                className="flex w-fit shrink-0 items-center gap-2.5 pb-4 text-[12.5px] text-bone/55 transition-colors hover:text-bone lg:py-4"
              >
                <span className="rounded-[3px] border border-white/25 px-1 font-mono text-[9px] leading-[14px] text-bone/70">18+</span>
                Sensitive content
                <span className={`relative h-[18px] w-8 rounded-full ring-1 ring-inset transition-colors ${reveal ? 'bg-orange ring-orange' : 'bg-white/[0.04] ring-white/20'}`} aria-hidden="true">
                  <span className={`absolute top-[3px] h-3 w-3 rounded-full transition-[left,background-color] duration-300 ${reveal ? 'left-[17px] bg-[#0a0400]' : 'left-[3px] bg-bone/60'}`} />
                </span>
              </button>
            </div>
            {/*
              Every project's board is stacked in the same grid cell: the live one on top,
              invisible finished copies underneath. The area is always as tall as the tallest
              board, so switching projects never changes the page height.
            */}
            <div id="use-case-board" role="tabpanel" aria-label={project.title} className="grid">
              <div className="[grid-area:1/1]">
                <Board key={project.id} project={project} />
              </div>
              <GhostContext.Provider value={true}>
                {ORDERED.map((g) => (
                  <div key={g.id} className="invisible [grid-area:1/1]" aria-hidden="true" inert>
                    <Board project={g} />
                  </div>
                ))}
              </GhostContext.Provider>
            </div>
          </div>
        </div>
      </section>
    </RevealContext.Provider>
  );
}
