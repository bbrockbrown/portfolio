import { motion } from 'motion/react';

interface SpotifyArtistProps {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
  showAll?: boolean;
  showNumber?: boolean;
}

export default function SpotifyArtist({ artist, index, showAll = false, showNumber = true }: SpotifyArtistProps) {
  const shouldShow = showAll || index < 3;

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        type: 'spring',
        stiffness: 100,
      }}
      className='flex items-center space-x-4 p-3 rounded-md hover:bg-accent/50 transition-colors group'
    >
      {showNumber && <div className='flex-shrink-0 text-sm text-muted-foreground w-6'>#{index + 1}</div>}

      {artist.images[0] && (
        <motion.img
          src={artist.images[0].url}
          alt={artist.name}
          className='w-12 h-12 rounded-full object-cover'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className='flex-grow min-w-0'>
        <motion.div whileHover={{ x: 2, textDecoration: 'underline', underlineThickness: 0.5 }}>
          <a
            className='font-medium text-foreground truncate group-hover:text-primary transition-colors'
            href={artist.external_urls.spotify}
            target='_blank'
          >
            {artist.name}
          </a>
        </motion.div>
        <p className='text-sm text-muted-foreground truncate'>
          {artist.followers.total.toLocaleString()} followers
        </p>
        {/* nbsp keeps the row height equal to track rows when there are no genres */}
        <p className='text-xs text-muted-foreground truncate'>{artist.genres.slice(0, 3).join(', ') || ' '}</p>
      </div>

      <div className='flex-shrink-0 text-xs text-muted-foreground'>{Math.round(artist.popularity)}%</div>
    </motion.div>
  );
}
