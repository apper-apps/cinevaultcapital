import watchlistData from '@/services/mockData/watchlist.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const watchlistService = {
  async getAll() {
    await delay(200);
    return [...watchlistData];
  },

  async getById(id) {
    await delay(150);
    const item = watchlistData.find(w => w.Id === parseInt(id, 10));
    if (!item) {
      throw new Error('Watchlist item not found');
    }
    return { ...item };
  },

  async create(item) {
    await delay(300);
    const newId = Math.max(...watchlistData.map(w => w.Id), 0) + 1;
    const newItem = {
      Id: newId,
      movieId: item.movieId,
      addedDate: new Date().toISOString(),
      watched: false,
      userRating: null,
      ...item
    };
    watchlistData.push(newItem);
    return { ...newItem };
  },

  async update(id, data) {
    await delay(250);
    const index = watchlistData.findIndex(w => w.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Watchlist item not found');
    }
    
    watchlistData[index] = {
      ...watchlistData[index],
      ...data,
      Id: watchlistData[index].Id // Prevent Id modification
    };
    
    return { ...watchlistData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = watchlistData.findIndex(w => w.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Watchlist item not found');
    }
    
    const deletedItem = { ...watchlistData[index] };
    watchlistData.splice(index, 1);
    return deletedItem;
  },

  async isInWatchlist(movieId) {
    await delay(100);
    return watchlistData.some(w => w.movieId === movieId);
  },

  async getByMovieId(movieId) {
    await delay(150);
    const item = watchlistData.find(w => w.movieId === movieId);
    return item ? { ...item } : null;
  }
};

export default watchlistService;