import type { CategoryFilter } from '@/lib/patches/filter';

interface Props {
  categories: CategoryFilter[];
  active: CategoryFilter;
  onSelect: (c: CategoryFilter) => void;
  count: number;
  total: number;
}

export function CategoryTabs({ categories, active, onSelect, count, total }: Props) {
  return (
    <div className='mb-8 flex flex-wrap items-center gap-x-6 gap-y-3'>
      <div role='group' aria-label='Filter projects by category' className='flex flex-wrap gap-x-5 gap-y-2'>
        {categories.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              type='button'
              aria-pressed={on}
              onClick={() => onSelect(c)}
              className={`font-mono text-xs tracking-widest underline-offset-8 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                on
                  ? 'text-foreground underline decoration-2'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <span aria-live='polite' className='font-mono text-xs tracking-wider text-muted-foreground'>
        {count === total ? `${total} projects` : `${count} of ${total}`}
      </span>
    </div>
  );
}
