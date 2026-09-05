// waveformSignature.ts — deterministic waveform mark from a seed string. No deps, SSR-safe.
// The constants below were tuned against rendered output; changing them silently
// changes every mark on the site (snapshot tests guard against that).

function cyrb53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type WaveFamily = 'saw' | 'square' | 'triangle' | 'wavetable';

// Weighted: wavetable/saw are the most distinctive shapes; triangle is the least, keep it rare.
function pickFamily(r: number): WaveFamily {
  if (r < 0.3) return 'saw';
  if (r < 0.55) return 'square';
  if (r < 0.7) return 'triangle';
  return 'wavetable';
}

export function waveformRecipe(seedStr: string) {
  const rand = mulberry32(cyrb53(seedStr) & 0xffffffff);
  const family = pickFamily(rand());
  const nHarm = 3 + ((rand() * 4) | 0); // 3..6
  const harmonics: { k: number; amp: number; phase: number }[] = [];
  for (let i = 0; i < nHarm; i++) {
    let k: number, amp: number;
    if (family === 'saw') {
      k = i + 1;
      amp = 1 / k;
    } else if (family === 'square') {
      k = 2 * i + 1;
      amp = 1 / k;
    } else if (family === 'triangle') {
      k = 2 * i + 1;
      amp = (i % 2 ? -1 : 1) / (k * k);
    } else {
      k = 1 + ((rand() * 7) | 0);
      amp = 0.35 + rand() * 0.65;
    }
    const phase = family === 'wavetable' ? rand() * Math.PI * 2 : (rand() - 0.5) * 0.6;
    harmonics.push({ k, amp, phase });
  }
  // 1–2 hash-derived "character partials": faint high harmonics that give each
  // pure-family mark its own ripple. Without these, triangles look identical.
  if (family !== 'wavetable') {
    const extras = 1 + ((rand() * 2) | 0);
    for (let i = 0; i < extras; i++)
      harmonics.push({
        k: 5 + ((rand() * 7) | 0),
        amp: 0.05 + rand() * 0.09,
        phase: rand() * Math.PI * 2,
      });
  }
  const cycles = 2 + ((rand() * 3) | 0); // 2..4 cycles across the mark
  return { family, harmonics, cycles };
}

export const SIG_VIEWBOX = { w: 120, h: 32 };

export function waveformPath(seedStr: string, samples = 160): string {
  const { harmonics, cycles } = waveformRecipe(seedStr);
  const ys: number[] = [];
  let peak = 0;
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * cycles * Math.PI * 2;
    let y = 0;
    for (const h of harmonics) y += h.amp * Math.sin(h.k * x + h.phase);
    ys.push(y);
    peak = Math.max(peak, Math.abs(y));
  }
  const mid = SIG_VIEWBOX.h / 2,
    amp = (SIG_VIEWBOX.h / 2) * 0.82;
  let d = '';
  for (let i = 0; i <= samples; i++)
    d +=
      (i === 0 ? 'M' : 'L') +
      ((i / samples) * SIG_VIEWBOX.w).toFixed(2) +
      ' ' +
      (mid - (ys[i] / peak) * amp).toFixed(2);
  return d;
}
