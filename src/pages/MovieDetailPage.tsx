import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { usePlayer } from '../context/PlayerContext';
import { MovieCard } from '../components/MovieCard';
import { TrailerModal } from '../components/TrailerModal';
import { formatToEmbedUrl } from '../utils/playerSanitizer';
import { executeDownload } from '../utils/downloadEngine';
import type { CastMember } from '../types';
import {
  Play,
  Download,
  Star,
  Clock,
  Calendar,
  Subtitles,
  Server,
  Send,
  ArrowLeft,
  Film,
  Globe,
  CheckCircle,
  Eye,
  Info,
  Users,
  HardDrive,
  Volume2,
  Layers,
  ExternalLink
} from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { movies, incrementViews, incrementDownloads } = useMovies();
  const { t } = useLanguage();
  const { playStream } = usePlayer();

  const movie = movies.find(m => m.id === id);

  const [activeServer, setActiveServer] = useState<string>('');
  const [plotTab, setPlotTab] = useState<'sinhala' | 'english'>('sinhala');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string>('');
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>('');
  const [trailerModal, setTrailerModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Episode Selection Logic for TV Series
  const selectedEpisode = movie?.episodes?.find(ep => ep.id === activeEpisodeId) || movie?.episodes?.[0];

  // Strict URL extraction and non-empty checks (Override with selected episode if TV series)
  const s1Url = selectedEpisode?.streamServer1Url?.trim() || movie?.streamServer1Url?.trim() || '';
  const s2Url = selectedEpisode?.streamServer2Url?.trim() || movie?.streamServer2Url?.trim() || '';
  const s3Url = selectedEpisode?.streamServer3Url?.trim() || movie?.streamServer3Url?.trim() || '';
  const trailerUrl = movie?.trailerEmbedUrl?.trim() || movie?.trailerUrl?.trim() || '';
  const subtitleUrl = movie?.subtitleSourceUrl?.trim() || '';

  useEffect(() => {
    if (movie) {
      incrementViews(movie.id);

      // Auto-set initial player state: If Server 1 is empty but Server 2 exists, set to Server 2, etc.
      if (s1Url) {
        setActiveServer('s1');
      } else if (s2Url) {
        setActiveServer('s2');
      } else if (s3Url) {
        setActiveServer('s3');
      } else if (trailerUrl) {
        setActiveServer('trailer');
      } else if (movie.servers && movie.servers.length > 0) {
        setActiveServer(movie.servers[0].id);
      }
    }
    window.scrollTo(0, 0);
  }, [id, movie?.id, s1Url, s2Url, s3Url, trailerUrl]);

  if (!movie) {
    return (
      <div className="text-center py-24 bg-[#121620]/80 backdrop-blur-xl rounded-3xl border border-white/5 space-y-4">
        <Film className="w-16 h-16 text-[#FF0E25] mx-auto" />
        <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
        <p className="text-[#9E9EA0] text-sm">The movie you requested could not be located in our library.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToCatalog')}
        </Link>
      </div>
    );
  }

  // Active server selection logic
  let activeUrl = '';
  let activeServerName = '';
  let activeServerType = 'generic';

  if (activeServer === 's1' && s1Url) {
    activeUrl = s1Url;
    activeServerName = 'Server 1: StreamHG';
    activeServerType = 'streamhg';
  } else if (activeServer === 's2' && s2Url) {
    activeUrl = s2Url;
    activeServerName = 'Server 2: EarnVids';
    activeServerType = 'earnvids';
  } else if (activeServer === 's3' && s3Url) {
    activeUrl = s3Url;
    activeServerName = 'Server 3: FileMoon';
    activeServerType = 'filemoon';
  } else if (activeServer === 'trailer' && trailerUrl) {
    activeUrl = trailerUrl;
    activeServerName = 'Trailer';
    activeServerType = 'youtube';
  } else {
    const foundServer = movie.servers?.find(s => s.id === activeServer && s.url && s.url.trim() !== '') || movie.servers?.find(s => s.url && s.url.trim() !== '');
    if (foundServer) {
      activeUrl = foundServer.url;
      activeServerName = foundServer.name;
      activeServerType = foundServer.serverType || 'generic';
    }
  }

  const sanitizedPlayerUrl = activeUrl ? formatToEmbedUrl(activeUrl, activeServerType) : '';
  const [isIframeProcessing, setIsIframeProcessing] = useState<boolean>(false);

  // Sync active stream to PlayerContext for persistent floating mini-player
  const handlePlayActiveServer = (serverId: string, url: string, name: string) => {
    setActiveServer(serverId);
    if (url) {
      playStream({
        movieId: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        streamUrl: url,
        serverName: name,
      });
    }
  };

  const relatedMovies = movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 6);

  const handleDownloadTrigger = (quality: string, url: string, audioSubAttr?: string) => {
    const result = executeDownload({
      url,
      title: movie.title,
      quality,
      onMetricsIncrement: () => incrementDownloads(movie.id)
    });

    const tagLabel = audioSubAttr ? ` (${audioSubAttr})` : '';
    setDownloadSuccessMessage(`${result.message}${tagLabel}`);
    setTimeout(() => {
      setDownloadSuccessMessage('');
    }, 4500);
  };

  const primaryLang = movie.language || movie.languages?.[0] || 'English';
  const categoryType = movie.contentType || (movie.hasSinhalaSub ? 'Sinhala Sub' : 'Without Sub / English');

  // Normalize cast array
  const formattedCast: CastMember[] = (movie.cast || []).map(item => {
    if (typeof item === 'string') {
      return { name: item, character: 'Lead Cast', profileUrl: '', image: '' };
    }
    return {
      tmdb_id: item.tmdb_id,
      name: item.name,
      character: item.character || 'Lead Cast',
      profileUrl: item.profileUrl || item.image || '',
      image: item.image || item.profileUrl || ''
    };
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">

      {/* Back Navigation Bar */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121620]/80 backdrop-blur-md border border-white/5 text-gray-300 hover:text-white hover:border-[#FF0E25]/50 text-xs font-extrabold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF0E25]" />
          {t('backToCatalog')}
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#121620] border border-white/5 shadow-2xl">
        <div className="relative min-h-[320px] md:min-h-[400px] w-full flex items-end">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/80 to-transparent" />

          {/* Hero Content Grid */}
          <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col md:flex-row items-start md:items-end gap-6">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-36 sm:w-48 aspect-[2/3] object-cover rounded-2xl border border-white/10 shadow-2xl flex-shrink-0"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#FF0E25] text-white font-black text-xs uppercase tracking-wider shadow-md">
                  {movie.qualityBadge}
                </span>

                {categoryType === 'Sinhala Sub' && (
                  <span className="px-3 py-1 rounded-xl bg-purple-600/90 border border-purple-400/30 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                    <Subtitles className="w-3.5 h-3.5 text-cyan-300" />
                    [CC] Sinhala Sub
                  </span>
                )}

                {categoryType === 'Sinhala Dubbed' && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-600/90 border border-emerald-400/30 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-200" />
                    [🔊] Sinhala Dubbed
                  </span>
                )}

                {categoryType === 'Without Sub / English' && (
                  <span className="px-3 py-1 rounded-xl bg-blue-600/90 border border-blue-400/30 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                    <Globe className="w-3.5 h-3.5 text-blue-200" />
                    [EN] Original Audio
                  </span>
                )}

                <span className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/20 text-rose-300 font-bold text-xs">
                  🌐 {primaryLang}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
              <p className="text-lg sm:text-2xl font-black text-[#FF0E25] leading-snug">
                {movie.sinhalaTitle}
              </p>

              {/* Quick Metadata Bar */}
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

      {/* Cinesub-Style Meta Grid Overview */}
      <section className="bg-[#121620]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/5 shadow-2xl">
        <h3 className="text-xs font-black text-[#FF0E25] tracking-wider uppercase mb-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4" /> Cinesub Meta Grid Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">Release Year</span>
            <span className="font-extrabold text-white text-sm">{movie.year}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">Runtime</span>
            <span className="font-extrabold text-white text-sm">{movie.duration}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">Language</span>
            <span className="font-extrabold text-sky-300 text-sm">{primaryLang}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">IMDb Rating</span>
            <span className="font-extrabold text-amber-400 text-sm">★ {movie.imdbRating.toFixed(1)} / 10</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">Video Quality</span>
            <span className="font-extrabold text-[#FF0E25] text-sm">{movie.qualityBadge}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#9E9EA0] uppercase font-bold block">Category</span>
            <span className="font-extrabold text-purple-300 text-sm">{categoryType}</span>
          </div>
        </div>
      </section>

      {/* TV SERIES EPISODE SELECTOR GRID (Renders when movie is a TV Series and has episodes) */}
      {Boolean(movie.isTVSeries && movie.episodes && movie.episodes.length > 0) && (
        <section className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FF0E25]" />
                TV Series Episodes Selector (කථාංග තෝරන්න)
              </h3>
              <p className="text-xs text-[#9E9EA0] mt-0.5">Select an episode to load its streaming servers & direct download links.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#FF0E25]/20 text-[#FF0E25] font-extrabold text-xs border border-[#FF0E25]/30">
              {movie.episodes?.length || 0} Episodes Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {movie.episodes?.map((ep) => {
              const isSelected = (selectedEpisode?.id === ep.id) || (!activeEpisodeId && movie.episodes?.[0]?.id === ep.id);
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    setActiveEpisodeId(ep.id);
                    if (ep.streamServer1Url) setActiveServer('s1');
                    else if (ep.streamServer2Url) setActiveServer('s2');
                    else if (ep.streamServer3Url) setActiveServer('s3');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white border-[#FF0E25] shadow-lg shadow-[#FF0E25]/30'
                      : 'bg-[#0A0A0E] text-gray-300 border-white/10 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-extrabold text-xs block truncate">
                      Ep {ep.episodeNumber}: {ep.title}
                    </span>
                    <span className="text-[10px] opacity-80 block truncate">
                      {ep.seasonNumber ? `Season ${ep.seasonNumber}` : 'Full Episode'}
                    </span>
                  </div>
                  <Play className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white fill-white' : 'text-[#FF0E25]'}`} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ONLINE STREAMING PLAYER */}
      <section className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-[#FF0E25] fill-[#FF0E25]" />
              In-Site Multi-Server Player Engine (නරඹන්න)
            </h2>
            <p className="text-xs text-[#9E9EA0] mt-0.5">
              100% In-Site Playback • StreamHG, EarnVids, FileMoon, Facebook Data & YouTube.
            </p>
          </div>

          {/* Server Switcher Tabs & External Mirror Popout Button */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
            {Boolean(s1Url) && (
              <button
                onClick={() => handlePlayActiveServer('s1', s1Url, 'Server 1: StreamHG')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeServer === 's1'
                    ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white shadow-lg shadow-[#FF0E25]/30'
                    : 'bg-[#0A0A0E] text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Server 1: StreamHG
              </button>
            )}

            {Boolean(s2Url) && (
              <button
                onClick={() => handlePlayActiveServer('s2', s2Url, 'Server 2: EarnVids')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeServer === 's2'
                    ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white shadow-lg shadow-[#FF0E25]/30'
                    : 'bg-[#0A0A0E] text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Server 2: EarnVids
              </button>
            )}

            {Boolean(s3Url) && (
              <button
                onClick={() => handlePlayActiveServer('s3', s3Url, 'Server 3: FileMoon')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeServer === 's3'
                    ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white shadow-lg shadow-[#FF0E25]/30'
                    : 'bg-[#0A0A0E] text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Server 3: FileMoon
              </button>
            )}

            {Boolean(trailerUrl) && (
              <button
                onClick={() => handlePlayActiveServer('trailer', trailerUrl, 'Trailer')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeServer === 'trailer'
                    ? 'bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 text-white shadow-lg shadow-[#FF0E25]/30'
                    : 'bg-[#0A0A0E] text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                Trailer
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Video Player Frame with key={activeServer} for unmount/remount sync */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group">
          {isIframeProcessing && (
            <div className="absolute inset-0 z-20 bg-[#0A0A0E]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 border border-white/10">
              <div className="w-12 h-12 rounded-full border-2 border-[#FF0E25] border-t-transparent animate-spin flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF0E25]" />
              </div>
              <p className="text-sm font-extrabold text-white">Video Processing on Server</p>
              <p className="text-xs text-[#9E9EA0] max-w-sm">Please Refresh in a few minutes while the cloud encoder finalizes stream rendering.</p>
              <button
                onClick={() => setIsIframeProcessing(false)}
                className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white text-xs font-bold shadow-md hover:opacity-90"
              >
                Dismiss & Retry Playback
              </button>
            </div>
          )}

          {sanitizedPlayerUrl ? (
            <iframe
              key={activeServer}
              src={sanitizedPlayerUrl}
              title={`${movie.title} CINEXUS Player`}
              className="w-full h-full aspect-video rounded-xl border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="origin-when-cross-origin"
              onError={() => setIsIframeProcessing(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-2 bg-[#0A0A0E]">
              <Clock className="w-8 h-8 text-[#FF0E25] animate-pulse" />
              <p className="text-sm font-bold text-white">Video Processing on Server - Please Refresh in a few minutes</p>
              <p className="text-xs text-[#9E9EA0]">The selected stream mirror is compiling video segments.</p>
            </div>
          )}
        </div>
      </section>

      {/* DIRECT BROWSER DOWNLOAD ENGINE & SUBTITLE SOURCE LINK */}
      <section className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF0E25]" />
              Direct Browser Download Engine & Subtitles (බාගත කරගන්න)
            </h2>
            <p className="text-xs text-[#9E9EA0] mt-0.5">
              Instant dynamic downloads for video files and external Sinhala subtitle file.
            </p>
          </div>

          {/* Clean Subtitle Download Source Button - Strict Conditional Rendering */}
          {Boolean(subtitleUrl) && (
            <a
              href={subtitleUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:opacity-90 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all shrink-0"
            >
              <Subtitles className="w-4 h-4 text-cyan-300" />
              [🌐 Download Subtitle File]
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </a>
          )}
        </div>

        {downloadSuccessMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {downloadSuccessMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(movie.downloadLinks && movie.downloadLinks.length > 0 ? movie.downloadLinks : [
            { id: 'dl_4k', quality: '4K', resolution: '3840x2160', fileSize: '5.2 GB', size: '5.2 GB', url: '#download-4k', serverType: 'Direct High-Speed', format: 'MKV / x265', audioSubAttribute: `${primaryLang} [Sinhala Sub]` },
            { id: 'dl_1080', quality: '1080p', resolution: '1920x1080', fileSize: '2.5 GB', size: '2.5 GB', url: '#download-1080p', serverType: 'Direct High-Speed', format: 'MKV / x264', audioSubAttribute: `${primaryLang} [Sinhala Sub]` },
            { id: 'dl_720', quality: '720p', resolution: '1280x720', fileSize: '1.2 GB', size: '1.2 GB', url: '#download-720p', serverType: 'Direct High-Speed', format: 'MP4', audioSubAttribute: `${primaryLang} [Sinhala Sub]` },
            { id: 'dl_tg', quality: 'Telegram', resolution: 'Original HD', fileSize: 'Telegram File', size: 'Telegram File', url: 'https://t.me/cinexus_official', serverType: 'Telegram Channel', format: 'Telegram', audioSubAttribute: `${primaryLang} [Sinhala Sub]` }
          ]).map((link) => {
            const isTelegram = link.quality.toLowerCase().includes('telegram');
            const displaySize = link.fileSize || link.size || 'Direct File';
            const displayRes = link.resolution || link.quality;
            const displayServer = link.serverType || (isTelegram ? 'Telegram Channel' : 'Direct High-Speed CDN');
            const attrTag = link.audioSubAttribute || `${primaryLang} [${categoryType}]`;

            return (
              <div
                key={link.id}
                className="bg-[#0A0A0E] p-4 rounded-2xl flex flex-col justify-between space-y-4 border border-white/5 hover:border-[#FF0E25]/50 transition-all shadow-lg group"
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
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-amber-300">
                    🏷️ {attrTag}
                  </span>
                </div>

                <button
                  onClick={() => handleDownloadTrigger(link.quality, link.url, attrTag)}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isTelegram
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                      : 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] hover:opacity-95 text-white shadow-[#FF0E25]/30'
                  }`}
                >
                  {isTelegram ? (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      Telegram Direct File
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

      {/* PLOT SUMMARY CARD & CAST INFO WITH PROFILE PHOTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Formatted Plot Summary & Cast Cards */}
        <div className="lg:col-span-2 space-y-8">

          {/* Plot Summary Card */}
          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF0E25]" /> Plot Summary (කතාවේ සාරාංශය)
              </h3>

              {/* Sinhala / English Tab Switcher */}
              <div className="flex items-center bg-[#0A0A0E] p-1 rounded-xl border border-white/10">
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

            {/* Formatted Plot Summary with line-height: 1.8 */}
            <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5">
              <p className="text-xs sm:text-sm text-gray-200 font-normal tracking-wide leading-[1.8] whitespace-pre-line">
                {plotTab === 'sinhala' ? (movie.sinhalaPlot || movie.englishPlot) : (movie.englishPlot || movie.sinhalaPlot)}
              </p>
            </div>
          </div>

          {/* Cast & Crew Section with Profile Photos */}
          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Users className="w-4 h-4 text-purple-400" /> Cast & Roles (රංගන ශිල්පීන්)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formattedCast.map((actor, idx) => {
                const actorTmdbUrl = actor.tmdb_id
                  ? `https://www.themoviedb.org/person/${actor.tmdb_id}`
                  : `https://www.themoviedb.org/search/person?query=${encodeURIComponent(actor.name)}`;

                return (
                  <a
                    key={idx}
                    href={actorTmdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A0A0E] p-3 rounded-2xl border border-white/5 flex items-center gap-3 group hover:border-purple-500/60 hover:bg-white/[0.03] transition-all cursor-pointer"
                    title={`View ${actor.name} on TMDB`}
                  >
                    <img
                      src={actor.image || actor.profileUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={actor.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div className="min-w-0 flex flex-col">
                      <span className="font-semibold text-white text-xs truncate group-hover:text-purple-300 transition-colors">{actor.name}</span>
                      <span className="text-[11px] text-gray-400 truncate">as {actor.character || 'Cast'}</span>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="pt-2 text-xs text-gray-300">
              <span className="text-[#9E9EA0]">Director: </span>
              <span className="font-extrabold text-amber-300">{movie.director}</span>
            </div>
          </div>

        </div>

        {/* Right Column: Subtitle Source Link Card & Community */}
        <div className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6 flex flex-col justify-between">
          {Boolean(subtitleUrl) ? (
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Subtitles className="w-4 h-4 text-[#FF0E25]" /> Subtitle File Link (උපසිරැසි ගොනුව)
              </h3>

              <div className="mt-4 p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-3">
                <p className="text-xs text-[#9E9EA0] leading-[1.8]">
                  Get the official external SRT/ASS Sinhala subtitle file for offline media player synchronization.
                </p>
                <a
                  href={subtitleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Globe className="w-4 h-4 text-cyan-300" />
                  [🌐 Download Subtitle File]
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                <Globe className="w-4 h-4 text-[#FF0E25]" /> CINEXUS Cinema Hub
              </h3>
              <p className="mt-4 text-xs text-[#9E9EA0] leading-[1.8]">
                Enjoy high-speed streaming and direct multi-quality downloads on CINEXUS.
              </p>
            </div>
          )}

          <a
            href="https://t.me/cinexus_official"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Send className="w-4 h-4" /> Join Telegram Movie Community
          </a>
        </div>

      </div>

      {/* Recommended Movies Grid */}
      {relatedMovies.length > 0 && (
        <section className="space-y-5 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FF0E25]" /> {t('recommendedMovies')}
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
