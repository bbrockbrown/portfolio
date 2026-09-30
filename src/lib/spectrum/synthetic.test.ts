import { describe, expect, it } from 'vitest';

import { BANDS } from './stft';
import { syntheticSpectrogram } from './synthetic';

describe('syntheticSpectrogram', () => {
  const s = syntheticSpectrogram('spotify:track:abc');

  it('has the same shape as a real 30 s analysis', () => {
    expect(s.fps).toBe(30);
    expect(s.frames).toBe(900);
    expect(s.bands).toBe(BANDS);
    expect(s.data).toHaveLength(900 * BANDS);
  });

  it('stays within 0..1', () => {
    for (const v of s.data) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('is deterministic per seed and differs between seeds', () => {
    expect(syntheticSpectrogram('spotify:track:abc').data).toEqual(s.data);
    expect(syntheticSpectrogram('spotify:track:xyz').data).not.toEqual(s.data);
  });

  it('pulses in the bass rather than sitting flat', () => {
    const bass = Array.from({ length: s.frames }, (_, f) => s.data[f * BANDS + 2]);
    const min = Math.min(...bass);
    const max = Math.max(...bass);
    expect(max - min).toBeGreaterThan(0.3);
  });
});
