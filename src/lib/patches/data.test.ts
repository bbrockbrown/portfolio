import { describe, expect, it } from 'vitest';

import { projects } from './data';
import { canonicalizeTag, TAG_LABELS } from './tags';

describe('project data invariants', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique patch numbers', () => {
    const patches = projects.map((p) => p.patch);
    expect(new Set(patches).size).toBe(patches.length);
  });

  it('has exactly one INIT project', () => {
    expect(projects.filter((p) => p.init).length).toBe(1);
  });

  it('pins patch 0 to the INIT project', () => {
    const init = projects.find((p) => p.init);
    expect(init?.patch).toBe(0);
  });

  it('resolves every tech entry to a canonical registry id', () => {
    for (const p of projects) {
      for (const t of p.tech) {
        expect(canonicalizeTag(t), `${p.id} tech "${t}"`).not.toBeNull();
        // data is authored in canonical form, so the id must be in the registry directly
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
