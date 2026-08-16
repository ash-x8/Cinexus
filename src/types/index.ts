export interface DownloadLink {
  id: string;
  quality: string; // e.g., '4K', '1080p', '720p', '480p', 'Telegram'
  resolution?: string; // e.g., '3840x2160', '1920x1080', '1280x720', '854x480'
  fileSize?: string; // e.g., '2.4 GB', '1.2 GB'
  size?: string; // alias for fileSize
  url: string;
  serverType?: string; // e.g., 'Direct High-Speed', 'Telegram Link', 'Google Drive', 'Mega'
  format?: string;
}

export interface ServerPlayer {
  id: string;
  name: string; // e.g., 'Server 1 (StreamHG)', 'Server 2 (Doodstream)', 'Server 3 (Streamtape)', 'Server 4 (Facebook Video)', 'Server 5 (YouTube Trailer)'
  url: string; // embed URL
  quality: string;
  serverType?: 'streamhg' | 'doodstream' | 'streamtape' | 'facebook' | 'youtube' | 'generic' | string;
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

  // Dynamic Section Titles
  latestMoviesTitle: string;
  trendingSeriesTitle: string;

  // Social Media & Contact Links
  facebookUrl: string;
  telegramChannelUrl: string;
  whatsappGroupUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  contactEmail: string;

  // Dynamic Content & Legal Pages
  aboutUsContent: string;
  termsContent: string;
  privacyContent: string;
  contactUsContent: string;
  faqContent: string;
  requestMovieRules: string;
}

export interface Analytics {
  totalMovies: number;
  activeStreams: number;
  totalDownloads: number;
  userTrafficToday: number;
  recentSearches?: string[];
}
