export interface DownloadLink {
  id: string;
  quality: string; // e.g., '4K', '1080p', '720p', '480p', 'Telegram'
  resolution?: string; // e.g., '3840x2160', '1920x1080', '1280x720', '854x480'
  fileSize?: string; // e.g., '2.4 GB', '1.2 GB'
  size?: string; // alias for fileSize
  url: string;
  serverType?: string; // e.g., 'Direct High-Speed', 'Telegram Link', 'Google Drive', 'Mega'
  format?: string;
  audioSubAttribute?: string; // e.g., 'Tamil [Sinhala Sub]', 'Hindi [Original Audio]'
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber?: number;
  title: string;
  streamServer1Url?: string;
  streamServer2Url?: string;
  streamServer3Url?: string;
  downloadUrl?: string;
}

export interface ServerPlayer {
  id: string;
  name: string; // e.g., 'Server 1: StreamHG', 'Server 2: EarnVids', 'Server 3: FileMoon', 'Server 4: Facebook', 'Server 5: YouTube Trailer'
  url: string; // embed URL
  quality: string;
  serverType?: 'streamhg' | 'earnvids' | 'filemoon' | 'doodstream' | 'streamtape' | 'facebook' | 'youtube' | 'generic' | string;
}

export interface CastMember {
  tmdb_id?: number | string;
  name: string;
  character?: string;
  profileUrl?: string;
  image?: string;
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

  // Dedicated Server URLs
  streamServer1Url?: string;
  streamServer2Url?: string;
  streamServer3Url?: string;
  trailerEmbedUrl?: string;

  // Plots
  sinhalaPlot: string;
  englishPlot: string;

  // Metadata & Categorization
  genres: string[];
  languages: string[]; // e.g., ['Tamil', 'Hindi', 'English', 'Sinhala', 'Malayalam', 'Telugu', 'Kannada', 'Japanese', 'Chinese', 'Korean']
  language: string; // Primary language e.g. 'Tamil'
  contentType: 'Sinhala Sub' | 'Without Sub / English' | 'Sinhala Dubbed' | string;
  cast: (string | CastMember)[];
  director: string;
  audioLanguage: string;
  subtitleSourceUrl?: string; // Direct link to download external subtitle file

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
  episodes?: Episode[];

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

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
}
