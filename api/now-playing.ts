import type { VercelRequest, VercelResponse } from '@vercel/node';

// The most recently played track plus a 30 s audio preview of it, so the site
// can run a real FFT on the song.
//
// Spotify doesn't serve audio (preview_url is null, audio-analysis 403s), so
// the preview comes from Deezer, matched by ISRC. Deezer's API has no CORS for
// browsers, hence this proxy; its preview CDN does, so the client fetches the
// mp3 directly. Preview URLs are signed and expire in ~15 min, which bounds the
// cache below.

export interface NowPlaying {
  name: string;
  artists: string;
  albumArt: string | null;
  spotifyUrl: string;
  playedAt: string;
  previewUrl: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }),
    });
    if (!tokenRes.ok) {
      throw new Error(`Failed to refresh token: ${JSON.stringify(await tokenRes.json())}`);
    }
    const { access_token } = await tokenRes.json();

    const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!recentRes.ok) {
      throw new Error(`Spotify API error: ${recentRes.status} - ${JSON.stringify(await recentRes.json())}`);
    }
    const recent: SpotifyApi.UsersRecentlyPlayedTracksResponse = await recentRes.json();
    const item = recent.items[0];
    if (!item) return res.status(404).json({ error: 'No recently played tracks' });
    const { track } = item;

    // A missing preview isn't an error: the client just stays on its idle field.
    let previewUrl: string | null = null;
    const isrc = track.external_ids?.isrc;
    if (isrc) {
      const deezer = await fetch(`https://api.deezer.com/track/isrc:${encodeURIComponent(isrc)}`);
      if (deezer.ok) {
        const data = await deezer.json();
        if (typeof data.preview === 'string' && data.preview) previewUrl = data.preview;
      }
    }

    const body: NowPlaying = {
      name: track.name,
      artists: track.artists.map((a) => a.name).join(', '),
      albumArt: track.album.images[0]?.url ?? null,
      spotifyUrl: track.external_urls.spotify,
      playedAt: item.played_at,
      previewUrl,
    };
    // Well inside the preview URL's ~15 min signature.
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=180');
    res.json(body);
  } catch (error) {
    console.error('Now playing API error:', error);
    res.status(500).json({
      error: 'Failed to fetch now playing',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
