import { useCallback, useEffect, useRef, useState } from 'react';

import {
  emptyFilters,
  type FilterState,
  toggleMute as applyMute,
  toggleSolo as applySolo,
} from '@/lib/patches/filter';
import { TAG_LABELS } from '@/lib/patches/tags';

const URL_DEBOUNCE_MS = 200;

function parseIds(raw: string | null): Set<string> {
  const out = new Set<string>();
  if (!raw) return out;
  for (const part of raw.split(',')) {
    const id = part.trim().toLowerCase();
    if (id in TAG_LABELS) out.add(id); // validate against the registry; drop unknowns silently
  }
  return out;
}

function readFromUrl(): FilterState {
  if (typeof window === 'undefined') return emptyFilters();
  const params = new URLSearchParams(window.location.search);
  return { solo: parseIds(params.get('solo')), mute: parseIds(params.get('mute')) };
}

function serialize(set: Set<string>): string {
  return [...set].sort().join(',');
}

/**
 * Owns solo/mute filter state and round-trips it through the URL query string
 * (`?solo=react,audio&mute=legacy`) with debounced replaceState — shareable
 * filtered views, no history spam.
 */
export function usePatchFilters() {
  const [filters, setFilters] = useState<FilterState>(readFromUrl);

  const toggleSolo = useCallback((tag: string) => setFilters((f) => applySolo(f, tag)), []);
  const toggleMute = useCallback((tag: string) => setFilters((f) => applyMute(f, tag)), []);
  const clear = useCallback(() => setFilters(emptyFilters()), []);

  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const solo = serialize(filters.solo);
      const mute = serialize(filters.mute);
      if (solo) params.set('solo', solo);
      else params.delete('solo');
      if (mute) params.set('mute', mute);
      else params.delete('mute');
      const qs = params.toString();
      window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }, URL_DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [filters]);

  return { filters, toggleSolo, toggleMute, clear };
}
