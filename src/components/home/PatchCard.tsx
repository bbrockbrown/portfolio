import { Fragment, type ReactNode, useEffect, useRef } from 'react';

import { noteName, parseMini } from '@/lib/audio/mini';
import { ACID, BPM, DEFAULT_CUTOFF, DRUM_PATTERN } from '@/lib/audio/patch';
import { useScope } from '@/lib/audio/scopeContext';

// The bio, written as a Strudel-style live-coding patch. This is real text and
// links (the canvas behind it is aria-hidden), so it's what screen readers and
// crawlers see.

const LINKS = [
  { href: 'https://github.com/bbrockbrown', label: 'github' },
  { href: 'https://www.linkedin.com/in/bbrockbrown/', label: 'linkedin' },
  { href: 'https://open.spotify.com/user/bbrockbrown', label: 'spotify' },
];

// The music lines mirror the real patch. Tokens light up on the step they play
// (like Strudel's active-event highlight), the acid notes swap each bar, and
// .lpf() tracks the pointer. Updated straight on the DOM via the readout bus,
// so React doesn't re-render ~9 times a second.
const DRUM_TOKENS = parseMini(DRUM_PATTERN);
const DRUM_HITS = DRUM_TOKENS.map((t) => new Set(t.steps));
const acidText = (n: number | null) => (n == null ? '~' : noteName(n));

/** The drum pattern string, with each token wrapped so it can be highlighted. */
function drumSegments(register: (k: number) => (el: HTMLSpanElement | null) => void) {
  const out: ReactNode[] = [];
  let pos = 0;
  DRUM_TOKENS.forEach((t, k) => {
    if (t.start > pos) out.push(DRUM_PATTERN.slice(pos, t.start));
    out.push(
      <span key={k} className='tok' ref={register(k)}>
        {t.text}
      </span>
    );
    pos = t.end;
  });
  out.push(DRUM_PATTERN.slice(pos));
  return out;
}

const Line = ({ children }: { children?: ReactNode }) => (
  <span className='l'>{children ?? ' '}</span>
);
const K = ({ children }: { children: ReactNode }) => <span className='k'>{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className='s'>"{children}"</span>;
const N = ({ children }: { children: ReactNode }) => <span className='n'>{children}</span>;

export function PatchCard() {
  const { playing, toggle: toggleSynth, readout } = useScope();
  const codeRef = useRef<HTMLPreElement>(null);
  const drumEls = useRef<(HTMLSpanElement | null)[]>([]);
  const acidEls = useRef<(HTMLSpanElement | null)[]>([]);
  const lpfEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let shownBar = 0;
    return readout.subscribe(({ step, bar, cutoff }) => {
      drumEls.current.forEach((el, k) => el?.classList.toggle('on', DRUM_HITS[k].has(step)));
      if (bar !== shownBar) {
        shownBar = bar;
        acidEls.current.forEach((el, i) => {
          if (el) el.textContent = acidText(ACID[bar][i]);
        });
      }
      acidEls.current.forEach((el, i) =>
        el?.classList.toggle('on', i === step && ACID[bar][i] != null)
      );
      if (lpfEl.current) lpfEl.current.textContent = String(Math.round(cutoff));
    });
  }, [readout]);

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
      <p className='sub'>software engineer · music + art stuffs on the side</p>
      <pre ref={codeRef}>
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
          <K>lead</K>(<S>disc</S>, <N>members: 300</N>)
        </Line>
        <Line>
          {'  .'}
          <K>teach</K>(<S>data structures</S>)
        </Line>
        <Line>
          {'  .'}
          <K>sound</K>(<S>techno, hyperpop, experimental, industrial, club</S>)
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
        <Line />
        <Line>
          <span className='c'>// music is evaluated live, making the spectrogram behind this!</span>
        </Line>
        <Line>
          <K>setcpm</K>(<N>{BPM}</N>/<N>4</N>)
        </Line>
        <Line>
          <K>$</K>: <K>s</K>(
          <span className='s'>"{drumSegments((k) => (el) => void (drumEls.current[k] = el))}"</span>
          )
        </Line>
        <Line>
          <K>$</K>: <K>note</K>(
          <span className='s'>
            "
            {ACID[0].map((n, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className='tok' ref={(el) => void (acidEls.current[i] = el)}>
                  {acidText(n)}
                </span>
              </Fragment>
            ))}
            "
          </span>
          )
        </Line>
        <Line>
          {'  .'}
          <K>s</K>(<S>sawtooth</S>).<K>lpf</K>(
          <N>
            <span ref={lpfEl}>{DEFAULT_CUTOFF}</span>
          </N>
          )
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
