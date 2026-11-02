import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

/** Toggle that names the theme you'd switch to ("light" while dark); an icon on phones. */
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
      <Icon aria-hidden='true' className='size-3.5 sm:hidden' />
      <span className='hidden sm:inline'>{next}</span>
    </button>
  );
}
