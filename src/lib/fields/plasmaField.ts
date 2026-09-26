import type { FieldFn } from './types';

// Additive synthesis: a bank of detuned sine oscillators. Everything on the page
// is oscillators — that's the story. The vocabulary (OSC, DRIVE, MIX_*) is part
// of the feature; keep it.
//
// kx/ky: rad per cell (mostly-vertical wavevectors => horizontal streaks)
// w:     rad per ms  (detuned rates => interference drift + slow beats)
interface Osc {
  kx: number;
  ky: number;
  w: number;
  A: number;
  p: number;
}

const OSC: Osc[] = [
  { kx: 0.055, ky: 0.3, w: 0.0003, A: 1.0, p: 0.0 },
  { kx: -0.045, ky: 0.26, w: -0.00037, A: 0.8, p: 2.1 }, // counter-traveling vs osc 1
  { kx: 0.02, ky: 0.38, w: 0.0006, A: 0.6, p: 4.2 },
  { kx: 0.12, ky: -0.06, w: 0.00016, A: 0.5, p: 1.3 }, // slow, more horizontal wavevector
];
const DRIVE = 1.6; // tanh soft-clip: restores contrast lost to summing (a synth's drive stage)
const FLOOR = 0.22; // subtracted floor: troughs go genuinely empty
const MIX_SPEED = 0.0003; // rad/ms — the mix LFO ("breathe"), ~21 s cycle
const MIX_DEPTH = 0.55;

const sumA = OSC.reduce((s, o) => s + o.A, 0);
const tanhD = Math.tanh(DRIVE);

export const plasmaField: FieldFn = (col, row, t) => {
  let raw = 0;
  for (const o of OSC) raw += o.A * Math.sin(o.kx * col + o.ky * row + o.w * t + o.p);
  raw /= sumA;
  const shaped = Math.tanh(raw * DRIVE) / tanhD;
  let v = (shaped + 1) / 2;
  v *= 1 - MIX_DEPTH * (0.5 + 0.5 * Math.sin(t * MIX_SPEED));
  return Math.max(0, (v - FLOOR) / (1 - FLOOR));
};
