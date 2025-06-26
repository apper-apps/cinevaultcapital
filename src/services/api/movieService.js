import movieData from '@/services/mockData/movies.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const movieService = {
  async getAll() {
    await delay(300);
    return [...movieData];
  },

  async getById(id) {
    await delay(200);
    const movie = movieData.find(m => m.Id === parseInt(id, 10));
    if (!movie) {
      throw new Error('Movie not found');
    }
    return { ...movie };
  },

  async getTrending() {
    await delay(250);
    return [...movieData]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  },

  async getByGenre(genre) {
    await delay(300);
    return [...movieData].filter(movie => 
      movie.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    );
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return [...movieData].filter(movie =>
      movie.title.toLowerCase().includes(searchTerm) ||
      movie.director.toLowerCase().includes(searchTerm) ||
      movie.cast.some(actor => actor.toLowerCase().includes(searchTerm)) ||
      movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  },

  async getPopular() {
    await delay(300);
    return [...movieData]
      .filter(movie => movie.rating >= 7.5)
      .sort((a, b) => b.rating - a.rating);
  },

  async getNewReleases() {
    await delay(300);
    return [...movieData]
      .filter(movie => movie.year >= 2022)
      .sort((a, b) => b.year - a.year);
  }
};

export default movieService;