import { motion, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Instagram, Mail, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import me from '@/assets/me.jpeg';

export default function About() {
  const location = useLocation();
  const [emailCopied, setEmailCopied] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const email = 'brockbrown46@gmail.com';

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <motion.div
      className='bg-background px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10 min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='max-w-4xl mx-auto space-y-8 sm:space-y-10 md:space-y-12'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-center'>About Me</h1>
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
            <div className='w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 bg-gray-800/50 rounded-2xl overflow-hidden'>
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
            {/* Paragraph 1 - Journey into CS */}
            <div className='space-y-3 md:space-y-4'>
              <p className='text-gray-300 leading-relaxed text-base sm:text-lg'>
                I'm a junior at Northwestern University studying computer science, though my journey
                into tech wasn't traditional. Coming into college, I had very little programming
                experience—just curiosity and a willingness to learn. What transformed my path were
                the incredible people I met through campus organizations and coding clubs. Their
                mentorship and collaborative spirit not only taught me the fundamentals but showed
                me how welcoming and dynamic the tech community could be.
              </p>
            </div>

            {/* Paragraph 2 - Growth and Passion */}
            <div className='space-y-3 md:space-y-4'>
              <p className='text-gray-300 leading-relaxed text-base sm:text-lg'>
                What excites me most about software development is the intersection of creativity
                and problem-solving. Whether I'm building interactive web experiences, crafting data
                visualizations, or working on full-stack applications, I'm constantly amazed by how
                code can bring ideas to life. I'm particularly drawn to projects that combine
                technical complexity with meaningful user impact.
              </p>
            </div>

            {/* Paragraph 3 - Personal Life */}
            <div className='space-y-3 md:space-y-4'>
              <p className='text-gray-300 leading-relaxed text-base sm:text-lg'>
                Outside of coding, I'm passionate about staying active and exploring new challenges.
                You'll often find me at the gym, training for endurance events, or experimenting
                with new recipes in the kitchen—baking has become my favorite creative outlet. I'm
                also an avid music listener and gamer, always eager to discover new artists or dive
                into immersive game worlds. These diverse interests keep me balanced and often
                inspire unexpected solutions to technical problems.
              </p>
            </div>

            {/* Paragraph 4 - Looking Forward */}
            <div className='space-y-3 md:space-y-4'>
              <p className='text-gray-300 leading-relaxed text-base sm:text-lg'>
                Looking ahead, I'm excited to contribute to teams that value both technical
                excellence and collaborative growth. I believe the best software comes from diverse
                perspectives and continuous learning—principles that have shaped my journey from a
                CS newcomer to someone passionate about building meaningful technology.
              </p>
            </div>

            {/* Social Links Section */}
            <motion.div
              id='connect'
              className={`pt-4 md:pt-5 border-t border-gray-800 clear-both mb-16 md:mb-7 relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className='flex items-center justify-center space-x-4 sm:space-x-6'>
                <a
                  href='https://github.com/bbrockbrown'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 p-2'
                  aria-label='GitHub'
                >
                  <Github className='w-7 h-7 sm:w-8 sm:h-8' />
                </a>
                <a
                  href='https://www.linkedin.com/in/bbrockbrown/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 p-2'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='w-7 h-7 sm:w-8 sm:h-8' />
                </a>
                <a
                  href='https://www.instagram.com/bbrockbrown/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 p-2'
                  aria-label='Instagram'
                >
                  <Instagram className='w-7 h-7 sm:w-8 sm:h-8' />
                </a>
                <button
                  onClick={handleCopyEmail}
                  className='text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 relative p-2'
                  aria-label='Copy email address'
                  title={emailCopied ? 'Email copied!' : `Copy ${email}`}
                >
                  <div className='relative'>
                    <Mail
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-200 ${
                        emailCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                      }`}
                    />
                    <Check
                      className={`w-7 h-7 sm:w-8 sm:h-8 text-green-400 absolute inset-0 transition-all duration-200 ${
                        emailCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    />
                    <span
                      className={`absolute text-xs whitespace-nowrap -top-12 sm:-top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded transition-all duration-200 ${
                        emailCopied
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                    >
                      Email copied!
                    </span>
                  </div>
                </button>
              </div>
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
