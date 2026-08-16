import React, { useState } from 'react';
import { X, FileText, Send, CheckCircle, Heart, Bookmark, User, Film, HelpCircle, Mail, ShieldCheck } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from './MovieCard';

export type ContentModalType = 'about' | 'terms' | 'privacy' | 'contact' | 'faq' | 'request' | 'watchlist' | 'favorites' | 'account' | null;

interface ContentModalProps {
  type: ContentModalType;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ type, onClose }) => {
  const { siteSettings, movies } = useMovies();

  // Form states for Request Movie & Contact Us
  const [requestTitle, setRequestTitle] = useState('');
  const [requestYear, setRequestYear] = useState('');
  const [requestNotes, setRequestYearNotes] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  if (!type) return null;

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setRequestTitle('');
      setRequestYear('');
      setRequestYearNotes('');
      onClose();
    }, 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      onClose();
    }, 2500);
  };

  const getModalTitle = () => {
    switch (type) {
      case 'about': return 'About CINEXUS (අප ගැන)';
      case 'terms': return 'Terms of Service (සේවා කොන්දේසි)';
      case 'privacy': return 'Privacy Policy (පුද්ගලිකත්ව ප්‍රතිපත්තිය)';
      case 'contact': return 'Contact Us (සම්බන්ධ කරගන්න)';
      case 'faq': return 'FAQ (නිතර අසන පැන්න)';
      case 'request': return 'Request a Movie / TV Series (චිත්‍රපට ඉල්ලීම්)';
      case 'watchlist': return 'My Watchlist (නරඹන්න සුරකින ලද)';
      case 'favorites': return 'Favorite Movies (ප්‍රියතම චිත්‍රපට)';
      case 'account': return 'My Account & Preferences (මගේ ගිණුම)';
      default: return '';
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case 'about': return <FileText className="w-5 h-5 text-[#FF0E25]" />;
      case 'terms': return <ShieldCheck className="w-5 h-5 text-[#FF0E25]" />;
      case 'privacy': return <ShieldCheck className="w-5 h-5 text-[#FF0E25]" />;
      case 'contact': return <Mail className="w-5 h-5 text-[#FF0E25]" />;
      case 'faq': return <HelpCircle className="w-5 h-5 text-amber-400" />;
      case 'request': return <Film className="w-5 h-5 text-[#FF0E25]" />;
      case 'watchlist': return <Bookmark className="w-5 h-5 text-amber-400" />;
      case 'favorites': return <Heart className="w-5 h-5 text-[#FF0E25]" />;
      case 'account': return <User className="w-5 h-5 text-rose-400" />;
      default: return null;
    }
  };

  const trendingMovies = movies.filter(m => m.isTrending || m.isFeatured);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11141f] border border-white/10 rounded-3xl my-8 overflow-hidden shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090A0F]">
          <div className="flex items-center gap-2.5">
            {getModalIcon()}
            <h3 className="text-base font-extrabold text-white">
              {getModalTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#9E9EA0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs text-gray-200 leading-relaxed">

          {type === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#090A0F] border border-[#FF0E25]/30">
                <img src="/logo.png" alt="CINEXUS Logo" className="h-10 w-auto object-contain" />
                <div>
                  <h4 className="font-extrabold text-white text-base">{siteSettings.siteTitle || 'CINEXUS'}</h4>
                  <p className="text-[11px] text-[#FF0E25] font-semibold">{siteSettings.sinhalaTitle || 'සිනෙක්ස්'} - Premier Cinema Platform</p>
                </div>
              </div>
              <div className="whitespace-pre-line text-[#9E9EA0] leading-relaxed">
                {siteSettings.aboutUsContent}
              </div>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-4 whitespace-pre-line text-[#9E9EA0] leading-relaxed">
              {siteSettings.termsContent}
            </div>
          )}

          {type === 'privacy' && (
            <div className="space-y-4 whitespace-pre-line text-[#9E9EA0] leading-relaxed">
              {siteSettings.privacyContent}
            </div>
          )}

          {type === 'faq' && (
            <div className="space-y-4 whitespace-pre-line text-gray-200 leading-relaxed font-sans">
              {siteSettings.faqContent}
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-6">
              <div className="whitespace-pre-line text-[#9E9EA0] leading-relaxed bg-[#090A0F] p-4 rounded-2xl border border-white/5">
                {siteSettings.contactUsContent}
              </div>

              {contactSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Your message has been sent successfully to CINEXUS Support!
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 pt-2">
                  <h4 className="font-bold text-white text-sm">Send Direct Support Message</h4>
                  <div>
                    <label className="block text-gray-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Message Body</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Type your message or inquiry..."
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          )}

          {type === 'request' && (
            <div className="space-y-6">
              <div className="whitespace-pre-line text-[#9E9EA0] leading-relaxed bg-[#090A0F] p-4 rounded-2xl border border-[#FF0E25]/30">
                <h4 className="font-extrabold text-[#FF0E25] text-xs uppercase mb-2">Submission Guidelines</h4>
                {siteSettings.requestMovieRules}
              </div>

              {requestSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Your movie request for "{requestTitle}" has been received!
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Submit New Movie Request</h4>
                  <div>
                    <label className="block text-gray-300 mb-1">Movie / TV Series Official Title*</label>
                    <input
                      type="text"
                      required
                      value={requestTitle}
                      onChange={(e) => setRequestTitle(e.target.value)}
                      placeholder="e.g., Gladiator II"
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Release Year</label>
                    <input
                      type="text"
                      value={requestYear}
                      onChange={(e) => setRequestYear(e.target.value)}
                      placeholder="2024 / 2025"
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Additional Notes / IMDb URL</label>
                    <textarea
                      rows={2}
                      value={requestNotes}
                      onChange={(e) => setRequestYearNotes(e.target.value)}
                      placeholder="e.g. Please add 1080p Web-DL with Sinhala Subtitles"
                      className="w-full bg-[#090A0F] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Movie Request
                  </button>
                </form>
              )}
            </div>
          )}

          {(type === 'watchlist' || type === 'favorites') && (
            <div className="space-y-4">
              <p className="text-[#9E9EA0]">
                {type === 'watchlist' ? 'Your saved titles to watch later:' : 'Your favorite movies collection:'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trendingMovies.slice(0, 3).map((m) => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </div>
            </div>
          )}

          {type === 'account' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#090A0F] border border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF0E25] to-amber-500 p-0.5">
                  <div className="w-full h-full bg-[#11141f] rounded-full flex items-center justify-center text-white font-bold">
                    CX
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">CINEXUS Guest User</h4>
                  <p className="text-xs text-emerald-400 font-bold">● Active Premium Session (Free Access)</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#090A0F] border border-white/10 space-y-2 text-[#9E9EA0]">
                <p>• Fast CDN Mirror: Active (Auto-selected)</p>
                <p>• Streaming Resolution Preference: Auto 1080p</p>
                <p>• Subtitle Default: Sinhala Subtitles Enabled</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
