import React, { useState } from 'react';
import { X, FileText, Send, CheckCircle, Heart, Bookmark, User, Film, HelpCircle, Mail, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { MovieCard } from './MovieCard';

export type ContentModalType = 'about' | 'terms' | 'privacy' | 'contact' | 'faq' | 'request' | 'watchlist' | 'favorites' | 'account' | null;

interface ContentModalProps {
  type: ContentModalType;
  onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({ type, onClose }) => {
  const { siteSettings, movies } = useMovies();
  const { t } = useLanguage();

  // Form states
  const [requestTitle, setRequestTitle] = useState('');
  const [requestYear, setRequestYear] = useState('');
  const [requestNotes, setRequestYearNotes] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ Accordion open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      case 'about': return `${t('aboutUs')} (අප ගැන)`;
      case 'terms': return `${t('termsOfService')} (සේවා කොන්දේසි)`;
      case 'privacy': return `${t('privacyPolicy')} (පුද්ගලිකත්ව ප්‍රතිපත්තිය)`;
      case 'contact': return `${t('contactUs')} (සම්බන්ධ කරගන්න)`;
      case 'faq': return `${t('faq')} (නිතර අසන පැන්න)`;
      case 'request': return `${t('requestMovie')} (චිත්‍රපට ඉල්ලීම්)`;
      case 'watchlist': return `${t('watchlist')} (සුරකින ලද)`;
      case 'favorites': return `${t('favorites')} (ප්‍රියතම චිත්‍රපට)`;
      case 'account': return `${t('myAccount')} (මගේ ගිණුම)`;
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

  // Structured FAQ Questions
  const defaultFaqs = [
    {
      q: 'How do I download movies with Sinhala subtitles on CINEXUS?',
      a: 'Navigate to any movie page, scroll to the "Direct Download Links" section, choose your preferred quality (4K, 1080p, 720p, 480p, or Telegram), and click the download button.'
    },
    {
      q: 'Are streaming and downloads 100% free?',
      a: 'Yes, CINEXUS is completely free with no mandatory subscriptions, hidden fees, or aggressive popups.'
    },
    {
      q: 'What video players are supported for online watching?',
      a: 'We provide 5 multi-server backup players including StreamHG, Doodstream, Streamtape, Facebook Free Data Video, and YouTube Trailers.'
    },
    {
      q: 'How can I request a new movie or TV series?',
      a: 'Click "Request Movie / Series" in the footer menu or fill out the request form in this modal to submit your request directly to our subbing team.'
    },
    {
      q: 'How long does it take for Sinhala subtitles to be published after digital release?',
      a: 'Our translation team typically publishes high-accuracy Sinhala subtitles within 24 to 48 hours after official digital release.'
    }
  ];

  const trendingMovies = movies.filter(m => m.isTrending || m.isFeatured);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#121620] border border-white/10 rounded-3xl my-8 overflow-hidden shadow-2xl">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0A0A0E]">
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
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0A0A0E] border border-[#FF0E25]/30">
                <img src="/logo.png" alt="CINEXUS Logo" className="h-10 w-auto object-contain" />
                <div>
                  <h4 className="font-extrabold text-white text-base">{siteSettings.siteTitle || 'CINEXUS'}</h4>
                  <p className="text-[11px] text-[#FF0E25] font-semibold">{siteSettings.sinhalaTitle || 'සිනෙක්ස්'} - Premier Cinema Platform</p>
                </div>
              </div>
              <div className="whitespace-pre-line text-[#9E9EA0] leading-[1.8] font-normal p-4 rounded-2xl bg-[#0A0A0E] border border-white/5">
                {siteSettings.aboutUsContent}
              </div>
            </div>
          )}

          {type === 'terms' && (
            <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 whitespace-pre-line text-[#9E9EA0] leading-[1.8]">
              {siteSettings.termsContent}
            </div>
          )}

          {type === 'privacy' && (
            <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 whitespace-pre-line text-[#9E9EA0] leading-[1.8]">
              {siteSettings.privacyContent}
            </div>
          )}

          {type === 'faq' && (
            <div className="space-y-3">
              <p className="text-[#9E9EA0] font-semibold mb-2">Click any question below to reveal detailed answer:</p>
              {defaultFaqs.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-2xl bg-[#0A0A0E] border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-extrabold text-white flex items-center justify-between gap-2 hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{faqItem.q}</span>
                      </span>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-[#FF0E25]" /> : <ChevronRight className="w-4 h-4 text-[#9E9EA0]" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-[#9E9EA0] leading-[1.8] border-t border-white/5 font-normal">
                        {faqItem.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-6">
              <div className="whitespace-pre-line text-[#9E9EA0] leading-[1.8] bg-[#0A0A0E] p-4 rounded-2xl border border-white/5">
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
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
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
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
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
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Support Message
                  </button>
                </form>
              )}
            </div>
          )}

          {type === 'request' && (
            <div className="space-y-6">
              <div className="whitespace-pre-line text-[#9E9EA0] leading-[1.8] bg-[#0A0A0E] p-4 rounded-2xl border border-[#FF0E25]/30">
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
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Release Year</label>
                    <input
                      type="text"
                      value={requestYear}
                      onChange={(e) => setRequestYear(e.target.value)}
                      placeholder="2024 / 2025"
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Additional Notes / IMDb URL</label>
                    <textarea
                      rows={2}
                      value={requestNotes}
                      onChange={(e) => setRequestYearNotes(e.target.value)}
                      placeholder="e.g. Please add 1080p WEB-DL with Sinhala Subtitles"
                      className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
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
              <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF0E25] to-amber-500 p-0.5">
                  <div className="w-full h-full bg-[#121620] rounded-full flex items-center justify-center text-white font-bold">
                    CX
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">CINEXUS Guest User</h4>
                  <p className="text-xs text-emerald-400 font-bold">● Active Premium Session (Free Access)</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/10 space-y-2 text-[#9E9EA0]">
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
