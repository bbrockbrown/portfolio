import { describe, expect, it } from 'vitest';

import { colFreq } from './patch';
import { simRow } from './spectrumModel';

const COLS = 160;
const flat = () => 0.5; // no crackle, constant floor

// Bar 0, step 0: the lead's C5 has just struck, so its harmonics are loudest.
const T = 0.001;

const energyAbove = (row: Float32Array, hz: number) => {
  let sum = 0;
  for (let c = 0; c < row.length; c++) if (colFreq(c, row.length) > hz) sum += row[c];
  return sum;
};

describe('simRow', () => {
  it('returns one value per column, within 0..1', () => {
    const row = simRow(T, COLS, 2500, flat);
    expect(row).toBeInstanceOf(Float32Array);
    expect(row).toHaveLength(COLS);
    for (const v of row) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('drops energy above the cutoff when the filter closes', () => {
    const open = simRow(T, COLS, 8000, flat);
    const closed = simRow(T, COLS, 600, flat);
    // Between the closed cutoff and the hats, only lead harmonics live.
    const band = (row: Float32Array) => energyAbove(row, 1200) - energyAbove(row, 5000);
    expect(band(closed)).toBeLessThan(band(open) * 0.8);
  });
});
