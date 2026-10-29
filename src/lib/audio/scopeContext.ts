import { createContext, useContext } from 'react';

import type { Synth } from './synth';

// One synth + spectrogram for the whole site, so the background (and any
// playing audio) survives route changes. Provider: components/scope/ScopeProvider.

/** Where the patch is right now. Emitted by the spectrogram loop, only on change. */
export interface Readout {
  step: number; // 0..15
  bar: number; // index into ACID
  cutoff: number; // Hz
}

export type ReadoutListener = (r: Readout) => void;

/** Tiny pub/sub so per-step updates reach the DOM without re-rendering React. */
export interface ReadoutBus {
  emit: ReadoutListener;
  /** Calls `fn` with the latest readout immediately (if any); returns an unsubscribe. */
  subscribe: (fn: ReadoutListener) => () => void;
}

export function createReadoutBus(): ReadoutBus {
  const listeners = new Set<ReadoutListener>();
  let last: Readout | null = null;
  return {
    emit: (r) => {
      last = r;
      listeners.forEach((fn) => fn(r));
    },
    subscribe: (fn) => {
      listeners.add(fn);
      if (last) fn(last);
      return () => {
        listeners.delete(fn);
      };
    },
  };
}

export interface ScopeState {
  synth: Synth;
  playing: boolean;
  toggle: () => Promise<void>;
  readout: ReadoutBus;
}

export const ScopeContext = createContext<ScopeState | null>(null);

export function useScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error('useScope must be used within a ScopeProvider');
  return ctx;
}
