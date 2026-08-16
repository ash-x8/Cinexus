import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Subtitles, Download, Sparkles } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onTrailerClick?: (trailerUrl: string, title: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onTrailerClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden flex flex-col justify-between h-full transform transition-all duration-300">

      {/* Top Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#090A0F]">

        {/* Skeleton placeholder before image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
        )}

        {/* Poster Image with lazy loading and hover zoom */}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dark Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none z-10">

          {/* IMDb Score Tag */}
          <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-500/30 text-amber-400 text-xs font-black shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {movie.imdbRating.toFixed(1)}
          </div>

          {/* Quality Badge */}
          <span className="px-2 py-0.5 rounded-lg bg-[#FF0E25] text-white font-black text-[10px] tracking-wider uppercase shadow-lg">
            {movie.qualityBadge}
          </span>
        </div>

        {/* Sinhala Subtitle Badge */}
        {movie.hasSinhalaSub && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border border-purple-400/30 text-white font-bold text-[11px] shadow-lg">
              <Subtitles className="w-3 h-3 text-cyan-300" />
              සිංහල උපසිරැසි
            </span>
          </div>
        )}

        {/* Hover Action Play Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 p-4">
          <Link
            to={`/movie/${movie.id}`}
            className="w-12 h-12 rounded-full bg-[#FF0E25] hover:bg-[#C80016] text-white flex items-center justify-center shadow-lg shadow-[#FF0E25]/50 transform group-hover:scale-110 transition-all"
            title="Watch Now"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </Link>

          {onTrailerClick && movie.trailerUrl && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onTrailerClick(movie.trailerUrl, movie.title);
              }}
              className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-xs font-bold text-gray-200 border border-white/20 hover:border-[#FF0E25] backdrop-blur-md flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF0E25]" />
              Trailer
            </button>
          )}
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#11141f] to-[#090A0F]">
        <div>
          <Link to={`/movie/${movie.id}`} className="block group/title">
            <h3 className="text-sm font-bold text-white group-hover/title:text-[#FF0E25] line-clamp-1 transition-colors">
              {movie.title}
            </h3>
            <p className="text-xs text-rose-300/80 font-medium line-clamp-1 mt-0.5">
              {movie.sinhalaTitle}
            </p>
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9E9EA0] font-medium">
          <span className="text-gray-300">{movie.year}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[#FF0E25] font-bold">
              <Download className="w-3 h-3" />
              {(movie.downloadsCount / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
