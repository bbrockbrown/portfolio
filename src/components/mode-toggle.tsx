import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

/** Sun/moon toggle showing the theme you'd switch to (sun while dark). */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';
  const Icon = next === 'light' ? Sun : Moon;

  return (
    <button
      type='button'
      onClick={() => setTheme(next)}
      className={cn('inline-flex items-center', className)}
      aria-label={`Switch to ${next} theme`}
    >
      <Icon aria-hidden='true' className='size-3.5 sm:size-4' />
    </button>
  );
}
