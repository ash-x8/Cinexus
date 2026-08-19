import { createClient } from '@supabase/supabase-js';
import type { Movie, MovieRequest, SiteSettings, Category } from '../types';

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://cyreqidqqwvbrrmifoch.supabase.co';

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'sb_publishable_Q_xutTeR2YZOhxm_6VBjlA_dK9k1Rld';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_ANON_KEY) &&
    !SUPABASE_URL.includes('xyzcompany')
  );
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Transforms a Supabase row (which could have snake_case or camelCase properties)
 * to a typed Movie object.
 */
export function mapRowToMovie(row: any): Movie {
  const cast = row.cast_data ?? row.cast ?? [];
  const episodes = row.episodes ?? [];
  const servers = row.servers ?? [];
  const downloadLinks = row.download_links ?? row.downloadLinks ?? [];
  const genres = Array.isArray(row.genres) ? row.genres : [];
  const languages = Array.isArray(row.languages) ? row.languages : (row.language ? [row.language] : ['English']);

  return {
    id: String(row.id),
    title: row.title || '',
    sinhalaTitle: row.sinhala_title ?? row.sinhalaTitle ?? '',
    originalTitle: row.original_title ?? row.originalTitle ?? row.title,
    year: Number(row.year) || new Date().getFullYear(),
    imdbRating: Number(row.imdb_rating ?? row.imdbRating) || 8.0,
    duration: row.duration || '2h 00m',
    qualityBadge: row.quality_badge ?? row.qualityBadge ?? '1080p WEB-DL',
    posterUrl: row.poster_url ?? row.posterUrl ?? '',
    backdropUrl: row.backdrop_url ?? row.backdropUrl ?? '',
    trailerUrl: row.trailer_url ?? row.trailerUrl ?? '',
    streamServer1Url: row.stream_server1_url ?? row.streamServer1Url ?? '',
    streamServer2Url: row.stream_server2_url ?? row.streamServer2Url ?? '',
    streamServer3Url: row.stream_server3_url ?? row.streamServer3Url ?? '',
    trailerEmbedUrl: row.trailer_embed_url ?? row.trailerEmbedUrl ?? row.trailer_url ?? row.trailerUrl ?? '',
    sinhalaPlot: row.sinhala_plot ?? row.sinhalaPlot ?? '',
    englishPlot: row.english_plot ?? row.englishPlot ?? '',
    genres,
    languages,
    language: row.language || languages[0] || 'English',
    contentType: row.content_type ?? row.contentType ?? 'Sinhala Sub',
    cast,
    director: row.director || 'Unknown',
    audioLanguage: row.audio_language ?? row.audioLanguage ?? 'English',
    subtitleSourceUrl: row.subtitle_source_url ?? row.subtitleSourceUrl ?? '',
    servers,
    downloadLinks,
    hasSinhalaSub: Boolean(row.has_sinhala_sub ?? row.hasSinhalaSub ?? true),
    isDualAudio: Boolean(row.is_dual_audio ?? row.isDualAudio ?? false),
    isTrending: Boolean(row.is_trending ?? row.isTrending ?? false),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured ?? false),
    isTVSeries: Boolean(row.is_tv_series ?? row.isTVSeries ?? false),
    seasonsCount: row.seasons_count ?? row.seasonsCount ?? 0,
    episodesCount: row.episodes_count ?? row.episodesCount ?? episodes.length,
    episodes,
    viewsCount: Number(row.views_count ?? row.viewsCount) || 0,
    downloadsCount: Number(row.downloads_count ?? row.downloadsCount) || 0,
    addedAt: row.added_at ?? row.addedAt ?? new Date().toISOString().split('T')[0],
  };
}

/**
 * Transforms a Movie object into a database row payload matching Supabase snake_case schema.
 */
