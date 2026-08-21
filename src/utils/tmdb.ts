export const TMDB_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_TMDB_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.TMDB_API_KEY) ||
  '';

export const TMDB_READ_ACCESS_TOKEN =
  (typeof import.meta !== 'undefined' && import.meta.env?.TMDB_READ_ACCESS_TOKEN) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TMDB_READ_ACCESS_TOKEN) ||
  '';

export interface TMCastMember {
  tmdb_id?: number | string;
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
  isTVSeries?: boolean;
  seasons?: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      seasonNumber: number;
      title: string;
      overview?: string;
    }[];
  }[];
  episodes?: {
    id: string;
    episodeNumber: number;
    seasonNumber: number;
    title: string;
    streamServer1Url?: string;
    streamServer2Url?: string;
    streamServer3Url?: string;
    downloadUrl?: string;
  }[];
}

export const DEFAULT_ACTOR_PLACEHOLDER = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

async function tmdbFetch(url: string): Promise<Response> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  if (TMDB_READ_ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${TMDB_READ_ACCESS_TOKEN}`;
  }
  return fetch(url, { headers });
}

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
      const findRes = await tmdbFetch(
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
      const searchRes = await tmdbFetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(trimmed)}`
      );
      const searchData = await searchRes.json();
      if (searchData.results && searchData.results.length > 0) {
        mediaId = searchData.results[0].id;
        mediaType = 'movie';
      } else {
        // Search TV as fallback
        const tvSearchRes = await tmdbFetch(
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

    // Call details endpoint and credits endpoint `/movie/{id}/credits` or `/tv/{id}/credits`
    const [detailRes, creditsRes] = await Promise.all([
      tmdbFetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}?api_key=${TMDB_API_KEY}`),
      tmdbFetch(`https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?api_key=${TMDB_API_KEY}`)
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

    // Map fields for every cast member
    const castMembers: TMCastMember[] = credits.cast
      ? credits.cast.slice(0, 16).map((c: any) => {
          const actorName = c.name || c.original_name || 'Unknown Actor';
          const characterName = c.character || 'Cast Member';
          const image = c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null;

          return {
            tmdb_id: c.id,
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

    const releaseYear = (detail.release_date || detail.first_air_date)
      ? parseInt((detail.release_date || detail.first_air_date).split('-')[0], 10)
      : new Date().getFullYear();

    const isTV = mediaType === 'tv';
    let fetchedSeasons: any[] = [];
    let fetchedEpisodes: any[] = [];

    if (isTV && detail.seasons && detail.seasons.length > 0) {
      // Fetch episode details for each season
      const seasonPromises = detail.seasons
        .filter((s: any) => s.season_number > 0)
        .map(async (s: any) => {
          try {
            const seasonRes = await tmdbFetch(
              `https://api.themoviedb.org/3/tv/${mediaId}/season/${s.season_number}?api_key=${TMDB_API_KEY}`
            );
            if (seasonRes.ok) {
              const seasonData = await seasonRes.json();
              return seasonData;
            }
          } catch (e) {
            console.error('Season fetch error', e);
          }
          return null;
        });

      const seasonResults = await Promise.all(seasonPromises);
      seasonResults.forEach((sData: any) => {
        if (!sData) return;
        const eps = (sData.episodes || []).map((ep: any) => ({
          episodeNumber: ep.episode_number,
          seasonNumber: sData.season_number,
          title: ep.name || `Episode ${ep.episode_number}`,
          overview: ep.overview || ''
        }));
        fetchedSeasons.push({
          seasonNumber: sData.season_number,
          episodes: eps
        });

        eps.forEach((ep: any) => {
          fetchedEpisodes.push({
            id: `ep_s${sData.season_number}_e${ep.episodeNumber}`,
            episodeNumber: ep.episodeNumber,
            seasonNumber: sData.season_number,
            title: ep.title,
            streamServer1Url: '',
            streamServer2Url: '',
            streamServer3Url: '',
            downloadUrl: ''
          });
        });
      });
    }

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
      title: detail.title || detail.name || detail.original_title || detail.original_name || trimmed,
      originalTitle: detail.original_title || detail.original_name,
      releaseYear,
      imdbRating: detail.vote_average ? parseFloat(detail.vote_average.toFixed(1)) : 8.0,
      genres,
      posterUrl,
      backdropUrl,
      englishPlot: detail.overview || 'No plot summary available.',
      sinhalaPlot: `${detail.title || detail.name || trimmed} සඳහා සිංහල උපසිරැසි සමඟින් උසස්ම HD ගුණාත්මක භාවයෙන් CINEXUS වෙතින් නොමිලේම නරඹන්න සහ බාගත කරගන්න.`,
      director: directorName,
      cast: castMembers,
      crew: crewNames,
      duration: isTV ? `${detail.number_of_seasons || 1} Season(s)` : durationStr,
      language: languageStr,
      isTVSeries: isTV,
      seasons: fetchedSeasons,
      episodes: fetchedEpisodes
    };
  } catch (err) {
    console.error('TMDB Auto-Fetch Error:', err);
    return null;
  }
}
