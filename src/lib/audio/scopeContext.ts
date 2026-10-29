import { createContext, useContext } from 'react';

import type { Synth } from './synth';

// One synth + spectrogram for the whole site, so the background (and any
// playing audio) survives route changes. Provider: components/scope/ScopeProvider.

export interface ScopeState {
  synth: Synth;
  playing: boolean;
  toggle: () => Promise<void>;
}

export const ScopeContext = createContext<ScopeState | null>(null);

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error('useScope must be used within a ScopeProvider');
  return ctx;
}