export function mapMovieToRow(movie: Partial<Movie>): Record<string, any> {
  const row: Record<string, any> = {};

  if (movie.id !== undefined) row.id = movie.id;
  if (movie.title !== undefined) row.title = movie.title;
  if (movie.sinhalaTitle !== undefined) row.sinhala_title = movie.sinhalaTitle;
  if (movie.originalTitle !== undefined) row.original_title = movie.originalTitle;
  if (movie.year !== undefined) row.year = movie.year;
  if (movie.imdbRating !== undefined) row.imdb_rating = movie.imdbRating;
  if (movie.duration !== undefined) row.duration = movie.duration;
  if (movie.qualityBadge !== undefined) row.quality_badge = movie.qualityBadge;
  if (movie.posterUrl !== undefined) row.poster_url = movie.posterUrl;
  if (movie.backdropUrl !== undefined) row.backdrop_url = movie.backdropUrl;
  if (movie.trailerUrl !== undefined) row.trailer_url = movie.trailerUrl;
  if (movie.streamServer1Url !== undefined) row.stream_server1_url = movie.streamServer1Url;
  if (movie.streamServer2Url !== undefined) row.stream_server2_url = movie.streamServer2Url;
  if (movie.streamServer3Url !== undefined) row.stream_server3_url = movie.streamServer3Url;
  if (movie.trailerEmbedUrl !== undefined) row.trailer_embed_url = movie.trailerEmbedUrl;
  if (movie.sinhalaPlot !== undefined) row.sinhala_plot = movie.sinhalaPlot;
  if (movie.englishPlot !== undefined) row.english_plot = movie.englishPlot;
  if (movie.genres !== undefined) row.genres = movie.genres;
  if (movie.languages !== undefined) row.languages = movie.languages;
  if (movie.language !== undefined) row.language = movie.language;
  if (movie.contentType !== undefined) row.content_type = movie.contentType;
  if (movie.cast !== undefined) row.cast_data = movie.cast;
  if (movie.director !== undefined) row.director = movie.director;
  if (movie.audioLanguage !== undefined) row.audio_language = movie.audioLanguage;
  if (movie.subtitleSourceUrl !== undefined) row.subtitle_source_url = movie.subtitleSourceUrl;
  if (movie.servers !== undefined) row.servers = movie.servers;
  if (movie.downloadLinks !== undefined) row.download_links = movie.downloadLinks;
  if (movie.hasSinhalaSub !== undefined) row.has_sinhala_sub = movie.hasSinhalaSub;
  if (movie.isDualAudio !== undefined) row.is_dual_audio = movie.isDualAudio;
  if (movie.isTrending !== undefined) row.is_trending = movie.isTrending;
  if (movie.isFeatured !== undefined) row.is_featured = movie.isFeatured;
  if (movie.isTVSeries !== undefined) row.is_tv_series = movie.isTVSeries;
  if (movie.seasonsCount !== undefined) row.seasons_count = movie.seasonsCount;
  if (movie.episodesCount !== undefined) row.episodes_count = movie.episodesCount;
  if (movie.episodes !== undefined) row.episodes = movie.episodes;
  if (movie.viewsCount !== undefined) row.views_count = movie.viewsCount;
  if (movie.downloadsCount !== undefined) row.downloads_count = movie.downloadsCount;
  if (movie.addedAt !== undefined) row.added_at = movie.addedAt;

  row.updated_at = new Date().toISOString();

  return row;
}

/**
 * Transforms a Supabase row to a typed MovieRequest object.
 */
export function mapRowToRequest(row: any): MovieRequest {
  return {
    id: String(row.id),
    userId: row.user_id ?? row.userId ?? '',
    userName: row.user_name ?? row.userName ?? 'Anonymous User',
    userUsername: row.user_username ?? row.userUsername ?? 'user',
    userEmail: row.user_email ?? row.userEmail ?? '',
    movieName: row.movie_name ?? row.movieName ?? '',
    year: row.year ?? '',
    language: row.language ?? 'English',
    message: row.message ?? '',
    status: (row.status || 'PENDING') as any,
    adminReply: row.admin_reply ?? row.adminReply ?? '',
    adminRepliedAt: row.admin_replied_at ?? row.adminRepliedAt,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
    emailStatus: row.email_status ?? row.emailStatus ?? 'SENT',
    emailSentTo: row.email_sent_to ?? row.emailSentTo,
    emailError: row.email_error ?? row.emailError,
  };
}

/**
 * Transforms a MovieRequest object into a database row payload.
 */
export function mapRequestToRow(req: Partial<MovieRequest>): Record<string, any> {
  const row: Record<string, any> = {};

  if (req.id !== undefined) row.id = req.id;
  if (req.userId !== undefined) row.user_id = req.userId;
  if (req.userName !== undefined) row.user_name = req.userName;
  if (req.userUsername !== undefined) row.user_username = req.userUsername;
  if (req.userEmail !== undefined) row.user_email = req.userEmail;
  if (req.movieName !== undefined) row.movie_name = req.movieName;
  if (req.year !== undefined) row.year = String(req.year);
  if (req.language !== undefined) row.language = req.language;
  if (req.message !== undefined) row.message = req.message;
  if (req.status !== undefined) row.status = req.status;
  if (req.adminReply !== undefined) row.admin_reply = req.adminReply;
  if (req.adminRepliedAt !== undefined) row.admin_replied_at = req.adminRepliedAt;
  if (req.emailStatus !== undefined) row.email_status = req.emailStatus;
  if (req.emailSentTo !== undefined) row.email_sent_to = req.emailSentTo;
  if (req.emailError !== undefined) row.email_error = req.emailError;

  row.updated_at = new Date().toISOString();

  return row;
}
