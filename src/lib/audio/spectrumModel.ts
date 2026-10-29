import { colFreq, HAT, KICK, LEAD, mtof, SNARE, STEP, STEPS } from './patch';

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
 * One spectrogram row (0..1 energy per column) at patch time `t` seconds,
 * with the lead run through a resonant lowpass at `cutoff` Hz.
 * `rng` is injectable so tests can make the noise floor deterministic.
 */
export function simRow(t: number, cols: number, cutoff: number, rng: () => number = Math.random) {
  const abs = Math.floor(t / STEP);
  const step = abs % STEPS;
  const frac = t - abs * STEP;
  const bar = Math.floor(abs / STEPS) % LEAD.length;

  const tk = since(KICK, step, frac);
  const ts = since(SNARE, step, frac);
  const th = since(HAT, step, frac);
  let note: number | null = null;
  let tn = 99;
  for (let back = 0; back < STEPS; back++) {
    const i = (((step - back) % STEPS) + STEPS) % STEPS;
    const n = LEAD[bar][i];
    if (n != null) {
      note = n;
      tn = back * STEP + frac;
      break;
    }
  }

  const kEnv = Math.exp(-tk * 9);
  const sEnv = Math.exp(-ts * 14);
  const hEnv = Math.exp(-th * 38) * (step % 2 ? 1 : 0.6);
  const nEnv = Math.exp(-tn * 4);
  const f0 = note != null ? mtof(note) : 0;

  const out = new Float32Array(cols);
  for (let c = 0; c < cols; c++) {
    const f = colFreq(c, cols);
    let e = 0.04 + rng() * 0.05 + (rng() < 0.004 ? 0.5 : 0); // floor + vinyl crackle
    e += kEnv * bump(f, 50 * (1 + kEnv * 1.8), 0.25);
    e += sEnv * 0.55 * bump(f, 1800, 2.2) + sEnv * 0.4 * bump(f, 190, 0.02);
    e += hEnv * 0.5 * bump(f, 10000, 0.25);
    if (note != null) {
      for (let k = 1; k <= 14; k++) {
        const fk = f0 * k;
        const lp = (1 / (1 + Math.pow(fk / cutoff, 4))) * (1 + 1.2 * bump(fk, cutoff, 0.02));
        e += nEnv * (0.9 / k) * lp * bump(f, fk, 0.0025);
      }
    }
    out[c] = Math.min(1, e);
  }
  return out;
}
