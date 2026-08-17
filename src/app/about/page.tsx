import React, { useEffect } from 'react';
import { useMovies } from '../../context/MovieContext';
import { useLanguage } from '../../context/LanguageContext';
import { Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <img src="/logo.png" alt="CINEXUS Logo" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="text-2xl font-black text-white">{t('aboutUs')} (අප ගැන)</h1>
            <p className="text-xs text-[#FF0E25] font-semibold">{siteSettings.siteTitle || 'CINEXUS'} Official Portal Information</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0A0E] border border-white/5 whitespace-pre-line text-sm text-gray-200 leading-[1.8] font-normal">
          {siteSettings.aboutUsContent}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#FF0E25]" />
            <div>
              <p className="text-xs font-bold text-white">Ultra Fast Streaming</p>
              <p className="text-[11px] text-[#9E9EA0]">Multi-CDN Fallback Servers</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Ad-Free Experience</p>
              <p className="text-[11px] text-[#9E9EA0]">Clean & Secure Player</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A0A0E] border border-white/5 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-xs font-bold text-white">Authentic Subtitles</p>
              <p className="text-[11px] text-[#9E9EA0]">100% Sinhala Subbed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
