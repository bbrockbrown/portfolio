import { useEffect, useState } from 'react';
import P5Sketch from '@/components/sketches/P5Sketch';
import { RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Silly from '@/components/composite/Silly';
import { Link } from 'react-router';

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [p5RefreshKey, setP5RefreshKey] = useState(0);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleP5Refresh = () => {
    setP5RefreshKey((prev) => prev + 1);
  };

  return (
    <div className='relative bg-background'>
      {/* Easter egg - appears when scrolling above content */}
      <Silly />
      {/* Main content container */}
      <div className='relative z-10'>
        {/* Hero section with P5 background */}
        <section className='full-viewport-height flex items-center justify-center relative overflow-hidden'>
          {/* P5 Background - contained within this section */}
          <div className='absolute inset-0 z-0'>
            <P5Sketch refreshKey={p5RefreshKey} />
          </div>
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
            <p className='text-xs sm:text-xs md:text-xs mt-1 opacity-80'>
              If you want to see this background do its magic again, click the refresh button at the
              top right!
            </p>
          </div>
          {/* Refresh button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className='absolute top-3 right-3 p-2 rounded-full w-fit bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200'
                onClick={handleP5Refresh}
              >
                <RotateCcw
                  color='white'
                  className='w-6 h-6 hover:rotate-[-360deg] transition-all duration-1000'
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh cool background ッ</p>
            </TooltipContent>
          </Tooltip>
        </section>
      </div>
    </div>
  );
}
