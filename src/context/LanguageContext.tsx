import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'SI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LOCAL_STORAGE_LANG_KEY = 'cinexus_site_language_v1';

// Dictionary of translations for EN and SI
const dictionary: Record<string, Record<Language, string>> = {
  // Navigation & Headers
  home: { EN: 'Home', SI: 'මුල් පිටුව' },
  movies: { EN: 'Movies', SI: 'චිත්‍රපට' },
  tvSeries: { EN: 'TV Series', SI: 'කථාමාලා' },
  sinhalaSub: { EN: 'Sinhala Subbed', SI: 'සිංහල උපසිරැසි' },
  withoutSub: { EN: 'Without Sub / English', SI: 'ඉංග්‍රීසි / උපසිරැසි නොමැති' },
  sinhalaDubbed: { EN: 'Sinhala Dubbed', SI: 'සිංහල හඬකැවූ' },
  genres: { EN: 'Genres', SI: 'ජානර' },
  languages: { EN: 'Languages / Industry', SI: 'භාෂා / සිනමා කර්මාන්ත' },
  contentType: { EN: 'Content Type', SI: 'අන්තර්ගත වර්ගය' },
  searchPlaceholder: { EN: 'Search movies, TV series or Sinhala subbed...', SI: 'චිත්‍රපට, කථාමාලා හෝ උපසිරැසි සොයන්න...' },
  liveViewers: { EN: 'Live Viewers', SI: 'සජීවී ප්‍රේක්ෂකයින්' },
  liveStreamers: { EN: 'Live Streamers', SI: 'සජීවී ප්‍රේක්ෂකයින්' },

  // Sidebar Headers
  sidebarTitle: { EN: 'CINEXUS Navigation', SI: 'සිනෙක්ස් මෙනුව' },
  sidebarSubtitle: { EN: 'Categorized Movie Portal', SI: 'වර්ගීකරණය කළ සිනමා අඩවිය' },

  // Homepage Toolbar
  latestReleases: { EN: 'Latest Sinhala Subbed Movies', SI: 'අලුත්ම සිංහල උපසිරැසි ගැන්වූ චිත්‍රපට' },
  allReleases: { EN: 'All Releases', SI: 'සියලුම එකතු' },
  filter: { EN: 'Filter', SI: 'පෙරහන' },
  sort: { EN: 'Sort', SI: 'පිළිවෙල' },
  latestUploads: { EN: 'Latest Uploads', SI: 'අලුත්ම එක්කිරීම්' },
  highestRating: { EN: 'Highest IMDb Score', SI: 'ඉහළම IMDb අගය' },
  mostPopular: { EN: 'Most Popular', SI: 'වඩාත්ම ජනප්‍රිය' },
  releaseYear: { EN: 'Release Year', SI: 'නිකුත් වූ වසර' },
  noMoviesFound: { EN: 'No Movies Found', SI: 'චිත්‍රපට හමු නොවීය' },
  resetFilters: { EN: 'Reset Filters', SI: 'පෙරහන් ඉවත් කරන්න' },

  // Details Page
  watchNow: { EN: 'Watch Now', SI: 'දැන් බලන්න' },
  download: { EN: 'Download', SI: 'බාගත කරන්න' },
  downloadLinks: { EN: 'Direct Download Links', SI: 'සෘජු බාගත කිරීමේ සබැඳි' },
  plotSummary: { EN: 'Plot Summary', SI: 'කතාවේ සාරාංශය' },
  castAndCrew: { EN: 'Cast & Crew', SI: 'රංගන ශිල්පීන් සහ අධ්‍යක්ෂණය' },
  subtitleTranslator: { EN: 'Subtitle Translator', SI: 'උපසිරැසිකරු' },
  director: { EN: 'Director', SI: 'අධ්‍යක්ෂණය' },
  runtime: { EN: 'Runtime', SI: 'ධාවන කාලය' },
  imdbScore: { EN: 'IMDb Rating', SI: 'IMDb අගය' },
  quality: { EN: 'Quality', SI: 'ගුණාත්මකභාවය' },
  audioLanguage: { EN: 'Audio Language', SI: 'ශ්‍රව්‍ය භාෂාව' },
  recommendedMovies: { EN: 'Recommended Related Movies', SI: 'තවත් යෝජිත චිත්‍රපට' },
  backToCatalog: { EN: 'Back to Movies Catalog', SI: 'නැවත චිත්‍රපට ලැයිස්තුවට' },

  // Footer Links
  aboutUs: { EN: 'About Us', SI: 'අප ගැන' },
  termsOfService: { EN: 'Terms of Service', SI: 'සේවා කොන්දේසි' },
  privacyPolicy: { EN: 'Privacy Policy', SI: 'පුද්ගලිකත්ව ප්‍රතිපත්තිය' },
  contactUs: { EN: 'Contact Us', SI: 'සම්බන්ධ කරගන්න' },
  faq: { EN: 'FAQ', SI: 'නිතර අසන පැන්න' },
  requestMovie: { EN: 'Request Movie / Series', SI: 'චිත්‍රපට ඉල්ලීම්' },
  watchlist: { EN: 'My Watchlist', SI: 'සුරකින ලද ලැයිස්තුව' },
  favorites: { EN: 'Favorites', SI: 'ප්‍රියතම ලැයිස්තුව' },
  myAccount: { EN: 'My Account', SI: 'මගේ ගිණුම' },
  backToTop: { EN: 'Back to Top', SI: 'ඉහළට යන්න' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    if (saved === 'SI' || saved === 'EN') return saved;
    return 'EN'; // Default language is English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'EN' ? 'SI' : 'EN';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    if (dictionary[key] && dictionary[key][language]) {
      return dictionary[key][language];
    }
    return key;
  };

  useEffect(() => {
    document.documentElement.lang = language === 'SI' ? 'si' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
