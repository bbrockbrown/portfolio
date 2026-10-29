import { NavLink } from 'react-router-dom';

import { ModeToggle } from '@/components/mode-toggle';
import { useScope } from '@/lib/audio/scopeContext';
import { cn } from '@/lib/utils';

const items = [
  { label: 'home', to: '/' },
  { label: 'projects', to: '/projects' },
  { label: 'experience', to: '/experience' },
  { label: 'about', to: '/about' },
  { label: 'stats', to: '/stats' },
];

const itemClass = 'py-0.5 text-muted-foreground transition-colors hover:text-foreground sm:px-1';

export default function NavMenu() {
  const { playing, toggle } = useScope();

  return (
    <nav
      id='nav-menu'
      aria-label='Primary'
      className='glass fixed inset-x-0 top-3 mx-auto flex w-fit max-w-[calc(100vw-24px)] flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 rounded-2xl px-3 py-1.5 text-[11px] sm:gap-x-5 sm:rounded-full sm:px-5 sm:text-xs'
      style={{ zIndex: 50 }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => cn(itemClass, isActive && 'font-medium text-foreground')}
        >
          {item.label}
        </NavLink>
      ))}
      <ModeToggle className={itemClass} />
      {playing && (
        <button type='button' onClick={() => void toggle()} className={cn(itemClass, 'text-hot')}>
          ■ stop
        </button>
      )}
    </nav>
  );
}
