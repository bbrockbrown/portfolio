import { useEffect, useState } from 'react';

export default function Silly() {
  const [isVisible, setIsVisible] = useState(false);

  // on mount, wait a second to render
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1500);
  }, []);

  if (!isVisible) return null;
  return (
    <div className='fixed top-0 left-0 w-full h-[200px] z-0 pointer-events-none opacity-100 transition-opacity duration-300'>
      <div className='absolute top-2 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        nothing to see here.
      </div>
      <div className='absolute top-12 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        why are you still going...
      </div>
      <div className='absolute top-22 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        there's literally nothing here
      </div>
      <div className='absolute top-32 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        okay you've lost it
      </div>
      <div className='absolute top-42 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        how far will you go?
      </div>
      <div className='absolute top-100 left-1/2 -translate-x-1/2 text-white/80 text-sm font-mono'>
        you played urself
      </div>
    </div>
  );
}
