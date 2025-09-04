import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // refresh token that has been previously stored
    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
    };

    const body = await fetch(url, payload);
    if (!body.ok) {
      const errorData = await body.json();
      throw new Error(`Failed to refresh token: ${JSON.stringify(errorData)}`);
    }

    const tokenResponse = await body.json();

    // Top 10 tracks, medium time range
    const tracksResponse = await fetch(
      'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10',
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      }
    );

    if (!tracksResponse.ok) {
      const errorData = await tracksResponse.json();
      throw new Error(`Spotify API error: ${tracksResponse.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await tracksResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Top tracks API error:', error);
    res.status(500).json({
      error: 'Failed to fetch your top tracks',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
