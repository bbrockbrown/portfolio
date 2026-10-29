import { useEffect, useRef, useState } from 'react';

// Horizontal cousin of the experience page's SignalRail: a faint sine trace that
// flows toward the links it flanks and swells into a wave packet next to them
// while one is hovered. Updated per frame through refs, so React never re-renders it.

const HEIGHT = 24;
const MID = HEIGHT / 2;
const STEP = 3; // px between path samples
const BASE_AMP = 1.2; // idle wobble
const SWELL_AMP = 6.5; // extra amplitude next to the links when active
const SPREAD = 54; // px, width of the wave packet
const K = 0.14; // rad per px, the trace's wavelength
const SPEED = 0.003; // rad per ms, phase drift
const EASE = 0.12; // per-frame approach for the swell

interface Props {
  /** Which side of the links this trace sits on; the packet hugs the inner end. */
  side: 'left' | 'right';
  active: boolean;
  className?: string;
}

export function ScopeTrace({ side, active, className }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const target = useRef(active);
  target.current = active;
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [gradId] = useState(() => `trace-${side}-${Math.random().toString(36).slice(2, 8)}`);
  // Animated mode reads `active` through `target`; reduced motion redraws per hover.
  const redrawKey = reduced ? active : null;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let width = svg.clientWidth;
    let phase = 0;
    let swell = target.current ? 1 : 0;
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      let d = '';
      for (let x = 0; x <= width; x += STEP) {
        // u = distance from the links, so both traces flow inward.
        const u = side === 'left' ? width - x : x;
        const a = BASE_AMP + SWELL_AMP * swell * Math.exp(-(((u - 20) / SPREAD) ** 2));
        const y = MID + a * Math.sin(u * K + phase);
        d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`;
      }
      pathRef.current?.setAttribute('d', d);
    };

    const ro = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      svg.setAttribute('viewBox', `0 0 ${width} ${HEIGHT}`);
      draw();
    });
    ro.observe(svg);

    if (reduced) {
      // Still frame, redrawn whenever the hover state changes.
      draw();
      return () => ro.disconnect();
    }

    const frame = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      const k = 1 - (1 - EASE) ** (dt / 16.7); // frame-rate independent easing
      swell += ((target.current ? 1 : 0) - swell) * k;
      phase += SPEED * dt;
      draw();
      raf = requestAnimationFrame(frame);
    };
    draw();
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
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [side, reduced, redrawKey]);

  // Fade out toward the outer end so the trace emerges from nothing.
  const [x1, x2] = side === 'left' ? ['0%', '100%'] : ['100%', '0%'];

  return (
    <svg
      ref={svgRef}
      aria-hidden='true'
      focusable='false'
      height={HEIGHT}
      preserveAspectRatio='none'
      className={`transition-colors duration-500 ${active ? 'text-hot' : 'text-muted-foreground'} ${className ?? ''}`}
    >
      <defs>
        <linearGradient id={gradId} x1={x1} x2={x2} y1='0' y2='0'>
          <stop offset='0%' stopColor='currentColor' stopOpacity={0} />
          <stop offset='70%' stopColor='currentColor' stopOpacity={0.7} />
          <stop offset='100%' stopColor='currentColor' stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        fill='none'
        stroke={`url(#${gradId})`}
        strokeWidth={1.25}
        strokeLinejoin='round'
        strokeLinecap='round'
      />
    </svg>
  );
}
