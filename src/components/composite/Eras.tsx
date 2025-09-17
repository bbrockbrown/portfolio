import { motion, AnimatePresence } from 'motion/react';
import { SwitchCamera, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import endurance from '@/assets/endurance.jpg';
import baking from '@/assets/baking.jpg';
import music from '@/assets/music.png';

interface Era {
  id: string;
  title: string;
  image_url: string;
  img_caption?: string[];
  bullets: string[];
  date: string;
}

export default function Eras() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const eras: Era[] = [
    {
      id: 'endurance',
      title: 'Endurance Enthusiast',
      image_url: endurance,
      img_caption: [
        'Top row: Mt. Elbert trail (1), 29209 trail, me contemplating life decisions @ 29029',
        "Bottom row: Chicago Marathon '23, Mt. Elbert trail (2), Lap branding @ 29029",
      ],
      bullets: [
        'Completed 3 marathons',
        '29029 challenge (29209ft in 36hrs)',
        'Hiked Mount Elbert, CO @ 14k ft',
      ],
      date: '2022-2025',
    },
    {
      id: 'music',
      title: 'Music Addict',
      image_url: music,
      img_caption: [
        'Top row: Zedd, Lana Del Rey, Charli XCX, Taylor Swift',
        'Bottom row: Maude Latour, Lorde, Beach House',
      ],
      bullets: [
        '150k+ listening minutes each year for past 3 years (104+ days of pure music)',
        'Avid concert goer',
      ],
      date: 'Ongoing',
    },
    {
      id: 'baking',
      title: 'Pineapple Cake Era',
      image_url: baking,
      img_caption: ["Isn't it beautiful??"],
      bullets: [
        '# Pineapple cakes baked this year: 18',
        'Have I baked anything else? No.',
        'May start a business for said cakes (jk)',
      ],
      date: '2025',
    },
    {
      id: 'kendama',
      title: 'Kendama Prodigy Era',
      image_url: '/placeholder-kendama.jpg',
      bullets: [
        'Played kendama for 4 years',
        'Won 3 tournaments at age 12',
        'Hand-eye coordinate === mega improved',
      ],
      date: 'Age 8-12',
    },
  ];

  useEffect(() => {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const key = e.key;
      if (key === 'Escape') closeImagePopup();
    });

    return () => window.removeEventListener('keydown', closeImagePopup);
  });

  const nextEra = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % eras.length);
  };

  const prevEra = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + eras.length) % eras.length);
  };

  const currentEra = eras[currentIndex];

  const openImagePopup = () => {
    if (!currentEra.image_url.includes('placeholder') && containerRef.current) {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile) {
        // On mobile, use larger dimensions for better viewing
        setContainerDimensions({
          width: window.innerWidth * 0.9,
          height: window.innerHeight * 0.7,
        });
      } else {
        // On desktop, use container dimensions
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
      setImagePopupOpen(true);
    }
  };

  const closeImagePopup = () => {
    setImagePopupOpen(false);
  };

  return (
    <motion.div
      className='border border-border rounded-lg p-6 bg-background/75 hover:bg-background/85 backdrop-blur-sm transition-all duration-300'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <SwitchCamera className='w-5 h-5 text-white' />
          <span className='text-white font-medium text-lg'>Niches/Eras</span>
        </div>
        <div className='bg-gray-800/60 px-3 py-1 rounded-full'>
          <span className='text-gray-300 text-sm font-medium'>Last 20 years</span>
        </div>
      </div>

      <AnimatePresence mode='wait' custom={direction}>
        <motion.div
          key={currentEra.id}
          custom={direction}
          className='flex md:flex-row flex-col md:items-start items-center md:text-start text-center gap-6'
          initial='enter'
          animate='center'
          exit='exit'
          variants={{
            enter: (direction: number) => ({
              opacity: 0,
              x: direction > 0 ? 20 : -20,
            }),
            center: {
              opacity: 1,
              x: 0,
            },
            exit: (direction: number) => ({
              opacity: 0,
              x: direction > 0 ? -20 : 20,
            }),
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Image Section */}
          <div className='flex-shrink-0 md:w-48 w-full h-auto md:h-32 bg-gray-800/50 rounded-lg overflow-hidden'>
            {currentEra.image_url.includes('placeholder') ? (
              <div className='w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>Image Placeholder</span>
              </div>
            ) : (
              <img
                src={currentEra.image_url}
                alt={currentEra.title}
                className='w-full h-full object-cover cursor-pointer transition-transform hover:scale-105'
                onClick={openImagePopup}
              />
            )}
          </div>

          {/* Content Section */}
          <div className='flex-1 space-y-4'>
            {currentEra.id === 'kendama' ? (
              <div>
                <h3 className='text-white font-semibold text-xl mb-2'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        className='underline decoration-1 decoration-gray-900/20 underline-offset-2 hover:text-gray-200/95 hover:decoration-gray-500 transition-all'
                        href='https://kendamausa.com/what-is-kendama/'
                        target='_blank'
                      >
                        Kendama
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side='top' align='start'>
                      <p>What is kendama?</p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  Prodigy Era
                </h3>
              </div>
            ) : (
              <div>
                <h3 className='text-white font-semibold text-xl mb-2'>{currentEra.title}</h3>
              </div>
            )}
            <ul className='space-y-2'>
              {currentEra.bullets.map((bullet, index) => (
                <li key={index} className='flex items-start text-gray-300 text-sm'>
                  <div className='w-1.5 h-1.5 bg-green-400 rounded-full mr-3 flex-shrink-0 mt-1.5'></div>
                  <span className='text-start'>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className='flex items-center justify-between mt-6'>
        <button
          onClick={prevEra}
          className='flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors'
        >
          <ChevronLeft className='w-4 h-4 text-gray-300' />
          <span className='text-gray-300 text-sm'>Previous</span>
        </button>

        <div className='flex space-x-2'>
          {eras.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-green-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextEra}
          className='flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors'
        >
          <span className='text-gray-300 text-sm'>Next</span>
          <ChevronRight className='w-4 h-4 text-gray-300' />
        </button>
      </div>

      {/* Image Popup Modal */}
      <AnimatePresence>
        {imagePopupOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 rounded-xl overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePopup}
          >
            <motion.div
              className='relative rounded-xl overflow-hidden'
              style={{
                width: containerDimensions.width,
                height: containerDimensions.height,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImagePopup}
                className='absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors'
                aria-label='Close image'
              >
                <X className='w-5 h-5' />
              </button>

              {/* Image */}
              <img
                src={currentEra.image_url}
                alt={currentEra.title}
                className='w-full h-full md:object-cover object-contain rounded-lg'
              />

              {/* Image Caption */}
              <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg'>
                {currentEra.img_caption ? (
                  <div>
                    <p className='text-white text-xs'>{currentEra.img_caption[0]}</p>
                    <p className='text-white text-xs'>{currentEra.img_caption[1]}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className='text-white font-semibold text-lg mb-1'>{currentEra.title}</h3>
                    <p className='text-gray-300 text-xs'>{currentEra.date}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
