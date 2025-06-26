import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import watchlistService from '@/services/api/watchlistService';
import movieService from '@/services/api/movieService';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unwatched', 'watched'
  const [sortBy, setSortBy] = useState('added'); // 'added', 'rating', 'title'
  const navigate = useNavigate();

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const watchlist = await watchlistService.getAll();
      setWatchlistItems(watchlist);
      
      // Load movie details for each watchlist item
      const moviePromises = watchlist.map(item => 
        movieService.getById(item.movieId)
      );
      
      const movieResults = await Promise.all(moviePromises);
      const moviesWithWatchlistData = movieResults.map((movie, index) => ({
        ...movie,
        watchlistItem: watchlist[index]
      }));
      
      setMovies(moviesWithWatchlistData);
    } catch (err) {
      setError(err.message || 'Failed to load watchlist');
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      const watchlistItem = watchlistItems.find(item => 
        item.movieId === movieId.toString()
      );
      
      if (watchlistItem) {
        await watchlistService.delete(watchlistItem.Id);
        setWatchlistItems(prev => prev.filter(item => item.Id !== watchlistItem.Id));
        setMovies(prev => prev.filter(movie => movie.Id !== movieId));
        toast.success('Removed from watchlist');
      }
    } catch (error) {
      toast.error('Failed to remove from watchlist');
    }
  };

  const handleToggleWatched = async (movieId) => {
    try {
      const movie = movies.find(m => m.Id === movieId);
      if (!movie) return;
      
      const updatedItem = await watchlistService.update(
        movie.watchlistItem.Id,
        { watched: !movie.watchlistItem.watched }
      );
      
      setWatchlistItems(prev => prev.map(item => 
        item.Id === updatedItem.Id ? updatedItem : item
      ));
      
      setMovies(prev => prev.map(movie => 
        movie.Id === movieId 
          ? { ...movie, watchlistItem: updatedItem }
          : movie
      ));
      
      toast.success(
        updatedItem.watched ? 'Marked as watched' : 'Marked as unwatched'
      );
    } catch (error) {
      toast.error('Failed to update watch status');
    }
  };

  const handleRateMovie = async (movieId, rating) => {
    try {
      const movie = movies.find(m => m.Id === movieId);
      if (!movie) return;
      
      const updatedItem = await watchlistService.update(
        movie.watchlistItem.Id,
        { userRating: rating }
      );
      
      setWatchlistItems(prev => prev.map(item => 
        item.Id === updatedItem.Id ? updatedItem : item
      ));
      
      setMovies(prev => prev.map(movie => 
        movie.Id === movieId 
          ? { ...movie, watchlistItem: updatedItem }
          : movie
      ));
      
      toast.success('Rating saved');
    } catch (error) {
      toast.error('Failed to save rating');
    }
  };

  const getFilteredAndSortedMovies = () => {
    let filtered = [...movies];
    
    // Apply filter
    if (filter === 'watched') {
      filtered = filtered.filter(movie => movie.watchlistItem.watched);
    } else if (filter === 'unwatched') {
      filtered = filtered.filter(movie => !movie.watchlistItem.watched);
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'added':
          return new Date(b.watchlistItem.addedDate) - new Date(a.watchlistItem.addedDate);
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredMovies = getFilteredAndSortedMovies();
  const watchedCount = movies.filter(movie => movie.watchlistItem?.watched).length;
  const unwatchedCount = movies.length - watchedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-surface-800 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-800 rounded w-64 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <SkeletonLoader count={5} type="list" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <ErrorState
            message={error}
            onRetry={loadWatchlist}
          />
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="Your watchlist is empty"
            description="Start building your personal movie collection by adding films you want to watch"
            icon="Bookmark"
            actionLabel="Discover Movies"
            onAction={() => navigate('/browse')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            My Watchlist
          </h1>
          <p className="text-slate-400">
            Your personal collection of movies to watch
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-surface-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-400 mb-1">
              {movies.length}
            </div>
            <div className="text-sm text-slate-400">Total Movies</div>
          </div>
          <div className="bg-surface-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {watchedCount}
            </div>
            <div className="text-sm text-slate-400">Watched</div>
          </div>
          <div className="bg-surface-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent-400 mb-1">
              {unwatchedCount}
            </div>
            <div className="text-sm text-slate-400">To Watch</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Filter:</span>
            {[
              { value: 'all', label: 'All', count: movies.length },
              { value: 'unwatched', label: 'To Watch', count: unwatchedCount },
              { value: 'watched', label: 'Watched', count: watchedCount }
            ].map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="relative"
              >
                {option.label}
                <span className="ml-1 text-xs opacity-75">
                  {option.count}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-800 border border-surface-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-primary-500"
            >
              <option value="added">Date Added</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>
        </motion.div>

        {/* Movie List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-surface-800 rounded-lg p-4 hover:bg-surface-700 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Movie Poster */}
                  <button
                    onClick={() => navigate(`/movie/${movie.Id}`)}
                    className="flex-shrink-0 hover:scale-105 transition-transform"
                  >
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  </button>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <button
                          onClick={() => navigate(`/movie/${movie.Id}`)}
                          className="text-lg font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1"
                        >
                          {movie.title}
                        </button>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                          <span>{movie.year}</span>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Star" className="w-3 h-3 text-accent-400 fill-current" />
                            <span>{movie.rating}</span>
                          </div>
                          <span>{movie.genres?.join(', ')}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        movie.watchlistItem.watched
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-accent-600/20 text-accent-400'
                      }`}>
                        {movie.watchlistItem.watched ? 'Watched' : 'To Watch'}
                      </span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                      {movie.synopsis}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={movie.watchlistItem.watched ? "Eye" : "EyeOff"}
                          onClick={() => handleToggleWatched(movie.Id)}
                        >
                          {movie.watchlistItem.watched ? 'Watched' : 'Mark Watched'}
                        </Button>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateMovie(movie.Id, star * 2)}
                              className={`transition-colors ${
                                movie.watchlistItem.userRating && star <= movie.watchlistItem.userRating / 2
                                  ? 'text-accent-400'
                                  : 'text-slate-600 hover:text-accent-400'
                              }`}
                            >
                              <ApperIcon 
                                name="Star" 
                                className={`w-4 h-4 ${
                                  movie.watchlistItem.userRating && star <= movie.watchlistItem.userRating / 2
                                    ? 'fill-current'
                                    : ''
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">
                          Added {new Date(movie.watchlistItem.addedDate).toLocaleDateString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleRemoveFromWatchlist(movie.Id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredMovies.length === 0 && (
          <EmptyState
            title={
              filter === 'watched' 
                ? "No watched movies yet"
                : filter === 'unwatched'
                ? "No movies to watch"
                : "No movies match your filter"
            }
            description={
              filter === 'watched'
                ? "Start watching movies from your list and mark them as watched"
                : filter === 'unwatched'
                ? "All movies in your watchlist have been watched!"
                : "Try adjusting your filter settings"
            }
            icon={filter === 'watched' ? "CheckCircle" : "Film"}
          />
        )}
      </div>
    </div>
  );
};

export default Watchlist;