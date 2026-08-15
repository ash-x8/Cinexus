import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { HeroSlider } from '../components/HeroSlider';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { SkeletonCard, SkeletonHero } from '../components/SkeletonLoader';
import { Sparkles, Tv, Clapperboard, Filter, ArrowUpDown } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { movies, categories, selectedCategory, setSelectedCategory, sortBy, setSortBy, searchQuery } = useMovies();
  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const [isLoading] = useState(false);

  // Filter movies
  let filteredMovies = movies.filter(movie => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q) || movie.sinhalaTitle.toLowerCase().includes(q);
      const matchGenre = movie.genres.some(g => g.toLowerCase().includes(q));
      return matchTitle || matchGenre;
    }

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Sinhala Subbed') return movie.hasSinhalaSub;
    if (selectedCategory === 'TV Series') return movie.isTVSeries;
    if (selectedCategory === 'Dual Audio') return movie.isDualAudio;

    return movie.genres.some(g => g.toLowerCase() === selectedCategory.toLowerCase());
  });

  // Sort movies
  filteredMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.imdbRating - a.imdbRating;
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
    // Default 'latest'
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const handleOpenTrailer = (url: string, title: string) => {
    setTrailerModal({ isOpen: true, url, title });
  };

  // Split into structured grid sections for homepage if no search filter active
  const latestSinhalaMovies = movies.filter(m => m.hasSinhalaSub && !m.isTVSeries);
  const trendingSeries = movies.filter(m => m.isTVSeries);
  const popularCollections = movies.filter(m => m.viewsCount > 30000 || m.isDualAudio);

  return (
    <div className="space-y-12 pb-12">

      {/* Featured Hero Slider */}
      {!searchQuery && selectedCategory === 'All' && (
        <section>
          {isLoading ? (
            <SkeletonHero />
          ) : (
            <HeroSlider movies={movies} onTrailerClick={handleOpenTrailer} />
          )}
        </section>
      )}

      {/* Filter and Sorting Header Toolbar */}
      <section className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 shadow-lg">

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                : 'bg-[#12151e] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            All Movies
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#12151e] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-cyan-300/80 font-normal">({cat.sinhalaName})</span>
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" /> Sort:
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#12151e] text-xs font-bold text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="latest">Latest Uploads</option>
            <option value="rating">IMDb Rating</option>
            <option value="popular">Most Popular</option>
            <option value="year">Release Year</option>
          </select>
        </div>

      </section>

      {/* Filtered Grid View if category filter or search active */}
      {(selectedCategory !== 'All' || searchQuery) ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Movies`}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Found {filteredMovies.length} titles matching criteria</p>
            </div>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border border-white/10">
              <Clapperboard className="w-16 h-16 mx-auto text-gray-600 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white">No Movies Found</h3>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or selected category filter.</p>
              <button
                onClick={() => { setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-purple-600 text-xs font-bold text-white rounded-xl hover:bg-purple-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onTrailerClick={handleOpenTrailer} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Standard Categorized Home Sections */
        <div className="space-y-12">

          {/* Section 1: Latest Sinhala Subtitled Movies */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full" />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                  අලුත්ම සිංහල උපසිරැසි චිත්‍රපට (Latest Sinhala Subbed Movies)
                </h2>
              </div>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High Speed Downloads
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : latestSinhalaMovies.slice(0, 6).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onTrailerClick={handleOpenTrailer} />
                  ))}
            </div>
          </section>

          {/* Section 2: Trending TV Series */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-rose-500 rounded-full" />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <Tv className="w-5 h-5 text-purple-400" />
                  Trending TV Series & Anime (කථාමාලා)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : trendingSeries.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onTrailerClick={handleOpenTrailer} />
                  ))}
            </div>
          </section>

          {/* Section 3: Popular Collections & Dual Audio */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Popular High Rating Cinema (ජනප්‍රියම එකතුව)
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : popularCollections.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onTrailerClick={handleOpenTrailer} />
                  ))}
            </div>
          </section>

        </div>
      )}

      {/* Trailer Video Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
        trailerUrl={trailerModal.url}
        title={trailerModal.title}
      />
    </div>
  );
};
