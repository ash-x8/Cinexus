import React, { useState } from 'react';
import { useMovies } from '../context/MovieContext';
import type { Movie, SiteSettings, ServerPlayer, DownloadLink, CastMember, MovieRequest } from '../types';
import { fetchTMDBMetadata } from '../utils/tmdb';
import { uploadToCloudinary } from '../utils/cloudinary';
import { extractVideoUrl } from '../components/CustomPlayer';
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
  Link as LinkIcon,
  UserCheck,
  Wrench,
  AlertTriangle,
  PowerOff,
  Eye,
  Clock
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
    movieRequests,
    updateMovieRequestStatus,
    replyMovieRequest,
    deleteMovieRequest,
  } = useMovies();

  // Auth passcode / email state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Tab State
  const [activeTab, setActiveTab] = useState<'movies' | 'requests' | 'branding' | 'social' | 'legal' | 'analytics' | 'categories'>('movies');

  // Admin Request Reply State
  const [replyingRequest, setReplyingRequest] = useState<MovieRequest | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [replyStatusChoice, setReplyStatusChoice] = useState<'PENDING' | 'REVIEWING' | 'REPLIED' | 'COMPLETED' | 'REJECTED'>('REPLIED');
  const [isSavingReply, setIsSavingReply] = useState(false);
  const [replySuccessMsg, setReplySuccessMsg] = useState(false);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [toastStatus, setToastStatus] = useState<{ show: boolean; status: 'saving' | 'saved' | 'idle'; message: string }>({
    show: false,
    status: 'idle',
    message: '',
  });

  const showSaveToast = (message: string) => {
    setToastStatus({ show: true, status: 'saving', message: 'Saving changes...' });
    setTimeout(() => {
      setToastStatus({ show: true, status: 'saved', message });
      setTimeout(() => {
        setToastStatus(prev => ({ ...prev, show: false }));
      }, 3500);
    }, 400);
  };

  const [showMaintenancePreview, setShowMaintenancePreview] = useState(false);

  const handleToggleMaintenanceQuick = async () => {
    const nextVal = !siteSettings.maintenanceMode;
    setIsSavingSettings(true);
    setToastStatus({ show: true, status: 'saving', message: nextVal ? 'Activating Maintenance Mode...' : 'Deactivating Maintenance Mode...' });
    await updateSiteSettings({ maintenanceMode: nextVal });
    setSettingsForm(prev => ({ ...prev, maintenanceMode: nextVal }));
    setIsSavingSettings(false);
    setToastStatus({
      show: true,
      status: 'saved',
      message: nextVal ? '⚠️ Maintenance Mode is now ACTIVE for visitors!' : '✅ Site is LIVE for all visitors!'
    });
    setTimeout(() => {
      setToastStatus(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  React.useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // TMDB fetch loading state
  const [isTmdbLoading, setIsTmdbLoading] = useState(false);

  // Server Live Status Checker State
  const [serverHealthStatus, setServerHealthStatus] = useState<Record<string, 'online' | 'checking' | 'degraded'>>({
    'Server 1: StreamHG': 'online',
    'Server 2: EarnVids': 'online',
    'Server 3: FileMoon': 'online',
    'Server 4: Facebook CDN': 'online',
    'Server 5: YouTube Trailer': 'online',
  });

  // Test URL Simulator State
  const [testUrlInput, setTestUrlInput] = useState('');
  const [testUrlResult, setTestUrlResult] = useState<string | null>(null);

  const handleRunServerHealthCheck = () => {
    setServerHealthStatus({
      'Server 1: StreamHG': 'checking',
      'Server 2: EarnVids': 'checking',
      'Server 3: FileMoon': 'checking',
      'Server 4: Facebook CDN': 'checking',
      'Server 5: YouTube Trailer': 'checking',
    });

    setTimeout(() => {
      setServerHealthStatus({
        'Server 1: StreamHG': 'online',
        'Server 2: EarnVids': 'online',
        'Server 3: FileMoon': 'online',
        'Server 4: Facebook CDN': 'online',
        'Server 5: YouTube Trailer': 'online',
      });
    }, 800);
  };

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
      setAuthError('Invalid Admin Email or Password!');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setToastStatus({ show: true, status: 'saving', message: 'Persisting settings to database & storage...' });
    await updateSiteSettings(settingsForm);
    setIsSavingSettings(false);
    setSettingsSavedMsg(true);
    setToastStatus({ show: true, status: 'saved', message: 'Settings saved & persisted successfully!' });
    setTimeout(() => {
      setSettingsSavedMsg(false);
    }, 3000);
    setTimeout(() => {
      setToastStatus(prev => ({ ...prev, show: false }));
    }, 3500);
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
    cast: [
      { name: 'Lead Actor 1', character: 'Main Role', profileUrl: '', image: '' },
      { name: 'Lead Actor 2', character: 'Supporting Role', profileUrl: '', image: '' }
    ],
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

  // TV Series Episodes list state
  const [episodesList, setEpisodesList] = useState<any[]>([]);

  const handleAddEpisodeRow = () => {
    const nextEpNum = episodesList.length + 1;
    setEpisodesList(prev => [
      ...prev,
      {
        id: `ep_${Date.now()}_${nextEpNum}`,
        episodeNumber: nextEpNum,
        seasonNumber: 1,
        title: `Episode ${nextEpNum}`,
        streamServer1Url: 'https://streamhg.com/e/yQEondeGvKo',
        streamServer2Url: 'https://earnvids.com/e/yQEondeGvKo',
        streamServer3Url: 'https://filemoon.sx/e/yQEondeGvKo',
        downloadUrl: '#download-ep'
      }
    ]);
  };

  const handleRemoveEpisodeRow = (index: number) => {
    setEpisodesList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateEpisodeRow = (index: number, key: string, value: any) => {
    const finalVal = typeof value === 'string' && key.startsWith('streamServer')
      ? extractVideoUrl(value)
      : value;
    setEpisodesList(prev => prev.map((ep, idx) => idx === index ? { ...ep, [key]: finalVal } : ep));
  };

  // Editable Cast Members State
  const [castList, setCastList] = useState<CastMember[]>([]);

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSinhala, setNewCatSinhala] = useState('');

  // TMDB API Auto-Fetch Helper for Cast, Crew, Movie & TV Metadata
  const fetchMovieDetails = async () => {
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
          sinhalaPlot: prev.sinhalaPlot || data.sinhalaPlot,
          director: data.director || prev.director,
          genres: data.genres && data.genres.length > 0 ? data.genres : prev.genres,
          language: data.language || prev.language,
          languages: [data.language || 'English'],
          duration: data.duration || prev.duration,
          isTVSeries: data.isTVSeries ?? prev.isTVSeries,
        }));

        if (data.cast && data.cast.length > 0) {
          const mappedCastList: CastMember[] = data.cast.map(c => ({
            tmdb_id: c.tmdb_id,
            name: c.name,
            character: c.character || 'Cast Role',
            image: c.image || c.profileUrl || '',
            profileUrl: c.profileUrl || c.image || ''
          }));
          setCastList(mappedCastList);
        }

        if (data.isTVSeries && data.episodes && data.episodes.length > 0) {
          setEpisodesList(data.episodes);
        }
      } else {
        alert('TMDB Fetch Notice: Movie/TV details not found. Please verify title or ID.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch from TMDB API.');
    } finally {
      setIsTmdbLoading(false);
    }
  };

  const handleTMDBFetch = fetchMovieDetails;

  // Cloudinary Poster File Upload Handler (using cinexus_preset)
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

  // Cloudinary Backdrop File Upload Handler (using cinexus_preset)
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
    setServer1Url('');
    setServer2Url('');
    setServer3Url('');
    setServer4Url('');
    setServer5Url('');

    setDownloadLinksList([]);
    setCastList([]);
    setEpisodesList([]);

    setFormData({
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
      genres: ['Action'],
      language: 'English',
      languages: ['English'],
      contentType: 'Sinhala Sub',
      director: '',
      audioLanguage: 'English',
      subtitleSourceUrl: '',
      hasSinhalaSub: true,
      isDualAudio: false,
      isTrending: false,
      isFeatured: false,
      isTVSeries: false,
    });
    setIsMovieModalOpen(true);
  };

  const handleOpenEditModal = (movie: Movie) => {
    setEditingMovieId(movie.id);
    setFormData(movie);

    setServer1Url(movie.streamServer1Url || movie.servers?.[0]?.url || '');
    setServer2Url(movie.streamServer2Url || movie.servers?.[1]?.url || '');
    setServer3Url(movie.streamServer3Url || movie.servers?.[2]?.url || '');
    setServer4Url(movie.servers?.[3]?.url || '');
    setServer5Url(movie.trailerEmbedUrl || movie.servers?.[4]?.url || movie.trailerUrl || '');

    setDownloadLinksList(movie.downloadLinks && movie.downloadLinks.length > 0 ? movie.downloadLinks : [
      { id: 'dl_1080', quality: '1080p', resolution: '1920x1080', fileSize: '2.5 GB', url: '#download-1080p', serverType: 'Direct High-Speed', format: 'MKV / x264', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` },
      { id: 'dl_720', quality: '720p', resolution: '1280x720', fileSize: '1.2 GB', url: '#download-720p', serverType: 'Direct High-Speed', format: 'MP4', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` },
      { id: 'dl_tg', quality: 'Telegram', resolution: 'Original HD', fileSize: 'Direct Telegram File', url: 'https://t.me/cinexus_official', serverType: 'Telegram Channel', format: 'Telegram', audioSubAttribute: `${movie.language || 'English'} [${movie.contentType || 'Sinhala Sub'}]` }
    ]);

    const formattedCast: CastMember[] = (movie.cast || []).map(item => {
      if (typeof item === 'string') {
        return { name: item, character: 'Lead Role', profileUrl: '', image: '' };
      }
      return {
        name: item.name,
        character: item.character || 'Lead Role',
        profileUrl: item.profileUrl || item.image || '',
        image: item.image || item.profileUrl || ''
      };
    });
    setCastList(formattedCast);
    setEpisodesList(movie.episodes || []);

    setIsMovieModalOpen(true);
  };

  const handleAddCastRow = () => {
    setCastList(prev => [...prev, { name: '', character: 'Role Name', profileUrl: '', image: '' }]);
  };

  const handleRemoveCastRow = (index: number) => {
    setCastList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCastRow = (index: number, key: keyof CastMember, value: string) => {
    setCastList(prev => prev.map((item, idx) => {
      if (idx !== index) return item;
      const updated = { ...item, [key]: value };
      if (key === 'image') updated.profileUrl = value;
      if (key === 'profileUrl') updated.image = value;
      return updated;
    }));
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.posterUrl) {
      alert('Please fill in required fields (Title & Poster URL).');
      return;
    }

    const cleanS1 = extractVideoUrl(server1Url);
    const cleanS2 = extractVideoUrl(server2Url);
    const cleanS3 = extractVideoUrl(server3Url);
    const cleanS4 = extractVideoUrl(server4Url);
    const cleanS5 = extractVideoUrl(server5Url || formData.trailerUrl || '');

    const updatedServers: ServerPlayer[] = [
      { id: 's1', name: 'Server 1: StreamHG', url: cleanS1, quality: '1080p', serverType: 'streamhg' },
      { id: 's2', name: 'Server 2: EarnVids', url: cleanS2, quality: '720p', serverType: 'earnvids' },
      { id: 's3', name: 'Server 3: FileMoon', url: cleanS3, quality: '720p', serverType: 'filemoon' },
      { id: 's4', name: 'Server 4: Facebook', url: cleanS4, quality: '480p', serverType: 'facebook' },
      { id: 's5', name: 'Server 5: YouTube Trailer', url: cleanS5, quality: '1080p', serverType: 'youtube' }
    ].filter(s => s.url && s.url.trim() !== '');

    // Ensure database schema stores cast as [{ tmdb_id, name: string, character: string, image: string }]
    const formattedCastArray = castList
      .filter(c => c.name.trim() !== '')
      .map(c => ({
        tmdb_id: c.tmdb_id,
        name: c.name,
        character: c.character || 'Role Name',
        image: c.image || c.profileUrl || '',
        profileUrl: c.profileUrl || c.image || ''
      }));

    const cleanedEpisodes = episodesList.map(ep => ({
      ...ep,
      streamServer1Url: extractVideoUrl(ep.streamServer1Url || ''),
      streamServer2Url: extractVideoUrl(ep.streamServer2Url || ''),
      streamServer3Url: extractVideoUrl(ep.streamServer3Url || ''),
    }));

    const movieToSave = {
      ...formData,
      streamServer1Url: cleanS1,
      streamServer2Url: cleanS2,
      streamServer3Url: cleanS3,
      trailerEmbedUrl: cleanS5,
      trailerUrl: cleanS5,
      cast: formattedCastArray,
      hasSinhalaSub: formData.contentType === 'Sinhala Sub',
      language: formData.language || formData.languages?.[0] || 'English',
      languages: formData.languages && formData.languages.length > 0 ? formData.languages : [formData.language || 'English'],
      servers: updatedServers,
      downloadLinks: downloadLinksList,
      episodes: cleanedEpisodes,
      episodesCount: cleanedEpisodes.length,
    };

    if (editingMovieId) {
      updateMovie(editingMovieId, movieToSave);
      showSaveToast(`Movie "${movieToSave.title || 'Entry'}" updated and persisted!`);
    } else {
      addMovie(movieToSave as any);
      showSaveToast(`New title "${movieToSave.title || 'Entry'}" added and saved!`);
    }
    setIsMovieModalOpen(false);
  };

  const handleSaveMovie = handleSave;

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSinhala) return;
    addCategory({
      name: newCatName,
      sinhalaName: newCatSinhala,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-')
    });
    showSaveToast(`Category "${newCatName}" saved successfully!`);
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
                placeholder="Enter admin email"
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
                placeholder="Enter admin password"
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">

      {/* Fixed Dynamic Toast Notification Feedback Indicator */}
      {toastStatus.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-xs font-bold ${
              toastStatus.status === 'saving'
                ? 'bg-[#121620]/95 border-amber-500/40 text-amber-300 shadow-amber-950/40'
                : 'bg-[#121620]/95 border-emerald-500/40 text-emerald-300 shadow-emerald-950/40'
            }`}
          >
            {toastStatus.status === 'saving' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-white text-[11px] font-black uppercase tracking-wider">Saving Settings...</span>
                  <span className="text-amber-300/90 text-[11px]">{toastStatus.message}</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-emerald-400 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                    ✓ Saved & Persisted
                  </span>
                  <span className="text-white text-[11px]">{toastStatus.message}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Top Control Panel Header */}
      <div className="bg-[#121620]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#FF0E25]/20 text-[#FF0E25] font-extrabold text-xs uppercase tracking-wider border border-[#FF0E25]/30">
              Admin Portal
            </span>
            <span className="text-xs text-rose-300 font-bold">CINEXUS Enterprise Command v4.0</span>

            {/* Real-time Persistence Status Indicator Icon */}
            <div
              className={`ml-2 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1.5 transition-all ${
                isSavingSettings || toastStatus.status === 'saving'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              }`}
              title={
                isSavingSettings || toastStatus.status === 'saving'
                  ? 'Saving changes to cloud & browser cache'
                  : 'All settings and catalog data are saved and persisted'
              }
            >
              {isSavingSettings || toastStatus.status === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Saved</span>
                </>
              )}
            </div>
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

      {/* Global Maintenance Mode Quick Control Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          siteSettings.maintenanceMode
            ? 'bg-gradient-to-r from-amber-950/80 via-[#1C1107] to-[#121620] border-amber-500/50 shadow-amber-950/30'
            : 'bg-[#121620]/80 border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              siteSettings.maintenanceMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {siteSettings.maintenanceMode ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  siteSettings.maintenanceMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {siteSettings.maintenanceMode ? '⚠️ MAINTENANCE MODE ACTIVE' : '● PRODUCTION LIVE'}
              </span>
              <span className="text-[11px] text-[#9E9EA0]">
                {siteSettings.maintenanceMode
                  ? 'Visitors are blocked by the maintenance notice overlay'
                  : 'Public access is fully open and streaming normally'}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-bold mt-1">
              {siteSettings.maintenanceMode
                ? `Notice: "${siteSettings.maintenanceTitle || 'Scheduled System Upgrade in Progress'}"`
                : 'Activate Maintenance Mode whenever updating catalog nodes, CDN servers, or performing backups.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setShowMaintenancePreview(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Preview Maintenance Screen as a visitor"
          >
            <Eye className="w-3.5 h-3.5 text-rose-300" /> Preview Overlay
          </button>

          <button
            type="button"
            onClick={handleToggleMaintenanceQuick}
            disabled={isSavingSettings}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all ${
              siteSettings.maintenanceMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                : 'bg-gradient-to-r from-amber-600 to-rose-700 hover:opacity-90 text-white shadow-amber-950/40'
            }`}
          >
            {isSavingSettings ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : siteSettings.maintenanceMode ? (
              <PowerOff className="w-3.5 h-3.5" />
            ) : (
              <Wrench className="w-3.5 h-3.5" />
            )}
            <span>
              {siteSettings.maintenanceMode
                ? 'Deactivate Maintenance (Go Live)'
                : 'Activate Maintenance Mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Streamlined Admin Navigation Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'movies'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-4 h-4" /> 1. Catalog Manager ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Send className="w-4 h-4 text-emerald-400" /> Movie Requests ({movieRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'branding'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" /> 2. Site Notices & Text
        </button>

        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Share2 className="w-4 h-4" /> 3. Social Media Links
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" /> 4. Categories & Genres
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white shadow-md shadow-[#FF0E25]/30'
              : 'text-[#9E9EA0] hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4" /> 5. Server Health Monitor
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
                                showSaveToast(`Movie "${movie.title}" removed.`);
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
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
              >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingSettings ? 'Saving...' : 'Save Content Changes'}</span>
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

              {/* MAINTENANCE MODE CONTROLS */}
              <div className={`md:col-span-2 space-y-4 p-5 rounded-2xl border transition-all ${
                settingsForm.maintenanceMode
                  ? 'bg-gradient-to-br from-amber-950/40 via-[#121620] to-[#121620] border-amber-500/50 shadow-lg shadow-amber-950/20'
                  : 'bg-[#0A0A0E] border-white/10'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wrench className={`w-4 h-4 ${settingsForm.maintenanceMode ? 'text-amber-400' : 'text-[#FF0E25]'}`} />
                      <label className="font-black text-white text-sm">
                        Maintenance Mode Engine (නඩත්තු ප්‍රකාරය)
                      </label>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        settingsForm.maintenanceMode
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {settingsForm.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9E9EA0] mt-0.5">
                      When enabled, visitors will see a full-page maintenance overlay with your custom message and update notices.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowMaintenancePreview(true)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-rose-300" /> Preview
                    </button>
                    <label className={`flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all ${
                      settingsForm.maintenanceMode
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                        : 'bg-white/5 text-gray-300 border-white/15 hover:border-white/30'
                    }`}>
                      <input
                        type="checkbox"
                        checked={settingsForm.maintenanceMode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                        className="accent-[#FF0E25] w-4 h-4"
                      />
                      <span>{settingsForm.maintenanceMode ? 'Maintenance ON' : 'Enable Maintenance'}</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="font-bold text-gray-300 block mb-1.5">Maintenance Headline (English)</label>
                    <input
                      type="text"
                      value={settingsForm.maintenanceTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceTitle: e.target.value })}
                      placeholder="e.g. Scheduled System Upgrade in Progress"
                      className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-300 block mb-1.5">Maintenance Headline (Sinhala - විකල්ප)</label>
                    <input
                      type="text"
                      value={settingsForm.maintenanceSinhalaTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceSinhalaTitle: e.target.value })}
                      placeholder="e.g. පද්ධති වැඩිදියුණු කිරීමේ කටයුත්තක් සිදුවෙමින් පවතී"
                      className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-bold text-gray-300 block mb-1.5">Detailed Visitor Message & Update Notice</label>
                    <textarea
                      rows={3}
                      value={settingsForm.maintenanceMessage || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMessage: e.target.value })}
                      placeholder="Explain the updates taking place (e.g., CDN node optimizations, new Sinhala subtitles sync, server maintenance)..."
                      className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-300 block mb-1.5">Estimated Online Time (Expected Return)</label>
                    <input
                      type="text"
                      value={settingsForm.maintenanceEstimatedTime || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceEstimatedTime: e.target.value })}
                      placeholder="e.g. Expected Online: Within 30–45 minutes"
                      className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300 hover:text-white p-3 rounded-xl bg-[#121620] border border-white/5 w-full">
                      <input
                        type="checkbox"
                        checked={settingsForm.maintenanceShowAdminBypass ?? true}
                        onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceShowAdminBypass: e.target.checked })}
                        className="accent-[#FF0E25] w-4 h-4"
                      />
                      <span>Show "Admin Portal Access" link on maintenance overlay</span>
                    </label>
                  </div>
                </div>
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
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
              >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingSettings ? 'Saving...' : 'Save Social & Contact Links'}</span>
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
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
              >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSavingSettings ? 'Saving...' : 'Save Legal & Info Pages'}</span>
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

              <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-emerald-500/30 space-y-2">
                <label className="font-bold text-white block flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" /> Movie Request Notification Destination Email
                </label>
                <p className="text-[11px] text-[#9E9EA0]">
                  This address receives notification alerts when visitors submit movie requests. It is kept private and never rendered on public web pages.
                </p>
                <input
                  type="email"
                  value={settingsForm.movieRequestAdminEmail || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, movieRequestAdminEmail: e.target.value })}
                  placeholder="admin@cinexus.site"
                  className="w-full bg-[#121620] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB: MOVIE REQUESTS INBOX */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" /> Submitted Movie Requests ({movieRequests.length})
                </h3>
                <p className="text-xs text-[#9E9EA0] mt-1">
                  Manage requests submitted by registered users. Review details, update status, or archive requests.
                </p>
              </div>
            </div>

            {movieRequests.length === 0 ? (
              <div className="text-center py-12 bg-[#0A0A0E] rounded-2xl border border-white/5 space-y-2">
                <Send className="w-8 h-8 text-[#9E9EA0] mx-auto opacity-40" />
                <p className="text-sm font-bold text-gray-300">No Movie Requests Found</p>
                <p className="text-xs text-[#9E9EA0]">New user requests will appear here in real time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-[#0A0A0E] text-[#9E9EA0] font-bold uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Requested Movie</th>
                      <th className="p-4">Requester Details</th>
                      <th className="p-4">Message / Notes</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movieRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{req.movieName}</p>
                          <p className="text-[#9E9EA0] text-[11px]">{req.year || 'N/A'} • {req.language || 'English'}</p>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-rose-300">{req.userName}</p>
                          <p className="text-[#9E9EA0] text-[11px]">@{req.userUsername} ({req.userEmail})</p>
                          <span className="text-[10px] text-gray-500">ID: {req.userId}</span>
                        </td>

                        <td className="p-4 max-w-xs space-y-1">
                          <p className="text-[#9E9EA0] text-xs" title={req.message}>
                            {req.message || 'No additional message.'}
                          </p>
                          {req.adminReply && (
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300">
                              <span className="font-bold text-white block">Admin Reply:</span>
                              "{req.adminReply}"
                            </div>
                          )}
                        </td>

                        <td className="p-4 text-[#9E9EA0]">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-4">
                          <select
                            value={req.status}
                            onChange={(e) => updateMovieRequestStatus(req.id, e.target.value as any)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border focus:outline-none bg-[#0A0A0E] ${
                              req.status === 'COMPLETED' ? 'text-emerald-400 border-emerald-500/30' :
                              req.status === 'REVIEWING' ? 'text-sky-400 border-sky-500/30' :
                              req.status === 'REPLIED' ? 'text-indigo-400 border-indigo-500/30' :
                              req.status === 'REJECTED' ? 'text-rose-400 border-rose-500/30' :
                              'text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="REVIEWING">REVIEWING</option>
                            <option value="REPLIED">REPLIED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setReplyingRequest(req);
                              setReplyMessageText(req.adminReply || '');
                              setReplyStatusChoice(req.status === 'PENDING' ? 'REPLIED' : req.status);
                              setReplySuccessMsg(false);
                            }}
                            className="p-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Reply to Request"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete request for "${req.movieName}"?`)) {
                                deleteMovieRequest(req.id);
                                showSaveToast(`Request for "${req.movieName}" deleted.`);
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Admin Reply Modal */}
          {replyingRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
              <div className="relative w-full max-w-lg bg-[#121620] border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-5 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-black text-base">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span>Admin Reply to Movie Request</span>
                  </div>
                  <button
                    onClick={() => setReplyingRequest(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Request Overview */}
                <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E9EA0]">Movie Requested:</span>
                    <span className="font-bold text-white">{replyingRequest.movieName} ({replyingRequest.year || 'N/A'})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E9EA0]">Requester:</span>
                    <span className="font-bold text-rose-300">{replyingRequest.userName} (@{replyingRequest.userUsername})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9E9EA0]">User Email:</span>
                    <span className="text-gray-300">{replyingRequest.userEmail}</span>
                  </div>
                  {replyingRequest.message && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[#9E9EA0] block mb-1">User Message:</span>
                      <p className="text-gray-300 italic bg-white/5 p-2 rounded-xl">"{replyingRequest.message}"</p>
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSavingReply(true);
                    await replyMovieRequest(replyingRequest.id, replyMessageText, replyStatusChoice);
                    setIsSavingReply(false);
                    setReplySuccessMsg(true);
                    showSaveToast(`Reply posted to ${replyingRequest.userName}'s request!`);
                    setTimeout(() => {
                      setReplyingRequest(null);
                      setReplySuccessMsg(false);
                    }, 1200);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Admin Reply Message*</label>
                    <textarea
                      rows={3}
                      required
                      value={replyMessageText}
                      onChange={(e) => setReplyMessageText(e.target.value)}
                      placeholder="e.g., We have added this movie to our translation queue! It will be uploaded this Friday with 1080p Sinhala subs."
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Update Request Status</label>
                    <select
                      value={replyStatusChoice}
                      onChange={(e) => setReplyStatusChoice(e.target.value as any)}
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 font-bold"
                    >
                      <option value="REPLIED">REPLIED (Reply Sent)</option>
                      <option value="REVIEWING">REVIEWING (In Translation Queue)</option>
                      <option value="COMPLETED">COMPLETED (Published on Site)</option>
                      <option value="REJECTED">REJECTED (Not Available)</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>

                  {replySuccessMsg && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold flex items-center gap-2">
                      <Check className="w-4 h-4" /> Reply saved and synced to database!
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setReplyingRequest(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingReply}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg hover:opacity-90 disabled:opacity-50"
                    >
                      {isSavingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Save & Post Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANALYTICS & SERVER HEALTH */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Total Catalog Movies</p>
                <h3 className="text-2xl font-black text-white mt-1">{analytics.totalMovies}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-[#FF0E25]/20 text-[#FF0E25]">
                <Film className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Active Live Streams</p>
                <h3 className="text-2xl font-black text-rose-400 mt-1">{analytics.activeStreams.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">Total Downloads</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{analytics.totalDownloads.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Download className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#121620]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
              <div>
                <p className="text-xs text-[#9E9EA0] font-semibold uppercase">User Traffic Today</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">{analytics.userTrafficToday.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Realtime Stream Server Health Monitor */}
          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#FF0E25]" /> Stream Server Cluster Health & Status Monitor
                </h3>
                <p className="text-xs text-[#9E9EA0] mt-0.5">Automated ping check for StreamHG, EarnVids, FileMoon, Facebook, and YouTube embed mirrors.</p>
              </div>

              <button
                onClick={handleRunServerHealthCheck}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Ping All Servers
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(serverHealthStatus).map(([serverName, status]) => (
                <div key={serverName} className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-white text-xs block">{serverName}</span>
                    <span className="text-[10px] text-[#9E9EA0]">HTTP/2 Status Response</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider ${
                    status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : status === 'checking'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stream Embed Link Converter Simulator */}
          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Instant Stream URL Embed Format Tester
            </h3>
            <p className="text-xs text-[#9E9EA0]">Paste any raw EarnVids, FileMoon, or StreamHG standard URL to simulate auto conversion to `/e/` embed format.</p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. https://earnvids.com/v/xyz123 or https://filemoon.sx/d/abc456"
                value={testUrlInput}
                onChange={(e) => setTestUrlInput(e.target.value)}
                className="flex-1 bg-[#0A0A0E] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF0E25]"
              />
              <button
                onClick={() => {
                  if (!testUrlInput) return;
                  const converted = testUrlInput.replace(/\/(v|d)\//i, '/e/');
                  setTestUrlResult(converted);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white text-xs font-extrabold rounded-xl hover:opacity-90 shadow-md"
              >
                Test Convert
              </button>
            </div>

            {testUrlResult && (
              <div className="p-3.5 bg-[#0A0A0E] border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-between">
                <span>Converted Embed Output: {testUrlResult}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">✓ Ready</span>
              </div>
            )}
          </div>

          <div className="bg-[#121620]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl">
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
                    onClick={() => {
                      deleteCategory(cat.id);
                      showSaveToast(`Category "${cat.name}" deleted.`);
                    }}
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

      {/* ADD / EDIT MOVIE MODAL FORM WITH TMDB AUTO-FETCH, MANUAL OVERRIDE, & CLOUDINARY UPLOADS */}
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
                      Upload to Cloudinary (cinexus_preset)
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
                      Upload to Cloudinary (cinexus_preset)
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

                {/* EDITABLE CAST & CREW WITH MANUAL OVERRIDE (CRITICAL REQUIREMENT) */}
                <div className="md:col-span-2 space-y-4 p-5 rounded-2xl bg-[#0A0A0E] border border-purple-500/30">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-400" /> Cast & Character Roles (Manual Override)
                      </h4>
                      <p className="text-[11px] text-[#9E9EA0]">
                        Auto-populated from TMDB with actor profile photos. Feel free to manually edit actor names, roles, or swap photo URLs.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCastRow}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-md transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Cast Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {castList.map((castItem, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#121620] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0A0A0E] shrink-0 border border-white/10 flex items-center justify-center font-bold text-white text-xs">
                          {(castItem.image || castItem.profileUrl) ? (
                            <img src={castItem.image || castItem.profileUrl || ''} alt={castItem.name} className="w-full h-full object-cover" />
                          ) : (
                            castItem.name?.[0] || '?'
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 w-full text-[11px]">
                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Actor Name</label>
                            <input
                              type="text"
                              value={castItem.name}
                              onChange={(e) => handleUpdateCastRow(idx, 'name', e.target.value)}
                              placeholder="e.g. Sam Worthington"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Character Role</label>
                            <input
                              type="text"
                              value={castItem.character || ''}
                              onChange={(e) => handleUpdateCastRow(idx, 'character', e.target.value)}
                              placeholder="e.g. Jake Sully"
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-rose-300 font-bold focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[#9E9EA0] block mb-0.5">Profile Photo CDN URL</label>
                            <input
                              type="text"
                              value={castItem.image || castItem.profileUrl || ''}
                              onChange={(e) => handleUpdateCastRow(idx, 'image', e.target.value)}
                              placeholder="https://image.tmdb.org/t/p/w185/..."
                              className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCastRow(idx)}
                          className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Remove actor"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TV SERIES EPISODES MANAGER (Conditional UI Section when isTVSeries is checked) */}
                {Boolean(formData.isTVSeries) && (
                  <div className="md:col-span-2 space-y-4 p-5 rounded-2xl bg-[#0A0A0E] border border-rose-500/40">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#FF0E25]" /> TV Series Episode List & Streaming Servers
                        </h4>
                        <p className="text-[11px] text-[#9E9EA0]">
                          Add and configure episode titles, season numbers, and custom StreamHG/EarnVids/FileMoon stream links per episode.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddEpisodeRow}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1 shadow-md transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Episode
                      </button>
                    </div>

                    <div className="space-y-3">
                      {episodesList.map((epRow, idx) => (
                        <div key={epRow.id || idx} className="p-3.5 rounded-2xl bg-[#121620] border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-rose-300">
                              Episode #{epRow.episodeNumber} ({epRow.title || 'Untitled Episode'})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEpisodeRow(idx)}
                              className="p-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white text-[10px]"
                              title="Remove episode"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                            <div>
                              <label className="text-[#9E9EA0] block mb-0.5">Ep #</label>
                              <input
                                type="number"
                                value={epRow.episodeNumber}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'episodeNumber', parseInt(e.target.value) || 1)}
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[#9E9EA0] block mb-0.5">Season #</label>
                              <input
                                type="number"
                                value={epRow.seasonNumber || 1}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'seasonNumber', parseInt(e.target.value) || 1)}
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-[#9E9EA0] block mb-0.5">Episode Title</label>
                              <input
                                type="text"
                                value={epRow.title}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'title', e.target.value)}
                                placeholder="e.g. Episode 1: Chapter One"
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-[#9E9EA0] block mb-0.5">Server 1 (StreamHG Embed Link)</label>
                              <input
                                type="text"
                                value={epRow.streamServer1Url || ''}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'streamServer1Url', e.target.value)}
                                placeholder="https://streamhg.com/e/..."
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[#9E9EA0] block mb-0.5">Server 2 (EarnVids Embed Link)</label>
                              <input
                                type="text"
                                value={epRow.streamServer2Url || ''}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'streamServer2Url', e.target.value)}
                                placeholder="https://earnvids.com/e/..."
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[#9E9EA0] block mb-0.5">Server 3 (FileMoon Embed Link)</label>
                              <input
                                type="text"
                                value={epRow.streamServer3Url || ''}
                                onChange={(e) => handleUpdateEpisodeRow(idx, 'streamServer3Url', e.target.value)}
                                placeholder="https://filemoon.sx/e/..."
                                className="w-full bg-[#0A0A0E] border border-white/10 rounded-lg p-2 text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5-Server Embedded Player URLs Manager */}
                <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-[#0A0A0E] border border-white/10">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#FF0E25]" /> Multi-Server Streaming Players (Servers 1 - 5)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 1: StreamHG Embed URL</label>
                      <input
                        type="text"
                        value={server1Url}
                        onChange={(e) => setServer1Url(e.target.value)}
                        placeholder="https://hgcloud.to/7uixqv4k0zat or https://streamhg.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 2: EarnVids Embed URL</label>
                      <input
                        type="text"
                        value={server2Url}
                        onChange={(e) => setServer2Url(e.target.value)}
                        placeholder="https://earnvids.com/e/..."
                        className="w-full bg-[#121620] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF0E25]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#9E9EA0] block mb-1">Server 3: FileMoon Embed URL</label>
                      <input
                        type="text"
                        value={server3Url}
                        onChange={(e) => setServer3Url(e.target.value)}
                        placeholder="https://filemoon.sx/e/..."
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
                  <label className="font-semibold text-gray-300 block mb-1">English Plot Summary (TMDB Overview - Manual Override)</label>
                  <textarea
                    rows={3}
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

      {/* MAINTENANCE OVERLAY PREVIEW MODAL */}
      {showMaintenancePreview && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#0F121A] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                <span>Live Visitor Overlay Preview (නඩත්තු පෙරදසුන)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowMaintenancePreview(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Simulated Screen */}
            <div className="bg-[#08090C] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF0E25]/20 via-black to-[#FF0E25]/10 border border-[#FF0E25]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#FF0E25]/20">
                <Wrench className="w-8 h-8 text-amber-400" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-extrabold uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Scheduled Maintenance • පද්ධති නඩත්තුව</span>
              </div>

              <h2 className="text-xl font-black text-white">
                {settingsForm.maintenanceTitle || siteSettings.maintenanceTitle || 'Scheduled System Upgrade in Progress'}
              </h2>
              {(settingsForm.maintenanceSinhalaTitle || siteSettings.maintenanceSinhalaTitle) && (
                <p className="text-sm font-extrabold text-[#FF0E25]">
                  {settingsForm.maintenanceSinhalaTitle || siteSettings.maintenanceSinhalaTitle}
                </p>
              )}

              <div className="bg-[#121620]/90 border border-white/5 p-4 rounded-xl text-xs text-gray-300 leading-relaxed text-left whitespace-pre-line">
                {settingsForm.maintenanceMessage || siteSettings.maintenanceMessage || 'We are currently upgrading our streaming CDN nodes...'}
              </div>

              {(settingsForm.maintenanceEstimatedTime || siteSettings.maintenanceEstimatedTime) && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-rose-200 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#FF0E25]" />
                  <span>{settingsForm.maintenanceEstimatedTime || siteSettings.maintenanceEstimatedTime}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-[#9E9EA0]">
                Current Site Status:{' '}
                <strong className={siteSettings.maintenanceMode ? 'text-amber-400' : 'text-emerald-400'}>
                  {siteSettings.maintenanceMode ? 'Maintenance Mode Active' : 'Site Live (Production)'}
                </strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMaintenancePreview(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleToggleMaintenanceQuick();
                    setShowMaintenancePreview(false);
                  }}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all ${
                    siteSettings.maintenanceMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-rose-700 hover:opacity-90 text-white'
                  }`}
                >
                  {siteSettings.maintenanceMode ? 'Turn Off Maintenance' : 'Activate Maintenance Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
