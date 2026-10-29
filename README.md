# bbrockbrown.com

my personal site! live at [bbrockbrown.com](https://www.bbrockbrown.com).

the whole site sits on top of an ASCII spectrogram. on the homepage it's driven by a little techno patch (kick, clap, hats, and a 303-style acid line) that's synthesized live in the browser with the Web Audio API. hit **run** and the bio card turns into the code that's actually playing, Strudel-style, with each sound lighting up on the step it hits. move across the background to sweep the filter. audio is always opt-in, nothing autoplays.

## what's on it

- **home**: the patch + spectrogram
- **projects**: things i've built
- **experience**: laid out like a record (each section is a side, each job is a track)
- **about**: the longer version of me
- **stats**: my GitHub contributions, Spotify (top tracks, top artists, recently played), and a running count of my keystrokes, synced from a little tracker on my laptop

## stack

React 19 + TypeScript, Vite, Tailwind v4, Vitest. hosted on Vercel, and `api/` is Vercel serverless functions for Spotify, GitHub, and the keystroke counter (stored in Upstash Redis).

the fun parts live in:

- `src/lib/audio/`: the synth, the patch, and a tiny mini-notation parser so the code on the card can't drift from what's playing (there's a test for that)
- `src/components/scope/`: the spectrogram canvas and its readout

## running it

```sh
npm install
npm run dev      # just the site, /api routes won't run
npx vercel dev   # site + /api routes
npm test
```

the api routes need these in `.env`:

```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REFRESH_TOKEN
GITHUB_ACCESS_TOKEN
KV_REST_API_URL
KV_REST_API_TOKEN
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
KEYSTROKE_SYNC_TOKEN
```
