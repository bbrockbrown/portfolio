import { projects } from '@/lib/patches/data';

import { PatchRow } from './PatchRow';

// Newest-first display order (data is authored that way; sort defensively by year).
const ordered = [...projects].sort((a, b) => b.year - a.year);

export function PatchList() {
  return (
    <ol className='border-t border-border'>
      {ordered.map((p, i) => (
        <PatchRow key={p.id} project={p} index={i + 1} />
      ))}
    </ol>
  );
}
