import { createNoise3D } from 'simplex-noise';

export interface AsciiFieldOptions {
  fontSize: number; // CSS px
  lineHeight: number; // multiplier → cell height
  fontFamily: string; // use the site's mono token; fallback stack below
  ramp: string; // sparse → dense; index 0 must be ' ' (skipped when drawing)
  minAlpha: number; // alpha of the faintest drawn glyph
  maxAlpha: number; // alpha at field maximum (dark theme; light theme wants less)
  xFreq: number; // noise frequency per column — LOWER than yFreq ⇒ horizontal streaks
  yFreq: number; // noise frequency per row
  timeScale: number; // noise-time advance per ms (morph speed)
  breatheSpeed: number; // rad/ms of the global density envelope (~0.00035 ⇒ ~18 s cycle)
  breatheDepth: number; // 0..1 — how empty the "exhale" phase gets
  fpsCap: number; // draw rate cap; field time still tracks wall clock
  maxDpr: number; // cap devicePixelRatio (2 is plenty)
}

export const defaultOptions: AsciiFieldOptions = {
  fontSize: 16,
  lineHeight: 1.15,
  fontFamily: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  ramp: ' .:/|cba%#',
  minAlpha: 0.1,
  maxAlpha: 0.5,
  xFreq: 0.022,
  yFreq: 0.085,
  timeScale: 0.00018,
  breatheSpeed: 0.00035,
  breatheDepth: 0.6,
  fpsCap: 60,
  maxDpr: 2,
};

const ALPHA_BUCKETS = 16;

export function createAsciiField(
  canvas: HTMLCanvasElement,
  overrides: Partial<AsciiFieldOptions> = {}
) {
  const o: AsciiFieldOptions = { ...defaultOptions, ...overrides };
  const ctx = canvas.getContext('2d')!;
  const noise3d = createNoise3D();

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
  const rebuildLUT = () => {
    alphaLUT = Array.from({ length: ALPHA_BUCKETS }, (_, i) => {
      const alpha = (o.minAlpha + (o.maxAlpha - o.minAlpha) * (i / (ALPHA_BUCKETS - 1))) * color.a;
      return `rgba(${color.r},${color.g},${color.b},${alpha.toFixed(4)})`;
    });
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
    const envelope = 1 - o.breatheDepth * (0.5 + 0.5 * Math.sin(t * o.breatheSpeed));
    const nT = t * o.timeScale;
    for (let row = 0; row < rows; row++) {
      const y = row * cellH;
      const nY = row * o.yFreq;
      for (let col = 0; col < cols; col++) {
        let v = (noise3d(col * o.xFreq, nY, nT) + 1) / 2; // → 0..1
        v *= envelope;
        const idx = Math.min(o.ramp.length - 1, (v * o.ramp.length) | 0);
        if (idx === 0) continue; // ' ' — nothing to draw
        ctx.fillStyle = alphaLUT[Math.min(ALPHA_BUCKETS - 1, (v * ALPHA_BUCKETS) | 0)];
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
