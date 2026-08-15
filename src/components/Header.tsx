import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Star, Shield, Menu, X, Flame, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const Header: React.FC = () => {
  const { movies, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useMovies();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Instant predictive search suggestions (up to 5 items)
  const searchSuggestions = searchQuery.trim() === ''
    ? []
    : movies.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sinhalaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMovie = (id: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/movie/${id}`);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-900/40 group-hover:shadow-cyan-500/30 transition-all duration-300">
              <div className="w-full h-full bg-[#08090c] rounded-[10px] flex items-center justify-center">
                <Film className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent">
                  CINEXUS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">
                  SITE
                </span>
              </div>
              <p className="text-[11px] font-semibold text-purple-300/80 tracking-widest flex items-center gap-1">
                සිනෙක්ස් <span className="inline-block w-1 h-1 rounded-full bg-cyan-400 animate-pulse" /> Sinhala Subbed
              </p>
            </div>
          </Link>

          {/* Live Predictive Search Bar (Desktop) */}
          <div className="hidden md:block relative flex-1 max-w-md mx-8" ref={searchRef}>
            <div className={`relative flex items-center rounded-xl bg-[#12151e]/90 border transition-all duration-300 ${
              isSearchFocused ? 'border-cyan-400/80 shadow-[0_0_20px_rgba(0,223,216,0.15)] bg-[#161a26]' : 'border-white/10 hover:border-white/20'
            }`}>
              <Search className={`w-5 h-5 ml-4 transition-colors ${isSearchFocused ? 'text-cyan-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search Sinhala Subbed Movies, TV Series, Directors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full py-2.5 px-3 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Popup Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#12151e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-purple-950/20">
                  <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Instant Results
                  </span>
                  <span className="text-[11px] text-gray-400">{searchSuggestions.length} found</span>
                </div>
                <div className="divide-y divide-white/5">
                  {searchSuggestions.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie.id)}
                      className="w-full p-3 flex items-center gap-3.5 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-cyan-900/20 transition-all text-left group"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-md shadow-md border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                            {movie.qualityBadge}
                          </span>
                          {movie.hasSinhalaSub && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                              Sinhala Sub
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 truncate mt-1 transition-colors">
                          {movie.title}
                        </h4>
                        <p className="text-xs text-purple-200/70 truncate">{movie.sinhalaTitle}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {movie.imdbRating}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Admin & Action Nav */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/admin"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/70 hover:to-indigo-800/70 border border-purple-500/30 text-purple-200 hover:text-white flex items-center gap-2 transition-all shadow-md hover:shadow-purple-500/20"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 text-xs font-semibold rounded-lg bg-purple-900/40 border border-purple-500/30 text-purple-300"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#12151e] border border-white/10 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        <div className="md:hidden pb-4">
          <div className="relative flex items-center rounded-xl bg-[#12151e] border border-white/10">
            <Search className="w-4 h-4 ml-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies or Sinhala subbed series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mr-3 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f17] border-b border-white/10 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <div>
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1 mb-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Quick Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold'
                    : 'bg-[#12151e] text-gray-300 hover:bg-[#1a1e2b]'
                }`}
              >
                All Movies
              </button>
              {['Action', 'Sci-Fi', 'Romance', 'Horror', 'Sinhala Subbed', 'TV Series', 'Anime', 'Dual Audio'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-[#12151e] text-gray-300 hover:bg-[#1a1e2b]'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3 h-3 text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
