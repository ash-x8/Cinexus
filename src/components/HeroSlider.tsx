import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Sparkles, ChevronLeft, ChevronRight, Subtitles, Flame, Volume2, Globe } from 'lucide-react';
import type { Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeroSliderProps {
  movies: Movie[];
  onTrailerClick: (url: string, title: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ movies, onTrailerClick }) => {
  const { t } = useLanguage();
  const featuredMovies = movies.filter(m => m.isFeatured || m.isTrending);
  const slideList = featuredMovies.length > 0 ? featuredMovies : movies;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slideList.length]);

  if (slideList.length === 0) return null;

  const currentMovie = slideList[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slideList.length);
  };

  const primaryLang = currentMovie.language || currentMovie.languages?.[0] || 'English';

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl group bg-[#121620]">

      {/* Background Image with Backdrop Blur Gradient */}
      <div className="relative min-h-[440px] md:min-h-[500px] w-full flex items-center">
        <img
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.4] transition-all duration-700 scale-105"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0E] via-[#0A0A0E]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-transparent to-black/40" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-3xl space-y-4">

          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF0E25] to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-[#FF0E25]/20">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              Featured Release
            </span>

            {currentMovie.hasSinhalaSub && (
              <span className="px-3 py-1 rounded-full bg-purple-600/90 border border-purple-400/40 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1 shadow-lg">
                <Subtitles className="w-3.5 h-3.5 text-cyan-300" />
                [CC] Sinhala Sub
              </span>
            )}

            {currentMovie.contentType === 'Sinhala Dubbed' && (
              <span className="px-3 py-1 rounded-full bg-emerald-600/90 border border-emerald-400/40 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1 shadow-lg">
                <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
                [🔊] Sinhala Dubbed
              </span>
            )}

            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-rose-300 font-bold text-xs">
              🌐 {primaryLang}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#FF0E25]/20 border border-[#FF0E25]/30 text-[#FF0E25] font-black text-xs">
              {currentMovie.qualityBadge}
            </span>
          </div>

          {/* Title & Sinhala Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
              {currentMovie.title}
            </h1>
            <p className="text-lg sm:text-2xl font-bold text-[#FF0E25] mt-1 drop-shadow">
              {currentMovie.sinhalaTitle}
            </p>
          </div>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-gray-300">
            <div className="flex items-center gap-1 text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{currentMovie.imdbRating.toFixed(1)}</span> / 10 IMDb
            </div>
            <span>{currentMovie.year}</span>
            <span>•</span>
            <span>{currentMovie.duration}</span>
            <span>•</span>
            <span className="text-rose-300">{currentMovie.genres.join(', ')}</span>
          </div>

          {/* Plot Summary with line-height 1.8 */}
          <p className="text-xs sm:text-sm text-gray-200/90 line-clamp-3 leading-[1.8] max-w-2xl font-normal">
            {currentMovie.sinhalaPlot || currentMovie.englishPlot}
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to={`/movie/${currentMovie.id}`}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-95 text-white font-black text-sm tracking-wide shadow-lg shadow-[#FF0E25]/30 hover:shadow-[#FF0E25]/50 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
              {t('watchNow')}
            </Link>

            {currentMovie.trailerUrl && (
              <button
                onClick={() => onTrailerClick(currentMovie.trailerUrl, currentMovie.title)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-bold text-sm flex items-center gap-2 transition-all hover:border-[#FF0E25]"
              >
                <Sparkles className="w-4 h-4 text-[#FF0E25]" />
                Trailer
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Manual Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-[#FF0E25] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF0E25] hover:text-white z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-[#FF0E25] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#FF0E25] hover:text-white z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
        {slideList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-8 bg-[#FF0E25]' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  );
};
