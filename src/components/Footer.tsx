import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Share2, Send, MessageSquare, Video } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const Footer: React.FC = () => {
  const { siteSettings, setSelectedCategory } = useMovies();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreCategories = [
    'Action', 'Animation', 'Crime',
    'Fantasy', 'Sci-Fi', 'Sinhala Subbed',
    'Horror', 'Romance', 'Thriller'
  ];

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#06070a] relative overflow-hidden">
      {/* Background glow gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-red-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Column 1: Branding & Socials */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="CINEXUS Logo"
                className="max-h-10 w-auto object-contain"
              />
              <div>
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-red-500 bg-clip-text text-transparent">
                  {siteSettings.siteTitle || 'CINEXUS'}
                </span>
                <p className="text-[10px] text-red-400 font-semibold">{siteSettings.sinhalaTitle || 'සිනෙක්ස්'} සිංහල උපසිරැසි</p>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your premium destination for movies in stunning HD with Sinhala subtitles.
            </p>

            {/* Rounded Glass Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={siteSettings.facebookUrl || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/40 transition-all"
                title="Facebook"
              >
                <Share2 className="w-4 h-4" />
              </a>

              <a
                href={siteSettings.telegramChannelUrl || "https://t.me"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/40 transition-all"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href={siteSettings.whatsappGroupUrl || "https://whatsapp.com"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/40 transition-all"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/40 transition-all"
                title="YouTube"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore Categories (2-column grid) */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 text-red-500">
              Explore Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {exploreCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left hover:text-red-400 transition-colors py-1"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Account & Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 text-red-500">
              Account & Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-red-400 transition-colors">Watchlist</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">Favorites</Link></li>
              <li><Link to="/" className="hover:text-red-400 transition-colors">Top Rated</Link></li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4 text-red-500">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#about" className="hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="#terms" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#contact" className="hover:text-red-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Floating Back to Top Button */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 CINEXUS. All rights reserved.</p>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-red-600/30 hover:border-red-500/40 transition-all font-bold"
          >
            <ArrowUp className="w-3.5 h-3.5 text-red-500" />
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};
