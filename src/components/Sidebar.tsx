import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Film,
  Globe2,
  Tag,
  Subtitles,
  Volume2,
  Sparkles,
  X,
  RotateCcw,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsedDesktop?: boolean;
  setIsCollapsedDesktop?: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  isCollapsedDesktop = false,
  setIsCollapsedDesktop
}) => {
  const {
    selectedContentType,
    setSelectedContentType,
    selectedLanguage,
    setSelectedLanguage,
    selectedGenre,
    setSelectedGenre,
    resetAllFilters
  } = useMovies();

  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Accordion open/close states
  const [contentTypeOpen, setContentTypeOpen] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(true);
  const [genresOpen, setGenresOpen] = useState(true);

  const contentTypes = [
    { label: 'Sinhala Subbed', value: 'Sinhala Sub', icon: <Subtitles className="w-3.5 h-3.5 text-[#FF0E25]" />, badge: 'CC' },
    { label: 'Without Sub / English', value: 'Without Sub / English', icon: <Volume2 className="w-3.5 h-3.5 text-blue-400" />, badge: 'EN' },
    { label: 'Sinhala Dubbed', value: 'Sinhala Dubbed', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />, badge: 'DUB' },
  ];

  const languages = [
    { label: 'Sinhala Movies', value: 'Sinhala', flag: '🇱🇰' },
    { label: 'Tamil Movies', value: 'Tamil', flag: '🇮🇳' },
    { label: 'Telugu Movies', value: 'Telugu', flag: '🇮🇳' },
    { label: 'Hindi Movies', value: 'Hindi', flag: '🇮🇳' },
    { label: 'Malayalam Movies', value: 'Malayalam', flag: '🇮🇳' },
    { label: 'Kannada Movies', value: 'Kannada', flag: '🇮🇳' },
    { label: 'English / Hollywood', value: 'English', flag: '🇺🇸' },
    { label: 'Japanese / Anime', value: 'Japanese', flag: '🇯🇵' },
    { label: 'Chinese / Asian Dramas', value: 'Chinese', flag: '🇨🇳' },
    { label: 'Korean / K-Dramas', value: 'Korean', flag: '🇰🇷' },
  ];

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  const handleSelectContentType = (type: string) => {
    setSelectedContentType(selectedContentType === type ? 'All' : type);
    if (location.pathname !== '/') navigate('/');
    if (onClose) onClose();
  };

  const handleSelectLanguage = (lang: string) => {
    setSelectedLanguage(selectedLanguage === lang ? 'All' : lang);
    if (location.pathname !== '/') navigate('/');
    if (onClose) onClose();
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? 'All' : genre);
    if (location.pathname !== '/') navigate('/');
    if (onClose) onClose();
  };

  const hasActiveFilters = selectedContentType !== 'All' || selectedLanguage !== 'All' || selectedGenre !== 'All';

  return (
    <aside
      className={`bg-[#0A0A0E]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 flex flex-col h-full ${
        isCollapsedDesktop ? 'w-16' : 'w-64 sm:w-72'
      }`}
    >
      {/* Sidebar Top Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
        {!isCollapsedDesktop && (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white tracking-wider uppercase">
                {t('sidebarTitle')}
              </h3>
              <p className="text-[10px] text-[#9E9EA0]">Cinesub Filter Portal</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {/* Active Reset Button */}
          {hasActiveFilters && !isCollapsedDesktop && (
            <button
              onClick={resetAllFilters}
              className="p-1.5 rounded-lg bg-[#FF0E25]/20 text-rose-300 hover:bg-[#FF0E25] hover:text-white transition-colors text-[10px] font-bold flex items-center gap-1"
              title="Reset All Filters"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}

          {/* Desktop Collapse/Expand Toggle */}
          {setIsCollapsedDesktop && (
            <button
              onClick={() => setIsCollapsedDesktop(!isCollapsedDesktop)}
              className="hidden lg:flex p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[#FF0E25] transition-colors"
              title={isCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsedDesktop ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Close Drawer Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-white/5 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion Content Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs scrollbar-thin scrollbar-thumb-white/10">

        {/* SECTION A: Content Type */}
        <div className="rounded-2xl bg-[#121620]/80 border border-white/5 overflow-hidden">
          <button
            onClick={() => setContentTypeOpen(!contentTypeOpen)}
            className="w-full p-3 flex items-center justify-between text-left font-extrabold text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF0E25]" />
              {!isCollapsedDesktop && t('contentType')}
            </span>
            {!isCollapsedDesktop && (
              contentTypeOpen ? <ChevronDown className="w-4 h-4 text-[#9E9EA0]" /> : <ChevronRight className="w-4 h-4 text-[#9E9EA0]" />
            )}
          </button>

          {(contentTypeOpen || isCollapsedDesktop) && (
            <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-1">
              {contentTypes.map((item) => {
                const isSelected = selectedContentType === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => handleSelectContentType(item.value)}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.icon}
                      {!isCollapsedDesktop && <span className="truncate">{item.label}</span>}
                    </div>
                    {!isCollapsedDesktop && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        isSelected ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION B: Language / Industry Section */}
        <div className="rounded-2xl bg-[#121620]/80 border border-white/5 overflow-hidden">
          <button
            onClick={() => setLanguageOpen(!languageOpen)}
            className="w-full p-3 flex items-center justify-between text-left font-extrabold text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-400" />
              {!isCollapsedDesktop && t('languages')}
            </span>
            {!isCollapsedDesktop && (
              languageOpen ? <ChevronDown className="w-4 h-4 text-[#9E9EA0]" /> : <ChevronRight className="w-4 h-4 text-[#9E9EA0]" />
            )}
          </button>

          {(languageOpen || isCollapsedDesktop) && (
            <div className="px-2 pb-2 space-y-1 border-t border-white/5 pt-1 max-h-64 overflow-y-auto">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.value;
                return (
                  <button
                    key={lang.value}
                    onClick={() => handleSelectLanguage(lang.value)}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-left font-bold transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    title={lang.label}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm shrink-0">{lang.flag}</span>
                      {!isCollapsedDesktop && <span className="truncate">{lang.label}</span>}
                    </div>
                    {isSelected && !isCollapsedDesktop && (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION C: Genres (ජානර) Section */}
        <div className="rounded-2xl bg-[#121620]/80 border border-white/5 overflow-hidden">
          <button
            onClick={() => setGenresOpen(!genresOpen)}
            className="w-full p-3 flex items-center justify-between text-left font-extrabold text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              {!isCollapsedDesktop && `${t('genres')} (ජානර)`}
            </span>
            {!isCollapsedDesktop && (
              genresOpen ? <ChevronDown className="w-4 h-4 text-[#9E9EA0]" /> : <ChevronRight className="w-4 h-4 text-[#9E9EA0]" />
            )}
          </button>

          {(genresOpen || isCollapsedDesktop) && (
            <div className="p-2 border-t border-white/5">
              {!isCollapsedDesktop ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {genres.map((genre) => {
                    const isSelected = selectedGenre === genre;
                    return (
                      <button
                        key={genre}
                        onClick={() => handleSelectGenre(genre)}
                        className={`px-2.5 py-1.5 rounded-xl text-left font-bold truncate text-[11px] transition-all ${
                          isSelected
                            ? 'bg-[#FF0E25] text-white shadow-sm'
                            : 'bg-black/30 text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {genres.slice(0, 5).map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleSelectGenre(genre)}
                      className="w-full p-1.5 rounded-lg text-center text-[10px] font-bold text-gray-300 hover:text-white"
                      title={genre}
                    >
                      {genre.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Footer Info */}
      {!isCollapsedDesktop && (
        <div className="p-3 border-t border-white/10 bg-[#090A0F] text-[10px] text-[#9E9EA0] text-center">
          <p className="font-semibold">CINEXUS • Cinesub Filter Engine</p>
        </div>
      )}
    </aside>
  );
};
