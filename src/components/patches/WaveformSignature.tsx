import { useMemo } from 'react';

import { SIG_VIEWBOX, waveformPath } from '@/lib/waveformSignature';

// Deterministic waveform mark. Pure function of `seed` ⇒ identical path every
// render (no effects, no hydration risk). Size via CSS; color via currentColor.
export function WaveformSignature({ seed, className }: { seed: string; className?: string }) {
  const d = useMemo(() => waveformPath(seed), [seed]);
  return (
    <svg
      viewBox={`0 0 ${SIG_VIEWBOX.w} ${SIG_VIEWBOX.h}`}
      className={className}
      aria-hidden='true'
      focusable='false'
    >
      <path
        d={d}
        fill='none'
        stroke='currentColor'
        strokeWidth={1.3}
        strokeLinejoin='round'
        strokeLinecap='round'
      />
    </svg>
  );
}
