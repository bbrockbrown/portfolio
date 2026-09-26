import type { PatchType, Project } from './types';

// Single-select category filter. 'ALL' shows everything.
export type CategoryFilter = PatchType | 'ALL';

export function filterByCategory(projects: Project[], category: CategoryFilter): Project[] {
  return category === 'ALL' ? projects : projects.filter((p) => p.category === category);
}

// Categories actually present in the data, in a fixed display order, prefixed
// with ALL — used to build the filter tabs.
const ORDER: PatchType[] = ['WEB', 'AUDIO', 'SYSTEMS', 'TOOL', 'EXPERIMENT'];

export function availableCategories(projects: Project[]): CategoryFilter[] {
  const present = new Set(projects.map((p) => p.category));
  return ['ALL', ...ORDER.filter((c) => present.has(c))];
}
