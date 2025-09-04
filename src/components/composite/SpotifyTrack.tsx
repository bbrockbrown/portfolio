import { motion } from 'motion/react';

interface SpotifyTrackProps {
  track: SpotifyApi.TrackObjectFull;
  index: number;
  showAll?: boolean;
  showNumber?: boolean;
}

export default function SpotifyTrack({ track, index, showAll = false, showNumber = true }: SpotifyTrackProps) {
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

      {track.album.images[0] && (
        <motion.img
          src={track.album.images[0].url}
          alt={track.album.name}
          className='w-12 h-12 rounded-md object-cover'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className='flex-grow min-w-0'>
        <motion.div whileHover={{ x: 2, textDecoration: 'underline', underlineThickness: 0.5 }}>
          <a
            className='font-medium text-foreground truncate group-hover:text-primary transition-colors'
            href={track.external_urls.spotify}
            target='_blank'
          >
            {track.name}
          </a>
        </motion.div>
        <p className='text-sm text-muted-foreground truncate'>
          {track.artists.map((artist) => artist.name).join(', ')}
        </p>
        <p className='text-xs text-muted-foreground truncate'>{track.album.name}</p>
      </div>

      {track.explicit && (
        <div className='text-xs bg-muted-foreground/20 text-muted-foreground px-2 py-1 rounded'>
          E
        </div>
      )}
    </motion.div>
  );
}
