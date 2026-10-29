import { useCallback, useMemo, useState } from 'react';

import { ScopeContext } from '@/lib/audio/scopeContext';
import { Synth } from '@/lib/audio/synth';

export function ScopeProvider({ children }: { children: React.ReactNode }) {
  // Creates no AudioContext until the first run click.
  const [synth] = useState(() => new Synth());
  const [playing, setPlaying] = useState(false);

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

  const value = useMemo(() => ({ synth, playing, toggle }), [synth, playing, toggle]);
  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}
