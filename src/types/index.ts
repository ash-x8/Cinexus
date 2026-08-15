export interface DownloadLink {
  id: string;
  quality: '480p' | '720p' | '1080p' | '4K' | 'Telegram';
  size: string;
  url: string;
  format: string;
}

export interface ServerPlayer {
  id: string;
  name: string; // e.g. 'Server 1 (HD)', 'Server 2 (Fast)', 'Streamtape', 'DooDrive / GDrive'
  url: string; // embed URL or stream URL
  quality: string;
}

export interface SubtitleAuthor {
  name: string;
  avatarUrl?: string;
  downloadsCount?: number;
  releaseDate?: string;
}

export interface Movie {
  id: string;
  title: string;
  sinhalaTitle: string;
  originalTitle?: string;
  year: number;
  imdbRating: number;
  duration: string;
  qualityBadge: string; // e.g., '1080p WEB-DL', '720p HD'
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;

  // Plots
  sinhalaPlot: string;
  englishPlot: string;

  // Metadata
  genres: string[];
  cast: string[];
  director: string;
  audioLanguage: string;
  subtitleAuthor: SubtitleAuthor;

  // Video and downloads
  servers: ServerPlayer[];
  downloadLinks: DownloadLink[];

  // Badges & Categories
  hasSinhalaSub: boolean;
  isDualAudio: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  isTVSeries: boolean;
  seasonsCount?: number;
  episodesCount?: number;

  // Stats
  viewsCount: number;
  downloadsCount: number;
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
  sinhalaName: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface SiteSettings {
  siteTitle: string;
  sinhalaTitle: string;
  announcementText: string;
  showAnnouncement: boolean;
  heroHeading: string;
  heroSubheading: string;
  footerText: string;
  telegramChannelUrl: string;
}

export interface Analytics {
  totalMovies: number;
  activeStreams: number;
  totalDownloads: number;
  userTrafficToday: number;
}
