import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { ProfileAvatar } from '../components/ProfileAvatar';
import {
  User,
  LogOut,
  Settings,
  Bookmark,
  Heart,
  Eye,
  Film,
  Calendar,
  Mail,
  Edit2,
  Check
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    updateUserProfile,
    watchlist,
    favorites,
    watchedHistory,
    recentlyViewed,
    movies
  } = useMovies();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(currentUser?.username || '');

  if (!currentUser) {
    return (
      <div className="text-center py-20 bg-[#121620] rounded-3xl border border-white/10 space-y-4 max-w-md mx-auto my-12 p-8">
        <User className="w-16 h-16 text-[#FF0E25] mx-auto" />
        <h2 className="text-2xl font-black text-white">Not Signed In</h2>
        <p className="text-xs text-[#9E9EA0]">Sign in to your CINEXUS account to sync watchlists, favorites, and profile settings.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs rounded-xl shadow-lg hover:opacity-90"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      username: usernameInput,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const savedWatchlist = movies.filter(m => watchlist.includes(m.id));
  const savedFavorites = movies.filter(m => favorites.includes(m.id));
  const recentMovies = movies.filter(m => recentlyViewed.includes(m.id));

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">

      {/* Profile Header Dashboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121620] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <ProfileAvatar size="xl" editable={true} />
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{currentUser.username}</h1>
              <span className="px-2 py-0.5 rounded bg-[#FF0E25]/20 text-[#FF0E25] text-[10px] font-black border border-[#FF0E25]/30 uppercase">PRO</span>
            </div>
            <p className="text-xs text-[#9E9EA0] flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" /> {currentUser.email}
            </p>
            <p className="text-[11px] text-[#9E9EA0] flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF0E25]" /> Member since {currentUser.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF0E25] text-white font-extrabold text-xs flex items-center gap-2 transition-all"
          >
            <Edit2 className="w-4 h-4 text-[#FF0E25]" />
            {isEditing ? 'Cancel Edit' : 'Edit Username'}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-[#FF0E25]/20 hover:bg-[#FF0E25] text-rose-300 hover:text-white font-extrabold text-xs flex items-center gap-2 transition-all border border-[#FF0E25]/30"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Edit Profile Form Panel */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-[#121620] border border-[#FF0E25]/40 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF0E25]" /> Edit Account Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#9E9EA0]">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#0A0A0E] text-white font-bold p-3 rounded-xl border border-white/10 focus:border-[#FF0E25] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#FF0E25] hover:bg-[#C80016] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Check className="w-4 h-4" /> Save Username
          </button>
        </form>
      )}

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
          <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-[#FF0E25]" /> Watchlist Count
          </span>
          <span className="text-2xl font-black text-white">{watchlist.length}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
          <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Favorite Movies
          </span>
          <span className="text-2xl font-black text-white">{favorites.length}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
          <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> Watched Total
          </span>
          <span className="text-2xl font-black text-white">{watchedHistory.length}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
          <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-sky-400" /> Recently Viewed
          </span>
          <span className="text-2xl font-black text-white">{recentlyViewed.length}</span>
        </div>
      </div>

      {/* Recently Viewed Grid */}
      {recentMovies.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Film className="w-5 h-5 text-[#FF0E25]" /> Recently Viewed Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentMovies.slice(0, 5).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Saved Watchlist Showcase */}
      {savedWatchlist.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Bookmark className="w-5 h-5 text-[#FF0E25]" /> Your Watchlist Showcase
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {savedWatchlist.slice(0, 5).map(movie => (
              <MovieCard key={`w_${movie.id}`} movie={movie} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
