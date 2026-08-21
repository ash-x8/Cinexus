import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { Tag, Film, ArrowLeft, Sparkles, Layers } from 'lucide-react';

interface GenreDef {
  name: string;
  sinhalaName: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

const GENRE_LIST: GenreDef[] = [
  { name: 'Action', sinhalaName: 'ක්‍රියාදාම', slug: 'action', icon: '🔥', color: 'from-red-600 to-rose-900', description: 'High-octane fights, explosions, and adrenaline-pumping sequences.' },
  { name: 'Sci-Fi', sinhalaName: 'විද්‍යා ප්‍රබන්ධ', slug: 'sci-fi', icon: '🚀', color: 'from-cyan-600 to-blue-900', description: 'Futuristic technology, space exploration, time travel, and cybernetics.' },
  { name: 'Romance', sinhalaName: 'ආදරණීය', slug: 'romance', icon: '❤️', color: 'from-pink-600 to-rose-900', description: 'Heartfelt emotional stories, love, passion, and relationship dynamics.' },
  { name: 'Horror', sinhalaName: 'භීතිකා', slug: 'horror', icon: '👻', color: 'from-purple-900 to-slate-950', description: 'Supernatural terrors, suspense, psychological chills, and monsters.' },
  { name: 'Adventure', sinhalaName: 'සහසික', slug: 'adventure', icon: '🗺️', color: 'from-amber-600 to-orange-900', description: 'Epic journeys, questing through unknown worlds, and survival.' },
  { name: 'Drama', sinhalaName: 'නාට්‍ය', slug: 'drama', icon: '🎭', color: 'from-[#FF0E25] to-purple-900', description: 'Deep human emotions, character conflicts, and inspiring true stories.' },
  { name: 'Crime', sinhalaName: 'අපරාධ', slug: 'crime', icon: '🔍', color: 'from-slate-700 to-zinc-900', description: 'Mobsters, detectives, heists, murder mysteries, and underworld sagas.' },
  { name: 'Fantasy', sinhalaName: 'මායා', slug: 'fantasy', icon: '🧙‍♂️', color: 'from-emerald-600 to-teal-950', description: 'Magical realms, mythical creatures, sorcery, and legendary hero tales.' },
  { name: 'Mystery', sinhalaName: 'අභිරහස්', slug: 'mystery', icon: '🕵️‍♂️', color: 'from-indigo-700 to-slate-900', description: 'Unraveling hidden secrets, unexpected twists, and whodunit thrillers.' },
  { name: 'Thriller', sinhalaName: 'ත්‍රාසජනක', slug: 'thriller', icon: '⚡', color: 'from-yellow-600 to-red-950', description: 'Edge-of-your-seat suspense, tension, conspiracies, and cat-and-mouse games.' },
  { name: 'Anime', sinhalaName: 'ඇනිමේ', slug: 'anime', icon: '🎌', color: 'from-rose-500 to-indigo-900', description: 'Japanese animated series and cinematic feature films.' },
  { name: 'TV Series', sinhalaName: 'කථාමාලා', slug: 'tv-series', icon: '📺', color: 'from-[#FF0E25] to-amber-900', description: 'Binge-worthy multi-season TV shows with episode downloads.' },
  { name: 'Sinhala Subbed', sinhalaName: 'සිංහල උපසිරැසි', slug: 'sinhala-subbed', icon: '💬', color: 'from-purple-600 to-indigo-950', description: 'Movies and shows translated with 100% accurate Sinhala subtitles.' },
  { name: 'Dual Audio', sinhalaName: 'ද්විත්ව හඬ', slug: 'dual-audio', icon: '🔊', color: 'from-emerald-600 to-emerald-950', description: 'Titles featuring multiple selectable original audio tracks.' },
];

export const GenresPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { movies, setSelectedCategory, setSelectedGenre, isLoadingMovies } = useMovies();
  const navigate = useNavigate();

