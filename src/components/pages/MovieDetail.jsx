import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import movieService from '@/services/api/movieService';
import watchlistService from '@/services/api/watchlistService';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMovie();
      checkWatchlistStatus();
    }
  }, [id]);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await movieService.getById(id);
      setMovie(result);
      
      // Load related movies (same genre)
      if (result.genres?.length > 0) {
        const related = await movieService.getByGenre(result.genres[0]);
        setRelatedMovies(related.filter(m => m.Id !== result.Id).slice(0, 4));
      }
    } catch (err) {
      setError(err.message || 'Failed to load movie details');
      toast.error('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const status = await watchlistService.isInWatchlist(id);
      setIsInWatchlist(status);
    } catch (error) {
      setIsInWatchlist(false);
    }
  };

  const handleWatchlistToggle = async () => {
    setWatchlistLoading(true);
    
    try {
      if (isInWatchlist) {
        const watchlistItem = await watchlistService.getByMovieId(id);
        if (watchlistItem) {
          await watchlistService.delete(watchlistItem.Id);
          setIsInWatchlist(false);
          toast.success('Removed from watchlist');
        }
      } else {
        await watchlistService.create({ movieId: id });
        setIsInWatchlist(true);
        toast.success('Added to watchlist');
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleStreamingClick = (platform, url) => {
    // In a real app, this would track affiliate clicks for revenue
    console.log(`Affiliate click: ${platform} - ${url}`);
    window.open(url, '_blank');
    toast.success(`Opening ${platform}...`, { autoClose: 2000 });
  };

  const getStreamingButtons = () => {
    if (!movie?.streamingLinks) return [];
    
    const platformInfo = {
      netflix: { name: 'Netflix', color: 'bg-red-600 hover:bg-red-700', icon: 'Play' },
      prime: { name: 'Prime Video', color: 'bg-blue-600 hover:bg-blue-700', icon: 'Play' },
      hulu: { name: 'Hulu', color: 'bg-green-600 hover:bg-green-700', icon: 'Play' },
      disney: { name: 'Disney+', color: 'bg-blue-700 hover:bg-blue-800', icon: 'Play' },
      hbo: { name: 'HBO Max', color: 'bg-purple-600 hover:bg-purple-700', icon: 'Play' },
      apple: { name: 'Apple TV+', color: 'bg-gray-800 hover:bg-gray-900', icon: 'Play' },
      shudder: { name: 'Shudder', color: 'bg-orange-600 hover:bg-orange-700', icon: 'Play' }
    };

    return Object.entries(movie.streamingLinks).map(([platform, url]) => ({
      platform,
      url,
      ...platformInfo[platform]
    })).filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-surface-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <SkeletonLoader count={8} type="text" />
            </div>
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
            onRetry={loadMovie}
          />
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }

  const streamingButtons = getStreamingButtons();

  return (
    <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.poster})`,
            filter: 'blur(20px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/80 to-surface-900/40" />
        
        <div className="relative container mx-auto px-4 py-16">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate(-1)}
            className="mb-8"
          >
            Back
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 text-shadow">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6 text-slate-300">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Star" className="w-5 h-5 text-accent-400 fill-current" />
                  <span className="text-accent-400 font-semibold text-lg">
                    {movie.rating}/10
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" className="w-5 h-5" />
                  <span>2h 15m</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Users" className="w-5 h-5" />
                  <span>{movie.cast?.length || 0} cast members</span>
                </div>
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-600/20 text-primary-300 text-sm rounded-full border border-primary-600/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              
              {/* Synopsis */}
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {movie.synopsis}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  variant={isInWatchlist ? "secondary" : "primary"}
                  size="lg"
                  icon={isInWatchlist ? "BookmarkCheck" : "BookmarkPlus"}
                  onClick={handleWatchlistToggle}
                  loading={watchlistLoading}
                >
                  {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  icon="Share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied to clipboard');
                  }}
                >
                  Share
                </Button>
              </div>

              {/* Streaming Links */}
              {streamingButtons.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    <ApperIcon name="Tv" className="w-5 h-5 inline mr-2" />
                    Watch Now
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {streamingButtons.map(({ platform, name, color, icon, url }) => (
                      <Button
                        key={platform}
                        variant="primary"
                        icon={icon}
                        onClick={() => handleStreamingClick(name, url)}
                        className={`${color} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    * Clicking these links may earn us a commission at no extra cost to you
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cast & Crew */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Cast & Crew
            </h2>
            
            <div className="space-y-4">
              <div className="bg-surface-800 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Director</h3>
                <p className="text-slate-300">{movie.director}</p>
              </div>
              
              <div className="bg-surface-800 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast?.map((actor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-surface-700 text-slate-300 text-sm rounded-full"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Movie Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              Movie Stats
            </h2>
            
            <div className="space-y-4">
              <div className="bg-surface-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Rating</span>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Star" className="w-4 h-4 text-accent-400 fill-current" />
                    <span className="text-accent-400 font-semibold">
                      {movie.rating}/10
                    </span>
                  </div>
                </div>
                <div className="w-full bg-surface-700 rounded-full h-2">
                  <div 
                    className="bg-accent-400 h-2 rounded-full"
                    style={{ width: `${(movie.rating / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-surface-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-400">
                      {movie.year}
                    </div>
                    <div className="text-sm text-slate-400">Release Year</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {movie.genres?.length || 0}
                    </div>
                    <div className="text-sm text-slate-400">Genres</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-display font-bold text-white mb-6">
              More Like This
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedMovies.map((relatedMovie, index) => (
                <motion.button
                  key={relatedMovie.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/movie/${relatedMovie.Id}`)}
                  className="bg-surface-800 rounded-lg overflow-hidden hover:bg-surface-700 transition-all duration-200 text-left"
                >
                  <img
                    src={relatedMovie.poster}
                    alt={relatedMovie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">
                      {relatedMovie.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{relatedMovie.year}</span>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Star" className="w-3 h-3 text-accent-400 fill-current" />
                        <span>{relatedMovie.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;