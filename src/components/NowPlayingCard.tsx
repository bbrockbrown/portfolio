import { useEffect, useState } from 'react';

import { dominantColor } from '@/lib/dominantColor';
import { loadNowPlayingSpectrum, type NowPlayingSpectrum } from '@/lib/spectrum/loadNowPlaying';

// Spotify-style card naming the song the background is visualising. Shares the
// background's single load, and fades in alongside the spectrum crossfade.

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function timeAgo(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'just now';
}

// Until the album art is analysed (or if that fails).
const DEFAULT_EQ_COLOR = '#141414';

function EqualizerIcon({ color }: { color: string }) {
  return (
    <span aria-hidden='true' className='flex h-3 items-end gap-[2px]'>
      {[0, 0.25, 0.5].map((delay) => (
        <span
          key={delay}
          className='w-[3px] h-full origin-bottom rounded-[1px] transition-colors duration-700 motion-safe:animate-[eq_0.9s_ease-in-out_infinite_alternate]'
          style={{ animationDelay: `${delay}s`, backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export function NowPlayingCard() {
  const [data, setData] = useState<NowPlayingSpectrum | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadNowPlayingSpectrum()
      .then((result) => !cancelled && setData(result))
      .catch(() => {}); // the background already logs; no card is the fallback
    return () => {
      cancelled = true;
    };
  }, []);

  const track = data?.track;
  const visualising = Boolean(data?.spectrogram);

  // Equalizer bars take the album cover's majority colour.
  const [eqColor, setEqColor] = useState(DEFAULT_EQ_COLOR);
  const albumArt = track?.albumArt;
  useEffect(() => {
    if (!albumArt) return;
    let cancelled = false;
    dominantColor(albumArt)
      .then((c) => c && !cancelled && setEqColor(c))
      .catch(() => {}); // keep the default
    return () => {
      cancelled = true;
    };
  }, [albumArt]);

  return (
    <div
      className={`fixed top-4 right-4 w-72 max-w-[calc(100vw-2rem)] transition-all duration-[1500ms] ease-out ${
        track ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      {track && (
        <a
          href={track.spotifyUrl}
          target='_blank'
          rel='noreferrer'
          aria-label={`${track.name} by ${track.artists} on Spotify`}
          className='group flex items-center gap-3 rounded-lg bg-[#282828]/95 p-2.5 pr-3 shadow-lg shadow-black/40 backdrop-blur-sm transition-colors hover:bg-[#333333]/95'
        >
          {track.albumArt && (
            <img
              src={track.albumArt}
              alt=''
              className='h-14 w-14 flex-shrink-0 rounded-md object-cover shadow-md shadow-black/50'
            />
          )}
          <div className='min-w-0 flex-grow'>
            <div className='mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#b3b3b3]'>
              {visualising && <EqualizerIcon color={eqColor} />}
              <span className='truncate'>
                {visualising ? 'Visualizing' : 'Last played'} · {timeAgo(track.playedAt)}
              </span>
            </div>
            <p className='truncate text-sm font-bold text-white group-hover:underline'>
              {track.name}
            </p>
            <p className='truncate text-xs text-[#b3b3b3]'>{track.artists}</p>
          </div>
        </a>
      )}
    </div>
  );
}
