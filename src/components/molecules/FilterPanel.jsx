import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterPanel = ({ onFiltersChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    genres: [],
    yearRange: { min: 2000, max: 2024 },
    rating: { min: 0, max: 10 },
    sortBy: 'rating'
  });

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Music'
  ];

  const sortOptions = [
    { value: 'rating', label: 'Rating' },
    { value: 'year', label: 'Year' },
    { value: 'title', label: 'Title' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const handleGenreToggle = (genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    
    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleRangeChange = (type, field, value) => {
    const newFilters = {
      ...filters,
      [type]: { ...filters[type], [field]: parseInt(value) }
    };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSortChange = (sortBy) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      genres: [],
      yearRange: { min: 2000, max: 2024 },
      rating: { min: 0, max: 10 },
      sortBy: 'rating'
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const activeFiltersCount = filters.genres.length + 
    (filters.yearRange.min !== 2000 || filters.yearRange.max !== 2024 ? 1 : 0) +
    (filters.rating.min !== 0 || filters.rating.max !== 10 ? 1 : 0);

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        icon="Filter"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        Filters
        {activeFiltersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-full right-0 mt-2 w-80 bg-surface-800 border border-surface-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-slate-400 hover:text-white"
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="X"
                      onClick={() => setIsOpen(false)}
                      className="p-1"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sort By
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`p-2 rounded text-sm transition-colors ${
                          filters.sortBy === option.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-700 text-slate-300 hover:bg-surface-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                          filters.genres.includes(genre)
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-700 text-slate-300 hover:bg-surface-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Release Year
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1980"
                      max="2024"
                      value={filters.yearRange.min}
                      onChange={(e) => handleRangeChange('yearRange', 'min', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-400 w-12">
                      {filters.yearRange.min}
                    </span>
                    <span className="text-slate-400">-</span>
                    <input
                      type="range"
                      min="1980"
                      max="2024"
                      value={filters.yearRange.max}
                      onChange={(e) => handleRangeChange('yearRange', 'max', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-400 w-12">
                      {filters.yearRange.max}
                    </span>
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.rating.min}
                      onChange={(e) => handleRangeChange('rating', 'min', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-400 w-8">
                      {filters.rating.min}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;