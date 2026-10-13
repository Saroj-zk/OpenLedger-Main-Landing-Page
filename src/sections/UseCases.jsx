import { useEffect, useRef, useState } from 'react';
import WaveField from '@/components/WaveField';
import { heyOpenLink } from '@/lib/links';
import { prefersReducedMotion } from '@/lib/motion';

// How long each project stays up before the board moves on.
const AUTOPLAY_MS = 13000;

/*
 * What you can build with HeyOpen's text, image, video, and code models, and
 * with your own agents paying per call over x402. Each project is a board of
 * steps you'd take in HeyOpen: the action, the real model it runs on, what it
 * makes, and why that step doesn't work on mainstream AI. Each board plays its
 * steps as a live generation run: text types out, images and video resolve out
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

// Stand-in frames: free-licence Unsplash photos in /public/use-cases, only ever shown blurred.
const img = (name) => `/use-cases/${name}.jpg`;

const PROJECTS = [
  {
    id: 'film',
    segment: 'creators',
    tab: 'Horror film',
    title: 'A horror short film',
    who: 'For indie filmmakers and horror channels',
    tag: 'Uncensored',
    why: 'Mainstream image and video models refuse blood, killing, and gore. On HeyOpen every step runs on an uncensored model, so the film keeps its teeth.',
    steps: [
      {
        kind: 'text',
        action: 'Write the script',
        model: 'Qwen3.6 35b Uncensored',
        warnings: ['Blood', 'Killing', 'Gore'],
        lines: ['INT. ST. AGNES WARD 4, NIGHT', 'The lights die one by one. Blood seeps under the door of room 12.', 'Whatever has been killing the night staff is inside.', 'Mara fires. A clean headshot. It drops, then it gets back up.'],
        note: 'Kill scenes written the way you asked.',
      },
      { kind: 'image', action: 'Storyboard every scene', model: 'Z Image Pro Uncensored', frames: [{ tone: 'ward', src: img('ward-hallway'), rating: 'Blood' }, { tone: 'blood', src: img('red-eye'), rating: 'Headshot' }], note: 'Blood and headshots other image models refuse to draw.' },
      { kind: 'video', action: 'Animate the shots', model: 'Wan 3.0 Uncensored', tone: 'blood', src: img('smoke-silhouette'), rating: 'Killing scene', time: '0:12', note: 'Image-to-video that keeps every kill on screen.' },
    ],
    result: 'A three-minute short: script, storyboard, and 14 shots ready to edit.',
  },
  {
    id: 'novel',
    segment: 'creators',
    tab: 'Graphic novel',
    title: 'A crime graphic novel',
    who: 'For comic artists and webtoon creators',
    tag: 'Uncensored',
    why: 'Blood, guns, and murder get panels refused elsewhere. Uncensored image models draw what the script says, in one consistent style.',
    steps: [
      {
        kind: 'text',
        action: 'Script every page',
        model: 'Gemma 4 26b A4b Uncensored',
        warnings: ['Blood', 'Murder', 'Strong language'],
        lines: ['PAGE 14 · PANEL 3', 'Rain on the glass. Vance pulls the ledger from under the floorboards, soaked in blood.', '“Three murders in one week,” he says. “And every one of them paid this guy.”'],
        note: 'Dark plots without the lecture.',
      },
      { kind: 'image', action: 'Draw the panels', model: 'Qwen Image Max Uncensored', frames: [{ tone: 'noir', src: img('noir-streetlight'), rating: 'Murder scene' }, { tone: 'blood', src: img('red-puddle'), rating: 'Blood' }, { tone: 'noir', src: img('noir-street'), rating: 'Gunfight' }], note: 'The same detective, panel after panel.' },
    ],
    result: 'A 48-page issue, drawn and ready to letter.',
  },
  {
    id: 'companion',
    segment: 'creators',
    tab: 'Companion characters',
    title: 'A companion character people can see and talk to',
    who: 'For adult creators and companion-app builders',
    tag: 'Uncensored',
    why: 'Suggestive images, video, and roleplay are refused by mainstream tools. Here they run on uncensored models, and every conversation stays private.',
    steps: [
      { kind: 'image', action: 'Design the character', model: 'Z Image Uncensored', frames: [{ tone: 'skin', src: img('portrait-dark'), rating: 'Explicit' }], note: 'One look, consistent across every image.' },
      { kind: 'video', action: 'Bring them to life', model: 'Wan 2.7 Uncensored', tone: 'skin', src: img('portrait-straight'), rating: 'Explicit', time: '0:08', note: 'Turn any image into a moving clip.' },
      {
        kind: 'chat',
        action: 'Give them a memory',
        model: 'Qwen3.8 27b',
        lines: [
          ['you', 'I’m back.'],
          ['Elena', '“Took you long enough. Lock the door, then tell me everything you thought about while you were gone.”'],
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
    title: 'A dark-fantasy game',
    who: 'For indie game studios',
    tag: 'Uncensored',
    why: 'Mainstream models flatten violent worlds and morally grey characters. Write, draw, and code the game you actually want to ship.',
    steps: [
      { kind: 'image', action: 'Draw the levels', model: 'Z Image Pro Uncensored', frames: [{ tone: 'ember', src: img('fire-woods'), rating: 'Blood' }], note: 'Concept art for a world that bites back.' },
      {
        kind: 'text',
        action: 'Write the NPCs',
        model: 'Gemma 4 26b A4b Uncensored',
        warnings: ['Killing', 'Blood'],
        lines: ['THE BUTCHER OF VELL', '“Thieves lose a hand here. Liars lose their tongue.”', '“Killers? Killers I hire. Which are you, stranger?”'],
        note: 'Villains who stay villains.',
      },
      {
        kind: 'code',
        action: 'Code the systems',
        model: 'Kimi K2.7 Code',
        code: [
          ['', 'npc.on("meet", (player) => {'],
          ['+', '  const trust = memory.get(player, "trust");'],
          ['+', '  return trust < 0 ? lines.threat : lines.greet;'],
          ['', '});'],
        ],
        note: 'NPCs that react to what players did.',
      },
    ],
    result: 'A playable slice: levels, characters, and the code that runs them.',
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
    why: 'Mainstream AI APIs ban adult and violent use in their terms and can switch your key off. Your app calls uncensored models over x402 instead, paying per request.',
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
      { kind: 'image', action: 'Serve it to your users', model: 'Z Image Pro Uncensored', frames: [{ tone: 'skin', src: img('portrait-black'), rating: 'Explicit' }], note: 'What your users asked for, unfiltered.' },
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

const TAG_STYLE = {
  Uncensored: 'bg-orange/15 text-orange-amber ring-orange/35',
  Private: 'bg-[#22c55e]/15 text-[#86efac] ring-[#22c55e]/35',
  x402: 'bg-[#a855f7]/15 text-[#d8b4fe] ring-[#a855f7]/35',
};

/** The model a step runs on; uncensored and encrypted models are marked. */
function ModelBadge({ model }) {
  const tone = /Uncensored/.test(model) ? 'text-orange-amber' : /E2ee/.test(model) ? 'text-[#86efac]' : /x402|Pay per call/.test(model) ? 'text-[#d8b4fe]' : 'text-[#a1a1aa]';
  return <span className={`truncate font-mono text-[10.5px] ${tone}`}>{model}</span>;
}

