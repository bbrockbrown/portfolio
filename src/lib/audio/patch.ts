// The homepage patch: one 16-step bar of 2-step-ish drums plus a two-bar lead.
// Shared by the simulated spectrum (before you press run) and the real synth,
// so what you see idling is what you hear once it plays. Pure data — no DOM.

export const BPM = 140;
/** Seconds per 16th-note step. */
export const STEP = 60 / BPM / 4;
export const STEPS = 16;

export const KICK = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0];
export const SNARE = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
export const HAT = [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1];

/** MIDI notes per step, one row per bar; null = rest (previous note rings on). */
export const LEAD: (number | null)[][] = [
  [72, null, 75, null, 79, null, 77, 75, 72, null, 70, null, 67, null, 70, 72],
  [70, null, 74, null, 77, null, 75, 74, 70, null, 69, null, 65, null, 69, 70],
];

export const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// Log frequency axis shared by the spectrogram columns and the filter sweep.
export const FMIN = 35;
export const FMAX = 16000;
export const MIN_CUTOFF = 120;
export const DEFAULT_CUTOFF = 2500;

/** Centre frequency of column `c` (fractional ok) on a `cols`-wide log axis. */
export const colFreq = (c: number, cols: number) => FMIN * Math.pow(FMAX / FMIN, c / (cols - 1));

/** 0..1 position of `f` on the log axis. */
export const freqToUnit = (f: number) => Math.log(f / FMIN) / Math.log(FMAX / FMIN);

/** Inverse of freqToUnit, clamped to the playable cutoff range. */
export const unitToCutoff = (u: number) =>
  Math.max(MIN_CUTOFF, FMIN * Math.pow(FMAX / FMIN, Math.min(1, Math.max(0, u))));
