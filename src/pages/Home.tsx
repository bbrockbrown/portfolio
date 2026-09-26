import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { AsciiFieldBackground } from '@/components/AsciiFieldBackground';
import Silly from '@/components/composite/Silly';

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className='relative'>
      {/* Ambient ASCII scalar-field background, fixed to the viewport */}
      <AsciiFieldBackground />
      {/* Easter egg - appears when scrolling above content */}
      <Silly />
      {/* Main content container */}
      <div className='relative z-10'>
        {/* Hero section */}
        <section className='full-viewport-height flex items-center justify-center relative overflow-hidden'>
          <div
            className={`
                text-left text-white p-4 md:p-8 rounded-lg backdrop-blur-sm bg-background/75
                transition-all duration-1000 ease-out
                w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%]
                max-h-[85vh] overflow-y-auto relative z-10
                ${
                  showContent ? 'opacity-100 scale-100 animate-bounce-gentle' : 'opacity-0 scale-75'
                }
              `}
          >
            <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-4'>
              Hi there,
            </h1>
            <p className='text-base sm:text-lg md:text-xl lg:text-2xl mb-1 md:mb-2'>
              My name is <span className='font-bold'>Brock Brown</span>.
            </p>
            <p className='text-sm sm:text-sm md:text-base lg:text-lg mb-1 md:mb-2 leading-relaxed'>
              I'm a junior @ Northwestern University studying computer science with a passion for
              bringing ideas to life. Whether it's developing impactful software or crafting
              math-driven animations like the one behind this page, I'm always eager to learn and
              grow through new opportunities.
            </p>
            <p className='text-sm sm:text-sm md:text-base mt-1 md:mt-2 lg:text-lg mb-2 md:mb-3 leading-relaxed'>
              Check out some of the things I have built{' '}
              <Link to='/projects' className='font-bold underline underline-offset-2 decoration-transparent hover:decoration-white ease-in transition-all'>
                here
              </Link>
              !
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
