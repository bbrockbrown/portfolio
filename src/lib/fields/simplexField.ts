import { createNoise3D } from 'simplex-noise';

import type { FieldFn } from './types';

// The original ascii-field source: 3D simplex noise sampled at (x*fx, y*fy, t)
// with fx < fy (horizontal streaks) and a slow breathe envelope. Preserved as
// the legacy field behind the `simplex` variant.
export interface SimplexFieldOptions {
  xFreq: number; // per column — lower than yFreq ⇒ horizontal streaks
  yFreq: number; // per row
  timeScale: number; // noise-time advance per ms (morph speed)
  breatheSpeed: number; // rad/ms of the density envelope (~0.00035 ⇒ ~18 s cycle)
  breatheDepth: number; // 0..1 — how empty the "exhale" phase gets
}

export const simplexDefaults: SimplexFieldOptions = {
  xFreq: 0.022,
  yFreq: 0.085,
  timeScale: 0.00018,
  breatheSpeed: 0.00035,
  breatheDepth: 0.6,
};

export function createSimplexField(overrides: Partial<SimplexFieldOptions> = {}): FieldFn {
  const o = { ...simplexDefaults, ...overrides };
  const noise3d = createNoise3D();
  return (col, row, t) => {
    const envelope = 1 - o.breatheDepth * (0.5 + 0.5 * Math.sin(t * o.breatheSpeed));
    const v = (noise3d(col * o.xFreq, row * o.yFreq, t * o.timeScale) + 1) / 2; // → 0..1
    return v * envelope;
  };
}
