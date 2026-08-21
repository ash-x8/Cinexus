import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import {
  Wrench,
  AlertTriangle,
  Clock,
  Send,
  MessageSquare,
  Share2,
  RefreshCw,
  Lock,
  Sparkles,
  Zap,
  ShieldCheck,
  Film,
  PowerOff,
} from 'lucide-react';

export const MaintenanceOverlay: React.FC = () => {
  const { siteSettings, updateSiteSettings, isAdminAuthenticated, refreshCatalog } = useMovies();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(false);
  const [adminBypassActive, setAdminBypassActive] = useState(false);

  const logoUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7L0R_e_q8Pky1G4x0UjWfB2-oKk810-7U0wI0QeW77oR-Xk6Xk1e0e8Q2e4e8e8e8e8e8e8e8e8/s1600/cinexus-logo.png';

  const handleRefreshCheck = async () => {
    setIsChecking(true);
    try {
      await refreshCatalog();
    } catch (e) {
      console.warn(e);
    }
    setTimeout(() => {
      setIsChecking(false);
    }, 800);
  };

  const handleDisableMaintenance = async () => {
    await updateSiteSettings({ maintenanceMode: false });
  };

  // If maintenance mode is OFF or user is currently on /admin, do not render full overlay
  if (!siteSettings.maintenanceMode || location.pathname === '/admin') {
    return null;
  }

  // If Admin is logged in and clicked "Preview Site Behind Overlay", show a persistent top floating bar instead of full blockage
  if (isAdminAuthenticated && adminBypassActive) {
    return (
      <div className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600 text-white px-4 py-2 shadow-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold border-b border-amber-300/30 animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-200 animate-bounce" />
          <span>
            <strong>MAINTENANCE MODE IS ACTIVE FOR VISITORS</strong> (You are viewing in Admin Preview Mode)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminBypassActive(false)}
            className="px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-white text-[11px] font-bold border border-white/20 transition-all"
          >
            View Maintenance Screen
          </button>
          <button
            onClick={handleDisableMaintenance}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow transition-all"
          >
            <PowerOff className="w-3.5 h-3.5" /> Turn Off Maintenance Mode
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-1 rounded-lg bg-white text-gray-900 hover:bg-gray-100 text-[11px] font-extrabold flex items-center gap-1 shadow transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-[#FF0E25]" /> Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#060709] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen select-none">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#FF0E25]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Admin Floating Shortcut Bar if Logged In */}
      {isAdminAuthenticated && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setAdminBypassActive(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5"
            title="Preview Site Content"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Preview Site
          </button>
          <button
            onClick={handleDisableMaintenance}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white shadow-lg shadow-emerald-950/50 flex items-center gap-1.5 transition-all"
          >
            <PowerOff className="w-4 h-4" /> Deactivate
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="relative z-10 max-w-2xl w-full bg-[#0F121A]/90 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] text-center space-y-6 my-auto">
        
        {/* Animated Brand Badge & Gear Icon */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#FF0E25]/20 via-black to-[#FF0E25]/10 border border-[#FF0E25]/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,14,37,0.3)]">
              <img
                src={logoUrl}
                alt="CINEXUS"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_12px_rgba(255,14,37,0.6)]"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 border-2 border-[#0F121A] flex items-center justify-center shadow-lg animate-spin-slow">
              <Wrench className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Maintenance Active Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Scheduled Maintenance • පද්ධති නඩත්තුව</span>
          </div>
        </div>

        {/* Dynamic Titles */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {siteSettings.maintenanceTitle || 'Scheduled System Upgrade in Progress'}
          </h1>
          {siteSettings.maintenanceSinhalaTitle && (
            <p className="text-sm sm:text-base font-extrabold text-[#FF0E25] tracking-wide">
              {siteSettings.maintenanceSinhalaTitle}
            </p>
          )}
        </div>

        {/* Dynamic Detailed Message */}
        <div className="bg-[#08090C]/80 border border-white/5 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto text-center sm:text-left">
          <p className="whitespace-pre-line">
            {siteSettings.maintenanceMessage ||
              'We are currently performing critical infrastructure upgrades across our streaming CDN nodes and subtitle servers to bring you ultra-fast speeds and 4K playback. CINEXUS will return shortly!'}
          </p>
        </div>

        {/* Estimated Time Badge */}
        {siteSettings.maintenanceEstimatedTime && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-rose-200 font-bold">
            <Clock className="w-4 h-4 text-[#FF0E25]" />
            <span>{siteSettings.maintenanceEstimatedTime}</span>
          </div>
        )}

        {/* Upcoming Upgrades Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-left">
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center space-y-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-extrabold text-white">4K CDN Nodes</span>
            <span className="text-[9px] text-[#9E9EA0]">Faster buffering</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center space-y-1">
            <Film className="w-4 h-4 text-[#FF0E25]" />
            <span className="text-[11px] font-extrabold text-white">Sinhala Subs</span>
            <span className="text-[9px] text-[#9E9EA0]">Instant sync engine</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center space-y-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-extrabold text-white">Direct Engine</span>
            <span className="text-[9px] text-[#9E9EA0]">Multi-quality links</span>
          </div>
          <div className="bg-white/[0.03] border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center space-y-1">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] font-extrabold text-white">99.9% Uptime</span>
            <span className="text-[9px] text-[#9E9EA0]">Resilient backups</span>
          </div>
        </div>

        {/* Community Social Links for Real-time Status */}
        <div className="space-y-3 pt-2">
          <p className="text-xs text-[#9E9EA0] font-bold">
            Join our official communities to receive instant live reopening alerts:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {siteSettings.telegramChannelUrl && (
              <a
                href={siteSettings.telegramChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Telegram Channel
              </a>
            )}
            {siteSettings.whatsappGroupUrl && (
              <a
                href={siteSettings.whatsappGroupUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Community
              </a>
            )}
            {siteSettings.facebookUrl && (
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" /> Facebook Page
              </a>
            )}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={handleRefreshCheck}
            disabled={isChecking}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold flex items-center justify-center gap-2 border border-white/15 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FF0E25] ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking status...' : 'Check If Online / පරීක්ෂා කරන්න'}</span>
          </button>

          {siteSettings.maintenanceShowAdminBypass && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-[#9E9EA0] hover:text-white hover:bg-white/5 font-extrabold flex items-center justify-center gap-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF0E25]" /> Admin Portal Access
            </button>
          )}
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="relative z-10 mt-6 text-center text-[11px] text-gray-500">
        CINEXUS (සිනෙක්ස්) • Ultra-Fast Sinhala Subtitled Cinema Engine
      </div>
    </div>
  );
};
