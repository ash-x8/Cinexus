export const TMDB_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY ||
  import.meta.env.NEXT_PUBLIC_TMDB_API_KEY ||
  'abdcc6777a98f6195e7adc6b7d50ed8b';

export const TMDB_READ_ACCESS_TOKEN =
  import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN ||
  import.meta.env.TMDB_READ_ACCESS_TOKEN ||
  'EyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYmRjYzY3NzdhOThmNjE5NWU3YWRjNmI3ZDUwZWQ4YiIsIm5iZiI6MTc4Njg1ODgxMy4wNTUsInN1YiI6IjZhODE0ZDNkOTI4MTYxNTM3JiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bnuVpWeDRRerLPOyGYF8BTV5helM2u1SR9C_WTHQbg0';

export interface TMCastMember {
  name: string;
  character: string;
  profileUrl?: string;
  image: string | null;
}

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
  cast: TMCastMember[];
  crew: string[];
  duration: string;
  language: string;
}

export const DEFAULT_ACTOR_PLACEHOLDER = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

export async function fetchTMDBMetadata(query: string): Promise<TMDBMovieDetail | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    let mediaType: 'movie' | 'tv' = 'movie';
    let mediaId: number | string | null = null;

    // Check if query is numeric ID or IMDb ID (tt...)
    if (/^\d+$/.test(trimmed)) {
      mediaId = trimmed;
    } else if (/^tt\d+$/i.test(trimmed)) {
      // Find by IMDb ID
      const findRes = await fetch(
        `https://api.themoviedb.org/3/find/${trimmed}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
      );
      const findData = await findRes.json();
      if (findData.movie_results && findData.movie_results.length > 0) {
        mediaId = findData.movie_results[0].id;
        mediaType = 'movie';
      } else if (findData.tv_results && findData.tv_results.length > 0) {
        mediaId = findData.tv_results[0].id;
        mediaType = 'tv';
      }
    }

    if (!mediaId) {
      // Search by movie name
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(trimmed)}`
      );
      const searchData = await searchRes.json();
      if (searchData.results && searchData.results.length > 0) {
        mediaId = searchData.results[0].id;
        mediaType = 'movie';
      } else {
        // Search TV as fallback
        const tvSearchRes = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(trimmed)}`
        );
        const tvSearchData = await tvSearchRes.json();
        if (tvSearchData.results && tvSearchData.results.length > 0) {
          mediaId = tvSearchData.results[0].id;
          mediaType = 'tv';
        }
      }
    }

    if (!mediaId) {
      return null;
    }

    // Step 1: Endpoint Integration
    // Query details and credits endpoint
    const [detailRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${TMDB_API_KEY}`),
      fetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${TMDB_API_KEY}`)
    ]);

    if (!detailRes.ok) return null;

    const detail = await detailRes.json();
    const credits = creditsRes.ok ? await creditsRes.json() : { cast: [], crew: [] };

    // Extract Directors & Crew
    const directors = credits.crew
      ? credits.crew
          .filter((c: any) => c.job === 'Director' || c.job === 'Creator' || c.job === 'Executive Producer')
          .slice(0, 3)
          .map((c: any) => c.name)
      : [];
    const directorName = directors.length > 0 ? directors.join(', ') : 'Unknown Director';

    // Step 2: Data Mapping Logic
    // Iterate through the `cast` array from the API response and map fields for EVERY cast member:
    // - Actor Name: Map from original_name (fallback name)
    // - Character Name: Map from character
    // - Actor Photo: If profile_path exists: https://image.tmdb.org/t/p/w200/[profile_path], else default placeholder URL
    const castMembers: TMCastMember[] = credits.cast
      ? credits.cast.slice(0, 12).map((c: any) => {
          const actorName = c.name || c.original_name || 'Unknown Actor';
          const characterName = c.character || 'Cast Member';
          const image = c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null;

          return {
            name: actorName,
            character: characterName,
            image,
            profileUrl: image || undefined
          };
        })
      : [];

    // Extract Crew
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
      cast: castMembers,
      crew: crewNames,
      duration: durationStr,
      language: languageStr
    };
  } catch (err) {
    console.error('TMDB Auto-Fetch Error:', err);
    return null;
  }
}
