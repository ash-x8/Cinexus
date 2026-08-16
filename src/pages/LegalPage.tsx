import React, { useEffect } from 'react';
import { useMovies } from '../context/MovieContext';
import { useLanguage } from '../context/LanguageContext';
import { ContentModal, type ContentModalType } from '../components/ContentModal';

interface LegalPageProps {
  type: 'about' | 'terms' | 'privacy' | 'contact' | 'faq';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const getTitle = () => {
    switch (type) {
      case 'about': return `${t('aboutUs')} (අප ගැන)`;
      case 'terms': return `${t('termsOfService')} (සේවා කොන්දේසි)`;
      case 'privacy': return `${t('privacyPolicy')} (පුද්ගලිකත්ව ප්‍රතිපත්තිය)`;
      case 'contact': return `${t('contactUs')} (සම්බන්ධ කරගන්න)`;
      case 'faq': return `${t('faq')} (නිතර අසන පැන්න)`;
    }
  };

  const getContent = () => {
    switch (type) {
      case 'about': return siteSettings.aboutUsContent;
      case 'terms': return siteSettings.termsContent;
      case 'privacy': return siteSettings.privacyContent;
      case 'contact': return siteSettings.contactUsContent;
      case 'faq': return siteSettings.faqContent;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <img src="/logo.png" alt="CINEXUS Logo" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="text-2xl font-black text-white">{getTitle()}</h1>
            <p className="text-xs text-[#FF0E25] font-semibold">{siteSettings.siteTitle || 'CINEXUS'} Official Portal Information</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0A0E] border border-white/5 whitespace-pre-line text-sm text-gray-200 leading-[1.8] font-normal">
          {getContent()}
        </div>
      </div>
    </div>
  );
};
