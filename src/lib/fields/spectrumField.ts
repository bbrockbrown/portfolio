import type { Spectrogram } from '@/lib/spectrum/stft';

import { plasmaField } from './plasmaField';
import type { Field } from './types';

// A spectrum analyser of the song I last played, drawn by the ASCII engine:
// bars rise from the bottom of the screen, bass on the left to treble on the
// right, each with a peak cap that falls back slowly. The clock runs through
// the (silently looping) 30 s preview.
//
// Plasma stands in until the spectrogram is ready, then crossfades into it over
// FADE_MS, so the Spotify/Deezer round trip never lands as a snap.

export type SpectrumField = Field & { setSpectrogram: (s: Spectrogram) => void };

const FADE_MS = 2000;
const BAR_COLS = 4; // glyph columns per bar
const GAP_COLS = 2; // empty columns between bars
const MAX_HEIGHT = 0.85; // tallest bar, as a fraction of the screen
const HEIGHT_CURVE = 1.2; // > 1: sustained mid-level energy stays low, hits reach up
const HEADROOM_PCT = 0.98; // this percentile of the song's levels reaches full height
const PEAK_FALL = 0.35; // peak caps fall this fraction of max height per second
const BODY = 0.8; // glyph density inside a bar
const CAP = 0.95; // glyph density of the peak cap

// Dark gradient, right → left: deep blue, indigo, purple, plum, deep pink.
// Pair with a higher alpha range (see AsciiFieldBackground) — the colours are
// dark enough to stay moody at near-full opacity.
const PALETTE: [number, number, number][] = [
  [28, 42, 110],
  [45, 31, 112],
  [76, 29, 110],
  [112, 31, 98],
  [140, 35, 92],
];
const HEIGHT_TINT = 0.25; // bars also warm toward pink as they rise
// Plasma (loading / no-preview fallback) runs under the same high alpha range,
// so it's turned down to stay an ambient backdrop rather than a flash.
const PLASMA_LEVEL = 0.35;
const idle = (col: number, row: number, t: number) => plasmaField(col, row, t) * PLASMA_LEVEL;

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export function createSpectrumField(): SpectrumField {
  let spec: Spectrogram | null = null;
  let pending: Spectrogram | null = null;
  let fadeStart = 0;
  let cols = 1,
    rows = 1;
  let bars = 1;
  let heights = new Float32Array(1); // per bar, 0..1 of MAX_HEIGHT
  let peaks = new Float32Array(1);
  let lastT = -1;
  let gain = 1; // per song, so its loud moments reach the top

  // Linear sample of one band at a fractional frame (time), looping the clip.
  const sample = (s: Spectrogram, frame: number, band: number) => {
    const f0 = Math.floor(frame);
    const ft = frame - f0;
    const r0 = (((f0 % s.frames) + s.frames) % s.frames) * s.bands;
    const r1 = ((((f0 + 1) % s.frames) + s.frames) % s.frames) * s.bands;
    return s.data[r0 + band] * (1 - ft) + s.data[r1 + band] * ft;
  };

  // Once per frame: bar heights for "now" in the song, and falling peak caps.
  const update = (s: Spectrogram, t: number) => {
    const dt = lastT < 0 ? 0 : Math.min(t - lastT, 100) / 1000;
    lastT = t;
    const frame = ((t - fadeStart) / 1000) * s.fps;
    for (let i = 0; i < bars; i++) {
      // Bars spread over the bands; average the bands each bar covers.
      const b0 = Math.floor((i / bars) * s.bands);
      const b1 = Math.max(b0 + 1, Math.floor(((i + 1) / bars) * s.bands));
      let v = 0;
      for (let b = b0; b < b1; b++) v += sample(s, frame, b);
      heights[i] = Math.min(1, (v / (b1 - b0)) * gain) ** HEIGHT_CURVE;
      peaks[i] = Math.max(heights[i], peaks[i] - PEAK_FALL * dt);
    }
  };

  const field = ((col: number, row: number, t: number) => {
    if (pending) {
      // Start the song clock and the crossfade on the first frame that sees it.
      spec = pending;
      pending = null;
      const sorted = Float32Array.from(spec.data).sort();
      gain = 1 / Math.max(0.05, sorted[Math.floor((sorted.length - 1) * HEADROOM_PCT)] ?? 1);
      fadeStart = t;
      peaks.fill(0);
      lastT = -1;
    }
    if (!spec || spec.frames === 0) return idle(col, row, t);
    if (t !== lastT) update(spec, t);

    let v = 0;
    const slot = BAR_COLS + GAP_COLS;
    const bar = Math.floor(col / slot);
    if (col % slot < BAR_COLS && bar < bars) {
      const maxRows = rows * MAX_HEIGHT;
      const fromBottom = rows - 1 - row + 0.5; // cell centre, rows above the bottom edge
      const h = heights[bar] * maxRows;
      const p = peaks[bar] * maxRows;
      if (fromBottom <= h) v = BODY;
      else if (Math.abs(fromBottom - p) < 0.5 && p > 1) v = CAP;
    }

    const k = smoothstep(Math.min(1, (t - fadeStart) / FADE_MS));
    return k >= 1 ? v : idle(col, row, t) * (1 - k) + v * k;
  }) as SpectrumField;

  field.palette = PALETTE;
  field.colorAt = (col, row) => {
    const x = 1 - col / Math.max(1, cols - 1); // pink/purple on the left, blue on the right
    const up = (rows - 1 - row) / Math.max(1, rows * MAX_HEIGHT);
    return x * (1 - HEIGHT_TINT) + Math.min(1, up) * HEIGHT_TINT;
  };
  field.resize = (c, r) => {
    cols = c;
    rows = r;
    bars = Math.max(1, Math.floor((cols + GAP_COLS) / (BAR_COLS + GAP_COLS)));
    heights = new Float32Array(bars);
    peaks = new Float32Array(bars);
  };
  field.setSpectrogram = (s) => {
    pending = s;
  };
  return field;
}
