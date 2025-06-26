import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-display font-bold text-primary-500/30 leading-none">
              404
            </h1>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ 
                delay: 1,
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut'
              }}
              className="w-32 h-32 mx-auto bg-surface-800 rounded-full flex items-center justify-center"
            >
              <ApperIcon name="FilmStrip" className="w-16 h-16 text-primary-400" />
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Movie Not Found
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Looks like this page went missing from our vault. The movie you're looking for 
              might have been moved or doesn't exist.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="primary"
              size="lg"
              icon="Home"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              icon="Search"
              onClick={() => navigate('/search')}
            >
              Search Movies
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              icon="ArrowLeft"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 max-w-lg mx-auto"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              While you're here, you might like:
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="ghost"
                icon="TrendingUp"
                onClick={() => navigate('/?section=trending')}
                className="justify-start"
              >
                Trending Movies
              </Button>
              <Button
                variant="ghost"
                icon="Star"
                onClick={() => navigate('/browse?sort=rating')}
                className="justify-start"
              >
                Top Rated
              </Button>
              <Button
                variant="ghost"
                icon="Calendar"
                onClick={() => navigate('/browse?filter=new')}
                className="justify-start"
              >
                New Releases
              </Button>
              <Button
                variant="ghost"
                icon="Bookmark"
                onClick={() => navigate('/watchlist')}
                className="justify-start"
              >
                My Watchlist
              </Button>
            </div>
          </motion.div>

          {/* Fun Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-slate-500 text-sm mt-8"
          >
            "Even the best directors have scenes that end up on the cutting room floor." 🎬
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;