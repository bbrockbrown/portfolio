import { createSimplexField } from './fields/simplexField';
import type { Field } from './fields/types';

export interface AsciiFieldOptions {
  fontSize: number; // CSS px
  lineHeight: number; // multiplier → cell height
  fontFamily: string; // use the site's mono token; fallback stack below
  ramp: string; // sparse → dense; index 0 must be ' ' (skipped when drawing)
  minAlpha: number; // alpha of the faintest drawn glyph
  maxAlpha: number; // alpha at field maximum (dark theme; light theme wants less)
  fpsCap: number; // draw rate cap; field time still tracks wall clock
  maxDpr: number; // cap devicePixelRatio (2 is plenty)
  // The scalar field, 0..1 per cell. Owns its own spatial/temporal dynamics.
  // Defaults to the legacy simplex field when omitted.
  field?: Field;
}

export const defaultOptions: Omit<AsciiFieldOptions, 'field'> = {
  fontSize: 16,
  lineHeight: 1.15,
  fontFamily: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  ramp: ' .:/|cba%#',
  minAlpha: 0.03,
  maxAlpha: 0.16,
  fpsCap: 60,
  maxDpr: 2,
};

const ALPHA_BUCKETS = 16;
const PALETTE_STEPS = 24; // gradient resolution for fields with a palette

export function createAsciiField(
  canvas: HTMLCanvasElement,
  overrides: Partial<AsciiFieldOptions> = {},
) {
  const o: AsciiFieldOptions = { ...defaultOptions, ...overrides };
  const ctx = canvas.getContext('2d')!;
  const field: Field = o.field ?? createSimplexField();

  let cssW = 0,
    cssH = 0,
    cols = 0,
    rows = 0,
    cellW = 9,
    cellH = 18;
  let t = Math.random() * 100_000; // random start point in the field
  let raf = 0,
    last = 0,
    acc = 0;

  // Precomputed rgba strings, indexed by alpha bucket. Rebuilt on color change.
  // Fallback is a neutral gray (≈ the dark theme's --muted-foreground) rather than
  // white, so if a browser serializes the computed `color` in a non-rgb form that
  // setColorFromCss can't parse, glyphs still degrade to a sensible tone.
  let color = { r: 170, g: 170, b: 170, a: 1 };
  let alphaLUT: string[] = [];
  // Same idea per gradient step, when the field brings its own palette:
  // paletteLUT[step][alphaBucket]. The theme token's alpha still scales it.
  let paletteLUT: string[][] | null = null;
  const bucketAlpha = (i: number) =>
    (o.minAlpha + (o.maxAlpha - o.minAlpha) * (i / (ALPHA_BUCKETS - 1))) * color.a;
  const rebuildLUT = () => {
    alphaLUT = Array.from(
      { length: ALPHA_BUCKETS },
      (_, i) => `rgba(${color.r},${color.g},${color.b},${bucketAlpha(i).toFixed(4)})`,
    );
    const stops = field.palette;
    paletteLUT = stops?.length
      ? Array.from({ length: PALETTE_STEPS }, (_, s) => {
          const x = (s / (PALETTE_STEPS - 1)) * (stops.length - 1);
          const a = stops[Math.floor(x)];
          const b = stops[Math.min(stops.length - 1, Math.floor(x) + 1)];
          const f = x - Math.floor(x);
          const [r, g, bl] = [0, 1, 2].map((c) => Math.round(a[c] + (b[c] - a[c]) * f));
          return Array.from(
            { length: ALPHA_BUCKETS },
            (_, i) => `rgba(${r},${g},${bl},${bucketAlpha(i).toFixed(4)})`,
          );
        })
      : null;
  };
  rebuildLUT();

  const setFont = () => {
    ctx.font = `${o.fontSize}px ${o.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
  };

  const draw = () => {
    ctx.clearRect(0, 0, cssW, cssH);
    setFont();
    for (let row = 0; row < rows; row++) {
      const y = row * cellH;
      for (let col = 0; col < cols; col++) {
        const v = field(col, row, t); // 0..1, dynamics + envelope owned by the field
        const idx = Math.min(o.ramp.length - 1, (v * o.ramp.length) | 0);
        if (idx === 0) continue; // ' ' — nothing to draw
        const bucket = Math.min(ALPHA_BUCKETS - 1, (v * ALPHA_BUCKETS) | 0);
        if (paletteLUT && field.colorAt) {
          const c = Math.min(1, Math.max(0, field.colorAt(col, row)));
          ctx.fillStyle = paletteLUT[Math.round(c * (PALETTE_STEPS - 1))][bucket];
        } else {
          ctx.fillStyle = alphaLUT[bucket];
        }
        ctx.fillText(o.ramp[idx], col * cellW, y);
      }
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(now - last, 100); // clamp: no time-jump after tab restore
    last = now;
    t += dt; // wall-clock time → refresh-rate independent
    acc += dt;
    const interval = 1000 / o.fpsCap;
    if (acc < interval) return;
    acc %= interval;
    draw();
  };

  return {
    resize(w: number, h: number) {
      cssW = w;
      cssH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, o.maxDpr);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont();
      cellW = Math.max(4, Math.ceil(ctx.measureText('0').width));
      cellH = Math.max(8, Math.round(o.fontSize * o.lineHeight));
      cols = Math.ceil(w / cellW) + 1;
      rows = Math.ceil(h / cellH) + 1;
      field.resize?.(cols, rows);
      if (!raf) draw(); // keep the static frame fresh (reduced motion / pre-start)
    },
    start() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    renderOnce: draw,
    /** Accepts a computed CSS color ("rgb(a,b,c)" / "rgba(...)"); token alpha scales the whole effect. */
    setColorFromCss(css: string) {
      const m = css.match(/rgba?\(([^)]+)\)/);
      if (!m) return;
      const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
      color = { r: +r, g: +g, b: +b, a: +a };
      rebuildLUT();
      if (!raf) draw();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
