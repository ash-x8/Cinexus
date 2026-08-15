import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import type { Movie, SiteSettings, ServerPlayer, DownloadLink } from '../types';
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
  ShieldCheck,
  Share2,
  Mail,
  Key,
  Server,
  Loader2
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
    resetToDefaultData,
    fetchOMDbMetadata
  } = useMovies();

  // Auth passcode / email state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'movies' | 'branding' | 'social' | 'analytics' | 'categories'>('movies');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // OMDb fetch loading indicator
  const [isOmdbLoading, setIsOmdbLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(adminEmail, adminPassword)) {
      setAuthError('');
      setAdminEmail('');
      setAdminPassword('');
    } else {
      setAuthError('Invalid Admin Email or Password! (Default: admin@cinexus.site / cinexus2025)');
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

  // Movie Form State
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
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: true,
    isFeatured: false,
    isTVSeries: false,
  });

  // 5 Server player embed helper inputs
  const [server1Url, setServer1Url] = useState('');
  const [server2Url, setServer2Url] = useState('');
  const [server3Url, setServer3Url] = useState('');
  const [server4Url, setServer4Url] = useState('');
  const [server5Url, setServer5Url] = useState('');

  // Download inputs helper state
  const [dl480Url, setDl480Url] = useState('');
  const [dl720Url, setDl720Url] = useState('');
  const [dl1080Url, setDl1080Url] = useState('');
  const [dlTelegramUrl, setDlTelegramUrl] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSinhala, setNewCatSinhala] = useState('');

  // OMDb API Auto-Fetch Helper (Key: 87cd62a9)
  const handleOMDbFetch = async () => {
    if (!formData.title) {
      alert('Please enter a movie title or IMDb ID first.');
      return;
    }
    setIsOmdbLoading(true);
    try {
      const data = await fetchOMDbMetadata(formData.title);
      if (data && data.Response !== 'False') {
        setFormData(prev => ({
          ...prev,
          title: data.Title || prev.title,
          sinhalaTitle: prev.sinhalaTitle || `${data.Title} (සිංහල උපසිරැසි)`,
          year: parseInt(data.Year) || prev.year,
          imdbRating: parseFloat(data.imdbRating) || 8.0,
          posterUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : prev.posterUrl,
          backdropUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : prev.backdropUrl,
          englishPlot: data.Plot || prev.englishPlot,
          sinhalaPlot: prev.sinhalaPlot || `${data.Title} සඳහා සියලුම සිංහල උපසිරැසි සමඟින් උසස්ම ගුණාත්මක භාවයෙන් යුතුව සිනෙක්ස් අඩවියෙන් නොමිලේම නරඹන්න සහ බාගත කරගන්න.`,
          director: data.Director || prev.director,
          cast: data.Actors ? data.Actors.split(', ') : prev.cast,
          genres: data.Genre ? data.Genre.split(', ') : prev.genres,
          duration: data.Runtime || prev.duration,
        }));
      } else {
        alert(`OMDb Fetch Notice: ${data.Error || 'Movie not found.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch from OMDb API. Please check network connection.');
    } finally {
      setIsOmdbLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMovieId(null);
    setServer1Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer2Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer3Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer4Url('https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%-[#]');
    setServer5Url('https://www.youtube.com/embed/d9MyW72ELq0');

    setDl480Url('#download-480p');
    setDl720Url('#download-720p');
    setDl1080Url('#download-1080p');
    setDlTelegramUrl('https://t.me/cinexus_official');

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

    // Set 5 server helper fields
    setServer1Url(movie.servers?.[0]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer2Url(movie.servers?.[1]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer3Url(movie.servers?.[2]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer4Url(movie.servers?.[3]?.url || '');
    setServer5Url(movie.servers?.[4]?.url || movie.trailerUrl || '');

    const d480 = movie.downloadLinks?.find(d => d.quality === '480p')?.url || '';
    const d720 = movie.downloadLinks?.find(d => d.quality === '720p')?.url || '';
    const d1080 = movie.downloadLinks?.find(d => d.quality === '1080p')?.url || '';
    const dTelegram = movie.downloadLinks?.find(d => d.quality === 'Telegram')?.url || '';

    setDl480Url(d480);
    setDl720Url(d720);
    setDl1080Url(d1080);
    setDlTelegramUrl(dTelegram);

    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.posterUrl) {
      alert('Please fill in required fields (Title & Poster URL).');
      return;
    }

    // Build 5 servers array
    const updatedServers: ServerPlayer[] = [
      { id: 's1', name: 'Server 1 (StreamHG)', url: server1Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p', serverType: 'streamhg' },
      { id: 's2', name: 'Server 2 (Doodstream)', url: server2Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p', serverType: 'doodstream' },
      { id: 's3', name: 'Server 3 (Streamtape)', url: server3Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p', serverType: 'streamtape' },
      { id: 's4', name: 'Server 4 (Facebook Free Data)', url: server4Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '480p', serverType: 'facebook' },
      { id: 's5', name: 'Server 5 (YouTube Official Trailer)', url: server5Url || formData.trailerUrl || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p', serverType: 'youtube' }
    ];

    // Build download links array
    const updatedDownloads: DownloadLink[] = [
      { id: 'dl1', quality: '1080p', size: '2.5 GB', url: dl1080Url || '#download-1080p', format: 'MKV / x264' },
      { id: 'dl2', quality: '720p', size: '1.2 GB', url: dl720Url || '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: '480p', size: '600 MB', url: dl480Url || '#download-480p', format: 'MP4' },
      { id: 'dl4', quality: 'Telegram', size: 'Direct Telegram', url: dlTelegramUrl || 'https://t.me/cinexus_official', format: 'Telegram' }
    ];

    const movieToSave = {
      ...formData,
      servers: updatedServers,
      downloadLinks: updatedDownloads,
    };

    if (editingMovieId) {
      updateMovie(editingMovieId, movieToSave);
    } else {
      addMovie(movieToSave as any);
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

  // Security Authentication Check (Require Email & Password)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-rose-600 to-amber-500 p-0.5 mx-auto shadow-lg shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#121620] rounded-2xl flex items-center justify-center text-cyan-400">
              <Lock className="w-8 h-8 text-rose-500" />
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 font-extrabold text-[10px] uppercase tracking-wider border border-rose-500/30">
              Restricted Portal
            </span>
            <h2 className="text-2xl font-black text-white mt-2">CINEXUS Admin Access</h2>
            <p className="text-xs text-gray-400 mt-1">Please enter administrator credentials to gain access.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@cinexus.site"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password (cinexus2025)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#08090c] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> Authenticate Administrator
            </button>
          </form>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-400 text-left space-y-1">
            <p className="font-bold text-gray-300">Default Access Credentials:</p>
            <p>Email: <code className="text-cyan-300">admin@cinexus.site</code></p>
            <p>Password: <code className="text-amber-300">cinexus2025</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* Top Control Panel Header */}
      <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-extrabold text-xs uppercase tracking-wider border border-rose-500/30">
              Admin Portal
            </span>
            <span className="text-xs text-purple-300 font-bold">CINEXUS System Control v3.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Site Control Panel (පාලන පුවරුව)
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
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Movie / Series
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Lock & Exit Admin"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'movies'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-4 h-4" /> Movie CRUD ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" /> General Content Customizer
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Media Links Controller
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" /> Analytics & Traffic
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" /> Genre Manager
        </button>
      </div>

      {/* TAB 1: MOVIE MANAGEMENT (CRUD) */}
      {activeTab === 'movies' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Search Table Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#121620] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by title..."
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                className="w-full bg-[#0a0b0e] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-rose-500"
              />
            </div>
            <span className="text-xs text-gray-400">Showing {filteredAdminMovies.length} of {movies.length} entries</span>
          </div>

          {/* Movies List Table */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0c0e15] text-gray-400 font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Movie / Series</th>
                    <th className="p-4">IMDb Score</th>
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

      {/* TAB 2: GENERAL SITE CONTENT CUSTOMIZER */}
      {activeTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" /> General Site Content Customizer
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Change site notices, dynamic announcements, home section titles, and footer copyright text.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <Save className="w-4 h-4" /> Save Content Changes
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> General site content and dynamic section titles saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (English)</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (Sinhala - සිනෙක්ස්)</label>
                <input
                  type="text"
                  value={settingsForm.sinhalaTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sinhalaTitle: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Home Movies Section Title (Sinhala / English)</label>
                <input
                  type="text"
                  value={settingsForm.latestMoviesTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, latestMoviesTitle: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Home Series Section Title</label>
                <input
                  type="text"
                  value={settingsForm.trendingSeriesTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, trendingSeriesTitle: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-300 flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" /> Dynamic Top Notice / Announcement
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-400">
                    <input
                      type="checkbox"
                      checked={settingsForm.showAnnouncement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                      className="accent-rose-500 w-4 h-4"
                    />
                    Enable Notice Banner
                  </label>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  placeholder="Enter notice text shown at the top of every page..."
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Main Headline</label>
                <input
                  type="text"
                  value={settingsForm.heroHeading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Subtitle Copy</label>
                <input
                  type="text"
                  value={settingsForm.heroSubheading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-300 block mb-1.5">Footer Copyright & Description Text</label>
                <input
                  type="text"
                  value={settingsForm.footerText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA LINKS CONTROLLER */}
      {activeTab === 'social' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-rose-500" /> Social Media Links Controller
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Manage Facebook, Telegram, and WhatsApp community links. Changes dynamically update the footer social buttons.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <Save className="w-4 h-4" /> Save Social Links
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Social media community links saved successfully!
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Telegram Channel URL</label>
                <input
                  type="url"
                  value={settingsForm.telegramChannelUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, telegramChannelUrl: e.target.value })}
                  placeholder="https://t.me/cinexus_official"
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Facebook Page URL</label>
                <input
                  type="url"
                  value={settingsForm.facebookUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/cinexus.official"
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">WhatsApp Group URL</label>
                <input
                  type="url"
                  value={settingsForm.whatsappGroupUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappGroupUrl: e.target.value })}
                  placeholder="https://chat.whatsapp.com/cinexus_official"
                  className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Total Catalog Movies</p>
                <h3 className="text-2xl font-black text-white mt-1">{analytics.totalMovies}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400">
                <Film className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Active Live Streams</p>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">{analytics.activeStreams.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Total Downloads</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{analytics.totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Download className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">User Traffic Today</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{analytics.userTrafficToday.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Recent Search Queries Log
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {analytics.recentSearches?.map((query, index) => (
                <span key={index} className="px-3 py-1.5 rounded-xl bg-[#121620] border border-white/10 text-cyan-300 font-bold">
                  🔍 {query}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORY & TAG MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">

          {/* Add Category Form */}
          <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-500" /> Add New Genre Category
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Category Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Thriller"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
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
                  className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold text-xs"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Active Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-xl bg-[#121620] border border-white/5 flex items-center justify-between">
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

      {/* ADD / EDIT MOVIE MODAL FORM (5 STREAMING SERVERS & DOWNLOADS) */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#121620] border border-white/10 rounded-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0e15]">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white">
                  {editingMovieId ? 'Edit Movie Details & Embed Links' : 'Add New Movie / Series'}
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

              {/* OMDb Auto Fetch Assistant (API Key: 87cd62a9) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-rose-900/30 to-indigo-900/40 border border-purple-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white">OMDb API Auto-Fetcher (Key: 87cd62a9)</p>
                    <p className="text-[11px] text-gray-400">Enter title or IMDb ID (e.g., Avatar or tt1630029) and click Fetch.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOMDbFetch}
                  disabled={isOmdbLoading}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs whitespace-nowrap shadow-md flex items-center gap-1.5"
                >
                  {isOmdbLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  OMDb Auto-Fetch
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
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Title (සිංහල නම)</label>
                  <input
                    type="text"
                    value={formData.sinhalaTitle}
                    onChange={(e) => setFormData({ ...formData, sinhalaTitle: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">IMDb Rating Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.imdbRating}
                    onChange={(e) => setFormData({ ...formData, imdbRating: parseFloat(e.target.value) || 7.0 })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Poster Image URL*</label>
                  <input
                    type="text"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Backdrop Image URL</label>
                  <input
                    type="text"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Trailer Embed URL</label>
                  <input
                    type="text"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Quality Badge Text</label>
                  <input
                    type="text"
                    value={formData.qualityBadge}
                    onChange={(e) => setFormData({ ...formData, qualityBadge: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* 5-Server Embedded Player URLs Manager */}
                <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-white/10">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-rose-500" /> Multi-Server Embedded Player URLs (Servers 1 - 5)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Server 1 (StreamHG Embed Link)</label>
                      <input
                        type="text"
                        value={server1Url}
                        onChange={(e) => setServer1Url(e.target.value)}
                        placeholder="https://streamhg.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Server 2 (Doodstream Embed Link)</label>
                      <input
                        type="text"
                        value={server2Url}
                        onChange={(e) => setServer2Url(e.target.value)}
                        placeholder="https://doodstream.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Server 3 (Streamtape Embed Link)</label>
                      <input
                        type="text"
                        value={server3Url}
                        onChange={(e) => setServer3Url(e.target.value)}
                        placeholder="https://streamtape.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Server 4 (Facebook Embed Link - Free Data)</label>
                      <input
                        type="text"
                        value={server4Url}
                        onChange={(e) => setServer4Url(e.target.value)}
                        placeholder="https://www.facebook.com/plugins/video.php?href=..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-gray-400 block mb-1">Server 5 (Official YouTube Trailer Embed Link)</label>
                      <input
                        type="text"
                        value={server5Url}
                        onChange={(e) => setServer5Url(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Multi-Quality Download Links */}
                <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-[#0a0b0e] border border-white/10">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Multi-Quality Download & Telegram Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">480p Download Link</label>
                      <input
                        type="text"
                        value={dl480Url}
                        onChange={(e) => setDl480Url(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">720p Download Link</label>
                      <input
                        type="text"
                        value={dl720Url}
                        onChange={(e) => setDl720Url(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">1080p Download Link</label>
                      <input
                        type="text"
                        value={dl1080Url}
                        onChange={(e) => setDl1080Url(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Telegram Direct Link</label>
                      <input
                        type="text"
                        value={dlTelegramUrl}
                        onChange={(e) => setDlTelegramUrl(e.target.value)}
                        placeholder="https://t.me/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Plot Summary (සිංහල කතා සාරාංශය)</label>
                  <textarea
                    rows={3}
                    value={formData.sinhalaPlot}
                    onChange={(e) => setFormData({ ...formData, sinhalaPlot: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">English Plot Summary</label>
                  <textarea
                    rows={2}
                    value={formData.englishPlot}
                    onChange={(e) => setFormData({ ...formData, englishPlot: e.target.value })}
                    className="w-full bg-[#0a0b0e] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Toggles and Badges */}
              <div className="p-4 rounded-2xl bg-[#0a0b0e] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.hasSinhalaSub}
                    onChange={(e) => setFormData({ ...formData, hasSinhalaSub: e.target.checked })}
                    className="accent-rose-500 w-4 h-4"
                  />
                  Sinhala Subtitle
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isDualAudio}
                    onChange={(e) => setFormData({ ...formData, isDualAudio: e.target.checked })}
                    className="accent-rose-500 w-4 h-4"
                  />
                  Dual Audio
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-rose-500 w-4 h-4"
                  />
                  Trending
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTVSeries}
                    onChange={(e) => setFormData({ ...formData, isTVSeries: e.target.checked })}
                    className="accent-rose-500 w-4 h-4"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
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
