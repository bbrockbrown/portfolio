import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { WaveformSignature } from '@/components/patches/WaveformSignature';
import { type Entry, formatRange, sides, tenureMonths } from '@/lib/experience/data';
import { RAIL_X, railColor } from '@/lib/experience/rail';

import { SignalRail } from './SignalRail';

// Record-style timeline: sides (filled dots) hold tracks (hollow dots) along a
// live signal rail. Hovering or focusing a track swells the rail around it and
// lights its dot + waveform in the rail's colour at that point.

const DOT = 10; // entry dot diameter, px
const GUTTER = 'pl-9 sm:pl-10'; // content inset from the rail

function Track({
  entry,
  label,
  accent,
  active,
  dotRef,
  onActivate,
  onDeactivate,
}: {
  entry: Entry;
  label: string;
  accent: string;
  active: boolean;
  dotRef: (el: HTMLSpanElement | null) => void;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const months = tenureMonths(entry);
  const sub = [entry.role, entry.location].filter(Boolean).join(' · ');

  return (
    <li
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={`relative ${GUTTER} py-5 outline-none focus-visible:bg-accent/20`}
    >
      <span
        ref={dotRef}
        aria-hidden='true'
        className='absolute top-[1.72rem] rounded-full border-2 bg-background transition-colors duration-300'
        style={{
          left: RAIL_X - DOT / 2,
          width: DOT,
          height: DOT,
          borderColor: active ? accent : 'var(--color-muted-foreground)',
          backgroundColor: active ? accent : undefined,
        }}
      />
      <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
        <div className='flex min-w-0 items-baseline gap-3'>
          <span className='font-mono text-xs tabular-nums tracking-wider text-muted-foreground'>
            {label}
          </span>
          <h3 className='text-base font-semibold text-foreground sm:text-lg'>{entry.org}</h3>
          {/* Colour via currentColor: rail accent when playing, muted otherwise. */}
          <span
            className='hidden shrink-0 self-center transition-colors duration-300 sm:block'
            style={{ color: active ? accent : 'var(--color-muted-foreground)' }}
          >
            <WaveformSignature seed={entry.org} className='block h-4 w-12' />
          </span>
        </div>
        <span className='font-mono text-xs tabular-nums tracking-wider text-muted-foreground'>
          {formatRange(entry)}
          {months !== null && <span className='text-muted-foreground/60'> · {months} mo</span>}
        </span>
      </div>
      <p className='mt-1 text-sm italic text-muted-foreground'>{sub}</p>
      <p className='mt-2 text-sm leading-relaxed text-gray-300'>{entry.description}</p>
      {entry.details?.map((d) => (
        <p key={d} className='mt-1.5 text-xs leading-relaxed text-muted-foreground'>
          {d}
        </p>
      ))}
    </li>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dots = useRef(new Map<string, HTMLSpanElement>());
  const [height, setHeight] = useState(0);
  const [dotY, setDotY] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(null);

  const measure = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setHeight(box.height);
    const ys: Record<string, number> = {};
    dots.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      ys[id] = r.top + r.height / 2 - box.top;
    });
    setDotY(ys);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const accentAt = (id: string) => (height > 0 ? railColor((dotY[id] ?? 0) / height) : undefined);
  const firstId = sides[0]?.entries[0]?.id;

  return (
    <div ref={containerRef} className='relative'>
      <SignalRail
        height={height}
        activeY={active ? (dotY[active] ?? null) : null}
        restY={firstId ? (dotY[firstId] ?? 0) : 0}
      />
      {sides.map((side, s) => (
        <section key={side.side} className={s > 0 ? 'mt-4' : undefined}>
          <header className={`relative ${GUTTER} pb-1 pt-4`}>
            <span
              aria-hidden='true'
              className='absolute top-[1.55rem] h-3 w-3 rounded-full bg-foreground/80'
              style={{ left: RAIL_X - 6 }}
            />
            <p className='font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground'>
              Side {side.side}
            </p>
            <h2 className='text-xl font-semibold text-foreground'>{side.title}</h2>
          </header>
          <ol>
            {side.entries.map((entry, i) => (
              <Track
                key={entry.id}
                entry={entry}
                label={`${side.side}${i + 1}`}
                accent={accentAt(entry.id) ?? 'currentColor'}
                active={active === entry.id}
                dotRef={(el) => {
                  if (el) dots.current.set(entry.id, el);
                  else dots.current.delete(entry.id);
                }}
                onActivate={() => setActive(entry.id)}
                onDeactivate={() => setActive((a) => (a === entry.id ? null : a))}
              />
            ))}
          </ol>
          {/* Rule between sides starts at the text, not under the rail. */}
          {s < sides.length - 1 && <div className='ml-9 border-b border-border sm:ml-10' />}
        </section>
      ))}
    </div>
  );
}
