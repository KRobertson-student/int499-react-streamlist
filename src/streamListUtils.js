export function normalizeTitle(value) {
  return value.trim();
}

export const STREAMLIST_STORAGE_KEY = 'streamlist_entries';

function createEntryId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createStreamEntry(value, id = createEntryId()) {
  return {
    id,
    title: normalizeTitle(value),
    isComplete: false,
  };
}

export function filterEntries(entries, filter) {
  if (filter === 'active') {
    return entries.filter((entry) => !entry.isComplete);
  }

  if (filter === 'complete') {
    return entries.filter((entry) => entry.isComplete);
  }

  return entries;
}

export function hasDuplicateTitle(entries, title, ignoredId = null) {
  const normalizedTitle = normalizeTitle(title).toLowerCase();

  return entries.some(
    (entry) =>
      entry.id !== ignoredId &&
      normalizeTitle(entry.title).toLowerCase() === normalizedTitle,
  );
}

function isStreamEntry(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id !== 'undefined' &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    typeof value.isComplete === 'boolean'
  );
}

export function loadStreamEntries(storage, fallbackEntries) {
  if (!storage) {
    return fallbackEntries;
  }

  try {
    const storedEntries = storage.getItem(STREAMLIST_STORAGE_KEY);

    if (!storedEntries) {
      return fallbackEntries;
    }

    const parsedEntries = JSON.parse(storedEntries);

    if (!Array.isArray(parsedEntries) || !parsedEntries.every(isStreamEntry)) {
      return fallbackEntries;
    }

    return parsedEntries.map((entry) => ({
      id: entry.id,
      title: normalizeTitle(entry.title),
      isComplete: entry.isComplete,
    }));
  } catch {
    return fallbackEntries;
  }
}

export function saveStreamEntries(storage, entries) {
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(STREAMLIST_STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function normalizeMovieSearchTerm(value) {
  return value.trim();
}

export function buildTmdbSearchUrl(searchTerm, apiKey) {
  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('query', normalizeMovieSearchTerm(searchTerm));
  params.set('include_adult', 'false');
  params.set('language', 'en-US');
  params.set('page', '1');

  return `https://api.themoviedb.org/3/search/movie?${params.toString()}`;
}

export function mapTmdbMovieResult(movie) {
  const title = normalizeTitle(movie.title || movie.name || 'Untitled movie');
  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Release year unavailable';
  const overview =
    normalizeTitle(movie.overview || '') || 'No overview is available from TMDB yet.';
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '';
  const rating =
    typeof movie.vote_average === 'number' && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : 'NR';

  return {
    id: movie.id,
    title,
    year,
    overview,
    posterUrl,
    rating,
  };
}

export function addRecentMovieSearch(recentSearches, searchTerm, limit = 5) {
  const normalizedSearchTerm = normalizeMovieSearchTerm(searchTerm);

  if (!normalizedSearchTerm) {
    return recentSearches.slice(0, limit);
  }

  const dedupedSearches = recentSearches.filter(
    (savedSearch) =>
      savedSearch.toLowerCase() !== normalizedSearchTerm.toLowerCase(),
  );

  return [normalizedSearchTerm, ...dedupedSearches].slice(0, limit);
}
