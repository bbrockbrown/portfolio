// Patch-browser data model. Projects are presented like a synth's preset library:
// each project is a "patch" with a stable number and a waveform signature.

export type PatchType = 'WEB' | 'AUDIO' | 'TOOL' | 'SYSTEMS' | 'EXPERIMENT';

export interface Project {
  id: string; // stable slug
  patch: number; // stable patch number; render zero-padded to 3. NEVER the array index.
  name: string;
  category: PatchType;
  tech: string[]; // canonical tag ids (see tag registry)
  year: number;
  status?: 'active' | 'wip' | 'archived';
  links: { github?: string; demo?: string; writeup?: string };
  description: string; // one-liner
  // Waveform seed; defaults to `name`. Set explicitly so a future rename can't
  // silently change the project's mark.
  sigSeed?: string;
  init?: boolean; // exactly one project has this (the pinned "start here" row)
}

export interface Tag {
  id: string; // canonical slug, e.g. 'react'
  label: string; // display form, e.g. 'REACT'
}
