import type { Movie, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Action', sinhalaName: 'ක්‍රියාදාම', slug: 'action' },
  { id: '2', name: 'Sci-Fi', sinhalaName: 'විද්‍යා ප්‍රබන්ධ', slug: 'sci-fi' },
  { id: '3', name: 'Romance', sinhalaName: 'ආදරණීය', slug: 'romance' },
  { id: '4', name: 'Horror', sinhalaName: 'භීතිකා', slug: 'horror' },
  { id: '5', name: 'Sinhala Subbed', sinhalaName: 'සිංහල උපසිරැසි', slug: 'sinhala-subbed' },
  { id: '6', name: 'TV Series', sinhalaName: 'කථාමාලා', slug: 'tv-series' },
  { id: '7', name: 'Anime', sinhalaName: 'ඇනිමේ', slug: 'anime' },
  { id: '8', name: 'Dual Audio', sinhalaName: 'ද්විත්ව හඬ', slug: 'dual-audio' },
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Avatar: The Way of Water',
    sinhalaTitle: 'ඇවටාර්: ද වේ ඔෆ් වෝටර්',
    originalTitle: 'Avatar: The Way of Water',
    year: 2022,
    imdbRating: 7.6,
    duration: '3h 12m',
    qualityBadge: '1080p WEB-DL',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
    sinhalaPlot: 'ජේක් සුලි සහ නෙයිටිරි පණ්‌ඩෝරා ග්‍රහලෝකයේ ඔවුන්ගේ පවුල සමඟ එකතු වී ජීවත් වේ. නව තර්ජනයක් පැමිණි විට, ඔවුන් සාගර ආශ්‍රිත මෙට්කායිනා ගෝත්‍රය වෙත රැකවරණය පතා යන අතර එහිදී දැවැන්ත සටනකට මුහුණ දීමට සිදු වේ.',
    englishPlot: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Kate Winslet'],
    director: 'James Cameron',
    audioLanguage: 'English / English (Sinhala Sub)',
    subtitleAuthor: {
      name: 'නිසල් රණසිංහ',
      downloadsCount: 14200,
      releaseDate: '2023-01-15'
    },
    servers: [
      { id: 's1', name: 'Server 1 (CINEXUS Ultra HD)', url: 'https://www.youtube.com/embed/d9MyW72ELq0?autoplay=1', quality: '1080p' },
      { id: 's2', name: 'Server 2 (Fast Stream Tape)', url: 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '720p' },
      { id: 's3', name: 'Google Drive Direct Embed', url: 'https://www.youtube.com/embed/d9MyW72ELq0', quality: '1080p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '2.8 GB', url: '#download-1080p', format: 'MKV / x264' },
      { id: 'dl2', quality: '720p', size: '1.4 GB', url: '#download-720p', format: 'MP4 / x264' },
      { id: 'dl3', quality: '480p', size: '650 MB', url: '#download-480p', format: 'MP4' },
      { id: 'dl4', quality: 'Telegram', size: 'Instant Link', url: 'https://t.me/cinexus_movies', format: 'Telegram Direct' }
    ],
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: true,
    isFeatured: true,
    isTVSeries: false,
    viewsCount: 45890,
    downloadsCount: 18230,
    addedAt: '2024-02-10'
  },
  {
    id: 'm2',
    title: 'Dune: Part Two',
    sinhalaTitle: 'ඩූන්: දෙවන කොටස',
    originalTitle: 'Dune: Part Two',
    year: 2024,
    imdbRating: 8.6,
    duration: '2h 46m',
    qualityBadge: '4K Ultra HD',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    sinhalaPlot: 'පෝල් අට්‍රෙයිඩීස්, චානි සහ ෆ්‍රෙමෙන් සමඟ එක්ව සිය පවුල විනාශ කළ කුමන්ත්‍රණකරුවන්ට එරෙහිව පළිගැනීමේ ගමන ආරම්භ කරයි. විශ්වයේ අනාගතය සහ ඔහුගේ ජීවිතයේ ආදරය අතර තේරීමක් කිරීමට ඔහුට සිදුවේ.',
    englishPlot: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    audioLanguage: 'English (Sinhala Subtitled)',
    subtitleAuthor: {
      name: 'කසුන් පෙරේරා',
      downloadsCount: 22100,
      releaseDate: '2024-03-01'
    },
    servers: [
      { id: 's1', name: 'Server 1 (Full HD Player)', url: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1', quality: '1080p' },
      { id: 's2', name: 'Server 2 (StreamTape Fast)', url: 'https://www.youtube.com/embed/Way9Dexny3w', quality: '720p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '3.1 GB', url: '#download-1080p', format: 'MKV x265' },
      { id: 'dl2', quality: '720p', size: '1.2 GB', url: '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: '480p', size: '580 MB', url: '#download-480p', format: 'MP4' },
      { id: 'dl4', quality: 'Telegram', size: 'Direct Telegram File', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
    ],
    hasSinhalaSub: true,
    isDualAudio: true,
    isTrending: true,
    isFeatured: true,
    isTVSeries: false,
    viewsCount: 62100,
    downloadsCount: 28900,
    addedAt: '2024-03-15'
  },
  {
    id: 'm3',
    title: 'The Batman',
    sinhalaTitle: 'ද බෑට්මෑන්',
    originalTitle: 'The Batman',
    year: 2022,
    imdbRating: 7.8,
    duration: '2h 56m',
    qualityBadge: '1080p BluRay',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/mqqft2x_Aa4',
    sinhalaPlot: 'ගෝතම් නගරයේ දූෂිත දේශපාලඥයින් සහ ප්‍රභූන් ඉලක්ක කරගනිමින් ඝාතන සිදුකරන රිඩ්ලර් නැමැති අභිරහස් ඝාතකයා සොයා බැට්මෑන් පරීක්ෂණ පවත්වයි.',
    englishPlot: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
    genres: ['Action', 'Crime', 'Drama'],
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    director: 'Matt Reeves',
    audioLanguage: 'English / Sinhala Subtitle',
    subtitleAuthor: {
      name: 'ධනුෂ්ක අබේසිංහ',
      downloadsCount: 18400,
      releaseDate: '2022-04-10'
    },
    servers: [
      { id: 's1', name: 'Server 1 (CINEXUS Engine)', url: 'https://www.youtube.com/embed/mqqft2x_Aa4', quality: '1080p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '2.5 GB', url: '#download-1080p', format: 'MKV' },
      { id: 'dl2', quality: '720p', size: '1.1 GB', url: '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: 'Telegram', size: 'Channel Direct', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
    ],
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: false,
    isFeatured: true,
    isTVSeries: false,
    viewsCount: 38900,
    downloadsCount: 15400,
    addedAt: '2023-11-20'
  },
  {
    id: 'm4',
    title: 'Stranger Things: Season 4',
    sinhalaTitle: 'ස්ට්‍රේන්ජර් තින්ග්ස් (කථාමාලාව)',
    originalTitle: 'Stranger Things S04',
    year: 2022,
    imdbRating: 8.7,
    duration: '9 Episodes',
    qualityBadge: '1080p WEBRip',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/yQEondeGvKo',
    sinhalaPlot: 'හොකින්ස් නගරයට බලපාන නව අද්භූත අඳුරු බලවේගයක් වන වෙක්නා සමඟ ඉලෙවන් සහ ඇගේ යහළුවන් කරන සටන.',
    englishPlot: 'When a new horror manifests in Hawkins, Indiana, a group of friends must unravel an ominous supernatural threat known as Vecna.',
    genres: ['TV Series', 'Sci-Fi', 'Horror'],
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour'],
    director: 'The Duffer Brothers',
    audioLanguage: 'English (Complete Sinhala Sub Pack)',
    subtitleAuthor: {
      name: 'සංජය ප්‍රනාන්දු',
      downloadsCount: 31000,
      releaseDate: '2022-07-01'
    },
    servers: [
      { id: 's1', name: 'Server 1 (All Episodes)', url: 'https://www.youtube.com/embed/yQEondeGvKo', quality: '1080p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '8.5 GB (Zip)', url: '#download-1080p', format: 'Full Season Zip' },
      { id: 'dl2', quality: '720p', size: '4.2 GB (Zip)', url: '#download-720p', format: 'Full Season Zip' },
      { id: 'dl3', quality: 'Telegram', size: 'Direct Channel Batch', url: 'https://t.me/cinexus_movies', format: 'Telegram Batch' }
    ],
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: true,
    isFeatured: false,
    isTVSeries: true,
    seasonsCount: 4,
    episodesCount: 34,
    viewsCount: 52000,
    downloadsCount: 24000,
    addedAt: '2023-12-05'
  },
  {
    id: 'm5',
    title: 'Interstellar',
    sinhalaTitle: 'ඉන්ටර්ස්ටෙලාර්',
    originalTitle: 'Interstellar',
    year: 2014,
    imdbRating: 8.7,
    duration: '2h 49m',
    qualityBadge: '1080p Remux',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    sinhalaPlot: 'පෘථිවියේ මානව වර්ගයා විනාශ වීමේ අවදානමට ලක්ව ඇති විට, මිනිසාට ජීවත්වීමට සුදුසු අලුත් ග්‍රහලෝකයක් සෙවීම සඳහා විශ්වයේ කළු කුහරයක් ඔස්සේ යන අභ්‍යවකාශගාමීන් පිරිසකගේ වික්‍රමය.',
    englishPlot: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    audioLanguage: 'English / Dual Audio Sinhala',
    subtitleAuthor: {
      name: 'ලහිරු මධුෂාන්',
      downloadsCount: 41200,
      releaseDate: '2021-08-12'
    },
    servers: [
      { id: 's1', name: 'Server 1 (CINEXUS 1080p)', url: 'https://www.youtube.com/embed/zSWdZVtXT7E', quality: '1080p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '2.4 GB', url: '#download-1080p', format: 'MKV' },
      { id: 'dl2', quality: '720p', size: '1.2 GB', url: '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: '480p', size: '500 MB', url: '#download-480p', format: 'MP4' },
      { id: 'dl4', quality: 'Telegram', size: 'Direct Link', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
    ],
    hasSinhalaSub: true,
    isDualAudio: true,
    isTrending: false,
    isFeatured: true,
    isTVSeries: false,
    viewsCount: 89000,
    downloadsCount: 41000,
    addedAt: '2023-08-10'
  },
  {
    id: 'm6',
    title: 'Demon Slayer: Hashira Training Arc',
    sinhalaTitle: 'ඩීමන් ස්ලේයර්: හෂිරා ට්‍රේනින්',
    originalTitle: 'Kimetsu no Yaiba',
    year: 2024,
    imdbRating: 8.5,
    duration: '8 Episodes',
    qualityBadge: '1080p WEB-DL',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/a9tq0aS5Zu8',
    sinhalaPlot: 'තන්ජිරෝ සහ සසුරුවන්නන් හෂිරා බලකායේ ප්‍රබල නායකයින්ගෙන් දැඩි පුහුණුවක් ලබා ගනිමින් අවසාන මහා යක්ෂ සටන සඳහා සුදානම් වෙති.',
    englishPlot: 'Tanjiro undergoes rigorous training with the Stone Hashira, Gyomei Himejima, in his quest to become a Hashira and prepare for the upcoming battle against Muzan Kibutsuji.',
    genres: ['Anime', 'Action', 'Fantasy'],
    cast: ['Natsuki Hanae', 'Akari Kitō', 'Hiro Shimono', 'Yoshitsugu Matsuoka'],
    director: 'Haruo Sotozaki',
    audioLanguage: 'Japanese (Sinhala Subbed)',
    subtitleAuthor: {
      name: 'ඇනිමේ සිංහල සබ්',
      downloadsCount: 19800,
      releaseDate: '2024-05-12'
    },
    servers: [
      { id: 's1', name: 'Server 1 (Anime HD)', url: 'https://www.youtube.com/embed/a9tq0aS5Zu8', quality: '1080p' }
    ],
    downloadLinks: [
      { id: 'dl1', quality: '1080p', size: '3.5 GB (Batch)', url: '#download-1080p', format: 'MKV' },
      { id: 'dl2', quality: '720p', size: '1.8 GB (Batch)', url: '#download-720p', format: 'MP4' },
      { id: 'dl3', quality: 'Telegram', size: 'Anime Channel Link', url: 'https://t.me/cinexus_movies', format: 'Telegram' }
    ],
    hasSinhalaSub: true,
    isDualAudio: false,
    isTrending: true,
    isFeatured: false,
    isTVSeries: true,
    viewsCount: 31000,
    downloadsCount: 16500,
    addedAt: '2024-05-20'
  }
];
