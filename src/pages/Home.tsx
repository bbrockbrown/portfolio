import { PatchCard } from '@/components/home/PatchCard';

import '@/components/home/home.css';

// The spectrogram and its readout are site-wide (ScopeBackground in App);
// the homepage adds the patch card that drives them.
export default function Home() {
  return (
    <div className='home'>
      {/* <NowPlayingCard /> */}
      <section className='full-viewport-height'>
        <PatchCard />
      </section>
    </div>
  );
}
