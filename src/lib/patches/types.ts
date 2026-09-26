// Project index data model. Projects keep a waveform "signature" mark and a
// display number, but the list is ordered newest-first and filtered by category.

export type PatchType = 'WEB' | 'AUDIO' | 'TOOL' | 'SYSTEMS' | 'EXPERIMENT';

export interface Project {
  id: string; // stable slug
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
}

export interface Tag {
  id: string; // canonical slug, e.g. 'react'
  label: string; // display form, e.g. 'REACT'
}
