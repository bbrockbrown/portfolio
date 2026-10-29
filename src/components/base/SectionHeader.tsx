import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`
        mb-8 sm:mb-10 transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <h1 className='text-lg sm:text-xl font-medium text-foreground'>{title.toLowerCase()}</h1>
      {subtitle && <p className='mt-1 text-xs sm:text-sm text-muted-foreground'>{subtitle}</p>}
    </div>
  );
}
