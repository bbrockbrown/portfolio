import { getTopTracks, getRecentTracks, getTopArtists } from '@/lib/spotify';
import {
  type SpotifyTopArtistsResponse,
  type SpotifyRecentlyPlayedResponse,
  type SpotifyTopTracksResponse,
  type GitHubApiResponse,
} from '@/types';
import { useEffect, useState } from 'react';
import SectionHeader from '@/components/base/SectionHeader';
import StatsCard from '@/components/composite/StatsCard';
import SpotifyTrack from '@/components/composite/SpotifyTrack';
import SpotifyArtist from '@/components/composite/SpotifyArtist';
import ExpandableList from '@/components/composite/ExpandableList';
import Footer from '@/components/layout/Footer';
import GitHubActivity from '@/components/composite/GitHubActivity';
import { getContributionData } from '@/lib/github';
import Eras from '@/components/composite/Eras';

interface DailyLog {
  count: number;
  date: string;
}

interface KeyData {
  last_updated: string;
  recent_activity: DailyLog[];
  today_keystrokes: number;
  total_keystrokes: number;
}

export default function Stats() {
  const [keyData, setKeyData] = useState<KeyData | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTopTracksResponse | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyTopArtistsResponse | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyRecentlyPlayedResponse | null>(null);
  const [contributionData, setContributionData] = useState<GitHubApiResponse | null>(null);

  // on mount, get all stats data
  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch keystroke data
      const fetchKeyData = async (retryCount: number): Promise<void> => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_KEYSTROKE_API_URL}/api/portfolio-stats`
          );
          const data: KeyData = await response.json();
          if (data.recent_activity.length === 0 && retryCount < 20) {
            // sometimes need to wake up service
            console.log('retrying key data; current try', retryCount)
            await fetchKeyData(retryCount + 1);
          } else {
            setKeyData(data);
          }
        } catch (error: any) {
          console.error('Failed to fetch key data:', error);
        }
      };

      // Fetch top tracks
      const fetchTopTracks = async () => {
        try {
          const topTracks = await getTopTracks();
          setTopTracks(topTracks);
        } catch (error: any) {
          console.error('Failed to fetch Spotify data:', error);
        }
      };

      // Fetch top artists
      const fetchTopArtists = async () => {
        try {
          const topArtists = await getTopArtists();
          setTopArtists(topArtists);
        } catch (error: any) {
          console.error('Failed to fetch Spotify data:', error);
        }
      };

      // Fetch recently played
      const fetchRecentTracks = async () => {
        try {
          const recentTracks = await getRecentTracks();
          setRecentTracks(recentTracks);
        } catch (error: any) {
          console.error('Failed to fetch recent tracks', error);
        }
      };

      // Fetch GitHub data
      const fetchGithubData = async () => {
        try {
          const data = await getContributionData();
          setContributionData(data);
        } catch (error: any) {
          console.error('Failed to fetch github data', error);
        }
      };

      // Run both fetches concurrently
      await Promise.all([
        fetchKeyData(0),
        fetchTopTracks(),
        fetchRecentTracks(),
        fetchTopArtists(),
        fetchGithubData(),
      ]);
    };

    fetchAllData();
  }, []);

  console.log('keyData', keyData);
  console.log('github', contributionData);

  topArtists?.items.forEach((item: SpotifyApi.ArtistObjectFull) => {
    console.log(item);
  });

  return (
    <>
      <section className='min-h-screen bg-background px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10'>
        <div className='max-w-7xl mx-auto'>
          <SectionHeader
            title='Stats'
            subtitle="A peek into my personal and digital life!"
          />

          {/* GitHub Activity - Full Width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <GitHubActivity data={contributionData} />
            <Eras />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
            {/* Recently Played Track */}
            <StatsCard title='Currently listening to' delay={0.1}>
              {recentTracks?.items && recentTracks.items.length > 0 ? (
                <SpotifyTrack
                  track={recentTracks.items[0].track}
                  index={0}
                  showAll={true}
                  showNumber={false}
                />
              ) : (
                <div className='flex items-center justify-center p-8 text-muted-foreground'>
                  <span className='text-sm'>Fetching recent listening data...</span>
                </div>
              )}
            </StatsCard>

            {/* Keystroke Stats */}
            <StatsCard title='Coding Activity' delay={0.2}>
              {keyData ? (
                <div className='space-y-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-primary'>
                      {keyData.total_keystrokes.toLocaleString()}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total Keystrokes <span className='text-xs'>(since March 2025)</span>
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-xl font-semibold text-foreground'>
                      {keyData.recent_activity[0].count}
                    </div>
                    <div className='text-xs text-muted-foreground'>Today</div>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center p-8 text-muted-foreground'>
                  <span className='text-sm'>Fetching keyboard data...</span>
                </div>
              )}
            </StatsCard>

            {/* Top Tracks */}
            <StatsCard title='Top Tracks' delay={0.3}>
              {topTracks?.items ? (
                <ExpandableList>
                  {topTracks.items.map((track, index) => (
                    <SpotifyTrack key={track.id} track={track} index={index} showAll={true} />
                  ))}
                </ExpandableList>
              ) : (
                <div className='flex items-center justify-center p-8 text-muted-foreground'>
                  <span className='text-sm'>Fetching song data...</span>
                </div>
              )}
            </StatsCard>

            {/* Top Artists */}
            <StatsCard title='Top Artists' delay={0.4}>
              {topArtists?.items ? (
                <ExpandableList>
                  {topArtists.items.map((artist, index) => (
                    <SpotifyArtist key={artist.id} artist={artist} index={index} showAll={true} />
                  ))}
                </ExpandableList>
              ) : (
                <div className='flex items-center justify-center p-8 text-muted-foreground'>
                  <span className='text-sm'>Fetching artist data...</span>
                </div>
              )}
            </StatsCard>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
