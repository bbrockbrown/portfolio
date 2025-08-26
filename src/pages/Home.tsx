import { useEffect, useState, useRef } from 'react';
import P5Sketch from '@/components/sketches/P5Sketch';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ProjectCard from '@/components/composite/ProjectCard';
import SectionHeader from '@/components/base/SectionHeader';
import Footer from '@/components/layout/Footer';
import { projects } from '@/utils/projects';
import Silly from '@/components/composite/Silly';

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
                ${showText ? 'opacity-100 scale-100 animate-bounce-gentle' : 'opacity-0 scale-75'}
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
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4'>
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

        {/* Projects Section */}
        <section
          ref={workRef}
          className='min-h-screen bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10'
        >
          <div className='max-w-7xl mx-auto'>
            <SectionHeader
              title='Projects'
              subtitle="Here are some of the things I've built. Each project represents a unique challenge and learning experience."
            />

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20'>
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    liveUrl={project.liveUrl}
                    githubUrl={project.githubUrl}
                    technologies={project.technologies}
                    animationDirection={index % 2 === 0 ? 'left' : 'right'}
                    delay={index * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
