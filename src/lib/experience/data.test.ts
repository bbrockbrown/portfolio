import { describe, expect, it } from 'vitest';

import { type Entry, formatRange, sides, tenureMonths } from './data';

const entry = (over: Partial<Entry>): Entry => ({
  id: 'x',
  org: 'X',
  role: 'R',
  start: '2025-06',
  end: '2025-09',
  description: '',
  ...over,
});

describe('formatRange', () => {
  it('collapses the year within one year', () => {
    expect(formatRange(entry({}))).toBe('June – Sept 2025');
  });
  it('spans years and open ranges', () => {
    expect(formatRange(entry({ start: '2024-11', end: '2025-02' }))).toBe('Nov 2024 – Feb 2025');
    expect(formatRange(entry({ start: '2026-06', end: 'present' }))).toBe('June 2026 – Present');
  });
  it('prefers an explicit label', () => {
    expect(formatRange(entry({ end: null, dateLabel: 'Exp: Dec 2026' }))).toBe('Exp: Dec 2026');
  });
});

describe('tenureMonths', () => {
  it('counts both end months', () => {
    expect(tenureMonths(entry({}))).toBe(4);
  });
  it('runs open ranges to now, and skips open-ended entries', () => {
    expect(tenureMonths(entry({ start: '2026-06', end: 'present' }), new Date(2026, 8, 28))).toBe(4);
    expect(tenureMonths(entry({ end: null }))).toBeNull();
  });
});

describe('sides', () => {
  it('has unique entry ids', () => {
    const ids = sides.flatMap((s) => s.entries.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
