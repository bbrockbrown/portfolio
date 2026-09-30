import type { NowPlaying } from '../../../api/now-playing';

import { type Spectrogram, spectrogram } from './stft';
import { syntheticSpectrogram } from './synthetic';

export type { NowPlaying };

export interface NowPlayingSpectrum {
  track: NowPlaying;
  spectrogram: Spectrogram;
  // True when there was no usable preview (e.g. a new release Deezer doesn't
  // carry) and the spectrogram is a seeded stand-in rather than the real audio.
  synthetic: boolean;
}

// One load per page session: the background and the now-playing card share it
// (and StrictMode's double effects don't fetch + decode twice).
let cached: Promise<NowPlayingSpectrum> | null = null;

export function loadNowPlayingSpectrum(): Promise<NowPlayingSpectrum> {
  cached ??= load().catch((err) => {
    cached = null; // let a later mount retry
    throw err;
  });
  return cached;
}

async function load(): Promise<NowPlayingSpectrum> {
  const res = await fetch('/api/now-playing');
  if (!res.ok) throw new Error(`now-playing: HTTP ${res.status}`);
  const track: NowPlaying = await res.json();

  if (track.previewUrl) {
    try {
      const real = await analysePreview(track.previewUrl);
      if (real.frames > 0) return { track, spectrogram: real, synthetic: false };
    } catch (err) {
      console.warn('preview analysis failed, using a stand-in spectrogram', err);
    }
  }
  return { track, spectrogram: syntheticSpectrogram(track.spotifyUrl), synthetic: true };
}

/**
 * Fetch a preview, decode it (silently: an OfflineAudioContext never plays and
 * needs no user gesture), and FFT it.
 */
async function analysePreview(url: string): Promise<Spectrogram> {
  const audio = await fetch(url);
  if (!audio.ok) throw new Error(`preview: HTTP ${audio.status}`);
  const decoded = await new OfflineAudioContext(1, 1, 44_100).decodeAudioData(
    await audio.arrayBuffer(),
  );

  const mono = new Float32Array(decoded.length);
  for (let c = 0; c < decoded.numberOfChannels; c++) {
    const ch = decoded.getChannelData(c);
    for (let i = 0; i < ch.length; i++) mono[i] += ch[i] / decoded.numberOfChannels;
  }
  return spectrogram(mono, decoded.sampleRate);
}
