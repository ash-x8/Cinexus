import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Send, Heart, Sparkles, Globe, MessageSquare, Share2 } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useMovies();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#06070a] relative overflow-hidden">
      {/* Background glow gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info & Social Controller */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-amber-400 p-[2px]">
                <div className="w-full h-full bg-[#08090c] rounded-[10px] flex items-center justify-center">
                  <Film className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-200 to-amber-300 bg-clip-text text-transparent">
                  {siteSettings.siteTitle || 'CINEXUS'}
                </span>
                <p className="text-[10px] text-amber-300/90 font-semibold">{siteSettings.sinhalaTitle || 'සිනෙක්ස්'} සිංහල උපසිරැසි</p>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              {siteSettings.footerText || "CINEXUS • Sri Lanka's premier Sinhala subtitled streaming & direct download portal."}
            </p>

            {/* Dynamic Social Media Links Managed by Admin */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {siteSettings.telegramChannelUrl && (
                <a
                  href={siteSettings.telegramChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-[11px] rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" /> Telegram
                </a>
              )}

              {siteSettings.facebookUrl && (
                <a
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-[11px] rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" /> Facebook Page
                </a>
              )}

              {siteSettings.whatsappGroupUrl && (
                <a
                  href={siteSettings.whatsappGroupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-[11px] rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Latest Sinhala Subtitled Movies</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Trending TV Series</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Dual Audio Sinhala</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">4K Ultra HD Cinema</Link></li>
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Anime Subtitled Collection</Link></li>
            </ul>
          </div>

          {/* Site Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" /> Navigation & Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home Page</Link></li>
              <li><a href="#dmca" className="hover:text-cyan-400 transition-colors">DMCA & Copyright Policy</a></li>
              <li><a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Subtitle Translator Contact</a></li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Disclaimer</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              CINEXUS does not host any media files on its servers. All videos and files provided are hosted on non-affiliated 3rd-party platforms (GDrive, Streamtape, YouTube).
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} CINEXUS (සිනෙක්ස්). All Rights Reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Sri Lankan Movie Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
