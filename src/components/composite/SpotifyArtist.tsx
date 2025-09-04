import { motion } from 'motion/react';

interface SpotifyArtistProps {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
  showAll?: boolean;
}

export default function SpotifyArtist({ artist, index, showAll = false }: SpotifyArtistProps) {
  const shouldShow = showAll || index < 3;
  
  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4,
        type: "spring",
        stiffness: 100 
      }}
      className="flex items-center space-x-4 p-3 rounded-md hover:bg-accent/50 transition-colors group"
    >
      <div className="flex-shrink-0 text-sm font-mono text-muted-foreground w-6">
        #{index + 1}
      </div>
      
      {artist.images[0] && (
        <motion.img
          src={artist.images[0].url}
          alt={artist.name}
          className="w-12 h-12 rounded-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      <div className="flex-grow min-w-0">
        <motion.p 
          className="font-medium text-foreground truncate group-hover:text-primary transition-colors"
          whileHover={{ x: 2 }}
        >
          {artist.name}
        </motion.p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{artist.followers.total.toLocaleString()} followers</span>
          {artist.genres.length > 0 && (
            <>
              <span>•</span>
              <span className="truncate">{artist.genres[0]}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {Math.round(artist.popularity)}% popularity
      </div>
    </motion.div>
  );
}