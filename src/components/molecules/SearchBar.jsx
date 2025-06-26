import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import movieService from '@/services/api/movieService';

const SearchBar = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchMovies = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const results = await movieService.search(query);
        setSuggestions(results.slice(0, 5));
        setIsOpen(true);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMovies, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchQuery) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`);
      setIsOpen(false);
      setQuery('');
      onSearch?.(finalQuery.trim());
    }
  };

  const handleSuggestionClick = (movie) => {
    navigate(`/movie/${movie.Id}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search movies, actors, directors..."
          icon="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-12"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <ApperIcon name="X" className="w-4 h-4 text-slate-400 hover:text-slate-300" />
          </button>
        )}
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-surface-800 border border-surface-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center">
                <ApperIcon name="Loader2" className="w-5 h-5 animate-spin mx-auto text-primary-400" />
                <p className="text-sm text-slate-400 mt-2">Searching...</p>
              </div>
            ) : (
              suggestions.map((movie) => (
                <button
                  key={movie.Id}
                  onClick={() => handleSuggestionClick(movie)}
                  className="w-full p-3 flex items-center space-x-3 hover:bg-surface-700 transition-colors text-left"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{movie.title}</h4>
                    <p className="text-sm text-slate-400">{movie.year} • {movie.genres[0]}</p>
                    <div className="flex items-center mt-1">
                      <ApperIcon name="Star" className="w-3 h-3 text-accent-400 fill-current mr-1" />
                      <span className="text-xs text-slate-400">{movie.rating}</span>
                    </div>
                  </div>
                  <ApperIcon name="ArrowRight" className="w-4 h-4 text-slate-400" />
                </button>
              ))
            )}
            
            {!loading && suggestions.length > 0 && (
              <button
                onClick={() => handleSearch()}
                className="w-full p-3 border-t border-surface-600 text-center text-primary-400 hover:bg-surface-700 transition-colors"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Search" className="w-4 h-4" />
                  <span>Search for "{query}"</span>
                </div>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;