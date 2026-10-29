import { useEffect, useState } from 'react';

import { BPM, DEFAULT_CUTOFF } from '@/lib/audio/patch';
import { type Readout, useScope } from '@/lib/audio/scopeContext';

import { SpectrogramCanvas } from './SpectrogramCanvas';

import './scope.css';

const formatHz = (hz: number) => (hz >= 1000 ? `${(hz / 1000).toFixed(1)}k` : `${Math.round(hz)}`);

/** Site-wide background: the spectrogram plus its bpm/step/cutoff readout. */
export function ScopeBackground() {
  const { synth, playing, readout: bus } = useScope();
  const [readout, setReadout] = useState<Readout>({ step: 0, bar: 0, cutoff: DEFAULT_CUTOFF });
  useEffect(() => bus.subscribe(setReadout), [bus]);

  return (
    <div className='scope' data-playing={playing}>
      <SpectrogramCanvas synth={synth} onReadout={bus.emit} />
      <div className='scope-readout' aria-hidden='true'>
        <b>{BPM}</b> bpm · step <b>{String(readout.step + 1).padStart(2, '0')}</b>/16
        <br />
        cutoff <b>{formatHz(readout.cutoff)}</b> Hz
      </div>
    </div>
  );
}
