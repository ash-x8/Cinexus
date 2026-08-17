import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import {
  Sparkles,
  Shuffle,
  TrendingUp,
  Star,
  Clock,
  Compass,
  Filter,
  ArrowUpDown,
  Subtitles,
  Flame,
  Gem,
  Play
} from 'lucide-react';
import type { Movie } from '../types';

export const DiscoverPage: React.FC = () => {
  const { movies } = useMovies();
  const navigate = useNavigate();

  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedQuality, setSelectedQuality] = useState<string>('All');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);

  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const handleRandomize = () => {
    if (movies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * movies.length);
    const chosen = movies[randomIndex];
    setRandomMovie(chosen);
  };

  // Filter logic
  const filteredMovies = movies.filter(movie => {
    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    const matchesLanguage = selectedLanguage === 'All' || movie.language === selectedLanguage || movie.languages?.includes(selectedLanguage);
    const matchesQuality = selectedQuality === 'All' || movie.qualityBadge.toLowerCase().includes(selectedQuality.toLowerCase());
    const matchesSub = selectedSubtitle === 'All' ||
      (selectedSubtitle === 'sub' && (movie.hasSinhalaSub || movie.contentType === 'Sinhala Sub')) ||
      (selectedSubtitle === 'dub' && movie.contentType === 'Sinhala Dubbed');

    return matchesGenre && matchesLanguage && matchesQuality && matchesSub;
  });

  // Sorting logic
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.imdbRating - a.imdbRating;
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'latest') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    return b.viewsCount - a.viewsCount; // default 'popular'
  });

  const trendingList = movies.filter(m => m.isTrending);
  const topRatedList = [...movies].sort((a, b) => b.imdbRating - a.imdbRating).slice(0, 5);
  const hiddenGems = movies.filter(m => m.imdbRating >= 7.5 && m.viewsCount < 50000).slice(0, 5);

  const genres = ['All', 'Action', 'Sci-Fi', 'Romance', 'Horror', 'Adventure', 'Drama', 'Crime', 'Anime', 'TV Series'];
  const languages = ['All', 'Tamil', 'Hindi', 'English', 'Sinhala', 'Malayalam', 'Telugu', 'Japanese', 'Korean'];
  const qualities = ['All', '4K', '1080p', '720p', 'WEB-DL'];

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#170305] via-[#121620] to-[#0A0A0E] border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF0E25]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4" /> Cinematic Explorer
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discover Your Next Movie
          </h1>
          <p className="text-xs sm:text-sm text-[#9E9EA0] leading-relaxed">
            Explore curated collections, trending blockbusters, high-rated gems, or hit the random generator to find instant entertainment.
          </p>

          {/* Surprise Random Generator Button */}
          <button
            onClick={handleRandomize}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all transform hover:scale-105"
          >
            <Shuffle className="w-4 h-4 animate-spin-slow" />
            <span>Surprise Me (Random Movie)</span>
          </button>
        </div>
      </div>

      {/* Random Movie Popup Card (If clicked) */}
      {randomMovie && (
        <div className="bg-[#121620] p-6 rounded-3xl border border-[#FF0E25]/40 shadow-2xl flex flex-col md:flex-row items-center gap-6 animate-in zoom-in-95 duration-200">
          <img
            src={randomMovie.posterUrl}
            alt={randomMovie.title}
            className="w-32 aspect-[2/3] object-cover rounded-2xl border border-white/10 shadow-lg shrink-0"
          />
          <div className="space-y-2 flex-1 text-center md:text-left">
            <span className="text-xs font-bold text-[#FF0E25] uppercase tracking-wider flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Random Selection
            </span>
            <h3 className="text-xl font-extrabold text-white">{randomMovie.title}</h3>
            <p className="text-xs text-rose-300 font-bold">{randomMovie.sinhalaTitle}</p>
            <p className="text-xs text-[#9E9EA0] line-clamp-2">{randomMovie.englishPlot || randomMovie.sinhalaPlot}</p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => navigate(`/movie/${randomMovie.id}`)}
                className="px-4 py-2 rounded-xl bg-[#FF0E25] text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#C80016]"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Watch Now
              </button>
              <button
                onClick={() => setRandomMovie(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-bold text-xs hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sorting Controls Toolbar */}
      <section className="bg-[#121620]/90 p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF0E25]" /> Custom Discovery Filters
          </h2>
          <span className="text-xs text-[#9E9EA0] font-bold">{sortedMovies.length} Titles Found</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">

          {/* Genre Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2.5 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Language Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2.5 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Quality Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase">Quality</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2.5 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            >
              {qualities.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>

          {/* Subtitle Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase">Subtitle / Audio</label>
            <select
              value={selectedSubtitle}
              onChange={(e) => setSelectedSubtitle(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2.5 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="sub">Sinhala Subtitled</option>
              <option value="dub">Sinhala Dubbed</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#9E9EA0] uppercase">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#0A0A0E] text-white font-bold p-2.5 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="latest">Latest Releases</option>
              <option value="year">Release Year</option>
              <option value="title">A-Z Title</option>
            </select>
          </div>

        </div>
      </section>

      {/* Main Filtered Grid Display */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#FF0E25]" /> Catalog Exploration Results
        </h2>

        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onTrailerClick={(url, title) => setTrailerModal({ isOpen: true, url, title })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#121620] rounded-3xl border border-white/10 space-y-3">
            <Compass className="w-12 h-12 text-[#FF0E25] mx-auto" />
            <h3 className="text-lg font-bold text-white">No Movies Match Your Criteria</h3>
            <p className="text-xs text-[#9E9EA0]">Try resetting one or more discovery filters above.</p>
          </div>
        )}
      </section>

      {/* Curated Collection Sections */}
      {selectedGenre === 'All' && (
        <>
          {/* Top Rated Section */}
          <section className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Highest Rated Masterpieces
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {topRatedList.map((movie) => (
                <MovieCard key={`top_${movie.id}`} movie={movie} />
              ))}
            </div>
          </section>

          {/* Hidden Gems Section */}
          <section className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-400" /> Hidden Gems You Might Have Missed
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {hiddenGems.map((movie) => (
                <MovieCard key={`gem_${movie.id}`} movie={movie} />
              ))}
            </div>
          </section>
        </>
      )}

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
