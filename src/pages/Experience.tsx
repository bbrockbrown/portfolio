import SectionHeader from '@/components/base/SectionHeader';
import { Timeline } from '@/components/experience/Timeline';

export default function Experience() {
  return (
    <section className='min-h-screen px-2 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 relative z-10'>
      <div className='glass p-4 sm:p-8 md:p-10 max-w-3xl mx-auto'>
        <SectionHeader title='Experience' />
        <Timeline />
      </div>
    </section>
  );
}
