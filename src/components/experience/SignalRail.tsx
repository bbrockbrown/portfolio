import { useEffect, useRef, useState } from 'react';

import { RAIL_STOPS, RAIL_X, railColor } from '@/lib/experience/rail';

// The timeline's rule, drawn as a live signal: a faint vertical sine trace that
// swells into a wave packet around the hovered entry, with a playhead that
// glides to it. Updated per frame through refs, so React never re-renders it.

const WIDTH = 24;
const STEP = 3; // px between path samples
const BASE_AMP = 1.2; // idle wobble
const SWELL_AMP = 7; // extra amplitude at the hovered entry
const SPREAD = 46; // px, width of the wave packet
const K = 0.13; // rad per px, the trace's wavelength
const SPEED = 0.0025; // rad per ms, phase drift
const EASE = 0.12; // per-frame approach for swell + playhead

interface Props {
  height: number;
  activeY: number | null; // y of the hovered entry's dot, px from the top
  restY: number; // where the playhead parks with nothing hovered
}

export function SignalRail({ height, activeY, restY }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const target = useRef({ activeY, restY });
  target.current = { activeY, restY };
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Animated mode reads hover through `target`; reduced motion redraws per hover.
  const redrawKey = reduced ? activeY : null;

  useEffect(() => {
    if (height <= 0) return;
    let phase = 0;
    let swell = 0;
    let headY = target.current.activeY ?? target.current.restY;
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      const cy = headY;
      let d = '';
      for (let y = 0; y <= height; y += STEP) {
        const a = BASE_AMP + SWELL_AMP * swell * Math.exp(-(((y - cy) / SPREAD) ** 2));
        const x = RAIL_X + a * Math.sin(y * K + phase);
        d += `${y === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y}`;
      }
      pathRef.current?.setAttribute('d', d);
      headRef.current?.setAttribute('cy', cy.toFixed(1));
      headRef.current?.setAttribute('cx', (RAIL_X + BASE_AMP * Math.sin(cy * K + phase)).toFixed(2));
      headRef.current?.setAttribute('fill', railColor(cy / height));
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const { activeY: a, restY: r } = target.current;
      const k = 1 - (1 - EASE) ** (dt / 16.7); // frame-rate independent easing
      swell += ((a === null ? 0 : 1) - swell) * k;
      headY += ((a ?? r) - headY) * k;
      phase += SPEED * dt;
      draw();
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      // Still frame, redrawn whenever the hovered entry changes.
      swell = target.current.activeY === null ? 0 : 1;
      draw();
      return;
    }
    draw(); // paint immediately rather than waiting for the first frame
    raf = requestAnimationFrame(frame);
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [height, reduced, redrawKey]);

  return (
    <svg
      aria-hidden='true'
      className='pointer-events-none absolute left-0 top-0'
      width={WIDTH}
      height={height}
      viewBox={`0 0 ${WIDTH} ${height}`}
      style={{ zIndex: 0 }}
    >
      <defs>
        <linearGradient id='rail-gradient' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='0' y2={height}>
          {RAIL_STOPS.map(([r, g, b], i) => (
            <stop key={i} offset={i / (RAIL_STOPS.length - 1)} stopColor={`rgb(${r}, ${g}, ${b})`} />
          ))}
        </linearGradient>
      </defs>
      <path ref={pathRef} fill='none' stroke='url(#rail-gradient)' strokeOpacity={0.55} strokeWidth={1.25} />
      <circle ref={headRef} r={3.5} />
    </svg>
  );
}
