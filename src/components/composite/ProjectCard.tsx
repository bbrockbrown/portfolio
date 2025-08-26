import { ExternalLink, Github } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import TechBadge from './TechBadge';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string | null;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  animationDirection: 'left' | 'right';
  delay?: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  liveUrl,
  githubUrl,
  technologies,
  animationDirection,
  delay = 0,
}: ProjectCardProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const animationClass = isVisible
    ? 'opacity-100 translate-x-0'
    : `opacity-0 ${animationDirection === 'left' ? '-translate-x-24' : 'translate-x-24'}`;

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 ease-out
        ${animationClass}
        w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl
      `}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      <div className='bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
        {/* Project Image */}
        <div className='aspect-video w-full overflow-hidden bg-gray-700'>
          {image ? (
            <img
              src={image}
              alt={title}
              className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'
            />
          ) : (
            <div className='w-full h-full bg-gray-600 object-cover transition-transform duration-300 hover:scale-110' />
          )}
        </div>

        {/* Project Content */}
        <div className='p-4 sm:p-6'>
          <h3 className='text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3'>{title}</h3>
          <p className='text-sm sm:text-base text-gray-300 mb-3 leading-relaxed'>{description}</p>

          {/* Tech Badges */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {technologies.map((tech, index) => (
              <TechBadge
                key={tech}
                tech={tech}
                index={index}
                direction={animationDirection}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            {liveUrl && (
              <a
                href={liveUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200'
              >
                <ExternalLink className='w-4 h-4' />
                <span className='hidden sm:inline'>Live Demo</span>
                <span className='sm:hidden'>Demo</span>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors duration-200'
              >
                <Github className='w-4 h-4' />
                <span className='hidden sm:inline'>Source</span>
                <span className='sm:hidden'>Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
