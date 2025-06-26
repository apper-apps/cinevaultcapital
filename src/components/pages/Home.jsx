import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TrendingCarousel from '@/components/organisms/TrendingCarousel';
import MovieGrid from '@/components/organisms/MovieGrid';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import movieService from '@/services/api/movieService';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState({
    trending: false,
    popular: false,
    newReleases: false
  });
  const [error, setError] = useState({
    trending: null,
    popular: null,
    newReleases: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingMovies();
    loadPopularMovies();
    loadNewReleases();
  }, []);

  const loadTrendingMovies = async () => {
    setLoading(prev => ({ ...prev, trending: true }));
    setError(prev => ({ ...prev, trending: null }));
    
    try {
      const result = await movieService.getTrending();
      setTrendingMovies(result);
    } catch (err) {
      setError(prev => ({ ...prev, trending: err.message || 'Failed to load trending movies' }));
      toast.error('Failed to load trending movies');
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  const loadPopularMovies = async () => {
    setLoading(prev => ({ ...prev, popular: true }));
    setError(prev => ({ ...prev, popular: null }));
    
    try {
      const result = await movieService.getPopular();
      setPopularMovies(result.slice(0, 10));
    } catch (err) {
      setError(prev => ({ ...prev, popular: err.message || 'Failed to load popular movies' }));
      toast.error('Failed to load popular movies');
    } finally {
      setLoading(prev => ({ ...prev, popular: false }));
    }
  };

  const loadNewReleases = async () => {
    setLoading(prev => ({ ...prev, newReleases: true }));
    setError(prev => ({ ...prev, newReleases: null }));
    
    try {
      const result = await movieService.getNewReleases();
      setNewReleases(result.slice(0, 10));
    } catch (err) {
      setError(prev => ({ ...prev, newReleases: err.message || 'Failed to load new releases' }));
      toast.error('Failed to load new releases');
    } finally {
      setLoading(prev => ({ ...prev, newReleases: false }));
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 max-w-full overflow-x-hidden">
      {/* Hero Section - Trending Carousel */}
      <section className="container mx-auto px-4 py-8">
        {loading.trending ? (
          <div className="h-[70vh] md:h-[80vh] bg-surface-800 rounded-xl animate-pulse flex items-center justify-center">
            <ApperIcon name="Loader2" className="w-12 h-12 text-primary-400 animate-spin" />
          </div>
        ) : error.trending ? (
          <div className="h-[70vh] md:h-[80vh] bg-surface-800 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">{error.trending}</p>
              <Button variant="primary" onClick={loadTrendingMovies}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <TrendingCarousel movies={trendingMovies} />
        )}
      </section>

      {/* Popular Movies Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Popular Movies
            </h2>
            <p className="text-slate-400">
              Discover what everyone's watching
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="ghost"
              icon="ArrowRight"
              iconPosition="right"
              onClick={() => navigate('/browse')}
              className="text-primary-400 hover:text-primary-300"
            >
              View All
            </Button>
          </motion.div>
        </div>
        
        <MovieGrid
          movies={popularMovies}
          loading={loading.popular}
          error={error.popular}
          onRetry={loadPopularMovies}
          emptyTitle="No popular movies available"
          emptyDescription="Check back later for the latest popular titles"
        />
      </section>

      {/* New Releases Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              New Releases
            </h2>
            <p className="text-slate-400">
              Fresh content just arrived
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              icon="Calendar"
              iconPosition="right"
              onClick={() => navigate('/browse?filter=new')}
              className="text-accent-400 hover:text-accent-300"
            >
              See More
            </Button>
          </motion.div>
        </div>
        
        <MovieGrid
          movies={newReleases}
          loading={loading.newReleases}
          error={error.newReleases}
          onRetry={loadNewReleases}
          emptyTitle="No new releases available"
          emptyDescription="Check back soon for the latest movie releases"
        />
      </section>

      {/* Quick Actions Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-600/20 to-accent-600/20 rounded-2xl p-8 text-center border border-primary-500/20"
        >
          <ApperIcon name="Star" className="w-16 h-16 text-accent-400 mx-auto mb-6" />
          <h3 className="text-2xl font-display font-bold text-white mb-4">
            Build Your Perfect Watchlist
          </h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Save movies you want to watch, track what you've seen, and never miss out on great content again. 
            Your personalized movie collection awaits.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              icon="Bookmark"
              onClick={() => navigate('/watchlist')}
            >
              My Watchlist
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon="Search"
              onClick={() => navigate('/search')}
            >
              Discover Movies
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;