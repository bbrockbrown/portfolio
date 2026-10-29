import SectionHeader from '@/components/base/SectionHeader';
import { PatchList } from '@/components/patches/PatchList';

export default function Projects() {
  return (
    <section className='min-h-screen px-2 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 relative z-10'>
      <div className='glass p-4 sm:p-8 md:p-10 max-w-4xl mx-auto'>
        <SectionHeader title='Projects' />
        <PatchList />
      </div>
    </section>
  );
}
