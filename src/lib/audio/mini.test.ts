import { describe, expect, it } from 'vitest';

import { noteName,parseMini } from './mini';
import { ACID, CLAP, DRUM_PATTERN, HAT, KICK, OPEN_HAT, STEPS } from './patch';

/** 16-step 0/1 grid of where every token named `sound` fires. */
const grid = (src: string, sound: string) => {
  const g = new Array(STEPS).fill(0);
  for (const t of parseMini(src)) if (t.text === sound) for (const s of t.steps) g[s] = 1;
  return g;
};

describe('parseMini', () => {
  it('handles repeats, groups, rests and stacks', () => {
    expect(grid('bd*4', 'bd')).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
    expect(grid('[~ oh]*4', 'oh')).toEqual([0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]);
    expect(grid('a, ~ b', 'b')).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('keeps source offsets so the string can be re-rendered', () => {
    const src = '[hh hh ~ hh]*4';
    for (const t of parseMini(src)) expect(src.slice(t.start, t.end)).toBe(t.text);
  });

  it('rejects syntax it does not support', () => {
    expect(() => parseMini('bd <sd hh>')).toThrow();
    expect(() => parseMini('[bd sd')).toThrow();
  });
});

describe('DRUM_PATTERN', () => {
  it('is exactly the drums the synth plays', () => {
    expect(grid(DRUM_PATTERN, 'bd')).toEqual(KICK);
    expect(grid(DRUM_PATTERN, 'cp')).toEqual(CLAP);
    expect(grid(DRUM_PATTERN, 'hh')).toEqual(HAT);
    expect(grid(DRUM_PATTERN, 'oh')).toEqual(OPEN_HAT);
  });
});

describe('noteName', () => {
  it('names every acid note the Strudel way', () => {
    expect(noteName(36)).toBe('c2');
    expect(noteName(39)).toBe('eb2');
    expect(noteName(48)).toBe('c3');
    for (const n of ACID.flat()) if (n != null) expect(noteName(n)).toMatch(/^[a-g]b?\d$/);
  });
});
