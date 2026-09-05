import type { Project } from './types';

export interface FilterState {
  solo: Set<string>;
  mute: Set<string>;
}

export const emptyFilters = (): FilterState => ({ solo: new Set(), mute: new Set() });

/**
 * Visibility predicate for the patch browser.
 *
 * 1. If the project has any muted tag        -> hidden   (mute always wins)
 * 2. Else if solo is empty                    -> visible
 * 3. Else visible iff it has any soloed tag   (solo is a union, like a mixer)
 *
 * Deliberate divergence from DAW convention (where solo overrides mute): for
 * *filtering*, exclude-beats-include is the predictable rule — muting `legacy`
 * while soloing `react` must still hide a react+legacy project.
 */
export function isVisible(project: Project, { solo, mute }: FilterState): boolean {
  for (const t of project.tech) if (mute.has(t)) return false;
  if (solo.size === 0) return true;
  for (const t of project.tech) if (solo.has(t)) return true;
  return false;
}

export function visibleProjects(projects: Project[], filters: FilterState): Project[] {
  return projects.filter((p) => isVisible(p, filters));
}

// Immutable toggles enforcing per-tag mutual exclusivity between solo and mute.
function toggle(set: Set<string>, tag: string): Set<string> {
  const next = new Set(set);
  if (next.has(tag)) next.delete(tag);
  else next.add(tag);
  return next;
}

export function toggleSolo(state: FilterState, tag: string): FilterState {
  const solo = toggle(state.solo, tag);
  const mute = new Set(state.mute);
  if (solo.has(tag)) mute.delete(tag); // soloing clears a mute on the same tag
  return { solo, mute };
}

export function toggleMute(state: FilterState, tag: string): FilterState {
  const mute = toggle(state.mute, tag);
  const solo = new Set(state.solo);
  if (mute.has(tag)) solo.delete(tag); // muting clears a solo on the same tag
  return { solo, mute };
}

export const hasActiveFilters = (s: FilterState): boolean => s.solo.size > 0 || s.mute.size > 0;
