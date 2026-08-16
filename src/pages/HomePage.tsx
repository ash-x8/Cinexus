import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { MovieCard } from '../components/MovieCard';
import { HeroSlider } from '../components/HeroSlider';
import { TrailerModal } from '../components/TrailerModal';
import { Sidebar } from '../components/Sidebar';
import { Sparkles, TrendingUp, Filter, ArrowUpDown, X, RotateCcw, Layers, Globe2, Tag } from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    movies,
    siteSettings,
    selectedCategory,
    setSelectedCategory,
    selectedContentType,
    setSelectedContentType,
    selectedLanguage,
    setSelectedLanguage,
    selectedGenre,
    setSelectedGenre,
    resetAllFilters,
    sortBy,
    setSortBy,
    searchQuery
  } = useMovies();

  const { t } = useLanguage();

  // Desktop sidebar collapsed state
  const [isSidebarCollapsedDesktop, setIsSidebarCollapsedDesktop] = useState(false);
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

  // Advanced multi-filter logic combining Search, Category, ContentType, Language, Genre, and Release Type
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = searchQuery === '' ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.sinhalaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' ||
      movie.genres.includes(selectedCategory) ||
      (selectedCategory === 'Sinhala Subbed' && (movie.hasSinhalaSub || movie.contentType === 'Sinhala Sub')) ||
      (selectedCategory === 'TV Series' && movie.isTVSeries) ||
      (selectedCategory === 'Dual Audio' && movie.isDualAudio);

    const matchesContentType = selectedContentType === 'All' ||
      (selectedContentType === 'Sinhala Sub' && (movie.contentType === 'Sinhala Sub' || movie.hasSinhalaSub)) ||
      (selectedContentType === 'Without Sub / English' && movie.contentType === 'Without Sub / English') ||
      (selectedContentType === 'Sinhala Dubbed' && movie.contentType === 'Sinhala Dubbed');

    const matchesLanguage = selectedLanguage === 'All' ||
      movie.language === selectedLanguage ||
      movie.languages?.includes(selectedLanguage) ||
      movie.audioLanguage?.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);

    const matchesType = filterType === 'all' ||
      (filterType === 'movies' && !movie.isTVSeries) ||
      (filterType === 'series' && movie.isTVSeries);

    return matchesSearch && matchesCategory && matchesContentType && matchesLanguage && matchesGenre && matchesType;
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

  const hasActiveMultiFilters =
    selectedCategory !== 'All' ||
    selectedContentType !== 'All' ||
    selectedLanguage !== 'All' ||
    selectedGenre !== 'All' ||
    searchQuery !== '';

  return (
    <div className="flex gap-6 pb-16 animate-in fade-in duration-300">

      {/* Cinesub-Style Collapsible Sidebar (Desktop) */}
      <div className="hidden lg:block shrink-0 sticky top-24 h-[calc(100vh-7rem)]">
        <Sidebar
          isCollapsedDesktop={isSidebarCollapsedDesktop}
          setIsCollapsedDesktop={setIsSidebarCollapsedDesktop}
        />
      </div>

      {/* Main Catalog View Container */}
      <div className="flex-1 space-y-8 min-w-0">

        {/* Featured Hero Carousel Slider (When no strict search or multi-filters) */}
        {!hasActiveMultiFilters && (
          <HeroSlider
            movies={featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3)}
            onTrailerClick={handleOpenTrailer}
          />
        )}

        {/* Multi-Filter Bar & Section Toolbar */}
        <section className="space-y-4">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">

            {/* Section Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 rounded-full bg-gradient-to-b from-[#FF0E25] via-[#C80016] to-amber-400" />
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : hasActiveMultiFilters
                    ? 'Filtered Movie Catalog'
                    : siteSettings.latestMoviesTitle || t('latestReleases')}
              </h2>
              <p className="text-xs text-[#9E9EA0] mt-1">
                Showing {sortedMovies.length} high-speed 1080p & 4K subtitled & dubbed releases
              </p>
            </div>

            {/* Controls: Type Switcher & Sorting */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Type Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#121620] border border-white/10 text-xs font-bold">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'all'
                      ? 'bg-[#FF0E25] text-white shadow-md'
                      : 'text-[#9E9EA0] hover:text-white'
                  }`}
                >
                  {t('allReleases')}
                </button>
                <button
                  onClick={() => setFilterType('movies')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'movies'
                      ? 'bg-[#FF0E25] text-white shadow-md'
                      : 'text-[#9E9EA0] hover:text-white'
                  }`}
                >
                  {t('movies')}
                </button>
                <button
                  onClick={() => setFilterType('series')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterType === 'series'
                      ? 'bg-[#FF0E25] text-white shadow-md'
                      : 'text-[#9E9EA0] hover:text-white'
                  }`}
                >
                  {t('tvSeries')}
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-[#121620] border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#FF0E25]" />
                <span className="text-[#9E9EA0] font-medium">{t('sort')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="latest" className="bg-[#121620]">{t('latestUploads')}</option>
                  <option value="rating" className="bg-[#121620]">{t('highestRating')}</option>
                  <option value="popular" className="bg-[#121620]">{t('mostPopular')}</option>
                  <option value="year" className="bg-[#121620]">{t('releaseYear')}</option>
                </select>
              </div>

            </div>

          </div>

          {/* Active Multi-Filter Tag Chips Bar */}
          {hasActiveMultiFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#121620]/90 border border-[#FF0E25]/30">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#FF0E25]" /> Active Filters:
              </span>

              {selectedContentType !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 text-xs font-bold">
                  <Layers className="w-3 h-3" /> Type: {selectedContentType}
                  <button onClick={() => setSelectedContentType('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedLanguage !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
                  <Globe2 className="w-3 h-3" /> Lang: {selectedLanguage}
                  <button onClick={() => setSelectedLanguage('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedGenre !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                  <Tag className="w-3 h-3" /> Genre: {selectedGenre}
                  <button onClick={() => setSelectedGenre('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                  Cat: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-white"><X className="w-3 h-3" /></button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="ml-auto text-xs font-bold text-rose-400 hover:text-white flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" /> Clear All Filters
              </button>
            </div>
          )}

          {/* Quick Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Sinhala Subbed', 'Action', 'Sci-Fi', 'Romance', 'Horror', 'TV Series', 'Anime', 'Dual Audio'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
                    : 'bg-[#121620] text-[#9E9EA0] border border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Main Grid: Movies Display */}
          {sortedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {sortedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#121620] rounded-3xl border border-white/10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FF0E25]/10 text-[#FF0E25] mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('noMoviesFound')}</h3>
              <p className="text-xs text-[#9E9EA0] max-w-sm mx-auto">
                We couldn't find any titles matching your selected multi-filters or search query.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#FF0E25] text-white font-bold text-xs shadow-md hover:bg-[#C80016]"
              >
                {t('resetFilters')}
              </button>
            </div>
          )}

        </section>

        {/* Trending TV Series Section (If on default view) */}
        {!hasActiveMultiFilters && tvSeriesList.length > 0 && (
          <section className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF0E25]" />
                {siteSettings.trendingSeriesTitle || 'Trending Sinhala Subbed TV Series'}
              </h2>
              <span
                className="text-xs text-rose-400 font-bold hover:underline cursor-pointer"
                onClick={() => setSelectedCategory('TV Series')}
              >
                View All Series →
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {tvSeriesList.slice(0, 5).map((movie) => (
                <MovieCard key={`tv_${movie.id}`} movie={movie} />
              ))}
            </div>
          </section>
        )}

      </div>

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
