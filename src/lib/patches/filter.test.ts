import { describe, expect, it } from 'vitest';

import { isVisible, toggleMute, toggleSolo } from './filter';
import type { Project } from './types';

const proj = (tech: string[]): Project => ({
  id: 't',
  patch: 0,
  name: 't',
  category: 'WEB',
  tech,
  year: 2024,
  links: {},
  description: '',
});

const S = (...t: string[]) => new Set(t);

describe('isVisible — semantics table', () => {
  const cases: [string[], string[], string[], boolean][] = [
    // solo, mute, tech, expected
    [[], [], ['react'], true],
    [['react'], [], ['react', 'ts'], true],
    [['react'], [], ['ts'], false],
    [['react', 'audio'], [], ['audio'], true],
    [[], ['legacy'], ['react', 'legacy'], false],
    [['react'], ['legacy'], ['react', 'legacy'], false],
    [['react'], ['legacy'], ['react', 'ts'], true],
  ];
  it.each(cases)('solo=%j mute=%j tech=%j -> %s', (solo, mute, tech, expected) => {
    expect(isVisible(proj(tech), { solo: S(...solo), mute: S(...mute) })).toBe(expected);
  });
});

describe('toggle mutual exclusivity', () => {
  it('soloing a muted tag moves it from mute to solo', () => {
    const start = { solo: S(), mute: S('react') };
    const next = toggleSolo(start, 'react');
    expect(next.solo.has('react')).toBe(true);
    expect(next.mute.has('react')).toBe(false);
  });

  it('muting a soloed tag moves it from solo to mute', () => {
    const start = { solo: S('react'), mute: S() };
    const next = toggleMute(start, 'react');
    expect(next.mute.has('react')).toBe(true);
    expect(next.solo.has('react')).toBe(false);
  });

  it('toggling twice clears the tag', () => {
    const once = toggleSolo({ solo: S(), mute: S() }, 'react');
    const twice = toggleSolo(once, 'react');
    expect(twice.solo.size).toBe(0);
  });
});
