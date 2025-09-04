import { useEffect, useState } from 'react';
import { House, FolderClosed, PersonStanding, ChartColumn, type LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavMenuProps {
  className?: string;
}

interface NavItem {
  id: string;
  to: string;
  icon: LucideIcon;
}

const items: NavItem[] = [
  {
    id: 'Home',
    to: '/',
    icon: House,
  },
  {
    id: 'Projects',
    to: '/projects',
    icon: FolderClosed,
  },
  {
    id: 'About',
    to: '/about',
    icon: PersonStanding,
  },
  {
    id: 'Stats',
    to: '/stats',
    icon: ChartColumn,
  },
];

export default function NavMenu({ className }: NavMenuProps) {
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      const timer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowAnimation(true);
    }
  }, [location.pathname, isHomePage]);

  return (
    <div
      className={`fixed flex flex-row gap-1 left-1/2 bottom-8 -translate-x-1/2 border backdrop-blur-lg z-50 rounded-md px-3 py-2 ${className}
                  ${isHomePage ? 'transition-all duration-1000 ease-out' : ''}
                  ${
                    showAnimation
                      ? `opacity-100 scale-100 ${isHomePage ? 'animate-bounce-gentle' : ''}`
                      : 'opacity-0 scale-75'
                  }`}
    >
      {items.map((item: NavItem) => {
        const IconComponent = item.icon;
        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link
                key={item.id}
                to={item.to}
                className='group p-2 hover:bg-gray-700/50 rounded-md transition-colors'
              >
                <IconComponent className='w-5 h-5 text-gray-400 group-hover:text-white transition-all' />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.id}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
