import { describe, expect, it } from 'vitest';

import { projects } from './data';
import { canonicalizeTag, TAG_LABELS } from './tags';

describe('project data invariants', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is ordered newest-first by year', () => {
    const years = projects.map((p) => p.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('resolves every tech entry to a canonical registry id', () => {
    for (const p of projects) {
      for (const t of p.tech) {
        expect(canonicalizeTag(t), `${p.id} tech "${t}"`).not.toBeNull();
        expect(TAG_LABELS[t], `${p.id} tech "${t}" not canonical`).toBeDefined();
      }
    }
  });

  it('gives every project at least one tech tag', () => {
    for (const p of projects) expect(p.tech.length).toBeGreaterThan(0);
  });
});

describe('tag canonicalization', () => {
  it('maps known variant spellings to canonical ids', () => {
    expect(canonicalizeTag('React.js')).toBe('react');
    expect(canonicalizeTag('ReactJS')).toBe('react');
    expect(canonicalizeTag('styled components')).toBe('styled-components');
    expect(canonicalizeTag('AG Grid')).toBe('ag-grid');
    expect(canonicalizeTag('Spotify Web API')).toBe('spotify-api');
    expect(canonicalizeTag('Postgres')).toBe('postgresql');
  });

  it('returns null for unknown tags', () => {
    expect(canonicalizeTag('cobol')).toBeNull();
    expect(canonicalizeTag('')).toBeNull();
  });
});
