import { useMemo } from 'react';

import { usePatchFilters } from '@/hooks/usePatchFilters';
import { projects } from '@/lib/patches/data';
import { visibleProjects } from '@/lib/patches/filter';
import { allTags } from '@/lib/patches/tags';

import { FilterRail } from './FilterRail';
import { PatchRow } from './PatchRow';

// Tags shown in the rail: only those that appear on ≥1 project, alphabetized.
const usedTagIds = new Set(projects.flatMap((p) => p.tech));
const railTags = allTags().filter((t) => usedTagIds.has(t.id));

// Stable display order: by patch number (INIT = 000 sorts first). Never index.
const ordered = [...projects].sort((a, b) => a.patch - b.patch);

export function PatchList() {
  const { filters, toggleSolo, toggleMute, clear } = usePatchFilters();
  const visible = useMemo(() => visibleProjects(ordered, filters), [filters]);

  return (
    <div>
      <FilterRail
        tags={railTags}
        filters={filters}
        toggleSolo={toggleSolo}
        toggleMute={toggleMute}
        clear={clear}
        visibleCount={visible.length}
        totalCount={ordered.length}
      />

      {visible.length > 0 ? (
        <ol className='border-t border-border'>
          {visible.map((p) => (
            <PatchRow key={p.id} project={p} />
          ))}
        </ol>
      ) : (
        <div className='flex flex-col items-center gap-4 border-t border-border py-20 text-center font-mono text-sm tracking-wider text-muted-foreground'>
          <span>NO PATCHES MATCH</span>
          <button
            type='button'
            onClick={clear}
            className='underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            CLEAR FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
