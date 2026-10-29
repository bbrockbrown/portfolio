import { describe, expect, it } from 'vitest';

import { colFreq } from './patch';
import { simRow } from './spectrumModel';

const COLS = 160;
const flat = () => 0.5; // no crackle, constant floor
const FLOOR = 0.04 + 0.5 * 0.05; // simRow's noise floor under `flat`

// Bar 0, step 0, 80 ms in: the acid line's C2 is still ringing, and its filter
// envelope has mostly settled onto the cutoff.
const T = 0.08;

/** Energy above the noise floor between `lo` and `hi` Hz. */
const bandEnergy = (row: Float32Array, lo: number, hi: number) => {
  let sum = 0;
  for (let c = 0; c < row.length; c++) {
    const f = colFreq(c, row.length);
    if (f > lo && f < hi) sum += Math.max(0, row[c] - FLOOR);
  }
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
    // Between the closed cutoff and the hats, only acid harmonics live.
    const band = (row: Float32Array) => bandEnergy(row, 1200, 5000);
    expect(band(open)).toBeGreaterThan(0.5);
    expect(band(closed)).toBeLessThan(band(open) * 0.5);
  });
});
