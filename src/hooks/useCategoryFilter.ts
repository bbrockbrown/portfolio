import { useEffect, useState } from 'react';

import type { CategoryFilter } from '@/lib/patches/filter';

const VALID: CategoryFilter[] = ['ALL', 'WEB', 'AUDIO', 'TOOL', 'SYSTEMS', 'EXPERIMENT'];

function readFromUrl(): CategoryFilter {
  if (typeof window === 'undefined') return 'ALL';
  const raw = new URLSearchParams(window.location.search).get('category');
  const upper = raw?.toUpperCase();
  return VALID.includes(upper as CategoryFilter) ? (upper as CategoryFilter) : 'ALL';
}

/** Single-select category filter, round-tripped through `?category=` in the URL. */
export function useCategoryFilter() {
  const [category, setCategory] = useState<CategoryFilter>(readFromUrl);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (category === 'ALL') params.delete('category');
    else params.set('category', category.toLowerCase());
    const qs = params.toString();
    window.history.replaceState(
      null,
      '',
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  }, [category]);

  return { category, setCategory };
}
