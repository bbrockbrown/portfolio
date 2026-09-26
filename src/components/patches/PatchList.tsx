import { useMemo } from 'react';

import { useCategoryFilter } from '@/hooks/useCategoryFilter';
import { projects } from '@/lib/patches/data';
import { availableCategories, filterByCategory } from '@/lib/patches/filter';

import { CategoryTabs } from './CategoryTabs';
import { PatchRow } from './PatchRow';

// Newest-first display order (data is authored that way; sort defensively by year).
const ordered = [...projects].sort((a, b) => b.year - a.year);
const categories = availableCategories(ordered);

export function PatchList() {
  const { category, setCategory } = useCategoryFilter();
  const visible = useMemo(() => filterByCategory(ordered, category), [category]);

  return (
    <div>
      <CategoryTabs
        categories={categories}
        active={category}
        onSelect={setCategory}
        count={visible.length}
        total={ordered.length}
      />

      {visible.length > 0 ? (
        <ol className='border-t border-border'>
          {visible.map((p, i) => (
            <PatchRow key={p.id} project={p} index={i + 1} />
          ))}
        </ol>
      ) : (
        <div className='flex flex-col items-center gap-4 border-t border-border py-20 text-center font-mono text-sm tracking-wider text-muted-foreground'>
          <span>NO PROJECTS IN THIS CATEGORY</span>
          <button
            type='button'
            onClick={() => setCategory('ALL')}
            className='underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
          >
            SHOW ALL
          </button>
        </div>
      )}
    </div>
  );
}
