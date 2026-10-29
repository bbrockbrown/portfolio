import { useState } from 'react';

import { BPM, DEFAULT_CUTOFF } from '@/lib/audio/patch';
import { useScope } from '@/lib/audio/scopeContext';

import { type Readout, SpectrogramCanvas } from './SpectrogramCanvas';

import './scope.css';

const formatHz = (hz: number) => (hz >= 1000 ? `${(hz / 1000).toFixed(1)}k` : `${Math.round(hz)}`);

/** Site-wide background: the spectrogram plus its bpm/step/cutoff readout. */
export function ScopeBackground() {
  const { synth, playing } = useScope();
  const [readout, setReadout] = useState<Readout>({ step: 0, cutoff: DEFAULT_CUTOFF });

  return (
    <div className='scope' data-playing={playing}>
      <SpectrogramCanvas synth={synth} onReadout={setReadout} />
      <div className='scope-readout' aria-hidden='true'>
        <b>{BPM}</b> bpm · step <b>{String(readout.step + 1).padStart(2, '0')}</b>/16
        <br />
        cutoff <b>{formatHz(readout.cutoff)}</b> Hz
      </div>
    </div>
  );
}
