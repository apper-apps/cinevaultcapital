import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const MobileMenu = ({ onClose }) => {
  const navigationItems = Object.values(routes).filter(route => !route.hideFromNav);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 h-full w-80 bg-surface-900 border-l border-surface-700 z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Film" className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-display font-bold text-white">
                CineVault
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navigationItems.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={route.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-surface-800'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5" />
                  <span className="font-medium">{route.label}</span>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 ml-auto" />
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-surface-700">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={onClose}
                className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-surface-800 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="TrendingUp" className="w-4 h-4" />
                <span>Trending Movies</span>
              </button>
              <button
                onClick={onClose}
                className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-surface-800 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>New Releases</span>
              </button>
              <button
                onClick={onClose}
                className="w-full flex items-center space-x-3 p-3 text-slate-300 hover:text-white hover:bg-surface-800 rounded-lg transition-all duration-200"
              >
                <ApperIcon name="Award" className="w-4 h-4" />
                <span>Top Rated</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileMenu;