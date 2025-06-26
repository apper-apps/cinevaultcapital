import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MovieGrid from '@/components/organisms/MovieGrid';
import FilterPanel from '@/components/molecules/FilterPanel';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import movieService from '@/services/api/movieService';

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentFilters, setCurrentFilters] = useState({
    genres: [],
    yearRange: { min: 2000, max: 2024 },
    rating: { min: 0, max: 10 },
    sortBy: 'rating'
  });

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [movies, currentFilters]);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await movieService.getAll();
      setMovies(result);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Filter by genres
    if (currentFilters.genres.length > 0) {
      filtered = filtered.filter(movie =>
        movie.genres.some(genre =>
          currentFilters.genres.includes(genre)
        )
      );
    }

    // Filter by year range
    filtered = filtered.filter(movie =>
      movie.year >= currentFilters.yearRange.min &&
      movie.year <= currentFilters.yearRange.max
    );

    // Filter by rating
    filtered = filtered.filter(movie =>
      movie.rating >= currentFilters.rating.min &&
      movie.rating <= currentFilters.rating.max
    );

    // Sort movies
    filtered.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return b.rating - a.rating; // Using rating as popularity proxy
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setCurrentFilters(newFilters);
  };

  const activeFiltersCount = currentFilters.genres.length + 
    (currentFilters.yearRange.min !== 2000 || currentFilters.yearRange.max !== 2024 ? 1 : 0) +
    (currentFilters.rating.min !== 0 || currentFilters.rating.max !== 10 ? 1 : 0);

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
            Browse Movies
          </h1>
          <p className="text-slate-400">
            Discover your next favorite film from our extensive collection
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center space-x-4">
            <FilterPanel onFiltersChange={handleFiltersChange} />
            
            {activeFiltersCount > 0 && (
              <div className="text-sm text-slate-400">
                {filteredMovies.length} of {movies.length} movies
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400 mr-2">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              icon="Grid3X3"
              onClick={() => setViewMode('grid')}
              className="p-2"
              title="Grid view"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              icon="List"
              onClick={() => setViewMode('list')}
              className="p-2"
              title="List view"
            />
          </div>
        </motion.div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-2">
              {currentFilters.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-sm rounded-full"
                >
                  {genre}
                  <button
                    onClick={() => {
                      const newGenres = currentFilters.genres.filter(g => g !== genre);
                      handleFiltersChange({ ...currentFilters, genres: newGenres });
                    }}
                    className="ml-2 hover:text-primary-200"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {(currentFilters.yearRange.min !== 2000 || currentFilters.yearRange.max !== 2024) && (
                <span className="inline-flex items-center px-3 py-1 bg-accent-600 text-white text-sm rounded-full">
                  {currentFilters.yearRange.min} - {currentFilters.yearRange.max}
                  <button
                    onClick={() => {
                      handleFiltersChange({
                        ...currentFilters,
                        yearRange: { min: 2000, max: 2024 }
                      });
                    }}
                    className="ml-2 hover:text-accent-200"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {(currentFilters.rating.min !== 0 || currentFilters.rating.max !== 10) && (
                <span className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Rating: {currentFilters.rating.min}+
                  <button
                    onClick={() => {
                      handleFiltersChange({
                        ...currentFilters,
                        rating: { min: 0, max: 10 }
                      });
                    }}
                    className="ml-2 hover:text-green-200"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Movies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MovieGrid
            movies={filteredMovies}
            loading={loading}
            error={error}
            onRetry={loadMovies}
            emptyTitle="No movies match your filters"
            emptyDescription="Try adjusting your filters to see more results"
            className={viewMode === 'list' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
          />
        </motion.div>

        {/* Stats */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-surface-800 rounded-lg p-6 inline-block">
              <div className="flex items-center space-x-8">
                <div>
                  <div className="text-2xl font-bold text-primary-400">
                    {filteredMovies.length}
                  </div>
                  <div className="text-sm text-slate-400">Movies Shown</div>
                </div>
                <div className="w-px h-8 bg-surface-600"></div>
                <div>
                  <div className="text-2xl font-bold text-accent-400">
                    {movies.length}
                  </div>
                  <div className="text-sm text-slate-400">Total Movies</div>
                </div>
                <div className="w-px h-8 bg-surface-600"></div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {activeFiltersCount}
                  </div>
                  <div className="text-sm text-slate-400">Active Filters</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Browse;