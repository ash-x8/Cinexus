import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { HeroSlider } from '../components/HeroSlider';
import { TrailerModal } from '../components/TrailerModal';
import { Sparkles, TrendingUp, Filter, ArrowUpDown } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { movies, siteSettings, selectedCategory, setSelectedCategory, sortBy, setSortBy, searchQuery } = useMovies();
  const [filterType, setFilterType] = useState<'all' | 'movies' | 'series'>('all');

  // Trailer modal state
  const [trailerState, setTrailerState] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const handleOpenTrailer = (url: string, title: string) => {
    setTrailerState({ isOpen: true, url, title });
  };

  // Filter movies based on category, search, and type
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = searchQuery === '' ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.sinhalaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' ||
      movie.genres.includes(selectedCategory) ||
      (selectedCategory === 'Sinhala Subbed' && movie.hasSinhalaSub) ||
      (selectedCategory === 'TV Series' && movie.isTVSeries) ||
      (selectedCategory === 'Dual Audio' && movie.isDualAudio);

    const matchesType = filterType === 'all' ||
      (filterType === 'movies' && !movie.isTVSeries) ||
      (filterType === 'series' && movie.isTVSeries);

    return matchesSearch && matchesCategory && matchesType;
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.imdbRating - a.imdbRating;
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(); // default 'latest'
  });

  const featuredMovies = movies.filter(m => m.isFeatured || m.isTrending);
  const tvSeriesList = sortedMovies.filter(m => m.isTVSeries);

  return (
    <div className="space-y-12 pb-16">

      {/* Featured Hero Carousel Slider */}
      {!searchQuery && selectedCategory === 'All' && (
        <HeroSlider
          movies={featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3)}
          onTrailerClick={handleOpenTrailer}
        />
      )}

      {/* Main Content Toolbar & Category Filters */}
      <section className="space-y-6">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">

          {/* Section Heading */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="w-2 h-7 rounded-full bg-gradient-to-b from-rose-600 via-rose-500 to-amber-400" />
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory !== 'All'
                  ? `${selectedCategory} Collection`
                  : siteSettings.latestMoviesTitle || 'අලුත්ම සිංහල උපසිරැසි (Latest Movies)'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Explore {sortedMovies.length} high-speed 1080p Sinhala subtitled releases
            </p>
          </div>

          {/* Controls: Type Filter & Sorting */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Type Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#121620] border border-white/10 text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Releases
              </button>
              <button
                onClick={() => setFilterType('movies')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'movies'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => setFilterType('series')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === 'series'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                TV Series
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-[#121620] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-gray-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-[#121620]">Latest Uploads</option>
                <option value="rating" className="bg-[#121620]">Highest IMDb Score</option>
                <option value="popular" className="bg-[#121620]">Most Popular</option>
                <option value="year" className="bg-[#121620]">Release Year</option>
              </select>
            </div>

          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-rose-500" /> Filter:
          </span>
          {['All', 'Action', 'Sci-Fi', 'Romance', 'Horror', 'Sinhala Subbed', 'TV Series', 'Anime', 'Dual Audio'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-md shadow-rose-600/30'
                  : 'bg-[#121620] text-gray-400 border border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Grid: Movies Display */}
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121620] rounded-3xl border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any titles matching your selected filters or search query. Try resetting your search.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setFilterType('all'); }}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-500"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* Grid Section 2: Trending TV Series Section (If on All view) */}
      {!searchQuery && selectedCategory === 'All' && tvSeriesList.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-rose-500" />
              {siteSettings.trendingSeriesTitle || 'Trending Sinhala Subbed TV Series'}
            </h2>
            <span className="text-xs text-rose-400 font-bold hover:underline cursor-pointer" onClick={() => setSelectedCategory('TV Series')}>
              View All Series →
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {tvSeriesList.slice(0, 6).map((movie) => (
              <MovieCard key={`tv_${movie.id}`} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerState.isOpen}
        onClose={() => setTrailerState({ isOpen: false, url: '', title: '' })}
        trailerUrl={trailerState.url}
        title={trailerState.title}
      />

    </div>
  );
};
