import { useEffect, useState, useRef } from 'react';
import P5Sketch from '@/components/sketches/P5Sketch';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function Home() {
  const [showText, setShowText] = useState(false);
  const [p5RefreshKey, setP5RefreshKey] = useState(0);
  const workRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleWorkRef = () => {
    if (!workRef || !workRef.current) return;

    workRef.current.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleP5Refresh = () => {
    setP5RefreshKey((prev) => prev + 1);
  };

  return (
    <div className='relative bg-background'>
      {/* P5 Background - only on home page */}
      <div className='fixed inset-0 z-0 w-full h-full'>
        <P5Sketch refreshKey={p5RefreshKey} />
      </div>

      {/* Main content container */}
      <div className='relative z-10'>
        {/* Hero section with P5 background */}
        <section className='full-viewport-height flex items-center justify-center'>
          <div
            className={`
                text-left text-white p-4 md:p-8 rounded-lg backdrop-blur-sm bg-background/10
                transition-all duration-1000 ease-out 
                w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%]
                max-h-[85vh] overflow-y-auto
                ${showText ? 'opacity-100 scale-100 animate-bounce-gentle' : 'opacity-0 scale-75'}
              `}
          >
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-4'>Hi there,</h1>
            <p className='text-lg sm:text-xl md:text-xl lg:text-2xl mb-1 md:mb-2'>
              My name is <span className='font-bold'>Brock Brown</span>.
            </p>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl mb-1 md:mb-2 leading-relaxed'>
              I'm a junior @ Northwestern University studying computer science with a passion for
              bringing ideas to life. Whether it's developing impactful software or crafting
              math-driven animations like the one behind this page, I'm always eager to learn and
              grow through new opportunities.
            </p>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl mb-2 md:mb-3'>
              Check out some of the things I have built below!
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
          {/* Navigation buttons */}
          <div className='absolute translate-y-[45vh] flex gap-4'>
            <button
              className='p-2 rounded-full bg-black/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200'
              onClick={handleWorkRef}
              title='Scroll to projects'
            >
              <ChevronDown color='white' strokeWidth={2} className='md:w-10 w-7 md:h-10 h-7' />
            </button>
          </div>
        </section>

        {/* Scrollable content section with dark background */}
        {/* <section className='min-h-screen bg-gray-900 px-8 py-16'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-white mb-8'>About Me</h2>
            <div className='text-gray-300 space-y-6'>
              <p>
                Welcome to my portfolio! I'm passionate about creating innovative web applications
                and solving complex problems through code.
              </p>
              <p>
                I specialize in modern web technologies including React, Node.js, TypeScript, and
                various database systems. I love building user-friendly interfaces and robust
                backend systems.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing to
                open source projects, or working on creative coding experiments like the animation
                you see above.
              </p>
            </div>
          </div>
        </section> */}

        {/* Additional content sections can go here */}
        <section ref={workRef} className='min-h-screen bg-[rgb(20,20,20)] px-8 py-16 relative z-10'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-white mb-8'>Projects</h2>
            <div className='text-gray-300'>
              <p>This section can showcase your projects and work...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
