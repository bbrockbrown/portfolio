// The site's patch: one 16-step bar of four-on-the-floor techno drums plus a
// two-bar acid bassline. Shared by the simulated spectrum (before you press run)
// and the real synth, so what you see idling is what you hear once it plays.
// Pure data — no DOM.

export const BPM = 132;
/** Seconds per 16th-note step. */
export const STEP = 60 / BPM / 4;
export const STEPS = 16;

export const KICK = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
export const CLAP = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
/** Closed hats on every 16th except the offbeats, where the open hat takes over. */
export const HAT = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1];
export const OPEN_HAT = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];

/** The drums above, as the Strudel mini-notation shown on the home card.
 *  mini.test.ts checks it expands to exactly KICK / CLAP / HAT / OPEN_HAT. */
export const DRUM_PATTERN = 'bd*4, ~ cp ~ cp, [hh hh ~ hh]*4, [~ oh]*4';

/** Acid line: MIDI notes per step, one row per bar; null = rest. Each note is a 16th. */
export const ACID: (number | null)[][] = [
  [36, 36, 48, null, 36, 39, null, 36, 43, null, 36, 46, 36, null, 48, 39],
  [36, 36, 48, null, 36, 41, null, 36, 43, null, 39, 46, 36, 48, null, 43],
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
