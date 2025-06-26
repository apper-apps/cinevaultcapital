import Home from '@/components/pages/Home';
import Browse from '@/components/pages/Browse';
import Search from '@/components/pages/Search';
import Watchlist from '@/components/pages/Watchlist';
import MovieDetail from '@/components/pages/MovieDetail';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Grid3X3',
    component: Browse
  },
  search: {
    id: 'search',
    label: 'Search',
    path: '/search',
    icon: 'Search',
    component: Search
  },
  watchlist: {
    id: 'watchlist',
    label: 'My Watchlist',
    path: '/watchlist',
    icon: 'Bookmark',
    component: Watchlist
  },
  movieDetail: {
    id: 'movieDetail',
    label: 'Movie Detail',
    path: '/movie/:id',
    icon: 'Film',
    component: MovieDetail,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;