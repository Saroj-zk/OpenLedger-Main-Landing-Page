import { useId } from 'react';
import { OCTOPUS_PATH, OCTOPUS_VIEWBOX } from '@/components/octopus';

/** The OpenLedger octopus, lit from the top-left in the brand orange. */
export function Logo({ className = '' }) {
  // useId can contain characters that are awkward inside url(#…)
  const id = `ol-logo-${useId().replace(/[^\w-]/g, '')}`;
  return (
    <svg viewBox={OCTOPUS_VIEWBOX} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#ffa060" />
          <stop offset="0.45" stopColor="#ff5500" />
          <stop offset="1" stopColor="#e04000" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d={OCTOPUS_PATH} />
    </svg>
  );
}

export function Arrow({ className = 'arrow h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

export function SectionHead({ label, title, children, align = 'left', className = '' }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-[860px] ${className}`}>
      <p className="eyebrow mb-5" data-reveal>
        <b>//</b> {label} <b>//</b>
      </p>
      <h2 className="display text-[40px] sm:text-[54px] lg:text-[68px]" data-reveal>
        {title}
      </h2>
      {children && (
        <p className={`lead mt-6 max-w-[620px] ${center ? 'mx-auto' : ''}`} data-reveal>
          {children}
        </p>
      )}
    </div>
  );
}
