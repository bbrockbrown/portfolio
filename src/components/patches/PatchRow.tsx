import { getTag } from '@/lib/patches/tags';
import type { Project } from '@/lib/patches/types';

import { WaveformSignature } from './WaveformSignature';

function Jack({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      className='font-mono text-xs tracking-wider text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
    >
      {label}↗
    </a>
  );
}

export function PatchRow({ project, index }: { project: Project; index: number }) {
  const { name, category, tech, year, links, sigSeed } = project;
  const num = String(index).padStart(2, '0');

  return (
    <li className='group border-b border-border'>
      <div className='flex items-start gap-4 px-3 py-4 transition-colors group-hover:bg-accent/30 sm:gap-5'>
        {/* number */}
        <span className='mt-1 w-6 shrink-0 font-mono text-xs tabular-nums tracking-wider text-muted-foreground group-hover:text-foreground'>
          {num}
        </span>

        {/* waveform signature */}
        <WaveformSignature
          seed={sigSeed ?? name}
          className='mt-0.5 h-6 w-16 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground'
        />

        {/* name + tech */}
        <div className='min-w-0 flex-1'>
          <div className='flex items-baseline gap-3'>
            <h3 className='truncate text-base font-semibold text-foreground sm:text-lg'>{name}</h3>
            <span className='shrink-0 font-mono text-[0.7rem] tracking-widest text-muted-foreground'>
              {category}
            </span>
          </div>
          <p className='mt-1.5 font-mono text-[0.7rem] leading-relaxed tracking-wider text-muted-foreground'>
            {tech.map((id, i) => (
              <span key={id}>
                {i > 0 && <span className='px-1.5 text-border'>·</span>}
                {getTag(id)?.label ?? id}
              </span>
            ))}
          </p>
        </div>

        {/* year + links */}
        <div className='flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-baseline sm:gap-4'>
          <span className='font-mono text-xs tabular-nums tracking-wider text-muted-foreground group-hover:text-foreground'>
            {year}
          </span>
          <span className='flex items-center gap-3'>
            {links.demo && <Jack href={links.demo} label='DEMO' />}
            {links.github && <Jack href={links.github} label='GH' />}
            {links.writeup && <Jack href={links.writeup} label='NOTES' />}
          </span>
        </div>
      </div>
    </li>
  );
}
