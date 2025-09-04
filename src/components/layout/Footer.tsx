import { Github, Linkedin, Instagram, Mail, Check, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export default function Footer() {
  const [emailCopied, setEmailCopied] = useState(false);
  const email = 'brockbrown46@gmail.com';

  const handleToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
    <footer className='relative flex flex-row justify-center bg-background md:w-[60%] w-[75%] justify-self-center border-t border-gray-800 py-8 px-4 sm:px-6 md:px-8'>
      <div className='max-w-7xl w-full'>
        <div className='flex flex-row justify-center items-start space-y-4'>
          {/* Social Links */}
          <div className='flex space-x-6'>
            <a
              href='https://github.com/bbrockbrown'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-white transition-colors duration-200'
              aria-label='GitHub'
            >
              <Github className='w-6 h-6' />
            </a>
            <a
              href='https://www.linkedin.com/in/bbrockbrown/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-white transition-colors duration-200'
              aria-label='LinkedIn'
            >
              <Linkedin className='w-6 h-6' />
            </a>
            <a
              href='https://www.instagram.com/bbrockbrown/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-400 hover:text-white transition-colors duration-200'
              aria-label='Instagram'
            >
              <Instagram className='w-6 h-6' />
            </a>
            <button
              onClick={handleCopyEmail}
              className='text-gray-400 hover:text-white transition-colors duration-200 relative'
              aria-label='Copy email address'
              title={emailCopied ? 'Email copied!' : `Copy ${email}`}
            >
              <div className='relative'>
                <Mail
                  className={`w-6 h-6 transition-all duration-300 ${
                    emailCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                  }`}
                />
                <Check
                  className={`w-6 h-6 text-green-400 absolute inset-0 transition-all duration-300 ${
                    emailCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                />
                <span
                  className={`absolute text-xs whitespace-nowrap -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded transition-all duration-300 ${
                    emailCopied
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  Email copied!
                </span>
              </div>
              {/* To top */}
            </button>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className='absolute right-0 text-gray-400 hover:text-white transition-colors duration-200'
                onClick={handleToTop}
                title='Scroll to top'
              >
                <ChevronUp
                  strokeWidth={2}
                  className='w-8 h-8 stroke-gray-400 hover:stroke-white duration-200 transition-all'
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to top</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  );
}
