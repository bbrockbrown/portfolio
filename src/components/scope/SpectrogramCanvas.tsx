import { useEffect, useRef } from 'react';

import { ACID, DEFAULT_CUTOFF, freqToUnit, STEP, STEPS, unitToCutoff } from '@/lib/audio/patch';
import type { Readout } from '@/lib/audio/scopeContext';
import { simRow } from '@/lib/audio/spectrumModel';
import type { Synth } from '@/lib/audio/synth';

// Full-viewport ASCII spectrogram of the site's patch, behind every page. Everything per-frame
// (grid, cutoff, clock) lives inside the effect; React only hears about the
// readout, and only when a value it shows actually changes.

interface Props {
  synth: Synth;
  onReadout: (r: Readout) => void;
}

const RAMP = ' .·:-=+*%#@';
const ROW_MS = 30;
const AXIS: [number, string][] = [
  [60, '60'],
  [250, '250'],
  [1000, '1k'],
  [4000, '4k'],
  [12000, '12k'],
];
// Pointer moves over these don't sweep the filter (content glass, nav, links).
const NO_SWEEP = '[data-no-sweep], .glass, a, button, #nav-menu';

export function SpectrogramCanvas({ synth, onReadout }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadoutRef = useRef(onReadout);
  useEffect(() => {
    onReadoutRef.current = onReadout;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // ---------- geometry ----------
    let W = 0;
    let H = 0;
    let cell = 12;
    let cols = 0;
    let rows = 0;
    let grid: Float32Array[] = [];
    let font = '';
    let axisFont = '';
    const X0 = 12;
    const Y0 = 14;
    const cw = () => cell * 0.62;
    const freqX = (f: number) => X0 + freqToUnit(f) * (cols - 1) * cw();

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W <= 760 ? 9 : 12;
      const nextCols = Math.max(2, Math.floor((W - 24) / cw()));
      const nextRows = Math.max(1, Math.floor((H - 40) / cell));
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        grid = Array.from({ length: rows }, () => new Float32Array(cols));
      }
      const family = getComputedStyle(canvas!).fontFamily;
      font = `${Math.round(cell * 0.92)}px ${family}`;
      axisFont = `10px ${family}`;
    }

    let dirty = true; // only repaint when a row, the cutoff, or the theme changed

    // ---------- theme colours (read from the site's CSS tokens) ----------
    const TOKENS = {
      bg: '--background',
      fg: '--foreground',
      muted: '--muted-foreground',
      hot: '--hot',
      mid: '--scope-mid',
    };
    const C = { bg: '', fg: '', muted: '', hot: '', mid: '' };
    function readColors() {
      const cs = getComputedStyle(canvas!);
      for (const k of Object.keys(C) as (keyof typeof C)[]) {
        C[k] = cs.getPropertyValue(TOKENS[k]).trim();
      }
      dirty = true;
    }

    // ---------- readout (only on change) ----------
    let cutoff = DEFAULT_CUTOFF;
    let shownAbs = -1; // 16ths since the clock started
    let shownCutoff = -1;
    function report(abs: number) {
      if (abs < 0 || (abs === shownAbs && cutoff === shownCutoff)) return;
      shownAbs = abs;
      shownCutoff = cutoff;
      const step = abs % STEPS;
      const bar = Math.floor(abs / STEPS) % ACID.length;
      onReadoutRef.current({ step, bar, cutoff });
    }

    // ---------- draw ----------
    function draw() {
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = C.bg;
      ctx!.fillRect(0, 0, W, H);
      ctx!.font = font;
      ctx!.textBaseline = 'top';
      ctx!.textAlign = 'left';
      const w = cw();
      for (let r = 0; r < rows; r++) {
        const row = grid[r];
        const fade = 1 - (r / rows) * 0.75;
        for (let c = 0; c < cols; c++) {
          const e = row[c];
          if (e < 0.07) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(e * RAMP.length))];
          ctx!.globalAlpha = Math.min(1, (0.25 + e) * fade);
          ctx!.fillStyle = e > 0.62 ? C.hot : e > 0.32 ? C.fg : C.mid;
          ctx!.fillText(ch, X0 + c * w, Y0 + r * cell);
        }
      }
      // cutoff marker + frequency axis
      ctx!.globalAlpha = 0.5;
      ctx!.fillStyle = C.hot;
      ctx!.fillRect(Math.round(freqX(cutoff)), Y0, 1, rows * cell);
      ctx!.globalAlpha = 1;
      ctx!.font = axisFont;
      ctx!.fillStyle = C.muted;
      const axisY = Y0 + rows * cell + 8;
      for (const [f, label] of AXIS) {
        const x = freqX(f);
        ctx!.fillRect(Math.round(x), axisY - 4, 1, 3);
        ctx!.fillText(label, x + 3, axisY - 6);
      }
      ctx!.fillText('Hz', W - 30, axisY - 6);
    }

    // ---------- loop ----------
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let last = 0;
    let simT = 0;
    let rowAcc = 0;

    function pushRow() {
      grid.pop();
      grid.unshift(synth.playing ? synth.readSpectrum(cols) : simRow(simT, cols, cutoff));
    }

    function frame(now: number) {
      const dt = Math.min(100, now - last);
      last = now;
      simT += dt / 1000;
      rowAcc += dt;
      while (rowAcc >= ROW_MS) {
        rowAcc -= ROW_MS;
        pushRow();
        dirty = true;
      }
      report(synth.playing ? synth.position() : Math.floor(simT / STEP));
      if (dirty) {
        dirty = false;
        draw();
      }
      raf = requestAnimationFrame(frame);
    }

    function play() {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function renderStatic() {
      cancelAnimationFrame(raf);
      for (let i = 0; i < rows; i++) {
        simT += ROW_MS / 1000;
        grid.pop();
        grid.unshift(simRow(simT, cols, cutoff));
      }
      report(Math.floor(simT / STEP));
      draw();
    }

    const running = () => !reduceMq.matches && !document.hidden;
    const applyMotion = () => (reduceMq.matches ? renderStatic() : running() && play());

    // ---------- filter sweep from pointer ----------
    function onPointer(e: PointerEvent) {
      if ((e.target as Element | null)?.closest?.(NO_SWEEP)) return;
      cutoff = unitToCutoff((e.clientX - X0) / ((cols - 1) * cw()));
      synth.setCutoff(cutoff);
      dirty = true;
      if (reduceMq.matches) {
        report(shownAbs);
        draw();
      }
    }

    // ---------- lifecycle ----------
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layout();
        if (reduceMq.matches) renderStatic();
        else draw(); // resizing the canvas cleared it; the loop resumes from here
      }, 150);
    }
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (running()) play();
    }
    const themeObserver = new MutationObserver(() => {
      readColors();
      if (reduceMq.matches) draw();
    });

    // The font stylesheet loads async; the loop picks the font up on its own,
    // but a static (reduced-motion) frame needs a redraw.
    const onFontsLoaded = () => {
      if (reduceMq.matches) draw();
    };

    let disposed = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (disposed) return;
      layout();
      readColors();
      synth.setCutoff(cutoff);
      applyMotion();
    });

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer);
    window.addEventListener('pointerdown', onPointer);
    document.addEventListener('visibilitychange', onVisibility);
    reduceMq.addEventListener('change', applyMotion);
    document.fonts?.addEventListener('loadingdone', onFontsLoaded);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMq.removeEventListener('change', applyMotion);
      document.fonts?.removeEventListener('loadingdone', onFontsLoaded);
      themeObserver.disconnect();
      synth.dispose();
    };
  }, [synth]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='scope-canvas'
      // Inline z-index opts out of index.css's global `z-index: 10` rule so the
      // canvas stays behind page content.
      style={{ zIndex: -10 }}
    />
  );
}
