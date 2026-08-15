import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Star, Menu, X, Sparkles, Filter, ChevronRight, Megaphone, Users } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const Header: React.FC = () => {
  const { movies, siteSettings, analytics, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, logSearchQuery } = useMovies();
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
    logSearchQuery(searchQuery);
    setSearchQuery('');
    navigate(`/movie/${id}`);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', category: 'All' },
    { label: 'Sinhala Subbed', category: 'Sinhala Subbed' },
    { label: 'Movies', category: 'All' },
    { label: 'TV Series', category: 'TV Series' },
    { label: 'Genres', category: 'Action' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      {/* Dynamic Top Announcement Banner if enabled */}
      {siteSettings.showAnnouncement && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-red-950/80 via-rose-950/80 to-purple-950/80 border-b border-rose-500/20 px-4 py-1.5 text-center text-[11px] font-bold text-rose-300 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Megaphone className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-bounce" />
            <span className="truncate">{siteSettings.announcementText}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-400 text-[10px] font-extrabold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>🟢 Live Viewers Streaming Now: {(analytics?.activeStreams || 1482).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo Integration: Left-aligned responsive img */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/favicon.svg"
              alt="CINEXUS Logo"
              className="max-h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-500 bg-clip-text text-transparent">
                  {siteSettings.siteTitle || 'CINEXUS'}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-red-600/20 text-red-400 border border-red-500/30 uppercase tracking-widest">
                  SINHALASUB
                </span>
              </div>
              <p className="text-[10px] font-semibold text-rose-300/80 tracking-wider flex items-center gap-1">
                {siteSettings.sinhalaTitle || 'සිනෙක්ස්'} <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Sinhala Subtitled HD
              </p>
            </div>
          </Link>

          {/* Nav Menu Links: Clean navigation with subtle red hover highlights */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-gray-300">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCategorySelect(item.category)}
                className={`transition-colors duration-200 hover:text-red-500 ${
                  selectedCategory === item.category && item.label !== 'Home' && item.label !== 'Genres'
                    ? 'text-red-500 font-black'
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Compact Live Search Bar */}
          <div className="relative flex-1 max-w-xs md:max-w-sm mx-2" ref={searchRef}>
            <div className={`relative flex items-center rounded-2xl bg-[#121620]/90 border transition-all duration-300 ${
              isSearchFocused ? 'border-red-500/80 shadow-[0_0_20px_rgba(229,9,20,0.2)] bg-[#161a26]' : 'border-white/10 hover:border-white/20'
            }`}>
              <Search className={`w-4 h-4 ml-3.5 transition-colors ${isSearchFocused ? 'text-red-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search movies or Sinhala subbed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full py-2 px-3 bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Popup Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121620]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-red-950/30">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" /> Instant Results
                  </span>
                  <span className="text-[10px] text-gray-400">{searchSuggestions.length} found</span>
                </div>
                <div className="divide-y divide-white/5">
                  {searchSuggestions.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie.id)}
                      className="w-full p-3 flex items-center gap-3.5 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-rose-900/20 transition-all text-left group"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-xl shadow-md border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                            {movie.qualityBadge}
                          </span>
                          {movie.hasSinhalaSub && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                              Sinhala Sub
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-white group-hover:text-red-400 truncate mt-1 transition-colors">
                          {movie.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate leading-snug">{movie.sinhalaTitle}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {movie.imdbRating}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Header Right Action: Live active badge */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold whitespace-nowrap shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>🟢 Live Viewers: {(analytics?.activeStreams || 1482).toLocaleString()}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#121620] border border-white/10 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0b0e] border-b border-white/10 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-2 text-xs font-extrabold uppercase text-gray-300 border-b border-white/5 pb-3">
            {navLinks.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCategorySelect(item.category)}
                className="text-left py-1.5 hover:text-red-500 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div>
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1 mb-2">
              <Filter className="w-3.5 h-3.5 text-red-500" /> Quick Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategorySelect('All')}
                className={`px-3 py-2 text-xs font-bold rounded-xl text-left transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                    : 'bg-[#121620] text-gray-300 hover:bg-[#1a1e2b]'
                }`}
              >
                All Movies
              </button>
              {['Action', 'Sci-Fi', 'Romance', 'Horror', 'Sinhala Subbed', 'TV Series', 'Anime', 'Dual Audio'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl text-left transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-[#121620] text-gray-300 hover:bg-[#1a1e2b]'
                  }`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
