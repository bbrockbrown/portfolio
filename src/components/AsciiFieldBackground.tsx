import { useEffect, useRef } from 'react';

import { type AsciiFieldOptions, createAsciiField } from '@/lib/asciiField';
import { plasmaField } from '@/lib/fields/plasmaField';
import { createSimplexField } from '@/lib/fields/simplexField';
import { createSpectrumField } from '@/lib/fields/spectrumField';
import { loadNowPlayingSpectrum } from '@/lib/spectrum/loadNowPlaying';

interface Props {
  options?: Partial<AsciiFieldOptions>; // mount-time only, by design
  variant?: 'spectrum' | 'plasma' | 'simplex'; // which scalar field drives the glyphs; revert = one prop
  className?: string;
}

export function AsciiFieldBackground({ options, variant = 'spectrum', className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const spectrumField = !options?.field && variant === 'spectrum' ? createSpectrumField() : null;
    const fieldFn =
      options?.field ??
      spectrumField ??
      (variant === 'simplex' ? createSimplexField() : plasmaField);
    // The spectrum brings its own dark palette, so it can run far more opaque
    // than the default single-colour field.
    const alphas = spectrumField ? { minAlpha: 0.08, maxAlpha: 0.9 } : {};
    const field = createAsciiField(canvas, { ...alphas, ...options, field: fieldFn });

    let cancelled = false;
    if (spectrumField) {
      // Tracks without a preview get a stand-in spectrogram from the loader; only a
      // failed now-playing request leaves plasma up.
      loadNowPlayingSpectrum()
        .then((result) => {
          if (!cancelled) spectrumField.setSpectrogram(result.spectrogram);
        })
        .catch((err) => console.warn('spectrum unavailable, staying on plasma', err));
    }

    // Theme color: the canvas element carries the token via CSS `color`,
    // so the engine just reads the computed value — and re-reads on theme flips.
    const applyColor = () => field.setColorFromCss(getComputedStyle(canvas).color);
    applyColor();
    const themeObserver = new MutationObserver(applyColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    const parent = canvas.parentElement!;
    const ro = new ResizeObserver(([entry]) => {
      field.resize(entry.contentRect.width, entry.contentRect.height);
    });
    ro.observe(parent);
    // Prime the first frame immediately (ResizeObserver fires async).
    field.resize(parent.clientWidth, parent.clientHeight);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotion = () => {
      if (mq.matches) {
        field.stop();
        field.renderOnce();
      } else {
        field.start();
      }
    };
    applyMotion();
    mq.addEventListener('change', applyMotion);

    const onVisibility = () => {
      if (document.hidden) field.stop();
      else if (!mq.matches) field.start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      themeObserver.disconnect();
      ro.disconnect();
      mq.removeEventListener('change', applyMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      field.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- engine is mount-scoped

  return (
    <div
      aria-hidden='true'
      className={`fixed inset-0 pointer-events-none ${className ?? ''}`}
      // Inline z-index (not a Tailwind class) is deliberate: index.css has a global
      // `*:not(.p5Canvas):not([style*="z-index"]) { z-index: 10 }` rule that out-specifies
      // utility classes. An inline value opts out of that rule and stays behind content.
      style={{ zIndex: -10 }}
    >
      {/* `text-muted-foreground` is the single knob for glyph color; the engine reads
          this computed color (incl. any alpha) and scales the whole effect by it. */}
      <canvas ref={canvasRef} className='block h-full w-full text-muted-foreground' />
    </div>
  );
}
