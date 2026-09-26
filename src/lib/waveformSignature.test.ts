import { describe, expect, it } from 'vitest';

import { projects } from './patches/data';
import { SIG_VIEWBOX, waveformPath } from './waveformSignature';

const seeds = projects.map((p) => p.sigSeed ?? p.name);

function points(d: string): { x: number; y: number }[] {
  return d
    .split(/(?=[ML])/)
    .filter(Boolean)
    .map((seg) => {
      const [x, y] = seg.slice(1).trim().split(/\s+/).map(Number);
      return { x, y };
    });
}

describe('waveformPath', () => {
  it('is deterministic for a given seed', () => {
    for (const s of seeds) expect(waveformPath(s)).toBe(waveformPath(s));
  });

  it('keeps every sampled point inside the viewBox', () => {
    for (const s of [...seeds, 'Portfolio v2', 'Portfolio v3', 'x', '']) {
      for (const { x, y } of points(waveformPath(s))) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(SIG_VIEWBOX.w);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(SIG_VIEWBOX.h);
      }
    }
  });

  it('produces a distinct mark for every current project', () => {
    const paths = seeds.map((s) => waveformPath(s));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('diverges for sibling seeds', () => {
    expect(waveformPath('Portfolio v2')).not.toBe(waveformPath('Portfolio v3'));
  });

  // Guards the tuned constants: an accidental change would alter every mark on
  // the site, and these snapshots would fail loudly. Regenerate deliberately.
  it('matches snapshots for fixed seeds', () => {
    expect(waveformPath('The Money Personality')).toMatchSnapshot();
    expect(waveformPath('CloudStem')).toMatchSnapshot();
    expect(waveformPath('!stats.fm')).toMatchSnapshot();
  });
});
