import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import watchlistService from '@/services/api/watchlistService';

const MovieCard = ({ movie, isInWatchlist = false, onWatchlistChange }) => {
  const [loading, setLoading] = useState(false);
  const [watchlisted, setWatchlisted] = useState(isInWatchlist);
  const navigate = useNavigate();

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (watchlisted) {
        const watchlistItem = await watchlistService.getByMovieId(movie.Id.toString());
        if (watchlistItem) {
          await watchlistService.delete(watchlistItem.Id);
          setWatchlisted(false);
          toast.success('Removed from watchlist');
          onWatchlistChange?.(movie.Id, false);
        }
      } else {
        await watchlistService.create({
          movieId: movie.Id.toString()
        });
        setWatchlisted(true);
        toast.success('Added to watchlist');
        onWatchlistChange?.(movie.Id, true);
      }
    } catch (error) {
      toast.error('Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.Id}`);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8.5) return 'text-green-400';
    if (rating >= 7.5) return 'text-accent-400';
    if (rating >= 6.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-surface-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Poster Image */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Watchlist button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            watchlisted 
              ? 'bg-primary-600/80 text-white' 
              : 'bg-black/40 text-slate-300 hover:bg-black/60'
          }`}
          onClick={handleWatchlistToggle}
          loading={loading}
          disabled={loading}
        >
          <ApperIcon 
            name={watchlisted ? "BookmarkCheck" : "BookmarkPlus"} 
            className="w-4 h-4" 
          />
        </Button>
        
        {/* Rating badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Star" className="w-3 h-3 text-accent-400 fill-current" />
            <span className={`text-xs font-semibold ${getRatingColor(movie.rating)}`}>
              {movie.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-heading text-lg text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Clock" className="w-3 h-3" />
            <span>2h 15m</span>
          </div>
        </div>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genres?.slice(0, 2).map((genre, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-surface-700 text-slate-300 rounded-full"
            >
              {genre}
            </span>
          ))}
          {movie.genres?.length > 2 && (
            <span className="text-xs px-2 py-1 bg-surface-700 text-slate-300 rounded-full">
              +{movie.genres.length - 2}
            </span>
          )}
        </div>
        
        {/* Synopsis preview */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {movie.synopsis}
        </p>
        
        {/* Quick actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Play" className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-300">Watch Now</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <ApperIcon name="Users" className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">
              {movie.cast?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;