import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import type { Movie, SiteSettings, ServerPlayer, DownloadLink } from '../types';
import { fetchTMDBMetadata } from '../utils/tmdb';
import { uploadToCloudinary } from '../utils/cloudinary';
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
  Loader2,
  FileText,
  HelpCircle,
  Video,
  MessageSquare,
  Send,
  Layers,
  Upload,
  Link as LinkIcon
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
  } = useMovies();

  // Auth passcode / email state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'movies' | 'branding' | 'social' | 'legal' | 'analytics' | 'categories'>('movies');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // TMDB fetch loading state
  const [isTmdbLoading, setIsTmdbLoading] = useState(false);

  // Cloudinary Upload Loading state
  const [isPosterUploading, setIsPosterUploading] = useState(false);
  const [isBackdropUploading, setIsBackdropUploading] = useState(false);

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

  // Available option lists for tagging
  const availableLanguages = [
    'Sinhala', 'Tamil', 'Telugu', 'Hindi', 'Malayalam', 'Kannada', 'English', 'Japanese', 'Chinese', 'Korean'
  ];

  const availableGenres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  const availableContentTypes = [
    'Sinhala Sub', 'Without Sub / English', 'Sinhala Dubbed'
  ];

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
    language: 'English',
    languages: ['English'],
    contentType: 'Sinhala Sub',
    cast: ['Lead Actor 1', 'Lead Actor 2'],
    director: 'Director Name',
    audioLanguage: 'English (Sinhala Sub)',
    subtitleSourceUrl: 'https://cinesubz.co',
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

  // Download links list state
  const [downloadLinksList, setDownloadLinksList] = useState<DownloadLink[]>([]);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSinhala, setNewCatSinhala] = useState('');

  // TMDB API Auto-Fetch Helper
  const handleTMDBFetch = async () => {
    if (!formData.title) {
      alert('Please enter a movie title or TMDB/IMDb ID first.');
      return;
    }
    setIsTmdbLoading(true);
    try {
      const data = await fetchTMDBMetadata(formData.title);
      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          sinhalaTitle: prev.sinhalaTitle || `${data.title} (සිංහල උපසිරැසි)`,
          year: data.releaseYear || prev.year,
          imdbRating: data.imdbRating || prev.imdbRating,
          posterUrl: data.posterUrl || prev.posterUrl,
          backdropUrl: data.backdropUrl || prev.backdropUrl,
          englishPlot: data.englishPlot || prev.englishPlot,
          sinhalaPlot: data.sinhalaPlot || prev.sinhalaPlot,
          director: data.director || prev.director,
          cast: data.cast || prev.cast,
          genres: data.genres && data.genres.length > 0 ? data.genres : prev.genres,
          language: data.language || prev.language,
          languages: [data.language || 'English'],
          duration: data.duration || prev.duration,
        }));
      } else {
        alert('TMDB Fetch Notice: Movie details not found. Please verify title or ID.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch from TMDB API.');
    } finally {
      setIsTmdbLoading(false);
    }
  };

  // Cloudinary Poster File Upload Handler
  const handlePosterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsPosterUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, posterUrl: url }));
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message || 'Failed to upload image.'}`);
    } finally {
      setIsPosterUploading(false);
    }
  };

  // Cloudinary Backdrop File Upload Handler
  const handleBackdropFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsBackdropUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, backdropUrl: url }));
    } catch (err: any) {
      alert(`Cloudinary Upload Error: ${err.message || 'Failed to upload image.'}`);
    } finally {
      setIsBackdropUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMovieId(null);
    setServer1Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer2Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer3Url('https://www.youtube.com/embed/d9MyW72ELq0');
    setServer4Url('https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F');
    setServer5Url('https://www.youtube.com/embed/d9MyW72ELq0');

    setDownloadLinksList([
      { id: 'dl_4k', quality: '4K', resolution: '3840x2160', fileSize: '5.2 GB', url: '#download-4k', serverType: 'Direct High-Speed', format: 'MKV / x265', audioSubAttribute: 'English [Sinhala Sub]' },
      { id: 'dl_1080', quality: '1080p', resolution: '1920x1080', fileSize: '2.5 GB', url: '#download-1080p', serverType: 'Direct High-Speed', format: 'MKV / x264', audioSubAttribute: 'English [Sinhala Sub]' },
      { id: 'dl_720', quality: '720p', resolution: '1280x720', fileSize: '1.2 GB', url: '#download-720p', serverType: 'Direct High-Speed', format: 'MP4 / x264', audioSubAttribute: 'English [Sinhala Sub]' },
      { id: 'dl_480', quality: '480p', resolution: '854x480', fileSize: '600 MB', url: '#download-480p', serverType: 'Direct High-Speed', format: 'MP4', audioSubAttribute: 'English [Sinhala Sub]' },
      { id: 'dl_tg', quality: 'Telegram', resolution: 'Original HD', fileSize: 'Direct Telegram File', url: 'https://t.me/cinexus_official', serverType: 'Telegram Channel', format: 'Telegram', audioSubAttribute: 'English [Sinhala Sub]' }
    ]);

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
      language: 'English',
      languages: ['English'],
      contentType: 'Sinhala Sub',
      cast: ['Lead Actor 1', 'Lead Actor 2'],
      director: 'Director Name',
      audioLanguage: 'English (Sinhala Sub)',
      subtitleSourceUrl: 'https://cinesubz.co',
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

    setServer1Url(movie.servers?.[0]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer2Url(movie.servers?.[1]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer3Url(movie.servers?.[2]?.url || 'https://www.youtube.com/embed/d9MyW72ELq0');
    setServer4Url(movie.servers?.[3]?.url || '');
    setServer5Url(movie.servers?.[4]?.url || movie.trailerUrl || '');

    setDownloadLinksList(movie.downloadLinks && movie.downloadLinks.length > 0 ? movie.downloadLinks : [
      { id: 'dl_1080', quality: '1080p', resolution: '1920x1080', fileSize: '2.5 GB', url: '#download-1080p', serverType: 'Direct High-Speed', format: 'MKV / x264', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` },
      { id: 'dl_720', quality: '720p', resolution: '1280x720', fileSize: '1.2 GB', url: '#download-720p', serverType: 'Direct High-Speed', format: 'MP4', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` },
      { id: 'dl_tg', quality: 'Telegram', resolution: 'Original HD', fileSize: 'Direct Telegram File', url: 'https://t.me/cinexus_official', serverType: 'Telegram Channel', format: 'Telegram', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` }
    ]);

    setIsMovieModalOpen(true);
  };

  const handleAddDownloadLinkRow = () => {
    const newDl: DownloadLink = {
      id: `dl_${Date.now()}`,
      quality: '1080p',
      resolution: '1920x1080',
      fileSize: '2.0 GB',
      url: 'https://',
      serverType: 'Direct High-Speed',
      format: 'MKV',
      audioSubAttribute: `${formData.language || 'English'} [${formData.contentType || 'Sinhala Sub'}]`
    };
    setDownloadLinksList(prev => [...prev, newDl]);
  };

  const handleRemoveDownloadLinkRow = (id: string) => {
    setDownloadLinksList(prev => prev.filter(dl => dl.id !== id));
  };

  const handleUpdateDownloadLinkRow = (id: string, key: keyof DownloadLink, val: string) => {
    setDownloadLinksList(prev => prev.map(dl => dl.id === id ? { ...dl, [key]: val, ...(key === 'fileSize' ? { size: val } : {}) } : dl));
  };

  const handleToggleGenreTag = (genreName: string) => {
    const current = formData.genres || [];
    if (current.includes(genreName)) {
      setFormData({ ...formData, genres: current.filter(g => g !== genreName) });
    } else {
      setFormData({ ...formData, genres: [...current, genreName] });
    }
  };

  const handleToggleLanguageTag = (langName: string) => {
    const current = formData.languages || [];
    if (current.includes(langName)) {
      const updated = current.filter(l => l !== langName);
      setFormData({
        ...formData,
        languages: updated,
        language: updated[0] || 'English'
      });
    } else {
      const updated = [...current, langName];
      setFormData({
        ...formData,
        languages: updated,
        language: updated[0] || langName
      });
    }
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.posterUrl) {
      alert('Please fill in required fields (Title & Poster URL).');
      return;
    }

    const updatedServers: ServerPlayer[] = [
      { id: 's1', name: 'Server 1 (StreamHG)', url: server1Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p', serverType: 'streamhg' },
      { id: 's2', name: 'Server 2 (Doodstream)', url: server2Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p', serverType: 'doodstream' },
      { id: 's3', name: 'Server 3 (Streamtape)', url: server3Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p', serverType: 'streamtape' },
      { id: 's4', name: 'Server 4 (Facebook Free Data)', url: server4Url || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '480p', serverType: 'facebook' },
      { id: 's5', name: 'Server 5 (YouTube Official Trailer)', url: server5Url || formData.trailerUrl || 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p', serverType: 'youtube' }
    ];

    const movieToSave = {
      ...formData,
      hasSinhalaSub: formData.contentType === 'Sinhala Sub',
      language: formData.language || formData.languages?.[0] || 'English',
      languages: formData.languages && formData.languages.length > 0 ? formData.languages : [formData.language || 'English'],
      servers: updatedServers,
      downloadLinks: downloadLinksList,
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

  // Security Authentication Check
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF0E25] via-[#C80016] to-amber-500 p-0.5 mx-auto shadow-lg shadow-[#FF0E25]/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A0A0E] rounded-2xl flex items-center justify-center text-white">
              <Lock className="w-8 h-8 text-[#FF0E25]" />
            </div>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#FF0E25]/20 text-[#FF0E25] font-extrabold text-[10px] uppercase tracking-wider border border-[#FF0E25]/30">
              Restricted Portal
            </span>
            <h2 className="text-2xl font-black text-white mt-2">CINEXUS Admin Command</h2>
            <p className="text-xs text-[#9E9EA0] mt-1">Please enter administrator credentials to gain access.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF0E25]" /> Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@cinexus.site"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF0E25] transition-colors"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#FF0E25]" /> Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password (cinexus2025)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-[#0A0A0E] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF0E25] transition-colors"
                required
              />
            </div>

            {authError && (
              <p className="text-xs text-[#FF0E25] font-semibold bg-[#FF0E25]/10 p-2.5 rounded-xl border border-[#FF0E25]/20">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs shadow-lg shadow-[#FF0E25]/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> Authenticate Administrator
            </button>
          </form>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-[#9E9EA0] text-left space-y-1">
            <p className="font-bold text-gray-300">Default Access Credentials:</p>
            <p>Email: <code className="text-[#FF0E25]">admin@cinexus.site</code></p>
            <p>Password: <code className="text-amber-300">cinexus2025</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* Top Control Panel Header */}
      <div className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#FF0E25]/20 text-[#FF0E25] font-extrabold text-xs uppercase tracking-wider border border-[#FF0E25]/30">
              Admin Portal
            </span>
            <span className="text-xs text-rose-300 font-bold">CINEXUS Enterprise Command v4.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Enterprise Admin Control Panel (පාලන පුවරුව)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaultData}
            className="px-3.5 py-2 rounded-xl bg-[#FF0E25]/10 border border-[#FF0E25]/30 text-rose-300 hover:bg-[#FF0E25]/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Reset dataset to default"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default Data
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-95 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Movie / Series
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
            title="Lock & Exit Admin"
          >
            <LogOut className="w-4 h-4 text-[#FF0E25]" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'movies'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-4 h-4" /> Movie Catalog ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" /> General Content & Notice Banner
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Share2 className="w-4 h-4" /> Social Media & Contact CMS
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'legal'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" /> Dynamic Pages & Legal Editor
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" /> Realtime Metrics
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" /> Genres & Categories
        </button>
      </div>

      {/* TAB 1: MOVIE MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="space-y-6 animate-in fade-in duration-300">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#121620] p-4 rounded-2xl border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#9E9EA0] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog by title..."
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                className="w-full bg-[#0A0A0E] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#FF0E25]"
              />
            </div>
            <span className="text-xs text-[#9E9EA0]">Showing {filteredAdminMovies.length} of {movies.length} titles</span>
          </div>

          <div className="bg-[#121620]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#0A0A0E] text-[#9E9EA0] font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Movie / Series</th>
                    <th className="p-4">Language & Type</th>
                    <th className="p-4">IMDb Score</th>
                    <th className="p-4">Quality</th>
                    <th className="p-4">Download Links</th>
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
                            <p className="text-rose-300 text-xs">{movie.sinhalaTitle}</p>
                            <span className="text-[10px] text-[#9E9EA0]">{movie.year} • {movie.genres.join(', ')}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-sky-300">
                        <p>{movie.language || 'English'}</p>
                        <span className="text-[10px] text-[#9E9EA0]">{movie.contentType || 'Sinhala Sub'}</span>
                      </td>

                      <td className="p-4 font-bold text-amber-400">
                        ★ {movie.imdbRating}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-[#FF0E25]/20 text-[#FF0E25] border border-[#FF0E25]/30 font-bold">
                          {movie.qualityBadge}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30">
                          {movie.downloadLinks?.length || 0} Tagged Links
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(movie)}
                            className="p-2 rounded-lg bg-[#FF0E25]/20 text-rose-300 hover:bg-[#FF0E25] hover:text-white transition-colors"
                            title="Edit Movie & Tagging Options"
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

      {/* TAB 2: GENERAL SITE CONTENT & NOTICE BANNER */}
      {activeTab === 'branding' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#FF0E25]" /> General Site Content Customizer
                </h3>
                <p className="text-xs text-[#9E9EA0] mt-1">
                  Change site notices, dynamic announcements, home section titles, and footer copyright text.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30"
              >
                <Save className="w-4 h-4" /> Save Content Changes
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> General site content saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (English)</label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Brand Title (Sinhala - සිනෙක්ස්)</label>
                <input
                  type="text"
                  value={settingsForm.sinhalaTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sinhalaTitle: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Home Movies Section Title (Sinhala / English)</label>
                <input
                  type="text"
                  value={settingsForm.latestMoviesTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, latestMoviesTitle: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Home Series Section Title</label>
                <input
                  type="text"
                  value={settingsForm.trendingSeriesTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, trendingSeriesTitle: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2 p-4 rounded-2xl bg-[#0A0A0E] border border-[#FF0E25]/30">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white flex items-center gap-2 text-sm">
                    <Megaphone className="w-4 h-4 text-[#FF0E25] animate-pulse" /> Header Banner & Announcement Control
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400">
                    <input
                      type="checkbox"
                      checked={settingsForm.showAnnouncement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                      className="accent-[#FF0E25] w-4 h-4"
                    />
                    Live Enable Banner
                  </label>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  placeholder="Enter notice text shown at the top of every page..."
                  className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Main Headline</label>
                <input
                  type="text"
                  value={settingsForm.heroHeading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5">Hero Slider Subtitle Copy</label>
                <input
                  type="text"
                  value={settingsForm.heroSubheading}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubheading: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-300 block mb-1.5">Footer Copyright & Description Text</label>
                <input
                  type="text"
                  value={settingsForm.footerText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerText: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SOCIAL MEDIA & CONTACT CMS */}
      {activeTab === 'social' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#FF0E25]" /> Social Media & Contact CMS
                </h3>
                <p className="text-xs text-[#9E9EA0] mt-1">
                  Manage Telegram, Facebook, Instagram, X/Twitter, YouTube channels, and support email.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30"
              >
                <Save className="w-4 h-4" /> Save Social & Contact Links
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Social media links saved successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-sky-400" /> Telegram Channel / Group URL
                </label>
                <input
                  type="url"
                  value={settingsForm.telegramChannelUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, telegramChannelUrl: e.target.value })}
                  placeholder="https://t.me/cinexus_official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-blue-500" /> Facebook Page URL
                </label>
                <input
                  type="url"
                  value={settingsForm.facebookUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/cinexus.official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-pink-500" /> Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settingsForm.instagramUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/cinexus.official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-300" /> X / Twitter URL
                </label>
                <input
                  type="url"
                  value={settingsForm.twitterUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                  placeholder="https://x.com/cinexus_official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-500" /> YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={settingsForm.youtubeUrl || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@cinexus_official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" /> Official Support Contact Email
                </label>
                <input
                  type="email"
                  value={settingsForm.contactEmail || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  placeholder="contact@cinexus.site"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Group Link
                </label>
                <input
                  type="url"
                  value={settingsForm.whatsappGroupUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappGroupUrl: e.target.value })}
                  placeholder="https://chat.whatsapp.com/cinexus_official"
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: DYNAMIC CONTENT & LEGAL PAGES EDITOR */}
      {activeTab === 'legal' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={handleSaveSettings} className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#FF0E25]" /> Dynamic Content & Legal Pages Editor
                </h3>
                <p className="text-xs text-[#9E9EA0] mt-1">
                  Full control over site legal content: About Us, Terms of Service, Privacy Policy, Contact Us, FAQ, and Request Movie rules.
                </p>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30"
              >
                <Save className="w-4 h-4" /> Save Legal & Info Pages
              </button>
            </div>

            {settingsSavedMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Dynamic legal pages content updated and live across footer links!
              </div>
            )}

            <div className="space-y-6 text-xs">
              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FF0E25]" /> About Us Page Content
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.aboutUsContent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutUsContent: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FF0E25]" /> Terms of Service Page Content
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.termsContent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, termsContent: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#FF0E25]" /> Privacy Policy Page Content
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.privacyContent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, privacyContent: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#FF0E25]" /> Contact Us Details & Rules
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.contactUsContent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactUsContent: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" /> FAQ Content
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.faqContent}
                  onChange={(e) => setSettingsForm({ ...settingsForm, faqContent: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1.5 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-rose-400" /> Request Movie Rules & Instructions
                </label>
                <textarea
                  rows={4}
                  value={settingsForm.requestMovieRules}
                  onChange={(e) => setSettingsForm({ ...settingsForm, requestMovieRules: e.target.value })}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Total Catalog Movies</p>
                <h3 className="text-2xl font-black text-white mt-1">{analytics.totalMovies}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-[#FF0E25]/20 text-[#FF0E25]">
                <Film className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Active Live Streams</p>
                <h3 className="text-2xl font-black text-rose-400 mt-1">{analytics.activeStreams.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Total Downloads</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{analytics.totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Download className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">User Traffic Today</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{analytics.userTrafficToday.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF0E25]" /> Recent Search Queries Log
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {analytics.recentSearches?.map((query, index) => (
                <span key={index} className="px-3 py-1.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-rose-300 font-bold">
                  🔍 {query}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CATEGORY & TAG MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-300">

          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF0E25]" /> Add New Genre Category
            </h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Category Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Thriller"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF0E25]"
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
                  className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF0E25]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-bold text-xs"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="md:col-span-2 bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Active Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-3.5 rounded-xl bg-[#0A0A0E] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{cat.name}</span>
                    <span className="text-xs text-rose-300">{cat.sinhalaName}</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#FF0E25] hover:bg-[#FF0E25]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ADD / EDIT MOVIE MODAL FORM WITH TMDB AUTO-FETCH & CLOUDINARY UPLOADS */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#121620] border border-white/10 rounded-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0E]">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF0E25]" />
                <h3 className="text-base font-bold text-white">
                  {editingMovieId ? 'Edit Movie Details & Tagging Options' : 'Add New Movie / TV Series'}
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
            <form onSubmit={handleSaveMovie} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">

              {/* TMDB API Auto Fetch Assistant */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF0E25]/20 via-[#C80016]/20 to-rose-950/40 border border-[#FF0E25]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#FF0E25] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Fetch Details by Movie Name / TMDB ID</p>
                    <p className="text-[11px] text-[#9E9EA0]">Enter title or TMDB/IMDb ID (e.g., Leo or 1011985 or tt1565432) and click Fetch.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTMDBFetch}
                  disabled={isTmdbLoading}
                  className="px-4 py-2 rounded-xl bg-[#FF0E25] hover:bg-[#C80016] text-white font-extrabold text-xs whitespace-nowrap shadow-md flex items-center gap-1.5 shrink-0"
                >
                  {isTmdbLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Fetch Details by Movie Name / TMDB ID
                </button>
              </div>

              {/* Basic Movie Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Movie Title (English)*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Title (සිංහල නම)</label>
                  <input
                    type="text"
                    value={formData.sinhalaTitle}
                    onChange={(e) => setFormData({ ...formData, sinhalaTitle: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Release Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">IMDb Rating Score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.imdbRating}
                    onChange={(e) => setFormData({ ...formData, imdbRating: parseFloat(e.target.value) || 7.5 })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                {/* Subtitle Source URL Input */}
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#FF0E25]" /> Subtitle Source URL (Download Subtitle File Link)
                  </label>
                  <input
                    type="url"
                    value={formData.subtitleSourceUrl || ''}
                    onChange={(e) => setFormData({ ...formData, subtitleSourceUrl: e.target.value })}
                    placeholder="https://cinesubz.co or https://subscene.best/subtitles/..."
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                {/* CONTENT TYPE SELECTOR */}
                <div className="md:col-span-2 p-3.5 rounded-2xl bg-[#0A0A0E] border border-white/10 space-y-2">
                  <label className="font-extrabold text-white block flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#FF0E25]" /> Content Type Selector*
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableContentTypes.map((typeVal) => (
                      <button
                        key={typeVal}
                        type="button"
                        onClick={() => setFormData({ ...formData, contentType: typeVal, hasSinhalaSub: typeVal === 'Sinhala Sub' })}
                        className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                          formData.contentType === typeVal
                            ? 'bg-[#FF0E25] text-white shadow-md'
                            : 'bg-[#121620] text-gray-300 border border-white/10 hover:text-white'
                        }`}
                      >
                        {typeVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LANGUAGES MULTI-TAG SELECTOR */}
                <div className="md:col-span-2 p-3.5 rounded-2xl bg-[#0A0A0E] border border-white/10 space-y-2">
                  <label className="font-extrabold text-white block flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-sky-400" /> Language / Industry Tagging Options*
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableLanguages.map((langVal) => {
                      const isSelected = formData.languages?.includes(langVal) || formData.language === langVal;
                      return (
                        <button
                          key={langVal}
                          type="button"
                          onClick={() => handleToggleLanguageTag(langVal)}
                          className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-sm'
                              : 'bg-[#121620] text-gray-400 border border-white/10 hover:text-white'
                          }`}
                        >
                          {isSelected ? `✓ ${langVal}` : `+ ${langVal}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GENRES MULTI-TAG SELECTOR */}
                <div className="md:col-span-2 p-3.5 rounded-2xl bg-[#0A0A0E] border border-white/10 space-y-2">
                  <label className="font-extrabold text-white block flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-400" /> Genre Tagging Options*
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableGenres.map((genreVal) => {
                      const isSelected = formData.genres?.includes(genreVal);
                      return (
                        <button
                          key={genreVal}
                          type="button"
                          onClick={() => handleToggleGenreTag(genreVal)}
                          className={`px-2.5 py-1 rounded-xl font-bold text-[11px] transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-[#121620] text-gray-400 border border-white/10 hover:text-white'
                          }`}
                        >
                          {isSelected ? `✓ ${genreVal}` : `+ ${genreVal}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* POSTER IMAGE URL WITH CLOUDINARY FILE UPLOAD */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#0A0A0E] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-white block">Poster Image URL*</label>
                    <label className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-all">
                      {isPosterUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Upload Image to Cloudinary
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePosterFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/t/p/... or Cloudinary URL"
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                    required
                  />
                  {formData.posterUrl && (
                    <img src={formData.posterUrl} alt="Poster Preview" className="h-16 w-auto object-cover rounded-lg border border-white/10" />
                  )}
                </div>

                {/* BACKDROP IMAGE URL WITH CLOUDINARY FILE UPLOAD */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#0A0A0E] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-white block">Backdrop Image URL</label>
                    <label className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer flex items-center gap-1 transition-all">
                      {isBackdropUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      Upload Image to Cloudinary
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackdropFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.backdropUrl}
                    onChange={(e) => setFormData({ ...formData, backdropUrl: e.target.value })}
                    placeholder="https://image.tmdb.org/t/p/... or Cloudinary URL"
                    className="w-full bg-[#121620] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                  {formData.backdropUrl && (
                    <img src={formData.backdropUrl} alt="Backdrop Preview" className="h-16 w-auto object-cover rounded-lg border border-white/10" />
                  )}
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Trailer Embed URL</label>
                  <input
                    type="text"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Quality Badge Text</label>
                  <input
                    type="text"
                    value={formData.qualityBadge}
                    onChange={(e) => setFormData({ ...formData, qualityBadge: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                {/* 5-Server Embedded Player URLs Manager */}
                <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-[#0A0A0E] border border-white/10">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#FF0E25]" /> Multi-Server Streaming Players (Servers 1 - 5)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 1 (StreamHG / HGCloud Embed Link)</label>
                      <input
                        type="text"
                        value={server1Url}
                        onChange={(e) => setServer1Url(e.target.value)}
                        placeholder="https://hgcloud.to/7uixqv4k0zat or https://audinifer.com/7uixqv4k0zat"
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 2 (Doodstream Embed Link)</label>
                      <input
                        type="text"
                        value={server2Url}
                        onChange={(e) => setServer2Url(e.target.value)}
                        placeholder="https://doodstream.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 3 (Streamtape Embed Link)</label>
                      <input
                        type="text"
                        value={server3Url}
                        onChange={(e) => setServer3Url(e.target.value)}
                        placeholder="https://streamtape.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 4 (Facebook Video Embed Link)</label>
                      <input
                        type="text"
                        value={server4Url}
                        onChange={(e) => setServer4Url(e.target.value)}
                        placeholder="https://www.facebook.com/plugins/video.php?href=..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 5 (Official YouTube Trailer Embed Link)</label>
                      <input
                        type="text"
                        value={server5Url}
                        onChange={(e) => setServer5Url(e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                  </div>
                </div>

                {/* CATEGORIZED DOWNLOAD LINKS & TAGS MANAGER */}
                <div className="md:col-span-2 space-y-4 p-5 rounded-2xl bg-[#0A0A0E] border border-[#FF0E25]/30">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <Download className="w-4 h-4 text-[#FF0E25]" /> Categorized Download Links Tagging Manager
                      </h4>
                      <p className="text-[11px] text-[#9E9EA0]">
                        Tag download buttons with audio/sub attributes (e.g. Tamil [Sinhala Sub], Hindi [Original Audio]).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddDownloadLinkRow}
                      className="px-3 py-1.5 rounded-xl bg-[#FF0E25] hover:bg-[#C80016] text-white font-extrabold text-xs flex items-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Tagged Download Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {downloadLinksList.map((dlRow, idx) => (
                      <div key={dlRow.id || idx} className="p-3.5 rounded-2xl bg-[#121620] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-rose-300">Option #{idx + 1} ({dlRow.quality})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDownloadLinkRow(dlRow.id)}
                            className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[10px]"
                            title="Remove row"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px]">
                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Quality Label</label>
                            <input
                              type="text"
                              value={dlRow.quality}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'quality', e.target.value)}
                              placeholder="4K / 1080p"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Audio/Sub Attribute</label>
                            <input
                              type="text"
                              value={dlRow.audioSubAttribute || ''}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'audioSubAttribute', e.target.value)}
                              placeholder="Tamil [Sinhala Sub]"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-amber-300 font-bold focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">File Size</label>
                            <input
                              type="text"
                              value={dlRow.fileSize || dlRow.size || ''}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'fileSize', e.target.value)}
                              placeholder="2.4 GB"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Server Type</label>
                            <input
                              type="text"
                              value={dlRow.serverType || ''}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'serverType', e.target.value)}
                              placeholder="Direct High-Speed"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Format</label>
                            <input
                              type="text"
                              value={dlRow.format || ''}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'format', e.target.value)}
                              placeholder="MKV / MP4"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Download URL</label>
                            <input
                              type="text"
                              value={dlRow.url}
                              onChange={(e) => handleUpdateDownloadLinkRow(dlRow.id, 'url', e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">Sinhala Plot Summary (සිංහල කතා සාරාංශය)</label>
                  <textarea
                    rows={3}
                    value={formData.sinhalaPlot}
                    onChange={(e) => setFormData({ ...formData, sinhalaPlot: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-300 block mb-1">English Plot Summary</label>
                  <textarea
                    rows={2}
                    value={formData.englishPlot}
                    onChange={(e) => setFormData({ ...formData, englishPlot: e.target.value })}
                    className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 font-semibold">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.hasSinhalaSub}
                    onChange={(e) => setFormData({ ...formData, hasSinhalaSub: e.target.checked })}
                    className="accent-[#FF0E25] w-4 h-4"
                  />
                  Sinhala Subtitle
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isDualAudio}
                    onChange={(e) => setFormData({ ...formData, isDualAudio: e.target.checked })}
                    className="accent-[#FF0E25] w-4 h-4"
                  />
                  Dual Audio
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#FF0E25] w-4 h-4"
                  />
                  Trending
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.isTVSeries}
                    onChange={(e) => setFormData({ ...formData, isTVSeries: e.target.checked })}
                    className="accent-[#FF0E25] w-4 h-4"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" /> {editingMovieId ? 'Update Movie & Tagging' : 'Save Movie'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
