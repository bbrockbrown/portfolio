import type {
  SpotifyTopTracksResponse,
  SpotifyRecentlyPlayedResponse,
  SpotifyTopArtistsResponse,
} from '@/types';

export const getTopTracks = async (): Promise<SpotifyTopTracksResponse | null> => {
  try {
    const response = await fetch('/api/top-tracks');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpotifyTopTracksResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('Failed to get top tracks', err);
    return null;
  }
};

export const getTopArtists = async (): Promise<SpotifyTopArtistsResponse | null> => {
  try {
    const response = await fetch('/api/top-artists');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpotifyTopArtistsResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('Failed to get top tracks', err);
    return null;
  }
};

export const getRecentTracks = async (): Promise<SpotifyRecentlyPlayedResponse | null> => {
  try {
    const response = await fetch('/api/recently-played');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpotifyRecentlyPlayedResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('Failed to get recently played tracks', err);
    return null;
  }
};
