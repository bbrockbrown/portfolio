import { useState, useEffect } from 'react';

export default function Silly() {
  const [isVisible, setIsVisible] = useState(false);

  // On mount, wait 1.5sec before rendering
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1500);
  }, []);
  return (
    <div className={`${isVisible ? '' : 'hidden'}`}>
      <div className='fixed top-4 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm'>
        nothing to see here.
      </div>
      <div className='fixed top-14 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm '>
        why are you still going...
      </div>
      <div className='fixed top-24 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm '>
        there's literally nothing here
      </div>
      <div className='fixed top-48 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm '>
        okay you've lost it
      </div>
      <div className='fixed top-60 left-1/2 -translate-x-1/2 z-50 text-white/80 text-sm '>
        how far will you go?
      </div>
    </div>
  );
}
