import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { Search, X, Filter, History, Film, Sparkles, SlidersHorizontal } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { movies, analytics, logSearchQuery } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedQuality, setSelectedQuality] = useState<string>('All');

  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      logSearchQuery(query.trim());
      setSearchParams({ q: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleSelectRecentSearch = (term: string) => {
    setQuery(term);
    logSearchQuery(term);
    setSearchParams({ q: term });
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchParams({});
  };

  // Search matching multi-fields: Title, Sinhala Title, Original Title, Cast, Director, Genre, Year, Language
  const matchingMovies = movies.filter(movie => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || (
      movie.title.toLowerCase().includes(q) ||
      movie.sinhalaTitle.toLowerCase().includes(q) ||
      (movie.originalTitle && movie.originalTitle.toLowerCase().includes(q)) ||
      movie.director.toLowerCase().includes(q) ||
      movie.genres.some(g => g.toLowerCase().includes(q)) ||
      movie.year.toString().includes(q) ||
      movie.language.toLowerCase().includes(q) ||
      movie.cast.some(actor => typeof actor === 'string' ? actor.toLowerCase().includes(q) : actor.name.toLowerCase().includes(q))
    );

    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage;
    const matchesYear = selectedYear === 'All' || movie.year.toString() === selectedYear;
    const matchesQuality = selectedQuality === 'All' || movie.qualityBadge.toLowerCase().includes(selectedQuality.toLowerCase());

    return matchesQuery && matchesGenre && matchesLanguage && matchesYear && matchesQuality;
  });

  const recentSearches = analytics?.recentSearches || ['Avatar 2', 'Dune Part Two', 'Demon Slayer', 'Stranger Things'];
  const genres = ['All', 'Action', 'Sci-Fi', 'Romance', 'Horror', 'Adventure', 'Drama', 'Crime', 'Anime', 'TV Series'];
  const languages = ['All', 'Tamil', 'Hindi', 'English', 'Sinhala', 'Malayalam', 'Telugu', 'Japanese'];
  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2014'];
  const qualities = ['All', '4K', '1080p', '720p', 'WEB-DL'];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">

      {/* Search Header Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-white/10 shadow-2xl space-y-4">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-[#FF0E25]" /> Search CINEXUS Library
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex items-center rounded-2xl bg-[#0A0A0E] border border-white/20 focus-within:border-[#FF0E25] focus-within:shadow-[0_0_20px_rgba(255,14,37,0.3)] transition-all">
            <Search className="w-5 h-5 ml-4 text-[#9E9EA0]" />
            <input
              type="text"
              placeholder="Search by movie title, sinhala title, actor, director, genre, year, or language..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 px-4 bg-transparent text-sm sm:text-base text-white placeholder-[#9E9EA0] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mr-3 text-[#9E9EA0] hover:text-white p-1.5 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="mr-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>

        {/* Recent Search Terms */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-[#9E9EA0] font-bold flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-[#FF0E25]" /> Recent Searches:
            </span>
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectRecentSearch(term)}
                className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[#FF0E25] font-semibold transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filter Toolbar */}
      <section className="bg-[#121620]/90 p-4 sm:p-5 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#FF0E25]" /> Narrow Search Results
          </span>
          <span className="text-xs text-[#9E9EA0] font-bold">{matchingMovies.length} Movies Found</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">

          <div>
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase block mb-1">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2 rounded-xl border border-white/10 focus:outline-none"
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase block mb-1">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2 rounded-xl border border-white/10 focus:outline-none"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase block mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2 rounded-xl border border-white/10 focus:outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase block mb-1">Quality</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2 rounded-xl border border-white/10 focus:outline-none"
            >
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

        </div>
      </section>

      {/* Results Display */}
      <section className="space-y-4">
        {matchingMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {matchingMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onTrailerClick={(url, title) => setTrailerModal({ isOpen: true, url, title })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121620] rounded-3xl border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF0E25]/10 text-[#FF0E25] mx-auto flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-[#9E9EA0] max-w-sm mx-auto">
              We couldn't find any movies matching "{query}". Try checking your spelling or selecting different search filters.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 rounded-xl bg-[#FF0E25] text-white font-bold text-xs shadow-md hover:bg-[#C80016]"
            >
              Reset Search
            </button>
          </div>
        )}
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() => setTrailerModal({ ...trailerModal, isOpen: false })}
        trailerUrl={trailerModal.url}
        title={trailerModal.title}
      />
    </div>
  );
};
