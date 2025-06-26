import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import MovieGrid from '@/components/organisms/MovieGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import movieService from '@/services/api/movieService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5)); // Keep only last 5 searches
  }, []);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
      setShowHistory(false);
    } else {
      setMovies([]);
      setShowHistory(true);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await movieService.search(searchQuery);
      setMovies(results);
      
      // Add to search history
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(item => item !== searchQuery)
      ].slice(0, 5);
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery) => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleHistorySearch = (historyQuery) => {
    handleSearch(historyQuery);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getSearchSuggestions = () => {
    const suggestions = [
      'Action movies 2023',
      'Christopher Nolan',
      'Marvel movies',
      'Top rated dramas',
      'Sci-fi thrillers',
      'Comedy films',
      'Oscar winners',
      'Netflix originals'
    ];
    
    return suggestions.filter(suggestion => 
      !searchHistory.includes(suggestion)
    ).slice(0, 4);
  };

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
            Search Movies
          </h1>
          <p className="text-slate-400">
            Find your next favorite film by title, director, actor, or genre
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SearchBar 
            onSearch={handleSearch} 
            className="max-w-2xl mx-auto"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {showHistory && !query && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Recent Searches</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchHistory}
                      className="text-slate-400 hover:text-white"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleHistorySearch(item)}
                        className="flex items-center space-x-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 text-slate-300 hover:text-white rounded-lg transition-all duration-200"
                      >
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        <span>{item}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Suggestions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-2">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (searchHistory.length * 0.05) + (index * 0.05) }}
                      onClick={() => handleSearch(suggestion)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 hover:text-primary-200 rounded-lg transition-all duration-200 border border-primary-600/30"
                    >
                      <ApperIcon name="TrendingUp" className="w-4 h-4" />
                      <span>{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Browse Categories */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Browse by Genre</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Action', icon: 'Zap', color: 'from-red-600 to-red-500' },
                    { name: 'Comedy', icon: 'Smile', color: 'from-yellow-600 to-yellow-500' },
                    { name: 'Drama', icon: 'Theater', color: 'from-blue-600 to-blue-500' },
                    { name: 'Sci-Fi', icon: 'Rocket', color: 'from-purple-600 to-purple-500' },
                    { name: 'Horror', icon: 'Ghost', color: 'from-gray-600 to-gray-500' },
                    { name: 'Romance', icon: 'Heart', color: 'from-pink-600 to-pink-500' },
                    { name: 'Thriller', icon: 'Eye', color: 'from-green-600 to-green-500' },
                    { name: 'Adventure', icon: 'Map', color: 'from-orange-600 to-orange-500' }
                  ].map((genre, index) => (
                    <motion.button
                      key={genre.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.05) }}
                      onClick={() => navigate(`/browse?genre=${genre.name.toLowerCase()}`)}
                      className={`relative p-6 rounded-xl bg-gradient-to-br ${genre.color} text-white hover:scale-105 transition-all duration-200 group overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="relative z-10 text-center">
                        <ApperIcon name={genre.icon} className="w-8 h-8 mx-auto mb-2" />
                        <span className="font-medium">{genre.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {query && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search Results Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Search Results for "{query}"
                </h2>
                {!loading && !error && (
                  <p className="text-slate-400">
                    Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                  </p>
                )}
              </div>

              {/* Search Results */}
              <MovieGrid
                movies={movies}
                loading={loading}
                error={error}
                onRetry={() => performSearch(query)}
                emptyTitle="No movies found"
                emptyDescription={`No results found for "${query}". Try different keywords or check your spelling.`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;