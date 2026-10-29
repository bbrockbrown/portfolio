import { type ReactNode, useRef } from 'react';

import { BPM } from '@/lib/audio/patch';
import { useScope } from '@/lib/audio/scopeContext';

// The bio, written as a Strudel-style live-coding patch. This is real text and
// links (the canvas behind it is aria-hidden), so it's what screen readers and
// crawlers see.

const LINKS = [
  { href: 'https://github.com/bbrockbrown', label: 'github' },
  { href: 'https://www.linkedin.com/in/bbrockbrown/', label: 'linkedin' },
  { href: 'https://open.spotify.com/user/bbrockbrown', label: 'spotify' },
];

const Line = ({ children }: { children?: ReactNode }) => (
  <span className='l'>{children ?? ' '}</span>
);
const K = ({ children }: { children: ReactNode }) => <span className='k'>{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className='s'>"{children}"</span>;
const N = ({ children }: { children: ReactNode }) => <span className='n'>{children}</span>;

export function PatchCard() {
  const { playing, toggle: toggleSynth } = useScope();
  const codeRef = useRef<HTMLPreElement>(null);

  const toggle = () => {
    if (!playing) {
      // Re-trigger the "evaluated" flash on every run.
      const el = codeRef.current;
      el?.classList.remove('flash');
      void el?.offsetWidth;
      el?.classList.add('flash');
    }
    void toggleSynth();
  };

  return (
    <aside className='patch-card glass' data-no-sweep>
      <h1>
        brock<span>.</span>brown
      </h1>
      <p className='sub'>software engineer · makes noise on the side</p>
      <pre ref={codeRef}>
        <Line>
          <span className='c'>// music is evaluated live, making the spectrogram behind this!</span>
        </Line>
        <Line>
          <K>setcps</K>(<N>{BPM}</N>/<N>60</N>/<N>4</N>)
        </Line>
        <Line />
        <Line>
          <K>$</K>: <K>brock</K>()
        </Line>
        <Line>
          {'  .'}
          <K>study</K>(<S>cs @ northwestern</S>)
        </Line>
        <Line>
          {'  .'}
          <K>ship</K>(<S>siri @ apple</S>, <S>intern</S>)
        </Line>
        <Line>
          {'  .'}
          <K>lead</K>(<S>disc</S>, <N>300</N>)
        </Line>
        <Line>
          {'  .'}
          <K>teach</K>(<S>data structures</S>)
        </Line>
        <Line>
          {'  .'}
          <K>sound</K>(<S>hyperpop, club, 2-step</S>)
        </Line>
        <Line />
        <Line>
          <span className='c'>
            {'// '}
            {LINKS.map((l, i) => (
              <span key={l.href}>
                {i > 0 && ' · '}
                <a href={l.href} target='_blank' rel='noopener noreferrer'>
                  {l.label}
                </a>
              </span>
            ))}
          </span>
        </Line>
      </pre>

      <div className='transport'>
        <button className='run' type='button' aria-pressed={playing} onClick={toggle}>
          {playing ? '■ stop' : '▶ run'}
        </button>
        <p className='hint'>move across the spectrum to sweep the filter</p>
      </div>
    </aside>
  );
}
