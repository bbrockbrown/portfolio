import { BANDS, type Spectrogram } from './stft';

// A believable stand-in spectrogram for tracks with no preview audio (e.g. new
// releases Deezer doesn't carry yet). Same shape and 0..1 range as a real one,
// so the analyser can't tell the difference: kick on every beat, snare on 2 & 4,
// hats on the eighths, a sustained bassline, slow pad chords, and 8-bar sections
// that trade energy. Seeded, so a given track always gets the same "song".

const FPS = 30;
const SECONDS = 30;
const RELEASE = 0.55; // same per-frame decay as the real analysis

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bump centred at `mu` (band position 0..1) with width `sigma`.
const bump = (x: number, mu: number, sigma: number) => Math.exp(-(((x - mu) / sigma) ** 2));

export function syntheticSpectrogram(seed: string): Spectrogram {
  const rand = rng(seed);
  const bpm = 96 + rand() * 36;
  const frames = FPS * SECONDS;
  const bars = Math.ceil(((SECONDS * bpm) / 60) / 4) + 1;

  // Per-bar choices, drawn up front so they're stable per seed.
  const sectionEnergy = Array.from({ length: Math.ceil(bars / 8) }, () => 0.55 + rand() * 0.45);
  const chords = Array.from({ length: bars }, () => [0, 1, 2].map(() => 0.18 + rand() * 0.3));
  const bassNote = Array.from({ length: bars }, () => 0.09 + rand() * 0.06);
  const hatAccent = Array.from({ length: bars * 8 }, () => 0.5 + rand() * 0.5);
  const dropKick = Array.from({ length: bars }, () => rand() < 0.08); // occasional breakdown bar

  const data = new Float32Array(frames * BANDS);
  const prev = new Float32Array(BANDS);
  for (let f = 0; f < frames; f++) {
    const beatPos = ((f / FPS) * bpm) / 60;
    const beat = Math.floor(beatPos);
    const bar = Math.floor(beat / 4);
    const phase = beatPos - beat;
    const eighth = beatPos * 2 - Math.floor(beatPos * 2);
    const energy = sectionEnergy[Math.floor(bar / 8)];

    const kick = dropKick[bar] ? 0 : Math.exp(-phase * 7);
    const snare = beat % 2 === 1 ? Math.exp(-phase * 9) : 0;
    const hat = Math.exp(-eighth * 14) * hatAccent[Math.floor(beatPos * 2)];
    const swell = 0.75 + 0.25 * Math.sin((beatPos / 4) * Math.PI); // bar-length breathing

    for (let b = 0; b < BANDS; b++) {
      const x = b / (BANDS - 1);
      let v =
        kick * bump(x, 0.05, 0.07) +
        0.55 * swell * bump(x, bassNote[bar], 0.035) +
        snare * (0.5 * bump(x, 0.42, 0.16) + 0.3 * bump(x, 0.72, 0.2)) +
        0.55 * hat * bump(x, 0.86, 0.09);
      for (const note of chords[bar]) v += 0.32 * swell * bump(x, note, 0.025);
      v += 0.1 * (1 - x) * (0.7 + 0.3 * rand()); // noise floor, heavier in the lows
      v = Math.min(1, v * energy);
      prev[b] = v > prev[b] ? v : prev[b] * RELEASE + v * (1 - RELEASE);
      data[f * BANDS + b] = prev[b];
    }
  }
  return { fps: FPS, frames, bands: BANDS, data };
}
