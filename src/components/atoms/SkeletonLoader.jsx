import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => index);

  const shimmerAnimation = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  };

  if (type === 'card') {
    return (
      <>
        {skeletonItems.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-surface-800 rounded-lg overflow-hidden shadow-lg ${className}`}
          >
            {/* Poster skeleton */}
            <motion.div
              className="aspect-[2/3] bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%]"
              {...shimmerAnimation}
            />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              <motion.div
                className="h-5 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-3/4"
                {...shimmerAnimation}
              />
              <motion.div
                className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-1/2"
                {...shimmerAnimation}
              />
              <div className="flex space-x-2">
                <motion.div
                  className="h-6 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded-full w-16"
                  {...shimmerAnimation}
                />
                <motion.div
                  className="h-6 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded-full w-12"
                  {...shimmerAnimation}
                />
              </div>
              <motion.div
                className="h-3 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-full"
                {...shimmerAnimation}
              />
              <motion.div
                className="h-3 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-4/5"
                {...shimmerAnimation}
              />
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <>
        {skeletonItems.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`space-y-2 ${className}`}
          >
            <motion.div
              className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-full"
              {...shimmerAnimation}
            />
            <motion.div
              className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-3/4"
              {...shimmerAnimation}
            />
          </motion.div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <>
        {skeletonItems.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-4 ${className}`}
          >
            <motion.div
              className="w-16 h-20 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded"
              {...shimmerAnimation}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-5 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-3/4"
                {...shimmerAnimation}
              />
              <motion.div
                className="h-4 bg-gradient-to-r from-surface-700 via-surface-600 to-surface-700 bg-[length:200%_100%] rounded w-1/2"
                {...shimmerAnimation}
              />
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  return null;
};

export default SkeletonLoader;