import { useState, useEffect } from 'react';

export default function Silly() {
  const [scrollY, setScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      console.log('currScroll', currentScroll)
      setScrollY(currentScroll);
      
      // Mark that user has scrolled if they go beyond a threshold
      if (currentScroll > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always show the text, but it will be positioned above content
  const isVisible = hasScrolled && scrollY <= 10;
  console.log("scrollY is", scrollY, "hasScrolled", hasScrolled, 'so visible is', isVisible)

  return (
    <div 
      className={`${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '200px',
        zIndex: 0, 
        pointerEvents: 'none'
      }}
    >
      <div className='absolute top-32 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        nothing to see here.
      </div>
      <div className='absolute top-24 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        why are you still going...
      </div>
      <div className='absolute top-16 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        there's literally nothing here
      </div>
      <div className='absolute top-8 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        okay you've lost it
      </div>
      <div className='absolute top-2 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        how far will you go?
      </div>
    </div>
  );
}
