import { useEffect, useState } from 'react';
import P5Sketch from '@/components/sketches/P5Sketch';

export default function Home() {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='relative'>
      {/* P5 Background - only on home page */}
      <div className='fixed inset-0 z-0'>
        <P5Sketch />
      </div>

      {/* Main content container */}
      <div className='relative z-10'>
        {/* Hero section with P5 background */}
        <section className='min-h-screen flex items-center justify-center'>
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
        <section className='min-h-screen bg-gray-800 px-8 py-16'>
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
