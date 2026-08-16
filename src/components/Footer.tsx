import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, Share2, Send, MessageSquare, Video, Globe, Mail } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { ContentModal, type ContentModalType } from './ContentModal';

export const Footer: React.FC = () => {
  const { siteSettings, setSelectedCategory, setSelectedGenre, setSelectedLanguage } = useMovies();
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<ContentModalType>(null);
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: string) => {
    if (['Action', 'Sci-Fi', 'Romance', 'Horror', 'TV Series', 'Anime', 'Dual Audio'].includes(cat)) {
      setSelectedCategory(cat);
    } else if (['Tamil', 'Hindi', 'Malayalam', 'Telugu', 'Sinhala', 'English', 'Korean'].includes(cat)) {
      setSelectedLanguage(cat);
    } else {
      setSelectedGenre(cat);
    }
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exploreCategories = [
    'Action', 'Sci-Fi', 'Romance',
    'Horror', 'Tamil', 'Hindi',
    'TV Series', 'Anime', 'Sinhala Subbed'
  ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#06070a] relative overflow-hidden text-xs">
      {/* Background soft red gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#FF0E25]/15 via-[#C80016]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Column 1: Branding & Community Socials */}
          <div className="space-y-4">
            {/* Single Logo Policy: Strictly ONE logo in the footer */}
            <Link
              to="/"
              onClick={() => { setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-3 shrink-0 group focus:outline-none"
              title="CINEXUS - Go to Homepage"
            >
              <img
                src="/logo.png"
                alt="CINEXUS Logo"
                className="max-h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-[#FF0E25] bg-clip-text text-transparent">
                  {siteSettings.siteTitle || 'CINEXUS'}
                </span>
                <p className="text-[10px] text-[#FF0E25] font-semibold">
                  {siteSettings.sinhalaTitle || 'සිනෙක්ස්'} සිංහල උපසිරැසි
                </p>
              </div>
            </Link>

            <p className="text-[#9E9EA0] leading-relaxed">
              {siteSettings.footerText || "CINEXUS (සිනෙක්ස්) • Sri Lanka's premier Sinhala subtitled streaming and multi-quality direct download portal."}
            </p>

            {/* Rounded Glass Social Icons synced dynamically from Admin Panel - Strict Conditional Rendering */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {siteSettings.facebookUrl && siteSettings.facebookUrl.trim() !== '' && (
                <a
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="Facebook Page"
                >
                  <Share2 className="w-4 h-4 text-blue-500" />
                </a>
              )}

              {siteSettings.telegramChannelUrl && siteSettings.telegramChannelUrl.trim() !== '' && (
                <a
                  href={siteSettings.telegramChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="Telegram Channel"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                </a>
              )}

              {siteSettings.whatsappGroupUrl && siteSettings.whatsappGroupUrl.trim() !== '' && (
                <a
                  href={siteSettings.whatsappGroupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="WhatsApp Group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                </a>
              )}

              {siteSettings.instagramUrl && siteSettings.instagramUrl.trim() !== '' && (
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="Instagram"
                >
                  <Globe className="w-4 h-4 text-pink-500" />
                </a>
              )}

              {siteSettings.youtubeUrl && siteSettings.youtubeUrl.trim() !== '' && (
                <a
                  href={siteSettings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="YouTube Channel"
                >
                  <Video className="w-4 h-4 text-red-500" />
                </a>
              )}

              {siteSettings.contactEmail && siteSettings.contactEmail.trim() !== '' && (
                <Link
                  to="/contact"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all"
                  title="Contact Support"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2: Explore Categories */}
          <div>
            <h4 className="text-xs font-black text-[#FF0E25] tracking-wider uppercase mb-4">
              Explore Categories
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[#9E9EA0]">
              {exploreCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="text-left hover:text-[#FF0E25] transition-colors py-1 font-medium"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Account & Request Links */}
          <div>
            <h4 className="text-xs font-black text-[#FF0E25] tracking-wider uppercase mb-4">
              Account & Requests
            </h4>
            <ul className="space-y-2.5 text-[#9E9EA0] font-medium">
              <li>
                <button
                  onClick={() => setActiveModal('watchlist')}
                  className="hover:text-[#FF0E25] transition-colors text-left"
                >
                  {t('watchlist')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('favorites')}
                  className="hover:text-[#FF0E25] transition-colors text-left"
                >
                  {t('favorites')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('account')}
                  className="hover:text-[#FF0E25] transition-colors text-left"
                >
                  {t('myAccount')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal('request')}
                  className="hover:text-[#FF0E25] transition-colors text-left font-bold text-rose-300 flex items-center gap-1"
                >
                  <span>{t('requestMovie')}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[#FF0E25]/20 text-[#FF0E25] text-[9px] uppercase">New</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Dynamic Company & Legal Pages (Clickable Routes) */}
          <div>
            <h4 className="text-xs font-black text-[#FF0E25] tracking-wider uppercase mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-[#9E9EA0] font-medium">
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-[#FF0E25] transition-colors text-left block"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-[#FF0E25] transition-colors text-left block"
                >
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-[#FF0E25] transition-colors text-left block"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#FF0E25] transition-colors text-left block"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[#FF0E25] transition-colors text-left block"
                >
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright + Back to Top Button */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9EA0] gap-4">
          <p>© 2026 CINEXUS (සිනෙක්ස්). All rights reserved.</p>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-[#FF0E25]/30 hover:border-[#FF0E25]/50 transition-all font-bold"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#FF0E25]" />
            {t('backToTop')}
          </button>
        </div>
      </div>

      {/* Dynamic Modal Renderer for account & request modals */}
      <ContentModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </footer>
  );
};
