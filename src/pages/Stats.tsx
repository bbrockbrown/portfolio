import { useEffect, useState } from 'react';

import SectionHeader from '@/components/base/SectionHeader';
import Eras from '@/components/composite/Eras';
import ExpandableList from '@/components/composite/ExpandableList';
import GitHubActivity from '@/components/composite/GitHubActivity';
import SpotifyArtist from '@/components/composite/SpotifyArtist';
import SpotifyTrack from '@/components/composite/SpotifyTrack';
import StatsCard from '@/components/composite/StatsCard';
import { useKeystroke } from '@/components/keystroke-provider';
import { getContributionData } from '@/lib/github';
import { getRecentTracks, getTopArtists, getTopTracks } from '@/lib/spotify';
import {
  type GitHubApiResponse,
  type SpotifyRecentlyPlayedResponse,
  type SpotifyTopArtistsResponse,
  type SpotifyTopTracksResponse,
} from '@/types';

export default function Stats() {
  const { keyData, error: keystrokeError } = useKeystroke();
  const [topTracks, setTopTracks] = useState<SpotifyTopTracksResponse | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyTopArtistsResponse | null>(null);
  const [recentTracks, setRecentTracks] = useState<SpotifyRecentlyPlayedResponse | null>(null);
  const [contributionData, setContributionData] = useState<GitHubApiResponse | null>(null);

  // on mount, get all stats data (except keystroke which is handled by provider)
  useEffect(() => {
    const fetchAllData = async () => {
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

      // Run all fetches concurrently (keystroke data is handled by provider)
      await Promise.all([
        fetchTopTracks(),
        fetchRecentTracks(),
        fetchTopArtists(),
        fetchGithubData(),
      ]);
    };

    fetchAllData();
  }, []);

  return (
    <>
      <section className='min-h-screen px-2 sm:px-6 md:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16 relative z-10'>
        <div className='glass p-4 sm:p-8 md:p-10 max-w-6xl mx-auto'>
          <SectionHeader title='Stats' />

          {/* GitHub Activity - Full Width */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8'>
            {contributionData ? (
              <GitHubActivity data={contributionData} />
            ) : (
              <div className='flex flex-col justify-between bg-card/70 border border-border rounded-xl p-4 sm:p-6 hover:bg-card transition-all duration-300'>
                <div>
                  <div className='flex items-center justify-between mb-4 sm:mb-6'>
                    <div className='flex items-center space-x-2 sm:space-x-3'>
                      <div className='w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded animate-pulse' />
                      <span className='text-foreground font-medium text-base sm:text-lg'>
                        GitHub
                      </span>
                    </div>
                    <div className='bg-muted/60 px-2 py-1 sm:px-3 rounded-full'>
                      <span className='text-foreground/80 text-xs sm:text-sm font-medium'>
                        Last 25 weeks
                      </span>
                    </div>
                  </div>

                  {/* Loading skeleton for contribution graph */}
                  <div className='justify-self-center space-y-0.5 sm:space-y-1 mb-4 sm:mb-6 overflow-x-auto'>
                    <div className='min-w-fit'>
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div key={dayIndex} className='flex space-x-0.5 sm:space-x-1'>
                          {Array.from({ length: 25 }).map((_, weekIndex) => (
                            <div
                              key={weekIndex}
                              className='w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-foreground/[0.07] rounded-sm animate-pulse'
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loading skeleton for date range */}
                <div className='flex justify-between items-center text-muted-foreground text-xs sm:text-sm'>
                  <div className='hidden sm:block w-20 h-4 bg-muted rounded animate-pulse' />
                  <span className='text-muted-foreground'>Fetching GitHub activity...</span>
                  <div className='w-20 h-4 bg-muted rounded animate-pulse' />
                </div>
              </div>
            )}
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
              {keystrokeError ? (
                <div className='flex items-center justify-center p-8 text-red-400'>
                  <span className='text-sm'>Failed to load keyboard data</span>
                </div>
              ) : keyData ? (
                <div className='space-y-4'>
                  <div className='text-center'>
                    <div className='text-3xl font-bold text-primary'>
                      {(keyData.total_keystrokes ?? 0).toLocaleString()}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total Keystrokes <span className='text-xs'>(since March 2025)</span>
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-xl font-semibold text-foreground'>
                      {(keyData.today_keystrokes ?? 0).toLocaleString()}
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
    </>
  );
}
