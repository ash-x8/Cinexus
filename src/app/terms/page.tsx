import React, { useEffect } from 'react';
import { useMovies } from '../../context/MovieContext';
import { useLanguage } from '../../context/LanguageContext';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <FileText className="w-8 h-8 text-[#FF0E25]" />
          <div>
            <h1 className="text-2xl font-black text-white">{t('termsOfService')} (සේවා කොන්දේසි)</h1>
            <p className="text-xs text-[#FF0E25] font-semibold">{siteSettings.siteTitle || 'CINEXUS'} Terms & Usage Guidelines</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0A0E] border border-white/5 whitespace-pre-line text-sm text-gray-200 leading-[1.8] font-normal">
          {siteSettings.termsContent}
        </div>
      </div>
    </div>
  );
}
