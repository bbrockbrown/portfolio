import { describe, expect, it } from 'vitest';

import { bandEdges, BANDS, fft, FFT_SIZE, spectrogram } from './stft';

const SR = 44_100;

function tone(hz: number, seconds: number, amp = 0.5) {
  return Float32Array.from({ length: Math.round(SR * seconds) }, (_, i) =>
    amp * Math.sin((2 * Math.PI * hz * i) / SR),
  );
}

describe('fft', () => {
  it('puts a pure bin-centred sine in its bin', () => {
    const n = 64;
    const re = Float32Array.from({ length: n }, (_, i) => Math.sin((2 * Math.PI * 5 * i) / n));
    const im = new Float32Array(n);
    fft(re, im);
    const mags = Array.from(re, (r, i) => Math.hypot(r, im[i]));
    const peak = mags.slice(0, n / 2).indexOf(Math.max(...mags.slice(0, n / 2)));
    expect(peak).toBe(5);
    expect(mags[5]).toBeCloseTo(n / 2, 3);
  });
});

describe('bandEdges', () => {
  it('covers increasing, non-empty bin ranges within Nyquist', () => {
    const edges = bandEdges(SR);
    expect(edges).toHaveLength(BANDS);
    for (const [lo, hi] of edges) {
      expect(hi).toBeGreaterThan(lo);
      expect(hi).toBeLessThanOrEqual(FFT_SIZE / 2);
    }
    for (let b = 1; b < edges.length; b++) expect(edges[b][0]).toBeGreaterThanOrEqual(edges[b - 1][0]);
  });
});

describe('spectrogram', () => {
  it('lights up the band containing a tone and stays in 0..1', async () => {
    const s = await spectrogram(tone(1000, 1), SR);
    expect(s.frames).toBeGreaterThan(25);
    for (const v of s.data) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    const binHz = SR / FFT_SIZE;
    const toneBand = bandEdges(SR).findIndex(([lo, hi]) => 1000 >= lo * binHz && 1000 < hi * binHz);
    const mid = Math.floor(s.frames / 2) * BANDS;
    const row = Array.from(s.data.slice(mid, mid + BANDS));
    expect(Math.abs(row.indexOf(Math.max(...row)) - toneBand)).toBeLessThanOrEqual(1);
  });

  it('returns no frames for a clip shorter than one window', async () => {
    const s = await spectrogram(new Float32Array(FFT_SIZE - 1), SR);
    expect(s.frames).toBe(0);
  });
});
