// A field maps a grid cell + wall-clock time to a scalar in [0, 1]. It owns its
// own spatial frequencies and temporal dynamics (drift, breathe); the ASCII
// engine only turns the value into a glyph + alpha.
export type FieldFn = (col: number, row: number, tMs: number) => number;

// Optional hooks for stateful fields (e.g. the spectrum, which lays out bars by
// grid size). Pure functions like plasmaField simply don't have them.
export type Field = FieldFn & {
  resize?: (cols: number, rows: number) => void;
  // Optional per-glyph colour: `palette` stops (rgb 0..255), and where in the
  // gradient each cell sits (0..1). Without these the engine uses one theme colour.
  palette?: [number, number, number][];
  colorAt?: (col: number, row: number) => number;
};
