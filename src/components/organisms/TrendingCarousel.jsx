import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TrendingCarousel = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? movies.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === movies.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleWatchNow = (movie) => {
    // In a real app, this would open the first available streaming link
    const firstStreamingLink = Object.values(movie.streamingLinks)[0];
    window.open(firstStreamingLink, '_blank');
  };

  const handleViewDetails = (movie) => {
    navigate(`/movie/${movie.Id}`);
  };

  if (movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${currentMovie.poster})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full mb-4">
                    Trending Now
                  </span>
                  
                  <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 text-shadow">
                    {currentMovie.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 mb-6 text-slate-300">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>{currentMovie.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Star" className="w-4 h-4 text-accent-400 fill-current" />
                      <span className="text-accent-400 font-semibold">
                        {currentMovie.rating}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" className="w-4 h-4" />
                      <span>2h 15m</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentMovie.genres.slice(0, 3).map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-surface-800/80 text-slate-300 text-sm rounded-full backdrop-blur-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-lg text-slate-300 mb-8 leading-relaxed line-clamp-3">
                    {currentMovie.synopsis}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      icon="Play"
                      onClick={() => handleWatchNow(currentMovie)}
                      className="shadow-2xl"
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      icon="Info"
                      onClick={() => handleViewDetails(currentMovie)}
                    >
                      More Info
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full"
      >
        <ApperIcon name="ChevronLeft" className="w-6 h-6" />
      </Button>
      
      <Button
        variant="ghost"
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-sm hover:bg-black/50 p-3 rounded-full"
      >
        <ApperIcon name="ChevronRight" className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isAutoPlaying 
              ? 'bg-primary-600/80 text-white' 
              : 'bg-black/30 text-slate-300 hover:bg-black/50'
          }`}
          title={isAutoPlaying ? 'Pause autoplay' : 'Resume autoplay'}
        >
          <ApperIcon 
            name={isAutoPlaying ? "Pause" : "Play"} 
            className="w-4 h-4" 
          />
        </button>
      </div>
    </div>
  );
};

export default TrendingCarousel;