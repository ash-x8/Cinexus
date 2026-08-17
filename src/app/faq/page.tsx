import React, { useEffect, useState } from 'react';
import { useMovies } from '../../context/MovieContext';
import { useLanguage } from '../../context/LanguageContext';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rawFaq = siteSettings.faqContent || '';
  const faqSections = rawFaq.split(/Q\d+:/i).filter(Boolean);

  const defaultFaqs = [
    {
      q: "How do I download movies with Sinhala subtitles on CINEXUS?",
      a: "Navigate to your chosen movie page, scroll down to the 'Direct Download Links' section, select your preferred quality (4K, 1080p, 720p, 480p, or Telegram), and click the download button."
    },
    {
      q: "Are streams and downloads 100% free?",
      a: "Yes, CINEXUS is completely free with zero subscription requirements or forced payment barriers."
    },
    {
      q: "Which streaming servers are supported?",
      a: "We support multiple high-speed backup servers including Server 1 (StreamHG), Server 2 (EarnVids), Server 3 (FileMoon), Facebook Video Data, and YouTube Trailers."
    },
    {
      q: "How can I request a new movie or TV series?",
      a: "Use the 'Request Movie' form in the footer or join our official Telegram group to submit your request."
    }
  ];

  const parsedFaqs = faqSections.length > 0
    ? faqSections.map((sec, idx) => {
        const parts = sec.split(/\nA:/i);
        return {
          q: parts[0]?.trim() || `Frequently Asked Question #${idx + 1}`,
          a: parts[1]?.trim() || sec.trim()
        };
      })
    : defaultFaqs;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <HelpCircle className="w-8 h-8 text-[#FF0E25]" />
          <div>
            <h1 className="text-2xl font-black text-white">{t('faq')} (නිතර අසන පැන්න)</h1>
            <p className="text-xs text-[#FF0E25] font-semibold">Frequently Asked Questions & Support Help</p>
          </div>
        </div>

        {/* Accordion Component */}
        <div className="space-y-3">
          {parsedFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0A0A0E] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-white text-sm hover:text-[#FF0E25] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#FF0E25]">Q{idx + 1}:</span> {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#FF0E25]" /> : <ChevronDown className="w-5 h-5 text-[#9E9EA0]" />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-gray-300 leading-[1.8] border-t border-white/5 whitespace-pre-line">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
