// Shared by the signal rail and the entries it colours.

type RGB = [number, number, number];

// Top → bottom: pink, purple, blue. Brighter cousins of the home page spectrum
// palette, since these are thin strokes and small accents.
export const RAIL_STOPS: RGB[] = [
  [219, 80, 150],
  [150, 90, 220],
  [80, 120, 235],
];

/** Rail colour at a fraction 0..1 down its length, as `rgb(...)`. */
export function railColor(t: number): string {
  const x = Math.min(1, Math.max(0, t)) * (RAIL_STOPS.length - 1);
  const i = Math.min(RAIL_STOPS.length - 2, Math.floor(x));
  const f = x - i;
  const [r, g, b] = RAIL_STOPS[i].map((a, c) => Math.round(a + (RAIL_STOPS[i + 1][c] - a) * f));
  return `rgb(${r}, ${g}, ${b})`;
}

export const RAIL_X = 12; // rail centre line, px from the timeline's left edge
