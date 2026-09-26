import { describe, expect, it } from 'vitest';

import { availableCategories, filterByCategory } from './filter';
import type { Project } from './types';

const proj = (id: string, category: Project['category']): Project => ({
  id,
  name: id,
  category,
  tech: [],
  year: 2024,
  links: {},
  description: '',
});

const sample: Project[] = [
  proj('a', 'AUDIO'),
  proj('b', 'WEB'),
  proj('c', 'AUDIO'),
  proj('d', 'SYSTEMS'),
];

describe('filterByCategory', () => {
  it('ALL returns everything', () => {
    expect(filterByCategory(sample, 'ALL')).toHaveLength(4);
  });

  it('filters to a single category', () => {
    expect(filterByCategory(sample, 'AUDIO').map((p) => p.id)).toEqual(['a', 'c']);
    expect(filterByCategory(sample, 'WEB').map((p) => p.id)).toEqual(['b']);
  });

  it('returns empty when no project matches', () => {
    expect(filterByCategory(sample, 'TOOL')).toHaveLength(0);
  });
});

describe('availableCategories', () => {
  it('lists ALL plus present categories in fixed order', () => {
    expect(availableCategories(sample)).toEqual(['ALL', 'WEB', 'AUDIO', 'SYSTEMS']);
  });
});
