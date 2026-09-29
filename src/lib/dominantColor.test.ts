import { describe, expect, it } from 'vitest';

import { dominantColorFromPixels } from './dominantColor';

function pixels(...runs: [count: number, rgba: [number, number, number, number]][]) {
  const out: number[] = [];
  for (const [n, rgba] of runs) for (let i = 0; i < n; i++) out.push(...rgba);
  return new Uint8ClampedArray(out);
}

describe('dominantColorFromPixels', () => {
  it('picks the most common colour', () => {
    const data = pixels([10, [200, 30, 40, 255]], [3, [10, 10, 200, 255]]);
    expect(dominantColorFromPixels(data)).toBe('rgb(200, 30, 40)');
  });

  it('averages the real colours in the winning bucket', () => {
    // 100 and 110 share a 4-bit bucket (6); the average is returned, not the bucket edge.
    const data = pixels([2, [100, 100, 100, 255]], [2, [110, 110, 110, 255]], [3, [0, 0, 0, 255]]);
    expect(dominantColorFromPixels(data)).toBe('rgb(105, 105, 105)');
  });

  it('ignores transparent pixels, and returns null when nothing is opaque', () => {
    expect(dominantColorFromPixels(pixels([50, [255, 255, 255, 0]], [1, [5, 200, 5, 255]]))).toBe(
      'rgb(5, 200, 5)',
    );
    expect(dominantColorFromPixels(pixels([4, [1, 2, 3, 0]]))).toBeNull();
  });
});
