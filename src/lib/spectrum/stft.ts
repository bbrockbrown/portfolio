// Short-time Fourier transform of a decoded clip into a compact spectrogram:
// `frames` rows of `bands` log-spaced magnitudes, normalised to 0..1 per song.

export interface Spectrogram {
  fps: number; // frames per second of audio
  frames: number;
  bands: number;
  data: Float32Array; // frames * bands, row-major (frame, band), 0..1
}

export const FFT_SIZE = 2048;
export const BANDS = 64;
const FPS = 30;
const MIN_HZ = 40;
const MAX_HZ = 16_000;
// Per-song level mapping: dB at these percentiles of the whole clip map to 0
// and 1. Modern masters are dense, so the floor sits well up the distribution
// or every bin lights up; GAMMA then pushes mid values down for contrast.
const LOW_PCT = 0.45;
const HIGH_PCT = 0.99;
const GAMMA = 1.6;
const TILT_DB_PER_OCT = 3; // pink-noise tilt, so highs aren't buried under bass
const RELEASE = 0.55; // per-frame decay toward quieter values (attack is instant)

/** In-place iterative radix-2 FFT. `re`/`im` length must be a power of two. */
export function fft(re: Float32Array, im: Float32Array) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cRe = 1,
        cIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const aRe = re[i + k + len / 2] * cRe - im[i + k + len / 2] * cIm;
        const aIm = re[i + k + len / 2] * cIm + im[i + k + len / 2] * cRe;
        re[i + k + len / 2] = re[i + k] - aRe;
        im[i + k + len / 2] = im[i + k] - aIm;
        re[i + k] += aRe;
        im[i + k] += aIm;
        const nRe = cRe * wRe - cIm * wIm;
        cIm = cRe * wIm + cIm * wRe;
        cRe = nRe;
      }
    }
  }
}

/** FFT bin range [lo, hi) for each log-spaced band. */
export function bandEdges(sampleRate: number, bands = BANDS): [number, number][] {
  const binHz = sampleRate / FFT_SIZE;
  const nyquistBin = FFT_SIZE / 2;
  return Array.from({ length: bands }, (_, b) => {
    const f0 = MIN_HZ * (MAX_HZ / MIN_HZ) ** (b / bands);
    const f1 = MIN_HZ * (MAX_HZ / MIN_HZ) ** ((b + 1) / bands);
    const lo = Math.min(nyquistBin - 1, Math.floor(f0 / binHz));
    const hi = Math.min(nyquistBin, Math.max(lo + 1, Math.ceil(f1 / binHz)));
    return [lo, hi];
  });
}

/**
 * Spectrogram of a mono signal. Yields to the event loop every few hundred
 * frames so a 30 s clip doesn't block the main thread in one go.
 */
export async function spectrogram(samples: Float32Array, sampleRate: number): Promise<Spectrogram> {
  const hop = Math.round(sampleRate / FPS);
  const frames = Math.max(0, Math.floor((samples.length - FFT_SIZE) / hop) + 1);
  const edges = bandEdges(sampleRate);
  const window = Float32Array.from(
    { length: FFT_SIZE },
    (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1)),
  );
  const re = new Float32Array(FFT_SIZE);
  const im = new Float32Array(FFT_SIZE);
  const db = new Float32Array(frames * BANDS);

  for (let f = 0; f < frames; f++) {
    const start = f * hop;
    for (let i = 0; i < FFT_SIZE; i++) re[i] = samples[start + i] * window[i];
    im.fill(0);
    fft(re, im);
    for (let b = 0; b < BANDS; b++) {
      const [lo, hi] = edges[b];
      let power = 0;
      for (let k = lo; k < hi; k++) power += re[k] * re[k] + im[k] * im[k];
      const octaves = (b / BANDS) * Math.log2(MAX_HZ / MIN_HZ);
      db[f * BANDS + b] = 10 * Math.log10(power / (hi - lo) + 1e-12) + TILT_DB_PER_OCT * octaves;
    }
    if (f % 300 === 299) await new Promise((r) => setTimeout(r, 0));
  }

  // Per-song normalisation between percentiles, so a quiet master and a
  // brickwalled one both use the whole glyph ramp.
  const sorted = Float32Array.from(db).sort();
  const lo = sorted[Math.floor((sorted.length - 1) * LOW_PCT)] ?? 0;
  const hi = sorted[Math.floor((sorted.length - 1) * HIGH_PCT)] ?? 1;
  const span = Math.max(1e-6, hi - lo);
  const data = new Float32Array(frames * BANDS);
  for (let b = 0; b < BANDS; b++) {
    let prev = 0;
    for (let f = 0; f < frames; f++) {
      const v = Math.min(1, Math.max(0, (db[f * BANDS + b] - lo) / span)) ** GAMMA;
      prev = v > prev ? v : prev * RELEASE + v * (1 - RELEASE);
      data[f * BANDS + b] = prev;
    }
  }
  return { fps: FPS, frames, bands: BANDS, data };
}
