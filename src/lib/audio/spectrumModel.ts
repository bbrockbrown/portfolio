import { ACID, CLAP, colFreq, FMAX, HAT, KICK, mtof, OPEN_HAT, STEP, STEPS } from './patch';

// A cheap stand-in for the analyser: models each voice of the patch as a few
// log-Gaussian bumps with exponential envelopes. Used while audio is off.

/** Gaussian bump on a log-frequency axis. */
const bump = (f: number, center: number, width: number) => {
  const d = Math.log(f / center);
  return Math.exp((-d * d) / width);
};

/** Seconds since `pattern` last fired, looking back from `step` (99 if never). */
function since(pattern: number[], step: number, frac: number) {
  for (let back = 0; back < STEPS; back++) {
    const i = (((step - back) % STEPS) + STEPS) % STEPS;
    if (pattern[i]) return back * STEP + frac;
  }
  return 99;
}

/**
 * One spectrogram row (0..1 energy per column) at patch time `t` seconds, with
 * the acid line run through a resonant lowpass at `cutoff` Hz.
 * `rng` is injectable so tests can make the noise floor deterministic.
 */
export function simRow(t: number, cols: number, cutoff: number, rng: () => number = Math.random) {
  const abs = Math.floor(t / STEP);
  const step = abs % STEPS;
  const frac = t - abs * STEP;
  const bar = Math.floor(abs / STEPS) % ACID.length;

  const tk = since(KICK, step, frac);
  const tc = since(CLAP, step, frac);
  const th = since(HAT, step, frac);
  const to = since(OPEN_HAT, step, frac);
  let note: number | null = null;
  let tn = 99;
  for (let back = 0; back < STEPS; back++) {
    const i = (((step - back) % STEPS) + STEPS) % STEPS;
    const n = ACID[bar][i];
    if (n != null) {
      note = n;
      tn = back * STEP + frac;
      break;
    }
  }

  const kEnv = Math.exp(-tk * 7);
  const cEnv = Math.exp(-tc * 16);
  const hEnv = Math.exp(-th * 45);
  const oEnv = Math.exp(-to * 9);
  const nEnv = Math.exp(-tn * 10); // 16th-note plucks
  // Each acid note opens the filter well above the cutoff, then closes onto it.
  const fc = Math.min(FMAX, cutoff * (1 + 3 * Math.exp(-tn * 18)));
  const f0 = note != null ? mtof(note) : 0;
  const harmonics = note != null ? Math.min(64, Math.floor(FMAX / f0)) : 0;

  const out = new Float32Array(cols);
  for (let c = 0; c < cols; c++) {
    const f = colFreq(c, cols);
    let e = 0.04 + rng() * 0.05 + (rng() < 0.004 ? 0.5 : 0); // floor + vinyl crackle
    e += kEnv * bump(f, 48 * (1 + kEnv * 2), 0.3);
    e += cEnv * 0.6 * bump(f, 1200, 1.6);
    e += hEnv * 0.4 * bump(f, 9000, 0.2);
    e += oEnv * 0.45 * bump(f, 8000, 0.3);
    for (let k = 1; k <= harmonics; k++) {
      // Sawtooth: 1/k harmonics, 4-pole lowpass with a resonant peak at fc.
      const fk = f0 * k;
      const lp = (1 / (1 + Math.pow(fk / fc, 4))) * (1 + 1.6 * bump(fk, fc, 0.02));
      e += nEnv * (0.9 / k) * lp * bump(f, fk, 0.0025);
    }
    out[c] = Math.min(1, e);
  }
  return out;
}
