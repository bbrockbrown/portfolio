
import { motion } from 'motion/react';
import { Github, Linkedin, Instagram, Mail, Check } from 'lucide-react';
import { useState } from 'react';

export default function About() {
  const [emailCopied, setEmailCopied] = useState(false);
  const email = 'brockbrown46@gmail.com';

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
      className="min-h-screen bg-background text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Content Section */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Paragraph 1 */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            {/* Paragraph 2 */}
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed text-lg">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            {/* Social Links Section */}
            <motion.div
              className="pt-8 border-t border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">Let's Connect</h3>
              <div className="flex space-x-6">
                <a
                  href="https://github.com/bbrockbrown"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-8 h-8" />
                </a>
                <a
                  href="https://www.linkedin.com/in/bbrockbrown/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-8 h-8" />
                </a>
                <a
                  href="https://www.instagram.com/bbrockbrown/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-8 h-8" />
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110 relative"
                  aria-label="Copy email address"
                  title={emailCopied ? 'Email copied!' : `Copy ${email}`}
                >
                  <div className="relative">
                    <Mail
                      className={`w-8 h-8 transition-all duration-300 ${
                        emailCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                      }`}
                    />
                    <Check
                      className={`w-8 h-8 text-green-400 absolute inset-0 transition-all duration-300 ${
                        emailCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    />
                    <span
                      className={`absolute text-xs whitespace-nowrap -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded transition-all duration-300 ${
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

          {/* Image Section */}
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="w-80 h-96 bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50">
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <span className="text-gray-400 text-lg">Headshot Placeholder</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}