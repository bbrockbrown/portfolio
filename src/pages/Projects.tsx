import { projects } from '@/utils/projects';
import ProjectCard from '@/components/composite/ProjectCard';
import SectionHeader from '@/components/base/SectionHeader';

export default function Projects() {
  return (
    <section
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
  );
}
