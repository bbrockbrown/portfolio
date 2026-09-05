// A field maps a grid cell + wall-clock time to a scalar in [0, 1]. It owns its
// own spatial frequencies and temporal dynamics (drift, breathe); the ASCII
// engine only turns the value into a glyph + alpha.
export type FieldFn = (col: number, row: number, tMs: number) => number;
