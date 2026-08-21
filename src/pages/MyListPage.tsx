import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { Bookmark, Heart, CheckCircle2, History, Film, ArrowLeft } from 'lucide-react';

export const MyListPage: React.FC = () => {
  const { movies, watchlist, favorites, watchedHistory, recentlyViewed, isLoadingMovies } = useMovies();
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'watched' | 'recent'>('watchlist');

  const watchlistMovies = movies.filter(m => watchlist.includes(m.id));
  const favoriteMovies = movies.filter(m => favorites.includes(m.id));
  const watchedMovies = movies.filter(m => watchedHistory.includes(m.id));
  const recentMovies = movies.filter(m => recentlyViewed.includes(m.id));

  const getCurrentMovies = () => {
    switch (activeTab) {
      case 'watchlist': return watchlistMovies;
      case 'favorites': return favoriteMovies;
      case 'watched': return watchedMovies;
      case 'recent': return recentMovies;
      default: return watchlistMovies;
    }
  };

  const currentList = getCurrentMovies();

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121620] via-[#170305] to-[#0A0A0E] border border-white/10 shadow-2xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 text-xs font-black uppercase tracking-wider">
          <Bookmark className="w-4 h-4" /> Personal Saved Movies
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          My Cinema Library
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9EA0] max-w-xl">
          Access your saved watch later list, favorite blockbusters, watched history, and recently viewed movies.
        </p>
      </div>

      {/* List Section Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'watchlist'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-lg shadow-[#FF0E25]/30'
              : 'bg-[#121620] text-gray-300 border border-white/10 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watch Later ({watchlistMovies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'favorites'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-lg shadow-[#FF0E25]/30'
              : 'bg-[#121620] text-gray-300 border border-white/10 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Favorites ({favoriteMovies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('watched')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'watched'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-lg shadow-[#FF0E25]/30'
              : 'bg-[#121620] text-gray-300 border border-white/10 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Watched ({watchedMovies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'recent'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-lg shadow-[#FF0E25]/30'
              : 'bg-[#121620] text-gray-300 border border-white/10 hover:text-white'
          }`}
        >
          <History className="w-4 h-4 text-sky-400" />
          <span>Recently Viewed ({recentMovies.length})</span>
        </button>
      </div>

      {/* Movie Grid or Empty State */}
      <section>
        {isLoadingMovies ? (
          <SkeletonGrid count={5} />
        ) : currentList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {currentList.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121620] rounded-3xl border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF0E25]/10 text-[#FF0E25] mx-auto flex items-center justify-center">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Your {activeTab} list is empty</h3>
            <p className="text-xs text-[#9E9EA0] max-w-sm mx-auto">
              Click the bookmark or heart icon on any movie card to add items to your personal list.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0E25] text-white font-bold text-xs shadow-md hover:bg-[#C80016]"
            >
              <ArrowLeft className="w-4 h-4" /> Explore Movies
            </Link>
          </div>
        )}
      </section>

    </div>
  );
};
