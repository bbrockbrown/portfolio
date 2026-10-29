import { useTheme } from '@/components/theme-provider';

/** Text toggle that names the theme you'd switch to ("light" while dark). */
export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type='button'
      onClick={() => setTheme(next)}
      className={className}
      aria-label={`Switch to ${next} theme`}
    >
      {next}
    </button>
  );
}
