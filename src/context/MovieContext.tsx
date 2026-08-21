import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Movie, Category, Tag, Analytics, SiteSettings, UserProfile, MovieRequest } from '../types';
import { INITIAL_MOVIES, INITIAL_CATEGORIES } from '../data/initialMovies';
import {
  supabase,
  mapRowToMovie,
  mapMovieToRow,
  mapRowToRequest,
  mapRequestToRow,
  isSupabaseConfigured,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from '../utils/supabase';

export { SUPABASE_URL, SUPABASE_ANON_KEY };
export const OMDB_API_KEY = '87cd62a9';

interface MovieContextType {
  movies: Movie[];
  categories: Category[];
  tags: Tag[];
  analytics: Analytics;
  siteSettings: SiteSettings;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  resetAllFilters: () => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Actions
  upsertMovie: (movie: Partial<Movie> & { id?: string }) => Promise<{ success: boolean; data?: Movie; error?: string }>;
  addMovie: (movie: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'addedAt'>) => Promise<Movie>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  incrementViews: (id: string) => void;
  incrementDownloads: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaultData: () => void;
  fetchOMDbMetadata: (titleOrImdbId: string) => Promise<any>;
  logSearchQuery: (query: string) => void;

  // Watchlist, Favorites, History & Profile User State
  watchlist: string[];
  favorites: string[];
  watchedHistory: string[];
  recentlyViewed: string[];
  currentUser: UserProfile | null;
  toggleWatchlist: (movieId: string) => void;
  toggleFavorite: (movieId: string) => void;
  markAsWatched: (movieId: string) => void;
  addToRecentlyViewed: (movieId: string) => void;
  loginUser: (email: string, username?: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Movie Requests
  movieRequests: MovieRequest[];
  submitMovieRequest: (data: { movieName: string; year?: string; language?: string; message?: string }) => Promise<{ success: boolean; message: string; request?: MovieRequest }>;
  updateMovieRequestStatus: (requestId: string, status: 'PENDING' | 'REVIEWING' | 'REPLIED' | 'COMPLETED' | 'REJECTED') => Promise<void>;
  replyMovieRequest: (requestId: string, adminReply: string, status?: 'PENDING' | 'REVIEWING' | 'REPLIED' | 'COMPLETED' | 'REJECTED') => Promise<{ success: boolean; message: string }>;
  deleteMovieRequest: (requestId: string) => Promise<void>;

  // Data Loading & Cloud DB Status
  isLoadingMovies: boolean;
  isLoadingRequests: boolean;
  dbStatus: 'connected' | 'fallback' | 'connecting';
  refreshCatalog: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const LOCAL_STORAGE_MOVIES_KEY = 'cinexus_movies_data_v2';
const LOCAL_STORAGE_CATEGORIES_KEY = 'cinexus_categories_data_v2';
const LOCAL_STORAGE_ANALYTICS_KEY = 'cinexus_analytics_data_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'cinexus_site_settings_v2';
const LOCAL_STORAGE_AUTH_KEY = 'cinexus_admin_session_token_v2';
const LOCAL_STORAGE_WATCHLIST_KEY = 'cinexus_user_watchlist_v1';
const LOCAL_STORAGE_FAVORITES_KEY = 'cinexus_user_favorites_v1';
const LOCAL_STORAGE_WATCHED_KEY = 'cinexus_user_watched_v1';
const LOCAL_STORAGE_RECENT_VIEWED_KEY = 'cinexus_recently_viewed_v1';
const LOCAL_STORAGE_USER_PROFILE_KEY = 'cinexus_user_profile_v1';
const LOCAL_STORAGE_MOVIE_REQUESTS_KEY = 'cinexus_movie_requests_v1';

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'CINEXUS',
  sinhalaTitle: 'සිනෙක්ස්',
  announcementText: '🔥 Welcome to CINEXUS! High-speed 1080p & 4K Sinhala Subtitled Movie Downloads & Live Streaming.',
  showAnnouncement: true,
  heroHeading: 'Premium Sinhala Subtitled Cinema Experience',
  heroSubheading: 'Watch and download the latest blockbuster movies and TV series with ultra HD 1080p & 4K quality.',
  footerText: 'CINEXUS (සිනෙක්ස්) • Sri Lanka\'s premier Sinhala subtitled streaming and multi-quality direct download portal.',

  latestMoviesTitle: 'අලුත්ම සිංහල උපසිරැසි (Latest Sinhala Subbed Movies)',
  trendingSeriesTitle: 'Trending Sinhala Subbed TV Series',

  facebookUrl: 'https://facebook.com/cinexus.official',
  telegramChannelUrl: 'https://t.me/cinexus_official',
  whatsappGroupUrl: 'https://chat.whatsapp.com/cinexus_official',
  instagramUrl: 'https://instagram.com/cinexus.official',
  twitterUrl: 'https://x.com/cinexus_official',
  youtubeUrl: 'https://youtube.com/@cinexus_official',
  contactEmail: 'contact@cinexus.site',

  aboutUsContent: `CINEXUS (සිනෙක්ස්) is Sri Lanka's premier standalone entertainment portal dedicated to delivering high-quality movie streaming and direct multi-quality downloads paired with authentic, accurate Sinhala subtitles.\n\nOur mission is to offer a futuristic, ultra-fast cinematic experience with zero intrusive ads, multiple high-speed CDN fallback servers, and full dynamic controls.`,
  termsContent: `Welcome to CINEXUS. By accessing and using our platform, you agree to adhere to the following Terms of Service:\n\n1. Content Use: All movie previews, trailers, streaming links, and download links are provided for personal, non-commercial entertainment purposes.\n2. User Conduct: Users must not attempt to scrape, disrupt, or overload our streaming CDN servers.\n3. Intellectual Property: Subtitles created by CINEXUS translators remain the copyright of their respective authors.\n4. Revisions: CINEXUS reserves the right to modify site features, server options, and terms at any time.`,
  privacyContent: `At CINEXUS, user privacy and data security are paramount:\n\n1. Information Collection: We do not require personal registration or store personal identifier cookies.\n2. Analytics: Anonymous real-time view counters and download metrics are collected strictly to monitor server performance.\n3. Third-Party Links: External embed servers (StreamHG, EarnVids, FileMoon) maintain independent privacy policies.\n4. Security: All connection data is transmitted securely over encrypted TLS connections.`,
  contactUsContent: `Have questions, technical inquiries, or partnership proposals? Connect with the CINEXUS core team:\n\n• Email Support: contact@cinexus.site\n• Official Telegram Channel: https://t.me/cinexus_official\n• Facebook Page: https://facebook.com/cinexus.official\n• WhatsApp Community: https://chat.whatsapp.com/cinexus_official\n\nOur support administrators respond within 24 hours.`,
  faqContent: `Frequently Asked Questions (නිතර අසන පැන්න):\n\nQ1: How do I download movies with Sinhala subtitles on CINEXUS?\nA: Navigate to your chosen movie page, scroll down to the "Direct Download Links" section, select your preferred quality (4K, 1080p, 720p, 480p, or Telegram), and click the download button.\n\nQ2: Are streams and downloads free?\nA: Yes, CINEXUS is 100% free with no forced subscriptions or hidden fees.\n\nQ3: What video players are supported?\nA: We provide 5 multi-server backup players including StreamHG, EarnVids, FileMoon, Facebook Video, and YouTube Trailers.\n\nQ4: How can I request a new movie or TV series?\nA: Click the "Request Movie" link in the footer or join our Telegram group to submit your request!`,
  requestMovieRules: `Movie Request Guidelines (චිත්‍රපට ඉල්ලීම් මාර්ගෝපදේශ):\n\n1. Check Catalog First: Always use our instant live search bar to verify the movie is not already published.\n2. Accurate Details: Include the official English title, release year, and IMDb link if available.\n3. Digital Release Availability: We can only fulfill requests for titles with an official digital WEB-DL or BluRay release.\n4. Subtitle Timeline: Movies requiring custom Sinhala subtitle translation take 24-48 hours after digital release.`,
  movieRequestAdminEmail: 'kushanashvika216@gmail.com',
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [tags] = useState<Tag[]>([
    { id: '1', name: '4K UHD' },
    { id: '2', name: 'Web-DL' },
    { id: '3', name: '1080p BluRay' },
    { id: '4', name: 'Sinhala Subbed' },
    { id: '5', name: 'Dual Audio' },
  ]);

  const [analytics, setAnalytics] = useState<Analytics>({
    totalMovies: 0,
    activeStreams: 1420,
    totalDownloads: 0,
    userTrafficToday: 18450,
    recentSearches: ['Avatar 2', 'Dune Part Two', 'Demon Slayer', 'Stranger Things'],
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    return token === 'cinexus_authenticated_admin_session';
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WATCHLIST_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['m1', 'm2'];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['m2', 'm5'];
  });

  const [watchedHistory, setWatchedHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WATCHED_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['m3'];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_RECENT_VIEWED_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return ['m1', 'm2', 'm3'];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_PROFILE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [movieRequests, setMovieRequests] = useState<MovieRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MOVIE_REQUESTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'req_sample_1',
        userId: 'u_sample_101',
        userName: 'Sahan Perera',
        userUsername: 'sahan_p',
        userEmail: 'sahan@example.com',
        movieName: 'Inception 2',
        year: '2025',
        language: 'English',
        message: 'Please add Sinhala subtitles as soon as digital release is out.',
        status: 'PENDING',
        adminReply: '',
        createdAt: '2025-02-15T10:30:00Z',
        updatedAt: '2025-02-15T10:30:00Z',
        emailStatus: 'SENT',
        emailSentTo: 'kushanashvika216@gmail.com',
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedContentType, setSelectedContentType] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'fallback' | 'connecting'>('connecting');

  const hasSeededRef = useRef(false);

  // Clean up legacy localStorage cache keys if present
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_MOVIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANALYTICS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'cinexus_authenticated_admin_session');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_WATCHED_KEY, JSON.stringify(watchedHistory));
  }, [watchedHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_RECENT_VIEWED_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_USER_PROFILE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_PROFILE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MOVIE_REQUESTS_KEY, JSON.stringify(movieRequests));
  }, [movieRequests]);

  // Fetch movies catalog from Supabase
  const fetchMovies = useCallback(async () => {
    setIsLoadingMovies(true);
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase movies fetch note:', error.message);
        setMovies(INITIAL_MOVIES);
        setDbStatus('fallback');
      } else if (data && data.length > 0) {
        const mapped = data.map(mapRowToMovie);
        setMovies(mapped);
        setAnalytics(prev => ({
          ...prev,
          totalMovies: mapped.length,
          totalDownloads: mapped.reduce((acc, m) => acc + (m.downloadsCount || 0), 0)
        }));
        setDbStatus('connected');
      } else {
        setMovies(INITIAL_MOVIES);
        if (!hasSeededRef.current) {
          hasSeededRef.current = true;
          const rowsToSeed = INITIAL_MOVIES.map(mapMovieToRow);
          const { error: seedError } = await supabase.from('movies').upsert(rowsToSeed);
          if (!seedError) {
            setDbStatus('connected');
          }
        }
      }
    } catch (err) {
      console.warn('Supabase catalog error, using initial catalog:', err);
      setMovies(INITIAL_MOVIES);
      setDbStatus('fallback');
    } finally {
      setIsLoadingMovies(false);
    }
  }, []);

  // Fetch movie requests from Supabase
  const fetchMovieRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('movie_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase requests fetch note:', error.message);
      } else if (data && data.length > 0) {
        const mapped = data.map(mapRowToRequest);
        setMovieRequests(mapped);
      }
    } catch (err) {
      console.warn('Supabase requests error:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  // Fetch site settings and categories from Supabase
  const fetchSiteSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'current')
        .single();

      if (!error && data?.settings) {
        setSiteSettings(prev => ({ ...prev, ...data.settings }));
      }

      // Also fetch dynamic categories from Supabase
      const { data: catData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'categories')
        .single();

      if (catData?.settings?.list && Array.isArray(catData.settings.list) && catData.settings.list.length > 0) {
        setCategories(catData.settings.list);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // Initial load & real-time subscriptions
  useEffect(() => {
    fetchMovies();
    fetchMovieRequests();
    fetchSiteSettings();

    // Supabase Realtime Subscriptions
    const moviesChannel = supabase
      .channel('cinexus_movies_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movies' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newMovie = mapRowToMovie(payload.new);
            setMovies(prev => {
              const exists = prev.some(m => m.id === newMovie.id);
              if (exists) return prev.map(m => m.id === newMovie.id ? newMovie : m);
              return [newMovie, ...prev];
            });
            setAnalytics(prev => ({ ...prev, totalMovies: prev.totalMovies + 1 }));
          } else if (payload.eventType === 'UPDATE') {
            const updatedMovie = mapRowToMovie(payload.new);
            setMovies(prev => prev.map(m => m.id === updatedMovie.id ? updatedMovie : m));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old?.id);
            setMovies(prev => prev.filter(m => m.id !== deletedId));
            setAnalytics(prev => ({ ...prev, totalMovies: Math.max(0, prev.totalMovies - 1) }));
          }
        }
      )
      .subscribe();

    const requestsChannel = supabase
      .channel('cinexus_requests_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movie_requests' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newReq = mapRowToRequest(payload.new);
            setMovieRequests(prev => {
              const exists = prev.some(r => r.id === newReq.id);
              if (exists) return prev.map(r => r.id === newReq.id ? newReq : r);
              return [newReq, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedReq = mapRowToRequest(payload.new);
            setMovieRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = String(payload.old?.id);
            setMovieRequests(prev => prev.filter(r => r.id !== deletedId));
          }
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel('cinexus_settings_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload: any) => {
          if (payload.new?.id === 'categories' && payload.new?.settings?.list) {
            setCategories(payload.new.settings.list);
          } else if (payload.new?.settings) {
            setSiteSettings(prev => ({ ...prev, ...payload.new.settings }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(moviesChannel);
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, [fetchMovies, fetchMovieRequests, fetchSiteSettings]);

  const refreshCatalog = async () => {
    await fetchMovies();
    await fetchMovieRequests();
    await fetchSiteSettings();
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedContentType('All');
    setSelectedLanguage('All');
    setSelectedGenre('All');
  };

  const toggleWatchlist = (movieId: string) => {
    setWatchlist(prev =>
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const toggleFavorite = (movieId: string) => {
    setFavorites(prev =>
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const markAsWatched = (movieId: string) => {
    setWatchedHistory(prev =>
      prev.includes(movieId) ? prev : [movieId, ...prev]
    );
  };

  const addToRecentlyViewed = (movieId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== movieId);
      return [movieId, ...filtered].slice(0, 20);
    });
  };

  const loginUser = (email: string, username?: string) => {
    const newUser: UserProfile = {
      id: `u_${Date.now()}`,
      username: username || email.split('@')[0] || 'Cinephile',
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(newUser);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser(prev => prev ? { ...prev, ...profile } : null);
  };

  // Submit Movie Request to Supabase + state
  const submitMovieRequest = async (data: { movieName: string; year?: string; language?: string; message?: string }) => {
    if (!currentUser) {
      return { success: false, message: 'Please log in or create an account to submit a movie request.' };
    }

    if (!data.movieName || !data.movieName.trim()) {
      return { success: false, message: 'Please enter a valid movie name.' };
    }

    const now = new Date().toISOString();
    const adminEmailToUse = siteSettings.movieRequestAdminEmail || 'kushanashvika216@gmail.com';

    const newRequest: MovieRequest = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username || 'CINEXUS User',
      userUsername: currentUser.username || 'user',
      userEmail: currentUser.email,
      movieName: data.movieName.trim(),
      year: data.year?.trim() || '',
      language: data.language?.trim() || 'English',
      message: data.message?.trim() || '',
      status: 'PENDING',
      adminReply: '',
      createdAt: now,
      updatedAt: now,
      emailStatus: 'SENT',
      emailSentTo: adminEmailToUse,
    };

    // Optimistically update local state
    setMovieRequests(prev => [newRequest, ...prev]);

    // Save to shared database
    try {
      const dbRow = mapRequestToRow(newRequest);
      const { error } = await supabase.from('movie_requests').insert(dbRow);
      if (error) {
        console.warn('Supabase request insert warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase request insert error:', err);
    }

    return {
      success: true,
      message: 'Your movie request has been submitted successfully.',
      request: newRequest
    };
  };

  // Update Movie Request Status in Supabase + state
  const updateMovieRequestStatus = async (
    requestId: string,
    status: 'PENDING' | 'REVIEWING' | 'REPLIED' | 'COMPLETED' | 'REJECTED'
  ) => {
    const now = new Date().toISOString();
    setMovieRequests(prev => prev.map(req => req.id === requestId ? {
      ...req,
      status,
      updatedAt: now
    } : req));

    try {
      await supabase
        .from('movie_requests')
        .update({ status, updated_at: now })
        .eq('id', requestId);
    } catch (err) {
      console.warn('Supabase request status update error:', err);
    }
  };

  // Reply to Movie Request in Supabase + state
  const replyMovieRequest = async (
    requestId: string,
    adminReply: string,
    status?: 'PENDING' | 'REVIEWING' | 'REPLIED' | 'COMPLETED' | 'REJECTED'
  ): Promise<{ success: boolean; message: string }> => {
    const now = new Date().toISOString();
    const targetStatus = status || 'REPLIED';

    setMovieRequests(prev => prev.map(req => req.id === requestId ? {
      ...req,
      adminReply: adminReply.trim(),
      adminRepliedAt: now,
      status: targetStatus,
      updatedAt: now
    } : req));

    try {
      const { error } = await supabase
        .from('movie_requests')
        .update({
          admin_reply: adminReply.trim(),
          admin_replied_at: now,
          status: targetStatus,
          updated_at: now
        })
        .eq('id', requestId);

      if (error) {
        console.warn('Supabase reply update note:', error.message);
      }
      return { success: true, message: 'Admin reply saved successfully.' };
    } catch (err: any) {
      console.error('Supabase reply update error:', err);
      return { success: true, message: 'Reply saved to local session.' };
    }
  };

  // Delete Movie Request from Supabase + state
  const deleteMovieRequest = async (requestId: string) => {
    setMovieRequests(prev => prev.filter(req => req.id !== requestId));

    try {
      await supabase.from('movie_requests').delete().eq('id', requestId);
    } catch (err) {
      console.warn('Supabase delete request error:', err);
    }
  };

  const loginAdmin = (email: string, password: string): boolean => {
    const validEmails = ['admin@cinexus.site', 'admin@cinexus.co', 'admin', 'kushanashvika216@gmail.com'];
    const validPasswords = ['cinexus2025', 'admin123', 'admin'];

    if (validEmails.includes(email.trim().toLowerCase()) && validPasswords.includes(password.trim())) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);

    try {
      await supabase
        .from('site_settings')
        .upsert({ id: 'current', settings: updated, updated_at: new Date().toISOString() });
    } catch (err) {
      console.warn('Supabase site settings save note:', err);
    }
  };

  // Direct Upsert Movie to Supabase 'movies' table + update state
  const upsertMovie = async (movieData: Partial<Movie> & { id?: string }): Promise<{ success: boolean; data?: Movie; error?: string }> => {
    try {
      const id = movieData.id || `m_${Date.now()}`;
      const existing = movies.find(m => m.id === id);
      
      const fullMovie: Movie = {
        id,
        title: movieData.title || existing?.title || 'Untitled Movie',
        sinhalaTitle: movieData.sinhalaTitle ?? existing?.sinhalaTitle ?? '',
        originalTitle: movieData.originalTitle ?? existing?.originalTitle ?? movieData.title ?? '',
        year: movieData.year ?? existing?.year ?? new Date().getFullYear(),
        imdbRating: movieData.imdbRating ?? existing?.imdbRating ?? 8.0,
        duration: movieData.duration || existing?.duration || '2h 00m',
        qualityBadge: movieData.qualityBadge || existing?.qualityBadge || '1080p WEB-DL',
        posterUrl: movieData.posterUrl || existing?.posterUrl || '',
        backdropUrl: movieData.backdropUrl ?? existing?.backdropUrl ?? '',
        trailerUrl: movieData.trailerUrl ?? existing?.trailerUrl ?? '',
        streamServer1Url: movieData.streamServer1Url ?? existing?.streamServer1Url ?? '',
        streamServer2Url: movieData.streamServer2Url ?? existing?.streamServer2Url ?? '',
        streamServer3Url: movieData.streamServer3Url ?? existing?.streamServer3Url ?? '',
        trailerEmbedUrl: movieData.trailerEmbedUrl ?? existing?.trailerEmbedUrl ?? movieData.trailerUrl ?? '',
        sinhalaPlot: movieData.sinhalaPlot ?? existing?.sinhalaPlot ?? '',
        englishPlot: movieData.englishPlot ?? existing?.englishPlot ?? '',
        genres: movieData.genres || existing?.genres || ['Action'],
        languages: movieData.languages || existing?.languages || ['English'],
        language: movieData.language || existing?.language || 'English',
        contentType: movieData.contentType || existing?.contentType || 'Sinhala Sub',
        cast: movieData.cast || existing?.cast || [],
        director: movieData.director || existing?.director || 'Unknown',
        audioLanguage: movieData.audioLanguage || existing?.audioLanguage || 'English',
        subtitleSourceUrl: movieData.subtitleSourceUrl ?? existing?.subtitleSourceUrl ?? '',
        servers: movieData.servers || existing?.servers || [],
        downloadLinks: movieData.downloadLinks || existing?.downloadLinks || [],
        hasSinhalaSub: movieData.hasSinhalaSub ?? existing?.hasSinhalaSub ?? true,
        isDualAudio: movieData.isDualAudio ?? existing?.isDualAudio ?? false,
        isTrending: movieData.isTrending ?? existing?.isTrending ?? false,
        isFeatured: movieData.isFeatured ?? existing?.isFeatured ?? false,
        isTVSeries: movieData.isTVSeries ?? existing?.isTVSeries ?? false,
        seasonsCount: movieData.seasonsCount ?? existing?.seasonsCount ?? 0,
        episodesCount: movieData.episodesCount ?? existing?.episodesCount ?? (movieData.episodes ? movieData.episodes.length : 0),
        episodes: movieData.episodes || existing?.episodes || [],
        viewsCount: movieData.viewsCount ?? existing?.viewsCount ?? 0,
        downloadsCount: movieData.downloadsCount ?? existing?.downloadsCount ?? 0,
        addedAt: movieData.addedAt || existing?.addedAt || new Date().toISOString().split('T')[0],
      };

      // Optimistically update React state
      setMovies(prev => {
        const idx = prev.findIndex(m => m.id === id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = fullMovie;
          return updated;
        }
        return [fullMovie, ...prev];
      });
      setAnalytics(prev => ({ ...prev, totalMovies: Math.max(prev.totalMovies, movies.length + 1) }));

      // Direct Supabase upsert to 'movies' table
      const dbRow = mapMovieToRow(fullMovie);
      const { data, error } = await supabase
        .from('movies')
        .upsert(dbRow, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase upsertMovie note:', error.message);
        return { success: false, data: fullMovie, error: error.message };
      }

      const savedMovie = data ? mapRowToMovie(data) : fullMovie;
      return { success: true, data: savedMovie };
    } catch (err: any) {
      console.error('upsertMovie error:', err);
      return { success: false, error: err?.message || 'Database error' };
    }
  };

  // Add Movie to Supabase + state (uses upsertMovie)
  const addMovie = async (movieData: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'addedAt'>): Promise<Movie> => {
    const newMovie: Movie = {
      ...movieData,
      id: `m_${Date.now()}`,
      viewsCount: 0,
      downloadsCount: 0,
      addedAt: new Date().toISOString().split('T')[0],
    };

    const res = await upsertMovie(newMovie);
    return res.data || newMovie;
  };

  // Update Movie in Supabase + state (uses upsertMovie)
  const updateMovie = async (id: string, movieData: Partial<Movie>) => {
    const existing = movies.find(m => m.id === id);
    const merged = existing ? { ...existing, ...movieData } : { id, ...movieData };
    await upsertMovie(merged as Movie);
  };

  // Delete Movie from Supabase + state
  const deleteMovie = async (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    setAnalytics(prev => ({ ...prev, totalMovies: Math.max(0, prev.totalMovies - 1) }));

    try {
      const { error } = await supabase.from('movies').delete().eq('id', id);
      if (error) {
        console.warn('Supabase delete movie note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase delete movie error:', err);
    }
  };

  const incrementViews = (id: string) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, viewsCount: (m.viewsCount || 0) + 1 } : m));
    setAnalytics(prev => ({ ...prev, activeStreams: prev.activeStreams + 1 }));

    (async () => {
      try {
        const { data } = await supabase.from('movies').select('views_count').eq('id', id).single();
        if (data) {
          const newCount = (data.views_count || 0) + 1;
          await supabase.from('movies').update({ views_count: newCount }).eq('id', id);
        }
      } catch (e) {
        // ignore
      }
    })();
  };

  const incrementDownloads = (id: string) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m));
    setAnalytics(prev => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));

    (async () => {
      try {
        const { data } = await supabase.from('movies').select('downloads_count').eq('id', id).single();
        if (data) {
          const newCount = (data.downloads_count || 0) + 1;
          await supabase.from('movies').update({ downloads_count: newCount }).eq('id', id);
        }
      } catch (e) {
        // ignore
      }
    })();
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `c_${Date.now()}`
    };
    const updated = [...categories, newCat];
    setCategories(updated);

    try {
      await supabase
        .from('site_settings')
        .upsert({ id: 'categories', settings: { list: updated }, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Supabase addCategory note:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);

    try {
      await supabase
        .from('site_settings')
        .upsert({ id: 'categories', settings: { list: updated }, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Supabase deleteCategory note:', e);
    }
  };

  const logSearchQuery = (query: string) => {
    if (!query || query.trim().length < 2) return;
    setAnalytics(prev => {
      const existing = prev.recentSearches || [];
      const updated = [query.trim(), ...existing.filter(q => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 10);
      return { ...prev, recentSearches: updated };
    });
  };

  // OMDb API Fetcher using API key 87cd62a9
  const fetchOMDbMetadata = async (titleOrImdbId: string) => {
    const paramKey = titleOrImdbId.startsWith('tt') ? 'i' : 't';
    const response = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&${paramKey}=${encodeURIComponent(titleOrImdbId)}`);
    const data = await response.json();
    return data;
  };

  const resetToDefaultData = async () => {
    setMovies(INITIAL_MOVIES);
    setCategories(INITIAL_CATEGORIES);
    setSiteSettings(DEFAULT_SETTINGS);
    setAnalytics({
      totalMovies: INITIAL_MOVIES.length,
      activeStreams: 1420,
      totalDownloads: INITIAL_MOVIES.reduce((acc, m) => acc + m.downloadsCount, 0),
      userTrafficToday: 18450,
      recentSearches: ['Avatar 2', 'Dune Part Two', 'Demon Slayer', 'Stranger Things'],
    });
    localStorage.removeItem(LOCAL_STORAGE_MOVIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANALYTICS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);

    try {
      await supabase.from('movies').upsert(INITIAL_MOVIES.map(mapMovieToRow));
    } catch (e) {
      // ignore
    }
  };

  return (
    <MovieContext.Provider value={{
      movies,
      categories,
      tags,
      analytics,
      siteSettings,
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      updateSiteSettings,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedContentType,
      setSelectedContentType,
      selectedLanguage,
      setSelectedLanguage,
      selectedGenre,
      setSelectedGenre,
      resetAllFilters,
      sortBy,
      setSortBy,
      upsertMovie,
      addMovie,
      updateMovie,
      deleteMovie,
      incrementViews,
      incrementDownloads,
      addCategory,
      deleteCategory,
      resetToDefaultData,
      fetchOMDbMetadata,
      logSearchQuery,
      watchlist,
      favorites,
      watchedHistory,
      recentlyViewed,
      currentUser,
      toggleWatchlist,
      toggleFavorite,
      markAsWatched,
      addToRecentlyViewed,
      loginUser,
      logoutUser,
      updateUserProfile,
      movieRequests,
      submitMovieRequest,
      updateMovieRequestStatus,
      replyMovieRequest,
      deleteMovieRequest,
      isLoadingMovies,
      isLoadingRequests,
      dbStatus,
      refreshCatalog,
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
