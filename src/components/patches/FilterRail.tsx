import type { FilterState } from '@/lib/patches/filter';
import type { Tag } from '@/lib/patches/types';

interface Props {
  tags: Tag[];
  filters: FilterState;
  toggleSolo: (id: string) => void;
  toggleMute: (id: string) => void;
  clear: () => void;
  visibleCount: number;
  totalCount: number;
}

// S / M micro-buttons. Active = inverted colors (one flat token step) — no glow.
function MicroButton({
  kind,
  active,
  label,
  onClick,
}: {
  kind: 'S' | 'M';
  active: boolean;
  label: string; // tag label, for the a11y name
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      aria-pressed={active}
      aria-label={`${kind === 'S' ? 'Solo' : 'Mute'} ${label}`}
      onClick={onClick}
      className={`inline-flex min-h-11 min-w-8 items-center justify-center px-1.5 font-mono text-xs tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {kind}
    </button>
  );
}

export function FilterRail({
  tags,
  filters,
  toggleSolo,
  toggleMute,
  clear,
  visibleCount,
  totalCount,
}: Props) {
  const active = filters.solo.size > 0 || filters.mute.size > 0;

  return (
    <div role='group' aria-label='Filter projects' className='mb-6 flex flex-col gap-3'>
      <div
        className='flex gap-4 overflow-x-auto pb-1 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%-1rem),transparent)]'
      >
        {tags.map((t) => {
          const soloed = filters.solo.has(t.id);
          const muted = filters.mute.has(t.id);
          const engaged = soloed || muted;
          return (
            <div key={t.id} className='flex shrink-0 items-center gap-1.5 whitespace-nowrap'>
              <span className='flex items-center'>
                <MicroButton kind='S' active={soloed} label={t.label} onClick={() => toggleSolo(t.id)} />
                <MicroButton kind='M' active={muted} label={t.label} onClick={() => toggleMute(t.id)} />
              </span>
              {/* flat 6px LED — the ceiling of skeuomorphism */}
              <span
                aria-hidden='true'
                className={`h-1.5 w-1.5 ${engaged ? 'bg-foreground' : 'bg-border'}`}
              />
              <span
                className={`font-mono text-xs tracking-wider ${
                  engaged ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {t.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className='flex items-center gap-4 font-mono text-xs tracking-wider text-muted-foreground'>
        <span aria-live='polite'>
          {visibleCount} of {totalCount} patches
        </span>
        {active && (
          <button
            type='button'
            onClick={clear}
            className='underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            CLEAR
          </button>
        )}
      </div>
    </div>
  );
}