  // Selected genre matching slug
  const activeGenre = GENRE_LIST.find(g => g.slug === slug?.toLowerCase());

  // Filter movies if slug is specified
  const filteredMovies = activeGenre
    ? movies.filter(m => {
        if (activeGenre.slug === 'sinhala-subbed') return m.hasSinhalaSub || m.contentType === 'Sinhala Sub';
        if (activeGenre.slug === 'tv-series') return m.isTVSeries;
        if (activeGenre.slug === 'dual-audio') return m.isDualAudio;
        return m.genres.some(g => g.toLowerCase() === activeGenre.name.toLowerCase());
      })
    : movies;

  if (activeGenre) {
    return (
      <div className="space-y-8 pb-16 animate-in fade-in duration-300">
        <div>
          <button
            onClick={() => navigate('/genres')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121620] border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF0E25]" /> All Genres
          </button>
        </div>

        {/* Genre Banner */}
        <div className={`p-8 rounded-3xl bg-gradient-to-r ${activeGenre.color} border border-white/10 shadow-2xl relative overflow-hidden`}>
          <div className="relative z-10 space-y-2 max-w-xl">
            <span className="text-4xl">{activeGenre.icon}</span>
            <h1 className="text-3xl font-black text-white">{activeGenre.name} Movies</h1>
            <p className="text-sm font-bold text-[#FF0E25] bg-black/40 px-3 py-1 rounded-xl inline-block">{activeGenre.sinhalaName}</p>
            <p className="text-xs text-gray-200 leading-relaxed pt-1">{activeGenre.description}</p>
          </div>
        </div>

        {/* Filtered Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xl font-extrabold text-white">
              {activeGenre.name} Library ({filteredMovies.length})
            </h2>
          </div>

          {isLoadingMovies ? (
            <SkeletonGrid count={10} />
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#121620] rounded-3xl border border-white/10 space-y-2">
              <Film className="w-12 h-12 text-[#FF0E25] mx-auto" />
              <h3 className="text-lg font-bold text-white">No Movies Found in {activeGenre.name}</h3>
              <p className="text-xs text-[#9E9EA0]">Check back soon as new releases are added daily.</p>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">

      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#121620] via-[#170305] to-[#0A0A0E] border border-white/10 shadow-2xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 text-xs font-black uppercase tracking-wider">
          <Tag className="w-4 h-4" /> Category Hub
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Explore Movies by Genre
        </h1>
        <p className="text-xs sm:text-sm text-[#9E9EA0] max-w-xl">
          Browse CINEXUS's organized collections across action, sci-fi, horror, romance, anime, Sinhala subbed titles, and more.
        </p>
      </div>

      {/* Genre Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {GENRE_LIST.map((genre) => {
          const count = movies.filter(m => {
            if (genre.slug === 'sinhala-subbed') return m.hasSinhalaSub || m.contentType === 'Sinhala Sub';
            if (genre.slug === 'tv-series') return m.isTVSeries;
            if (genre.slug === 'dual-audio') return m.isDualAudio;
            return m.genres.some(g => g.toLowerCase() === genre.name.toLowerCase());
          }).length;

          return (
            <Link
              key={genre.slug}
              to={`/genre/${genre.slug}`}
              className="group p-6 rounded-3xl bg-[#121620] border border-white/5 hover:border-[#FF0E25]/50 transition-all duration-300 shadow-xl hover:shadow-[#FF0E25]/10 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${genre.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {genre.icon}
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[10px] font-extrabold text-gray-300">
                  {count} Movies
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white group-hover:text-[#FF0E25] transition-colors">
                  {genre.name}
                </h3>
                <p className="text-xs font-bold text-rose-300/80">{genre.sinhalaName}</p>
                <p className="text-[11px] text-[#9E9EA0] line-clamp-2 mt-1 leading-relaxed">
                  {genre.description}
                </p>
              </div>

              <div className="pt-2 text-xs font-bold text-[#FF0E25] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Genre →
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
};
