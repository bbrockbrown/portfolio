import { getTag } from '@/lib/patches/tags';
import type { Project } from '@/lib/patches/types';

import { WaveformSignature } from './WaveformSignature';

const pad = (n: number) => String(n).padStart(3, '0');

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

export function PatchRow({ project }: { project: Project }) {
  const { patch, name, category, tech, year, links, init, sigSeed } = project;
  const typeLabel = init ? 'INIT' : category;

  return (
    <li className='group border-b border-border'>
      <div className='patch-grid items-center gap-x-4 gap-y-1 px-2 py-3 text-muted-foreground transition-colors group-hover:bg-accent/30'>
        {/* patch number */}
        <span
          style={{ gridArea: 'num' }}
          className='font-mono text-xs tabular-nums tracking-wider group-hover:text-foreground'
        >
          {pad(patch)}
        </span>

        {/* waveform signature */}
        <span style={{ gridArea: 'sig' }} className='block'>
          <WaveformSignature
            seed={sigSeed ?? name}
            className='h-auto w-12 text-muted-foreground transition-colors group-hover:text-foreground md:w-[72px]'
          />
        </span>

        {/* name */}
        <span
          style={{ gridArea: 'name' }}
          className='truncate text-sm font-semibold text-foreground sm:text-base'
        >
          {name}
        </span>

        {/* metadata group: display:contents on desktop (joins the grid), flex row on mobile */}
        <div className='patch-meta items-center gap-x-4 gap-y-1'>
          <span
            style={{ gridArea: 'type' }}
            className='font-mono text-[0.7rem] tracking-wider group-hover:text-foreground'
          >
            {typeLabel}
          </span>

          <span
            style={{ gridArea: 'tech' }}
            className='flex min-w-0 flex-wrap items-center gap-x-2 font-mono text-[0.7rem] tracking-wider'
          >
            {tech.map((id, i) => {
              const t = getTag(id);
              return (
                <span key={id} className='whitespace-nowrap'>
                  {i > 0 && <span className='mr-2 text-border'>·</span>}
                  {t?.label ?? id}
                </span>
              );
            })}
          </span>

          <span
            style={{ gridArea: 'year' }}
            className='font-mono text-xs tabular-nums tracking-wider group-hover:text-foreground'
          >
            {year}
          </span>

          <span
            style={{ gridArea: 'links' }}
            className='flex items-center gap-3'
          >
            {links.demo && <Jack href={links.demo} label='DEMO' />}
            {links.github && <Jack href={links.github} label='GH' />}
            {links.writeup && <Jack href={links.writeup} label='NOTES' />}
          </span>
        </div>
      </div>
    </li>
  );
}
