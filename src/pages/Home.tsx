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

    // Set CSS custom property for dynamic viewport height (mobile fix)
    let viewportTimeout: NodeJS.Timeout;
    let lastHeight = window.innerHeight;
    
    const setViewportHeight = () => {
      const currentHeight = window.innerHeight;
      const heightChange = currentHeight - lastHeight;
      
      // Only update if height INCREASED (browser UI hidden, more space available)
      // Skip when height decreases (browser UI appearing) to avoid choppy updates
      if (heightChange > 50) {
        const vh = currentHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        lastHeight = currentHeight;
      }
    };

    const debouncedSetViewportHeight = () => {
      clearTimeout(viewportTimeout);
      viewportTimeout = setTimeout(setViewportHeight, 300);
    };

    // Set initial value
    setViewportHeight();

    // Update on resize and orientation change with debouncing
    window.addEventListener('resize', debouncedSetViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight); // Immediate for orientation

    return () => {
      clearTimeout(timer);
      clearTimeout(viewportTimeout);
      window.removeEventListener('resize', debouncedSetViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
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
    <div className='relative'>
      {/* P5 Background - only on home page */}
      <div className='fixed inset-0 z-0'>
        <P5Sketch refreshKey={p5RefreshKey} />
      </div>

      {/* Main content container */}
      <div className='relative z-10'>
        {/* Hero section with P5 background */}
        <section className='mobile-full-height flex items-center justify-center'>
          <div
            className={`
                text-center text-white px-8 py-12 rounded-lg backdrop-blur-sm bg-black/20
                transition-all duration-1000 ease-out
                ${showText ? 'opacity-100 scale-100 animate-bounce-gentle' : 'opacity-0 scale-75'}
              `}
          >
            <h1 className='text-4xl md:text-6xl font-bold mb-4'>Hi there,</h1>
            <p className='text-xl md:text-2xl mb-2'>
              My name is <span className='text-blue-400'>Brock Brown</span>.
            </p>
            <p className='text-lg md:text-xl'>
              I am a <span className='text-green-400'>fullstack engineer</span>.
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
              className='p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200'
              onClick={handleWorkRef}
              title='Scroll to projects'
            >
              <ChevronDown color='white' className='w-6 h-6' />
            </button>
          </div>
        </section>

        {/* Scrollable content section with dark background */}
        <section className='min-h-screen bg-gray-900 px-8 py-16'>
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
        </section>

        {/* Additional content sections can go here */}
        <section ref={workRef} className='min-h-screen bg-gray-800 px-8 py-16'>
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
