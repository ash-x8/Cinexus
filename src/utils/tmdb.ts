export const TMDB_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY ||
  import.meta.env.NEXT_PUBLIC_TMDB_API_KEY ||
  'abdcc6777a98f6195e7adc6b7d50ed8b';

export const TMDB_READ_ACCESS_TOKEN =
  import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ||
  import.meta.env.TMDB_READ_ACCESS_TOKEN ||
  'EyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYmRjYzY3NzdhOThmNjE5NWU3YWRjNmI3ZDUwZWQ4YiIsIm5iZiI6MTc4Njg1ODgxMy4wNTUsInN1YiI6IjZhODE0ZDNkOTI4MTYxNTM3NjJiMTIyNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bnuVpWeDRRerLPOyGYF8BTV5helM2u1SR9C_WTHQbg0';

export interface TMDBMovieDetail {
  title: string;
  originalTitle?: string;
  releaseYear: number;
  imdbRating: number;
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  englishPlot: string;
  sinhalaPlot: string;
  director: string;
  cast: string[];
  crew: string[];
  duration: string;
  language: string;
}

export async function fetchTMDBMetadata(query: string): Promise<TMDBMovieDetail | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    let movieId: number | string | null = null;

    // Check if query is numeric ID or IMDb ID (tt...)
    if (/^\d+$/.test(trimmed)) {
      movieId = trimmed;
    } else if (/^tt\d+$/i.test(trimmed)) {
      // Find by IMDb ID
      const findRes = await fetch(
        `https://api.themoviedb.org/3/find/${trimmed}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
      );
      const findData = await findRes.json();
      if (findData.movie_results && findData.movie_results.length > 0) {
        movieId = findData.movie_results[0].id;
      } else if (findData.tv_results && findData.tv_results.length > 0) {
        movieId = findData.tv_results[0].id;
      }
    }

    if (!movieId) {
      // Search by movie name
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(trimmed)}`
      );
      const searchData = await searchRes.json();
      if (searchData.results && searchData.results.length > 0) {
        movieId = searchData.results[0].id;
      }
    }

    if (!movieId) {
      return null;
    }

    // Fetch full details + credits
    const [detailRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`)
    ]);

    if (!detailRes.ok) return null;

    const detail = await detailRes.json();
    const credits = creditsRes.ok ? await creditsRes.json() : { cast: [], crew: [] };

    // Extract Directors & Crew
    const directors = credits.crew
      ? credits.crew
          .filter((c: any) => c.job === 'Director')
          .map((c: any) => c.name)
      : [];
    const directorName = directors.length > 0 ? directors.join(', ') : 'Unknown Director';

    // Extract Lead Cast (Top 6)
    const castNames = credits.cast
      ? credits.cast.slice(0, 6).map((c: any) => c.name)
      : [];

    // Extract Crew (Top 4 producers/writers)
    const crewNames = credits.crew
      ? credits.crew
          .filter((c: any) => ['Producer', 'Writer', 'Executive Producer', 'Screenplay'].includes(c.job))
          .slice(0, 4)
          .map((c: any) => `${c.name} (${c.job})`)
      : [];

    const releaseYear = detail.release_date
      ? parseInt(detail.release_date.split('-')[0], 10)
      : new Date().getFullYear();

    const genres = detail.genres ? detail.genres.map((g: any) => g.name) : ['Action'];

    const posterUrl = detail.poster_path
      ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
      : '';

    const backdropUrl = detail.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`
      : '';

    const runtimeMinutes = detail.runtime || 120;
    const hours = Math.floor(runtimeMinutes / 60);
    const mins = runtimeMinutes % 60;
    const durationStr = `${hours}h ${mins}m`;

    const primaryLangCode = detail.original_language || 'en';
    const langNames: Record<string, string> = {
      en: 'English',
      ta: 'Tamil',
      te: 'Telugu',
      hi: 'Hindi',
      ml: 'Malayalam',
      kn: 'Kannada',
      si: 'Sinhala',
      ja: 'Japanese',
      zh: 'Chinese',
      ko: 'Korean'
    };
    const languageStr = langNames[primaryLangCode] || 'English';

    return {
      title: detail.title || detail.original_title || trimmed,
      originalTitle: detail.original_title,
      releaseYear,
      imdbRating: detail.vote_average ? parseFloat(detail.vote_average.toFixed(1)) : 8.0,
      genres,
      posterUrl,
      backdropUrl,
      englishPlot: detail.overview || 'No plot summary available.',
      sinhalaPlot: `${detail.title || trimmed} චිත්‍රපටය සඳහා සිංහල උපසිරැසි සමඟින් උසස්ම HD ගුණාත්මක භාවයෙන් CINEXUS වෙතින් නොමිලේම නරඹන්න සහ බාගත කරගන්න.`,
      director: directorName,
      cast: castNames.length > 0 ? castNames : ['Lead Cast'],
      crew: crewNames,
      duration: durationStr,
      language: languageStr
    };
  } catch (err) {
    console.error('TMDB Auto-Fetch Error:', err);
    return null;
  }
}