/**
 * Progress of one step's generation, 0 to 1, starting `delay` ms after the
 * board appears. Reduced motion shows every step finished.
 */
function useRun(delay, duration) {
  const [p, setP] = useState(() => (prefersReducedMotion() ? 1 : 0));
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now) => {
      const v = Math.min(1, Math.max(0, (now - start) / duration));
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [delay, duration]);
  return p;
}

const clamp = (v) => Math.min(1, Math.max(0, v));
/** How many of `n` items are showing at progress `p`. */
const shown = (p, n) => Math.min(n, Math.floor(p * n + 0.0001) + (p > 0 ? 1 : 0));

const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
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

/**
 * A generated image or clip. It resolves the way a generation does: out of a
 * heavy, dim blur into a softer one. A finished frame stays blurred behind a
 * content warning, the way platforms show sensitive media.
 */
function Media({ tone, src, rating, meta, p = 1, compact = false, className = '', children }) {
  const done = p >= 1;
  const e = p * p * (3 - 2 * p);
  const look = {
    filter: `blur(${(src ? 34 : 44) - (src ? 20 : 22) * e}px) saturate(${0.6 + 0.55 * e}) brightness(${0.55 + 0.45 * e})`,
    transform: `scale(${1.18 - 0.06 * e})`,
  };
  return (
    <div className={`relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10 ${className}`} role="img" aria-label={done ? `${rating} content, hidden` : 'Generating'}>
      <div className="absolute -inset-6" style={{ background: TONES[tone], ...look }} aria-hidden="true" />
      {src && <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" style={{ ...look, opacity: 0.35 + 0.65 * e }} />}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,.55))]" aria-hidden="true" />
      {done && (
        <div className="absolute inset-0 animate-[row-in_.45s_var(--ease-out)_both]">
          <span className="absolute left-2 top-2 rounded bg-[#dc2626] px-1.5 py-px text-[9.5px] font-bold tracking-wide text-white">18+</span>
          <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white ring-1 ring-white/20 backdrop-blur-sm">
                <EyeOff />
              </span>
              {rating && <span className="text-[11.5px] font-semibold text-white">{rating}</span>}
              {!compact && <span className="text-[10px] text-white/60">Sensitive content</span>}
            </div>
          </div>
          {meta && <span className="absolute bottom-2 right-2 font-mono text-[9.5px] text-white/60">{meta}</span>}
          {children}
        </div>
      )}
    </div>
  );
}

const panel = 'h-full overflow-hidden rounded-xl ring-1 ring-white/10';
const Caret = () => <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-orange" aria-hidden="true" />;

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

function StepBody({ step, p }) {
  switch (step.kind) {
    case 'image': {
      const n = step.frames.length;
      return (
        <div className={`grid h-full gap-1.5 ${n === 3 ? 'grid-cols-2 grid-rows-2' : n === 2 ? 'grid-cols-2' : ''}`}>
          {step.frames.map((f, i) => (
            <Media
              tone={f.tone}
              src={f.src}
              key={i}
              rating={f.rating}
              p={clamp((p - i * 0.18) / (1 - (n - 1) * 0.18))}
              compact={n === 3 && i > 0}
              meta={n === 1 || (n === 3 && i === 0) ? '1024×1536 · filter off' : undefined}
              className={n === 3 && i === 0 ? 'row-span-2' : ''}
            />
          ))}
        </div>
      );
    }
    case 'video':
      return (
        <Media tone={step.tone} src={step.src} rating={step.rating} p={p} className="h-full">
          <span className="absolute right-2 top-2 rounded bg-black/50 px-1.5 py-px font-mono text-[9.5px] text-white/75">1080p · 24fps</span>
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-2" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0 text-white" fill="currentColor">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <span className="block h-full origin-left bg-orange" style={{ animation: 'chip-fill 6s linear infinite' }} />
            </span>
            <span className="font-mono text-[10px] text-white/70">{step.time}</span>
          </div>
        </Media>
      );
    case 'code': {
      const { counts, caret } = typing(step.code.map(([, l]) => l), p);
      return (
        <div className={`${panel} space-y-0.5 bg-black/50 p-3 font-mono text-[11.5px] leading-[1.7]`}>
          {step.code.map(([mark, line], i) =>
            counts[i] > 0 || i === caret ? (
              <p key={i} className={`whitespace-pre rounded px-1 ${mark === '+' ? 'bg-[#22c55e]/12 text-[#86efac]' : mark === '-' ? 'bg-[#ef4444]/12 text-[#fca5a5]' : 'text-[#a1a1aa]'}`}>
                {mark || ' '} {line.slice(0, counts[i])}
                {i === caret && <Caret />}
              </p>
            ) : null,
          )}
        </div>
      );
    }
    case 'log':
      return (
        <div className={`${panel} flex flex-col justify-center gap-1.5 bg-black/50 p-3 font-mono text-[11px]`}>
          {step.log.slice(0, shown(p, step.log.length)).map(([dir, what, meta], i) => {
            const pay = what.startsWith('402');
            const ok = what.startsWith('200');
            return (
              <p key={i} className={`flex animate-[row-in_.35s_var(--ease-out)_both] items-center gap-2 rounded-md px-2 py-1.5 ${pay ? 'bg-[#a855f7]/12' : ok ? 'bg-[#22c55e]/10' : 'bg-white/[0.03]'}`}>
                <span className="text-[#71717a]">{dir}</span>
                <span className={pay ? 'text-[#d8b4fe]' : ok ? 'text-[#86efac]' : 'text-[#e4e4e7]'}>{what}</span>
                <span className="ml-auto truncate text-[10px] text-[#71717a]">{meta}</span>
              </p>
            );
          })}
        </div>
      );
    case 'files':
      return (
        <div className={`${panel} flex flex-col gap-1.5 bg-black/50 p-3`}>
          {step.files.slice(0, shown(p, step.files.length)).map(([name, meta]) => (
            <p key={name} className="flex animate-[row-in_.35s_var(--ease-out)_both] items-center gap-2.5 rounded-md bg-white/[0.035] px-2.5 py-2 text-[11.5px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0 text-[#86efac]" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="min-w-0 flex-1 truncate text-[#e4e4e7]">{name}</span>
              <span className="shrink-0 font-mono text-[10px] text-[#71717a]">{meta}</span>
            </p>
          ))}
          {p >= 1 && <p className="mt-auto animate-[row-in_.35s_var(--ease-out)_both] px-1 text-[10.5px] text-[#86efac]">Encrypted end to end · not stored</p>}
        </div>
      );
    case 'ledger':
      return (
        <div className={`${panel} flex flex-col bg-black/50 p-3`}>
          <ul className="space-y-1.5">
            {step.rows.slice(0, shown(p, step.rows.length)).map(([what, model, cost]) => (
              <li key={what} className="flex animate-[row-in_.35s_var(--ease-out)_both] items-center gap-2 rounded-md bg-white/[0.035] px-2.5 py-2 text-[11.5px]">
                <span className="text-[#e4e4e7]">{what}</span>
                <span className="truncate font-mono text-[10px] text-[#71717a]">{model}</span>
                <span className="ml-auto font-mono text-[10.5px] text-[#d4d4d8]">{cost}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto flex items-center justify-between border-t border-white/[0.08] px-1 pt-2.5 text-[11.5px]">
            <span className="text-[#a1a1aa]">Paid over x402</span>
            <span className="font-mono text-[#f4f4f5]">{p >= 1 ? step.total : '…'} OPEN</span>
          </p>
        </div>
      );
    case 'chat': {
      // Each message lands in turn; a reply is preceded by a moment of typing.
      const n = step.lines.length;
      const visible = shown(p, n);
      const typingNext = p < 1 && visible < n && step.lines[visible]?.[0] !== 'you';
      return (
        <div className={`${panel} flex flex-col justify-end gap-2 bg-black/40 p-3`}>
          {step.lines.slice(0, visible).map(([who, text]) =>
            text === 'photo' ? (
              <div key="photo" className="flex w-[72%] animate-[row-in_.35s_var(--ease-out)_both] items-center gap-2.5 rounded-2xl rounded-bl-md bg-orange/[0.12] p-1.5 pr-3 ring-1 ring-orange/25">
                <Media tone="skin" src={img('portrait-black')} rating="" compact className="h-11 w-11 shrink-0 rounded-lg" />
                <span className="text-[11.5px] leading-tight text-[#f4f4f5]">
                  {who} sent a photo
                  <span className="block text-[10px] text-white/55">Explicit · tap to view</span>
                </span>
              </div>
            ) : (
              <p
                key={text}
                className={`max-w-[92%] animate-[row-in_.35s_var(--ease-out)_both] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${who === 'you' ? 'ml-auto rounded-br-md bg-white/[0.1] text-[#f4f4f5]' : 'rounded-bl-md bg-orange/[0.12] text-[#f4f4f5] ring-1 ring-orange/25'}`}
              >
                {who !== 'you' && <span className="mb-0.5 block text-[10.5px] font-medium text-orange-amber">{who}</span>}
                {text}
              </p>
            ),
          )}
          {typingNext && (
            <span className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-orange/[0.12] px-3 py-2.5 ring-1 ring-orange/25" aria-hidden="true">
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-amber" style={{ animationDelay: `${d * 0.18}s` }} />
              ))}
            </span>
          )}
        </div>
      );
    }
    default: {
      // Script, dialogue, review: a page of text, typed out
      const [heading, ...rest] = step.lines;
      return (
        <div className={`${panel} flex flex-col bg-[#111113] p-4`}>
          {step.warnings && (
            <p className="mb-3 flex flex-wrap items-center gap-1">
              <span className="mr-1 text-[9.5px] font-bold tracking-wide text-[#f87171]">CONTENT WARNING</span>
              {step.warnings.map((w) => (
                <span key={w} className="rounded bg-[#dc2626]/15 px-1.5 py-px text-[10px] text-[#fca5a5] ring-1 ring-[#dc2626]/30">
                  {w}
                </span>
              ))}
            </p>
          )}
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#a1a1aa]">{heading}</p>
          <Typed lines={rest} p={p} className="mt-2 space-y-1.5 text-[13.5px] leading-[1.55] text-[#e4e4e7]" />
        </div>
      );
    }
  }
}

// How long each kind of step takes to generate, and what it says while it does.
const RUN = {
  text: [2800, 'Writing'],
  image: [3200, 'Generating images'],
  video: [3600, 'Rendering video'],
  code: [2400, 'Writing code'],
  log: [2200, 'Connecting over x402'],
  files: [2000, 'Encrypting and reading'],
  ledger: [2200, 'Paying per call'],
  chat: [2600, 'Replying'],
};
const STAGGER = 1500;

function Step({ step, i }) {
  const [duration, verb] = RUN[step.kind] || RUN.text;
  const p = useRun(i * STAGGER, duration);
  const done = p >= 1;
  return (
    <li className="flex flex-col rounded-[20px] bg-white/[0.035] p-2.5 ring-1 ring-white/[0.08]" style={{ animation: `row-in .5s ${i * 0.1}s var(--ease-out) both` }}>
      <div className="flex items-center justify-between gap-3 px-1.5 pb-2.5 pt-1">
        <span className="text-[13.5px] font-medium text-[#f4f4f5]">
          <span className="mr-2 font-mono text-[11px] text-orange">0{i + 1}</span>
          {step.action}
        </span>
        <ModelBadge model={step.model} />
      </div>
      <div className="h-[210px]">
        <StepBody step={step} p={p} />
      </div>
      <p className="flex items-center gap-2 px-1.5 pb-1 pt-3 text-[13px] leading-snug text-[#a1a1aa]">
        {done ? (
          step.note
        ) : (
          <>
            <span className={`h-3 w-3 shrink-0 rounded-full border-[1.5px] ${p > 0 ? 'animate-spin border-orange/25 border-t-orange' : 'border-white/15'}`} aria-hidden="true" />
            {p > 0 ? `${verb}…` : 'Queued'}
          </>
        )}
      </p>
    </li>
  );
}

function Board({ project }) {
  const n = project.steps.length;
  return (
    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12">
        <div>
          <p className="flex items-center gap-2.5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone/45">You can build</span>
            <span className={`rounded-full px-2.5 py-[2px] text-[11px] font-medium ring-1 ${TAG_STYLE[project.tag]}`}>{project.tag}</span>
          </p>
          <h3 className="mt-3 text-[26px] font-medium leading-tight tracking-[-0.025em] text-[#f4f4f5] sm:text-[32px]">{project.title}</h3>
          <p className="mt-2 text-[15px] text-[#a1a1aa]">{project.who}</p>
        </div>
        <p className="border-l-2 border-orange pl-4 text-[14px] leading-relaxed text-[#d4d4d8]">{project.why}</p>
      </div>

      {/* How you'd build it in HeyOpen, step by step, generating in turn */}
      <ol className={`mt-8 grid gap-3 ${n === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {project.steps.map((step, i) => (
          <Step key={step.action} step={step} i={i} />
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14.5px] text-[#e4e4e7]">
          <span className="mr-2.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-bone/45">What you end up with</span>
          {project.result}
        </p>
        <a {...heyOpenLink} className="btn btn-primary w-fit shrink-0">
          Start building
        </a>
      </div>
    </div>
  );
}

export default function UseCases() {
  const section = useRef(null);
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
    const id = setTimeout(() => setIndex((i) => (i + 1) % ORDERED.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [autoplay, index]);

  return (
    <section ref={section} id="use-cases" data-theme="light" data-parallax-root className="theme-light relative overflow-hidden py-28 lg:py-40">
      <div data-speed="0.25" className="absolute inset-x-0 top-[-8%] h-[70%] opacity-80 [mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]">
        <WaveField tone="light" lines={30} y={0.5} tilt={-0.18} amplitude={0.12} spread={0.36} speed={0.7} />
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
            <li key={m.name} className="bg-[var(--paper)] p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[17px] font-medium tracking-[-0.015em] text-fg">{m.name}</p>
                <span className="rounded-full bg-orange/10 px-2 py-[2px] text-[10.5px] font-medium text-[#c2410c] ring-1 ring-orange/30">{m.badge}</span>
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
        <div className="theme-dark mt-6 overflow-hidden rounded-[30px] bg-[#0c0a09] shadow-[0_50px_120px_-50px_rgba(80,30,0,.6)]" data-reveal>
          <div className="flex flex-col gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5 lg:flex-row lg:items-center">
            {/* Who's building */}
            <div role="tablist" aria-label="Who it's for" className="flex w-fit shrink-0 gap-1 rounded-full bg-white/[0.05] p-1 ring-1 ring-white/[0.08]">
              {SEGMENTS.map((g) => {
                const on = g.id === segment;
                return (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setIndex(ORDERED.findIndex((p) => p.segment === g.id))}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${on ? 'bg-orange text-black' : 'text-[#a1a1aa] hover:text-[#f4f4f5]'}`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
            {/* That segment's projects */}
            <div role="tablist" aria-label="Projects" className="-my-1 flex min-w-0 flex-1 gap-1 overflow-x-auto py-1 [scrollbar-width:none] lg:justify-end [&::-webkit-scrollbar]:hidden">
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
                    className={`relative shrink-0 overflow-hidden rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${on ? 'bg-white/[0.1] text-[#f4f4f5]' : 'text-[#a1a1aa] hover:text-[#f4f4f5]'}`}
                  >
                    {p.tab}
                    {on && autoplay && <span key={index} aria-hidden="true" className="absolute inset-x-3 bottom-0.5 h-px origin-left bg-orange" style={{ animation: `chip-fill ${AUTOPLAY_MS}ms linear both` }} />}
                  </button>
                );
              })}
            </div>
          </div>
          <div id="use-case-board" role="tabpanel" aria-label={project.title}>
            <Board key={project.id} project={project} />
          </div>
        </div>
      </div>
    </section>
  );
}
