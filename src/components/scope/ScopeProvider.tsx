import { useCallback, useEffect, useMemo, useState } from 'react';

import { createReadoutBus, ScopeContext } from '@/lib/audio/scopeContext';
import { Synth } from '@/lib/audio/synth';

export function ScopeProvider({ children }: { children: React.ReactNode }) {
  // Creates no AudioContext until the first run click.
  const [synth] = useState(() => new Synth());
  const [playing, setPlaying] = useState(false);
  const [readout] = useState(createReadoutBus);

  const toggle = useCallback(async () => {
    try {
      if (synth.playing) await synth.stop();
      else await synth.start();
    } catch (err) {
      console.warn('audio unavailable', err);
    } finally {
      setPlaying(synth.playing);
    }
  }, [synth]);

  // Don't keep playing in a background tab; pick back up when the user returns.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? synth.pause() : synth.resume());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [synth]);

  const value = useMemo(
    () => ({ synth, playing, toggle, readout }),
    [synth, playing, toggle, readout]
  );
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}
