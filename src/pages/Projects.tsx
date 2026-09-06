import SectionHeader from '@/components/base/SectionHeader';
import { PatchList } from '@/components/patches/PatchList';

export default function Projects() {
  return (
    <section className='min-h-screen bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10'>
      <div className='max-w-4xl mx-auto'>
        <SectionHeader
          title='Projects'
          subtitle="Things I've built, newest first. Filter by type."
        />
        <PatchList />
      </div>
    </section>
  );
}
