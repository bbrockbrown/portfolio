export interface SpotifyTopTracksResponse {
  items: SpotifyApi.TrackObjectFull[];
  total: number;
  limit: number;
  offset: number;
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyApi.ArtistObjectFull[];
  total: number;
  limit: number;
  offset: number;
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyApi.PlayHistoryObject[];
  total: number;
  limit: number;
}

export interface GitHubContributionDay {
  contributionCount: number;
  date: string;
}

export interface GitHubApiResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: GitHubContributionDay[];
          }[];
        };
      };
    };
  };
}

export interface Era {
  id: string;
  title: string;
  image_url: string;
  description: string;
  date?: string;
}
