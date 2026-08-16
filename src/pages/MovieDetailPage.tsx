import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import {
  Play,
  Download,
  Star,
  Clock,
  Calendar,
  Subtitles,
  Server,
  UserCheck,
  Send,
  ArrowLeft,
  Film,
  Globe,
  CheckCircle,
  Eye,
  Info,
  Users,
  HardDrive
} from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { movies, incrementViews, incrementDownloads } = useMovies();

  const movie = movies.find(m => m.id === id);

  const [activeServer, setActiveServer] = useState<string>('');
  const [plotTab, setPlotTab] = useState<'sinhala' | 'english'>('sinhala');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string>('');
  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    if (movie) {
      incrementViews(movie.id);
      if (movie.servers && movie.servers.length > 0) {
        setActiveServer(movie.servers[0].id);
      }
    }
    window.scrollTo(0, 0);
  }, [id, movie?.id]);

  if (!movie) {
    return (
      <div className="text-center py-24 bg-[#11141f]/80 backdrop-blur-xl rounded-3xl border border-white/5 space-y-4">
        <Film className="w-16 h-16 text-[#FF0E25] mx-auto" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-[#9E9EA0] text-sm">The movie you requested could not be located in our library.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Homepage
        </Link>
      </div>
    );
  }

  const currentServerObj = movie.servers?.find(s => s.id === activeServer) || movie.servers?.[0];
  const relatedMovies = movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 6);

  const handleDownloadClick = (quality: string, url: string) => {
    incrementDownloads(movie.id);
    setDownloadSuccessMessage(`Starting download trigger for ${movie.title} (${quality})...`);
    setTimeout(() => {
      setDownloadSuccessMessage('');
    }, 4000);

    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">

      {/* Back Button Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#11141f]/80 backdrop-blur-md border border-white/5 text-gray-300 hover:text-white hover:border-[#FF0E25]/50 text-xs font-extrabold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF0E25]" />
          Back to Movies Catalog
        </Link>
      </div>

      {/* Clean Hero Backdrop Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#11141f] border border-white/5 shadow-2xl">
        <div className="relative min-h-[320px] md:min-h-[420px] w-full flex items-end">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/80 to-transparent" />

          {/* Details Hero Overlay */}
          <div className="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row items-start md:items-end gap-6">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-36 sm:w-48 aspect-[2/3] object-cover rounded-2xl border border-white/10 shadow-2xl flex-shrink-0"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#FF0E25] text-white font-extrabold text-xs uppercase tracking-wider shadow-md">
                  {movie.qualityBadge}
                </span>
                {movie.hasSinhalaSub && (
                  <span className="px-3 py-1 rounded-xl bg-purple-600/90 border border-purple-400/30 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                    <Subtitles className="w-3.5 h-3.5 text-cyan-300" />
                    Sinhala Subbed (සිංහල උපසිරැසි)
                  </span>
                )}
                {movie.isDualAudio && (
                  <span className="px-3 py-1 rounded-xl bg-indigo-600/80 text-white font-bold text-xs shadow-md">
                    Dual Audio
                  </span>
                )}
                {movie.isTVSeries && (
                  <span className="px-3 py-1 rounded-xl bg-rose-600/80 text-white font-bold text-xs shadow-md">
                    TV Series
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
              <p className="text-lg sm:text-2xl font-black text-[#FF0E25] leading-snug">
                {movie.sinhalaTitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-300 pt-1">
                <span className="flex items-center gap-1 text-amber-400 bg-black/70 px-3 py-1 rounded-xl border border-amber-500/30 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {movie.imdbRating.toFixed(1)} IMDb
                </span>
                <span className="flex items-center gap-1 text-gray-300 bg-black/50 px-2.5 py-1 rounded-xl border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-[#FF0E25]" /> {movie.year}
                </span>
                <span className="flex items-center gap-1 text-gray-300 bg-black/50 px-2.5 py-1 rounded-xl border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-[#FF0E25]" /> {movie.duration}
                </span>
                <span className="flex items-center gap-1 text-rose-300 bg-black/50 px-2.5 py-1 rounded-xl border border-white/10">
                  <Eye className="w-3.5 h-3.5 text-rose-400" /> {movie.viewsCount.toLocaleString()} Views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Online Streaming / Watch Options */}
      <section className="bg-[#11141f]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-[#FF0E25] fill-[#FF0E25]" />
              Online Streaming / Watch Options (නරඹන්න)
            </h2>
            <p className="text-xs text-[#9E9EA0] mt-0.5">StreamHG, Doodstream, Streamtape, Facebook Free Data, or Youtube Trailer embeds.</p>
          </div>

          {/* Server Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
            {movie.servers?.map((server, index) => (
              <button
                key={server.id}
                onClick={() => setActiveServer(server.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeServer === server.id
                    ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white shadow-lg shadow-[#FF0E25]/30'
                    : 'bg-[#090A0F] text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                {server.name || `Server ${index + 1}`}
              </button>
            ))}
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner">
          {currentServerObj ? (
            <iframe
              src={currentServerObj.url}
              title={`${movie.title} Streaming Player`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[#9E9EA0] text-xs font-bold">
              No video server configured.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: Direct Download Links */}
      <section className="bg-[#11141f]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF0E25]" />
              Direct Download Links & Telegram (බාගත කරගන්න)
            </h2>
            <p className="text-xs text-[#9E9EA0] mt-0.5">High-speed 4K, 1080p, 720p, 480p and Telegram file downloads</p>
          </div>
        </div>

        {downloadSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {downloadSuccessMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(movie.downloadLinks && movie.downloadLinks.length > 0 ? movie.downloadLinks : [
            { id: 'dl_4k', quality: '4K', resolution: '3840x2160', fileSize: '5.2 GB', size: '5.2 GB', url: '#download-4k', serverType: 'Direct High-Speed', format: 'MKV / x265' },
            { id: 'dl_1080', quality: '1080p', resolution: '1920x1080', fileSize: '2.5 GB', size: '2.5 GB', url: '#download-1080p', serverType: 'Direct High-Speed', format: 'MKV / x264' },
            { id: 'dl_720', quality: '720p', resolution: '1280x720', fileSize: '1.2 GB', size: '1.2 GB', url: '#download-720p', serverType: 'Direct High-Speed', format: 'MP4' },
            { id: 'dl_tg', quality: 'Telegram', resolution: 'Original HD', fileSize: 'Telegram File', size: 'Telegram File', url: 'https://t.me/cinexus_official', serverType: 'Telegram Channel', format: 'Telegram' }
          ]).map((link) => {
            const isTelegram = link.quality.toLowerCase().includes('telegram');
            const displaySize = link.fileSize || link.size || 'Direct File';
            const displayRes = link.resolution || link.quality;
            const displayServer = link.serverType || (isTelegram ? 'Telegram Channel' : 'Direct High-Speed CDN');

            return (
              <div
                key={link.id}
                className="bg-[#090A0F] p-4 rounded-2xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-[#FF0E25]/50 transition-all shadow-lg group"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl font-black text-xs ${
                    isTelegram ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30'
                  }`}>
                    {link.quality}
                  </span>
                  <span className="text-xs text-[#9E9EA0] font-bold">{displaySize}</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-white flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-[#FF0E25]" /> {link.format || 'Standard HD'}
                  </p>
                  <p className="text-[11px] text-[#9E9EA0]">{displayRes} • {displayServer}</p>
                </div>

                <button
                  onClick={() => handleDownloadClick(link.quality, link.url)}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isTelegram
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                      : 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] hover:opacity-95 text-white shadow-[#FF0E25]/30'
                  }`}
                >
                  {isTelegram ? (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      Download via Telegram
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-white" />
                      Download {link.quality}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: Plot Summary, Cast & Crew, Subtitle Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Plot Summary (Sinhala & English Tabs with fixed line-height: 1.8) & Cast */}
        <div className="lg:col-span-2 space-y-8">

          {/* Dynamic Plot Summary */}
          <div className="bg-[#11141f]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF0E25]" /> Plot Summary (කතාවේ සාරාංශය)
              </h3>

              {/* Sinhala / English Tab Switcher */}
              <div className="flex items-center bg-[#090A0F] p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setPlotTab('sinhala')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    plotTab === 'sinhala' ? 'bg-[#FF0E25] text-white shadow-md' : 'text-[#9E9EA0] hover:text-white'
                  }`}
                >
                  සිංහල
                </button>
                <button
                  onClick={() => setPlotTab('english')}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                    plotTab === 'english' ? 'bg-[#FF0E25] text-white shadow-md' : 'text-[#9E9EA0] hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Clean Sinhala typography with fixed line-height: 1.8 */}
            <p className="text-xs sm:text-sm text-gray-200 leading-[1.8] font-normal tracking-wide">
              {plotTab === 'sinhala' ? movie.sinhalaPlot : movie.englishPlot}
            </p>
          </div>

          {/* Cast & Crew Section */}
          <div className="bg-[#11141f]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Users className="w-4 h-4 text-purple-400" /> Cast & Crew (රංගන ශිල්පීන්)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {movie.cast?.map((actor, idx) => (
                <div key={idx} className="bg-[#090A0F] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-300 font-extrabold flex items-center justify-center text-xs shrink-0 border border-purple-500/20">
                    {actor[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{actor}</p>
                    <p className="text-[10px] text-[#9E9EA0]">Lead Cast</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-gray-300">
              <span className="text-[#9E9EA0]">Director: </span>
              <span className="font-extrabold text-amber-300">{movie.director}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Subtitle Author Info Card */}
        <div className="bg-[#11141f]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <UserCheck className="w-4 h-4 text-[#FF0E25]" /> Subtitle Translator (උපසිරැසිකරු)
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF0E25] to-[#C80016] p-[2px]">
                <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center font-bold text-white text-lg">
                  {movie.subtitleAuthor?.name?.[0] || 'C'}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{movie.subtitleAuthor?.name || 'CINEXUS Official Subber'}</h4>
                <p className="text-xs text-rose-300 font-semibold">Senior Sinhala Subtitle Translator</p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs bg-[#090A0F] p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between text-[#9E9EA0]">
                <span>Total Downloads:</span>
                <span className="font-extrabold text-[#FF0E25]">{movie.subtitleAuthor?.downloadsCount?.toLocaleString() || '12,500'}</span>
              </div>
              <div className="flex justify-between text-[#9E9EA0]">
                <span>Release Date:</span>
                <span className="font-extrabold text-white">{movie.subtitleAuthor?.releaseDate || 'Recently Added'}</span>
              </div>
              <div className="flex justify-between text-[#9E9EA0]">
                <span>Audio Language:</span>
                <span className="font-extrabold text-white">{movie.audioLanguage}</span>
              </div>
            </div>
          </div>

          <a
            href="https://t.me/cinexus_official"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" /> Join Subtitle Telegram Group
          </a>
        </div>

      </div>

      {/* Related Movies Grid */}
      {relatedMovies.length > 0 && (
        <section className="space-y-5 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF0E25]" /> Recommended Related Movies
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedMovies.map((relMovie) => (
              <MovieCard
                key={relMovie.id}
                movie={relMovie}
                onTrailerClick={(url, title) => setTrailerModal({ isOpen: true, url, title })}
              />
            ))}
          </div>
        </section>
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
