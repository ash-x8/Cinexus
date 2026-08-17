import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Star, Menu, X, Sparkles, Subtitles, Megaphone, Globe, User, Bookmark } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { ProfileAvatar } from './ProfileAvatar';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    movies,
    siteSettings,
    analytics,
    searchQuery,
    setSearchQuery,
    resetAllFilters,
    logSearchQuery,
    currentUser,
    watchlist
  } = useMovies();

  const { language, toggleLanguage, t } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      logSearchQuery(searchQuery);
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'Genres', path: '/genres' },
    { label: 'Discover', path: '/discover' },
    { label: 'My List', path: '/my-list', badge: watchlist.length > 0 ? watchlist.length : undefined },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-white/5 transition-all duration-300 bg-[#0A0A0E]/90 backdrop-blur-xl">
      {/* Dynamic Top Announcement Banner if enabled */}
      {siteSettings.showAnnouncement && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-[#170305] via-[#C80016]/90 to-[#170305] border-b border-[#FF0E25]/30 px-4 py-1.5 text-center text-[11px] font-bold text-white flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Megaphone className="w-3.5 h-3.5 text-[#FF0E25] shrink-0 animate-bounce" />
            <span className="truncate">{siteSettings.announcementText}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-400 text-[10px] font-extrabold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>🟢 {t('liveStreamers')}: {(analytics?.activeStreams || 1482).toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left Controls: Sidebar Drawer Toggle (Mobile) + CINEXUS Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="lg:hidden p-2.5 rounded-xl bg-[#121620] border border-white/10 text-gray-300 hover:text-white"
                title="Toggle Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* CINEXUS Logo */}
            <Link
              to="/"
              onClick={() => resetAllFilters()}
              className="flex items-center gap-3 focus:outline-none group"
              title="CINEXUS - Premium Movie Discovery"
            >
              <img
                src="/logo.png"
                alt="CINEXUS Official Logo"
                className="max-h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#FF0E25] bg-clip-text text-transparent">
                    {siteSettings.siteTitle || 'CINEXUS'}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 uppercase tracking-widest">
                    CINEMATIC
                  </span>
                </div>
                <p className="text-[10px] font-bold text-[#9E9EA0] tracking-wider flex items-center gap-1">
                  {siteSettings.sinhalaTitle || 'සිනෙක්ස්'} <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF0E25] animate-pulse" /> Sinhala Subtitled Cinema
                </p>
              </div>
            </Link>
          </div>

          {/* Nav Menu Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase tracking-wider text-gray-300">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative transition-colors duration-200 hover:text-[#FF0E25] flex items-center gap-1 ${
                    isActive ? 'text-[#FF0E25] font-black' : ''
                  }`
                }
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FF0E25] text-white text-[9px] font-black">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Compact Live Search Bar */}
          <div className="relative flex-1 max-w-xs md:max-w-sm mx-2" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`relative flex items-center rounded-2xl bg-[#121620]/90 border transition-all duration-300 ${
                isSearchFocused ? 'border-[#FF0E25] shadow-[0_0_20px_rgba(255,14,37,0.3)] bg-[#171b29]' : 'border-white/10 hover:border-white/20'
              }`}>
                <Search className={`w-4 h-4 ml-3.5 transition-colors ${isSearchFocused ? 'text-[#FF0E25]' : 'text-[#9E9EA0]'}`} />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full py-2 px-3 bg-transparent text-xs text-white placeholder-[#9E9EA0] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mr-3 text-[#9E9EA0] hover:text-white p-1 rounded-full hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Popup Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121620]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center bg-[#FF0E25]/20">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF0E25]" /> Search Results
                  </span>
                  <span className="text-[10px] text-[#9E9EA0]">{searchSuggestions.length} found</span>
                </div>
                <div className="divide-y divide-white/5">
                  {searchSuggestions.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie.id)}
                      className="w-full p-3 flex items-center gap-3.5 hover:bg-gradient-to-r hover:from-[#FF0E25]/20 hover:to-rose-900/20 transition-all text-left group"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-xl shadow-md border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF0E25]/20 text-[#FF0E25] font-bold border border-[#FF0E25]/30">
                            {movie.qualityBadge}
                          </span>
                          {movie.hasSinhalaSub && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold flex items-center gap-0.5">
                              <Subtitles className="w-3 h-3" /> Sinhala Sub
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-extrabold text-white group-hover:text-[#FF0E25] truncate mt-1 transition-colors">
                          {movie.title}
                        </h4>
                        <p className="text-[11px] text-[#9E9EA0] truncate leading-snug">{movie.sinhalaTitle}</p>
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

          {/* Right Action Bar: Language Toggle + Profile Link */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Header Language Switcher Button (EN | SI) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121620] border border-white/10 hover:border-[#FF0E25]/50 text-xs font-black transition-all shadow-md group"
              title="Switch UI Language (English / Sinhala)"
            >
              <Globe className="w-3.5 h-3.5 text-[#FF0E25] group-hover:rotate-180 transition-transform duration-500" />
              <span className={language === 'EN' ? 'text-[#FF0E25] font-black' : 'text-gray-400'}>EN</span>
              <span className="text-gray-600">|</span>
              <span className={language === 'SI' ? 'text-[#FF0E25] font-black' : 'text-gray-400'}>SI</span>
            </button>

            {/* Profile Avatar / Login Action */}
            <Link
              to={currentUser ? "/profile" : "/login"}
              className="flex items-center gap-2 p-1.5 sm:px-3 py-1.5 rounded-xl bg-[#121620] border border-white/10 hover:border-[#FF0E25]/50 transition-all"
              title={currentUser ? `Profile (${currentUser.username})` : "Sign In"}
            >
              {currentUser ? (
                <>
                  <ProfileAvatar size="sm" editable={false} />
                  <span className="hidden sm:inline text-xs font-bold text-white truncate max-w-[100px]">
                    {currentUser.username}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-[#FF0E25]" />
                  <span className="hidden sm:inline text-xs font-bold text-gray-300">Sign In</span>
                </>
              )}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};
