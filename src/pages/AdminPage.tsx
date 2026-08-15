import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import type { Movie, SiteSettings } from '../types';
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Download,
  Users,
  Activity,
  Sparkles,
  Tag,
  Search,
  RotateCcw,
  X,
  Check,
  Bot,
  Lock,
  LogOut,
  Settings,
  Megaphone,
  Globe,
  Save,
  ShieldCheck
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    movies,
    categories,
    analytics,
    siteSettings,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateSiteSettings,
    addMovie,
    updateMovie,
    deleteMovie,
    addCategory,
    deleteCategory,
    resetToDefaultData
  } = useMovies();

  // Auth passcode state
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'analytics' | 'movies' | 'categories' | 'branding'>('movies');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('Invalid Admin Passcode! (Default: cinexus2025)');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };
  const [searchAdmin, setSearchAdmin] = useState('');
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    sinhalaTitle: '',
    year: new Date().getFullYear(),
    imdbRating: 8.0,
    duration: '2h 15m',
    qualityBadge: '1080p WEB-DL',
    posterUrl: '',
    backdropUrl: '',
    trailerUrl: '',
    sinhalaPlot: '',
    englishPlot: '',
    genres: ['Action', 'Sci-Fi'],
    cast: ['Lead Actor 1', 'Lead Actor 2'],
    director: 'Director Name',
    audioLanguage: 'English (Sinhala Sub)',
    subtitleAuthor: {
      name: 'සිනෙක්ස් සිංහල සබ්',
      downloadsCount: 1500,
      releaseDate: new Date().toISOString().split('T')[0]
    },
    servers: [
      { id: 's1', name: 'Server 1 (CINEXUS Player)', url: 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p' },
      { id: 's2', name: 'Server 2 (Fast Stream)', url: 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '2.5 GB', url: '#download-1080p', format: 'MKV / x264' },
      { id: 'dl2', quality: '720p', size: '1.2 GB', url: '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: '480p', size: '600 MB', url: '#download-480p', format: 'MP4' },
      { id: 'dl4', quality: 'Telegram', size: 'Instant Link', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
    ],
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: true,
    isFeatured: false,
    isTVSeries: false,
  });

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSinhala, setNewCatSinhala] = useState('');

  // TMDB Auto-Fetch Simulator
  const handleTMDBCLEAFetch = () => {
    if (!formData.title) {
      alert('Please enter a movie title first to fetch TMDB metadata.');
      return;
    }
    // Simulate TMDB Metadata Fetch
    setFormData(prev => ({
      ...prev,
      sinhalaTitle: prev.title ? `${prev.title} (සිංහල උපසිරැසි)` : '',
      imdbRating: Number((Math.random() * (9.2 - 7.0) + 7.0).toFixed(1)),
      posterUrl: prev.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: prev.backdropUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: prev.trailerUrl || 'https://www.youtube.com/embed/d9MyW72ELq0',
      sinhalaPlot: `${prev.title} සඳහා සිංහල උපසිරැසි සමඟින් ඉහළම ගුණාත්මක භාවයෙන් යුතුව සිනෙක්ස් අඩවියෙන් නොමිලේම නරඹන්න සහ බාගත කරගන්න.`,
      englishPlot: `Official full movie details for ${prev.title}. High quality video stream and fast download links with complete Sinhala subtitle files.`,
      director: 'Hollywood Director',
      cast: ['Star Actor A', 'Star Actress B']
    }));
  };

  const handleOpenAddModal = () => {
    setEditingMovieId(null);
    setFormData({
      title: '',
      sinhalaTitle: '',
      year: new Date().getFullYear(),
      imdbRating: 8.0,
      duration: '2h 15m',
      qualityBadge: '1080p WEB-DL',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
      sinhalaPlot: '',
      englishPlot: '',
      genres: ['Action', 'Sci-Fi'],
      cast: ['Actor 1', 'Actor 2'],
      director: 'Director Name',
      audioLanguage: 'English (Sinhala Sub)',
      subtitleAuthor: {
        name: 'සිනෙක්ස් සිංහල සබ්',
        downloadsCount: 1500,
        releaseDate: new Date().toISOString().split('T')[0]
      },
      servers: [
        { id: 's1', name: 'Server 1 (CINEXUS HD)', url: 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p' }
      ],
      downloadLinks: [
        { id: 'dl1', quality: '1080p', size: '2.5 GB', url: '#download-1080p', format: 'MKV' },
        { id: 'dl2', quality: '720p', size: '1.2 GB', url: '#download-720p', format: 'MP4' },
        { id: 'dl3', quality: 'Telegram', size: 'Direct Telegram', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
      ],
      hasSinhalaSub: true,
      isDualAudio: false,
      isTrending: true,
      isFeatured: false,
      isTVSeries: false,
    });
    setIsMovieModalOpen(true);
  };

  const handleOpenEditModal = (movie: Movie) => {
    setEditingMovieId(movie.id);
    setFormData(movie);
    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.posterUrl) {
      alert('Please fill in required fields (Title & Poster URL).');
      return;
    }

    if (editingMovieId) {
      updateMovie(editingMovieId, formData);
    } else {
      addMovie(formData as any);
    }
    setIsMovieModalOpen(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSinhala) return;
    addCategory({
      name: newCatName,
      sinhalaName: newCatSinhala,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-')
    });
    setNewCatName('');
    setNewCatSinhala('');
  };

  const filteredAdminMovies = movies.filter(m =>
    m.title.toLowerCase().includes(searchAdmin.toLowerCase()) ||
    m.sinhalaTitle.toLowerCase().includes(searchAdmin.toLowerCase())
  );

  // Security Authentication Check
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-rose-600 p-0.5 mx-auto shadow-lg shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#121620] rounded-2xl flex items-center justify-center text-cyan-400">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-[10px] uppercase tracking-wider">
              Restricted Area
            </span>
            <h2 className="text-2xl font-black text-white mt-2">CINEXUS Admin Access</h2>
            <p className="text-xs text-gray-400 mt-1">Please enter the master administrator passcode to unlock dashboard control.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Master Passcode</label>
              <input
                type="password"
                placeholder="Enter admin passcode (e.g. cinexus2025)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
                required
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> Authenticate & Access Admin
            </button>
          </form>

          <p className="text-[11px] text-gray-500">Default passcode: <code className="text-cyan-300 bg-white/5 px-1.5 py-0.5 rounded">cinexus2025</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-extrabold text-xs uppercase tracking-wider">
              System Control
            </span>
            <span className="text-xs text-purple-300 font-bold">CINEXUS Admin v2.5</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Site Management & Dashboard (පාලන පුවරුව)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaultData}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reset dataset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default Data
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Movie / Series
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Lock & Exit Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'movies'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-4 h-4" /> Movies & Series ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" /> Branding & Announcements
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" /> Analytics & Traffic
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" /> Category & Genre Manager
        </button>
      </div>

      {/* TAB 0: BRANDING & ANNOUNCEMENTS CONTROL */}
      {activeTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> Site Customization & Branding Editor
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Change site titles, global announcement banners, hero section copy, and footer text in real-time.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <Save className="w-4 h-4" /> Save Site Settings
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Site branding and announcement settings saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (English)</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (Sinhala - සිනෙක්ස්)</label>
                <input
                  type="text"
                  value={settingsForm.sinhalaTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sinhalaTitle: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-300 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" /> Global Top Announcement Banner
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-400">
                    <input
                      type="checkbox"
                      checked={settingsForm.showAnnouncement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                      className="accent-cyan-400 w-4 h-4"
                    />
                    Enable Announcement Banner
                  </label>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  placeholder="Enter notice text shown at the top of every page..."
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Headline</label>
                <input
                  type="text"
                  value={settingsForm.heroHeading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.heroSubheading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Telegram Channel Link</label>
                <input
                  type="text"
                  value={settingsForm.telegramChannelUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, telegramChannelUrl: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Footer Text Copyright</label>
                <input
                  type="text"
                  value={settingsForm.footerText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                  className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Total Catalog Movies</p>
                <h3 className="text-2xl font-black text-white mt-1">{analytics.totalMovies}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
                <Film className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Active Live Streams</p>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">{analytics.activeStreams.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Total Downloads</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{analytics.totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Download className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">User Traffic Today</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{analytics.userTrafficToday.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Platform System Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#12151e] p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-gray-400">Embed Server 1 (CINEXUS Engine)</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Operational (100%)
                </p>
              </div>
              <div className="bg-[#12151e] p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-gray-400">Database Synchronization</span>
                <p className="font-bold text-cyan-400">LocalStorage Dynamic Sync Active</p>
              </div>
              <div className="bg-[#12151e] p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-gray-400">Telegram Channel Bot</span>
                <p className="font-bold text-purple-400">Connected (@cinexus_movies)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIE MANAGEMENT (CRUD) */}
      {activeTab === 'movies' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Search Table Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#12151e] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by title..."
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                className="w-full bg-[#08090c] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <span className="text-xs text-gray-400">Showing {filteredAdminMovies.length} of {movies.length} entries</span>
          </div>

          {/* Movies List Table */}
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0c0e15] text-gray-400 font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Movie / Series</th>
                    <th className="p-4">IMDb</th>
                    <th className="p-4">Quality</th>
                    <th className="p-4">Badges</th>
                    <th className="p-4">Views / Downloads</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAdminMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded-lg border border-white/10"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{movie.title}</p>
                            <p className="text-purple-300 text-xs">{movie.sinhalaTitle}</p>
                            <span className="text-[10px] text-gray-500">{movie.year} • {movie.genres.join(', ')}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-amber-400">
                        ★ {movie.imdbRating}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                          {movie.qualityBadge}
                        </span>
                      </td>

                      <td className="p-4 space-x-1">
                        {movie.hasSinhalaSub && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold text-[10px]">
                            Sinhala Sub
                          </span>
                        )}
                        {movie.isTrending && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                            Trending
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-gray-400">
                        {movie.viewsCount.toLocaleString()} / {movie.downloadsCount.toLocaleString()}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(movie)}
                            className="p-2 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                            title="Edit Movie"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
                                deleteMovie(movie.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-600/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CATEGORY & TAG MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">

          {/* Add Category Form */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" /> Add New Genre Category
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Category Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Thriller"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#12151e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Sinhala Name (සිංහල නම)</label>
                <input
                  type="text"
                  placeholder="e.g. කුතුහලාත්මක"
                  value={newCatSinhala}
                  onChange={(e) => setNewCatSinhala(e.target.value)}
                  className="w-full bg-[#12151e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Active Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-xl bg-[#12151e] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{cat.name}</span>
                    <span className="text-xs text-purple-300">{cat.sinhalaName}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ADD / EDIT MOVIE MODAL FORM */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#12151e] border border-white/10 rounded-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f17]">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {editingMovieId ? 'Edit Movie Details' : 'Add New Movie / Series'}
                </h3>
              </div>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveMovie} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

              {/* TMDB Auto Fetch Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white">TMDB Auto-Fetch Assistant</p>
                    <p className="text-[11px] text-gray-400">Type movie title below and click Auto-Fetch to auto-fill metadata.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTMDBCLEAFetch}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs whitespace-nowrap shadow-md"
                >
                  Auto-Fetch
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Movie Title (English)*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Title (සිංහල නම)</label>
                  <input
                    type="text"
                    value={formData.sinhalaTitle}
                    onChange={(e) => setFormData({ ...formData, sinhalaTitle: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">IMDb Rating Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.imdbRating}
                    onChange={(e) => setFormData({ ...formData, imdbRating: parseFloat(e.target.value) || 7.0 })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Poster Image URL*</label>
                  <input
                    type="text"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Backdrop Image URL</label>
                  <input
                    type="text"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Trailer Embed URL</label>
                  <input
                    type="text"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Quality Badge Text</label>
                  <input
                    type="text"
                    value={formData.qualityBadge}
                    onChange={(e) => setFormData({ ...formData, qualityBadge: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Plot Summary (සිංහල කතා සාරාංශය)</label>
                  <textarea
                    rows={3}
                    value={formData.sinhalaPlot}
                    onChange={(e) => setFormData({ ...formData, sinhalaPlot: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">English Plot Summary</label>
                  <textarea
                    rows={2}
                    value={formData.englishPlot}
                    onChange={(e) => setFormData({ ...formData, englishPlot: e.target.value })}
                    className="w-full bg-[#08090c] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Toggles and Badges */}
              <div className="p-4 rounded-2xl bg-[#08090c] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.hasSinhalaSub}
                    onChange={(e) => setFormData({ ...formData, hasSinhalaSub: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                  Sinhala Subtitle
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isDualAudio}
                    onChange={(e) => setFormData({ ...formData, isDualAudio: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                  Dual Audio
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                  Trending
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTVSeries}
                    onChange={(e) => setFormData({ ...formData, isTVSeries: e.target.checked })}
                    className="accent-cyan-400 w-4 h-4"
                  />
                  TV Series
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" /> {editingMovieId ? 'Update Movie' : 'Save Movie'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
