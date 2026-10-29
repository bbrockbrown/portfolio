import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import me from '@/assets/me.webp';
import { ScopeTrace } from '@/components/about/ScopeTrace';

const LINKS = [
  { href: 'https://github.com/bbrockbrown', label: 'github' },
  { href: 'https://www.linkedin.com/in/bbrockbrown/', label: 'linkedin' },
  { href: 'https://open.spotify.com/user/bbrockbrown', label: 'spotify' },
];

export default function About() {
  const location = useLocation();
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const paragraph = 'text-foreground/80 leading-relaxed text-sm sm:text-[15px]';

  // On mount, check if they clicked the handshake and scroll to connect section
  useEffect(() => {
    if (location.hash === '#connect') {
      // Smooth scroll to the connect section
      setTimeout(() => {
        const connectElement = document.getElementById('connect');
        if (connectElement) {
          connectElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);
    }
  }, [location.hash]);

  const openImagePopup = () => {
    setImagePopupOpen(true);
  };

  const closeImagePopup = () => {
    setImagePopupOpen(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImagePopup();
      }
    };

    if (imagePopupOpen) {
      window.addEventListener('keydown', handleKeydown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [imagePopupOpen]);

  return (
    <motion.div
      className='min-h-screen px-2 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 relative z-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='glass p-4 sm:p-8 md:p-10 max-w-4xl mx-auto space-y-8 sm:space-y-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1 className='text-lg sm:text-xl font-medium text-foreground'>about me</h1>
        </motion.div>

        {/* Content with floating image */}
        <div className='relative'>
          {/* Floating Image */}
          <motion.div
            className='flex justify-center md:float-right md:ml-8 mb-6 md:mb-8'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className='w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 bg-muted/50 rounded-2xl overflow-hidden'>
              <img
                src={me}
                alt='Brock Brown'
                className='w-full h-full object-cover cursor-pointer transition-transform hover:scale-105'
                onClick={openImagePopup}
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className='space-y-6 md:space-y-8'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Paragraph 1 - Intro / Origin */}
            <p className={paragraph}>hi!</p>
            <p className={paragraph}>
              i'm a senior studying CS at Northwestern, graduating December 2026. i showed up to
              college with basically zero programming experience. i just knew that typing certain
              things in the right order made cool stuff happen. what actually got me hooked was the
              people, especially at DISC 🫶. they taught me the fundamentals and made all of it feel
              way less intimidating than it had any right to be. now i'm DISC's Co-President, so i
              get to do the same thing for a 300+ member club. i also TA data structures &amp;
              algorithms every now and then.
            </p>
            {/* Paragraph 2 - What I Like Building */}
            <p className={paragraph}>
              my favorite problems are the ones where i get to be a little creative. sometimes
              that's a full-stack app, sometimes it's an interactive thing on the web, and lately
              it's a lot of tooling around AI agents. i love projects with real technical depth that
              real people end up using. i also love projects that are completely silly and serve no
              purpose at all (both count imo).
            </p>
            {/* Paragraph 3 - Work Experience */}
            <p className={paragraph}>
              this past summer i was on Apple's Siri team, writing Swift for audio playback and
              controls and going pretty deep on App Intents. before that, i was a full-stack intern
              at Barton Studio in San Diego, where i got to work directly with clients on both of my
              projects. on campus, i'm on the Mayfest Productions tech team. we shipped the official
              Dillo Day app (10,000+ downloads!), and right now i'm building internal tools that
              make life easier for the teams around us.
            </p>
            {/* Paragraph 4 - Personal Life */}
            <p className={paragraph}>
              outside of code, i looooove the gym and anything endurance. i run marathons, and i'm
              always eyeing the next one. music is a huge part of my life: hyperpop, experimental
              electronic, anything SOPHIE-adjacent. lately i've been making my own in Ableton and
              live coding it in Strudel (the homepage is a little nod to that). i also bake (my
              favorite 'creative' outlet) and game whenever i can find the time.
            </p>
            {/* Paragraph 5 - Looking Forward */}
            <p className={paragraph}>
              next up, i'm looking for my first full-time role starting in 2027. i want to be
              somewhere that builds ambitious stuff and takes the time to get it right, especially
              where AI meets products people actually use. if that sounds like your team, i'd love
              to chat.
            </p>
            {/* Social Links Section */}
            <motion.div
              id='connect'
              className='flex flex-row items-center gap-3 sm:gap-4 pt-4 md:pt-5 border-t border-border clear-both mb-16 md:mb-7 relative'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ScopeTrace side='left' active={linkHovered} className='min-w-6 flex-1' />
              <span className='shrink-0 whitespace-nowrap'>
                {LINKS.map((l, i) => (
                  <span key={l.href} className='shrink-0 whitespace-nowrap'>
                    {i > 0 && ' · '}
                    <a
                      className={'text-foreground/80 shrink-0 whitespace-nowrap'}
                      href={l.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      onPointerEnter={() => setLinkHovered(true)}
                      onPointerLeave={() => setLinkHovered(false)}
                      onFocus={() => setLinkHovered(true)}
                      onBlur={() => setLinkHovered(false)}
                    >
                      {l.label}
                    </a>
                  </span>
                ))}
              </span>
              <ScopeTrace side='right' active={linkHovered} className='min-w-6 flex-1' />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Image Popup Modal */}
      <AnimatePresence>
        {imagePopupOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 rounded-lg overflow-hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePopup}
          >
            <motion.div
              className='relative w-[90vw] h-[80vh] max-w-4xl max-h-screen rounded-lg overflow-hidden bg-black flex items-center justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image with overlays */}
              <div className='relative max-w-full max-h-full rounded-lg overflow-hidden'>
                <img
                  src={me}
                  alt='Brock Brown'
                  className='max-w-full max-h-full object-contain rounded-lg'
                />

                {/* Close Button */}
                <button
                  onClick={closeImagePopup}
                  className='absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors'
                  aria-label='Close image'
                >
                  <X className='w-6 h-6' />
                </button>

                {/* Caption */}
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg'>
                  <h3 className='text-white font-semibold text-xl mb-2'>Me •ᴗ•</h3>
                  <p className='text-gray-300 text-sm'>29029 Trail Event - July 10, 2025</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
