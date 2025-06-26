import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '@/components/molecules/MovieCard';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import watchlistService from '@/services/api/watchlistService';

const MovieGrid = ({ 
  movies = [], 
  loading = false, 
  error = null, 
  onRetry,
  emptyTitle = "No movies found",
  emptyDescription = "Try adjusting your filters or search terms",
  className = "" 
}) => {
  const [watchlistItems, setWatchlistItems] = useState(new Set());

  useEffect(() => {
    const loadWatchlistStatus = async () => {
      try {
        const watchlist = await watchlistService.getAll();
        const movieIds = new Set(watchlist.map(item => parseInt(item.movieId)));
        setWatchlistItems(movieIds);
      } catch (error) {
        setWatchlistItems(new Set());
      }
    };

    if (movies.length > 0) {
      loadWatchlistStatus();
    }
  }, [movies]);

  const handleWatchlistChange = (movieId, isInWatchlist) => {
    setWatchlistItems(prev => {
      const newSet = new Set(prev);
      if (isInWatchlist) {
        newSet.add(movieId);
      } else {
        newSet.delete(movieId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}>
        {[...Array(10)].map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon="Film"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {movies.map((movie, index) => (
        <motion.div
          key={movie.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <MovieCard
            movie={movie}
            isInWatchlist={watchlistItems.has(movie.Id)}
            onWatchlistChange={handleWatchlistChange}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MovieGrid;