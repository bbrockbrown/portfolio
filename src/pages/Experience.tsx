import SectionHeader from '@/components/base/SectionHeader';
import { Timeline } from '@/components/experience/Timeline';

export default function Experience() {
  return (
    <section className='min-h-screen bg-background px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10'>
      <div className='max-w-3xl mx-auto pb-24'>
        <SectionHeader title='Experience' subtitle="Where I've studied and worked. Hover a track." />
        <Timeline />
      </div>
    </section>
  );
}
