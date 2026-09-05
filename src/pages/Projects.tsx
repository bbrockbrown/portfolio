import { AsciiFieldBackground } from '@/components/AsciiFieldBackground';
import SectionHeader from '@/components/base/SectionHeader';
import { PatchList } from '@/components/patches/PatchList';

export default function Projects() {
  return (
    <>
      {/* Ambient plasma field behind the patch list — the one moving layer */}
      <AsciiFieldBackground />
      <section className='min-h-screen px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative z-10'>
        <div className='max-w-5xl mx-auto'>
          <SectionHeader
            title='Projects'
            subtitle='A patch library — each project is a preset. Solo or mute tags to filter the browser.'
          />
          <PatchList />
        </div>
      </section>
    </>
  );
}
