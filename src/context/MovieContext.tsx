import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie, Category, Tag, Analytics, SiteSettings } from '../types';
import { INITIAL_MOVIES, INITIAL_CATEGORIES } from '../data/initialMovies';

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
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Actions
  addMovie: (movie: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'addedAt'>) => void;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  incrementViews: (id: string) => void;
  incrementDownloads: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  resetToDefaultData: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

const LOCAL_STORAGE_MOVIES_KEY = 'cinexus_movies_data_v1';
const LOCAL_STORAGE_CATEGORIES_KEY = 'cinexus_categories_data_v1';
const LOCAL_STORAGE_ANALYTICS_KEY = 'cinexus_analytics_data_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'cinexus_site_settings_v1';
const LOCAL_STORAGE_AUTH_KEY = 'cinexus_admin_session_token_v1';

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'CINEXUS',
  sinhalaTitle: 'සිනෙක්ස්',
  announcementText: '🔥 Welcome to CINEXUS! High-speed 1080p Sinhala Subtitled Movie Downloads & Streaming.',
  showAnnouncement: true,
  heroHeading: 'Premium Sinhala Subtitled Cinema Experience',
  heroSubheading: 'Watch and download the latest blockbuster movies and series with 1080p Web-DL quality.',
  footerText: 'CINEXUS (සිනෙක්ස්) • Sri Lanka\'s premier Sinhala subtitled streaming and multi-quality direct download portal.',

  latestMoviesTitle: 'අලුත්ම සිංහල උපසිරැසි (Latest Sinhala Subbed Movies)',
  trendingSeriesTitle: 'Trending Sinhala Subbed TV Series',

  facebookUrl: 'https://facebook.com/cinexus.official',
  telegramChannelUrl: 'https://t.me/cinexus_official',
  whatsappGroupUrl: 'https://chat.whatsapp.com/cinexus_official',
};

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MOVIES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MOVIES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [tags] = useState<Tag[]>([
    { id: '1', name: '4K UHD' },
    { id: '2', name: 'Web-DL' },
    { id: '3', name: '1080p BluRay' },
    { id: '4', name: 'Sinhala Subbed' },
    { id: '5', name: 'Dual Audio' },
  ]);

  const [analytics, setAnalytics] = useState<Analytics>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ANALYTICS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      totalMovies: INITIAL_MOVIES.length,
      activeStreams: 1240,
      totalDownloads: INITIAL_MOVIES.reduce((acc, m) => acc + m.downloadsCount, 0),
      userTrafficToday: 18450,
    };
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
    }
    return DEFAULT_SETTINGS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    return token === 'cinexus_authenticated_admin_session';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MOVIES_KEY, JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ANALYTICS_KEY, JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'cinexus_authenticated_admin_session');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  }, [isAdminAuthenticated]);

  const loginAdmin = (email: string, password: string): boolean => {
    // Standard secure credentials for admin portal
    const validEmails = ['admin@cinexus.site', 'admin@cinexus.co', 'admin'];
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

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const addMovie = (movieData: Omit<Movie, 'id' | 'viewsCount' | 'downloadsCount' | 'addedAt'>) => {
    const newMovie: Movie = {
      ...movieData,
      id: `m_${Date.now()}`,
      viewsCount: 0,
      downloadsCount: 0,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setMovies(prev => [newMovie, ...prev]);
    setAnalytics(prev => ({ ...prev, totalMovies: prev.totalMovies + 1 }));
  };

  const updateMovie = (id: string, movieData: Partial<Movie>) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...movieData } : m));
  };

  const deleteMovie = (id: string) => {
    setMovies(prev => prev.filter(m => m.id !== id));
    setAnalytics(prev => ({ ...prev, totalMovies: Math.max(0, prev.totalMovies - 1) }));
  };

  const incrementViews = (id: string) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, viewsCount: m.viewsCount + 1 } : m));
    setAnalytics(prev => ({ ...prev, activeStreams: prev.activeStreams + 1 }));
  };

  const incrementDownloads = (id: string) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m));
    setAnalytics(prev => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `c_${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const resetToDefaultData = () => {
    setMovies(INITIAL_MOVIES);
    setCategories(INITIAL_CATEGORIES);
    setSiteSettings(DEFAULT_SETTINGS);
    setAnalytics({
      totalMovies: INITIAL_MOVIES.length,
      activeStreams: 1240,
      totalDownloads: INITIAL_MOVIES.reduce((acc, m) => acc + m.downloadsCount, 0),
      userTrafficToday: 18450,
    });
    localStorage.removeItem(LOCAL_STORAGE_MOVIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CATEGORIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANALYTICS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
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
      sortBy,
      setSortBy,
      addMovie,
      updateMovie,
      deleteMovie,
      incrementViews,
      incrementDownloads,
      addCategory,
      deleteCategory,
      resetToDefaultData,
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
