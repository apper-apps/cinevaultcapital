import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import { routes } from '@/config/routes';
import watchlistService from '@/services/api/watchlistService';

const Header = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadWatchlistCount = async () => {
      try {
        const watchlist = await watchlistService.getAll();
        setWatchlistCount(watchlist.length);
      } catch (error) {
        setWatchlistCount(0);
      }
    };

    loadWatchlistCount();
  }, []);

  const navigationItems = Object.values(routes).filter(route => !route.hideFromNav);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-surface-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-surface-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <ApperIcon 
                name="Film" 
                className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors" 
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full opacity-80"></div>
            </div>
            <span className="text-xl font-display font-bold text-white group-hover:text-primary-400 transition-colors">
              CineVault
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-surface-800'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-4 h-4" />
                <span>{route.label}</span>
                {route.id === 'watchlist' && watchlistCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
                    {watchlistCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              icon="Search"
              onClick={() => navigate('/search')}
              className="lg:hidden"
              title="Search"
            />
            <Button
              variant="ghost"
              icon="Bookmark"
              onClick={() => navigate('/watchlist')}
              className="relative"
              title="Watchlist"
            >
              {watchlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={onMobileMenuToggle}
            className="md:hidden relative z-50"
            title="Menu"
          >
            <motion.div
              animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-6 h-6" 
              />
            </motion.div>
          </Button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;