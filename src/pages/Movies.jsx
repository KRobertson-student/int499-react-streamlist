import { useEffect, useState } from 'react';
import {
  addRecentMovieSearch,
  buildTmdbSearchUrl,
  mapTmdbMovieResult,
  normalizeMovieSearchTerm,
} from '../streamListUtils.js';

const MOVIE_SEARCH_STORAGE_KEY = 'streamlist_movie_search';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';

const defaultMovieState = {
  query: '',
  results: [],
  selectedMovieId: null,
  recentSearches: [],
};

function getBrowserStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function isMovieResult(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id !== 'undefined' &&
    typeof value.title === 'string' &&
    typeof value.year === 'string' &&
    typeof value.overview === 'string' &&
    typeof value.posterUrl === 'string' &&
    typeof value.rating === 'string'
  );
}

function loadMovieState() {
  const storage = getBrowserStorage();

  if (!storage) {
    return defaultMovieState;
  }

  try {
    const storedState = storage.getItem(MOVIE_SEARCH_STORAGE_KEY);

    if (!storedState) {
      return defaultMovieState;
    }

    const parsedState = JSON.parse(storedState);
    const results = Array.isArray(parsedState.results)
      ? parsedState.results.filter(isMovieResult)
      : [];
    const recentSearches = Array.isArray(parsedState.recentSearches)
      ? parsedState.recentSearches.filter(
          (searchTerm) => typeof searchTerm === 'string',
        )
      : [];

    return {
      query: typeof parsedState.query === 'string' ? parsedState.query : '',
      results,
      selectedMovieId: parsedState.selectedMovieId ?? results[0]?.id ?? null,
      recentSearches: recentSearches.slice(0, 5),
    };
  } catch {
    return defaultMovieState;
  }
}

function saveMovieState(movieState) {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(MOVIE_SEARCH_STORAGE_KEY, JSON.stringify(movieState));
  } catch {
    // Browsers can block localStorage in private or restricted contexts.
  }
}

function Movies() {
  const [movieState, setMovieState] = useState(loadMovieState);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    saveMovieState(movieState);
  }, [movieState]);

  const selectedMovie =
    movieState.results.find(
      (movie) => String(movie.id) === String(movieState.selectedMovieId),
    ) ||
    movieState.results[0] ||
    null;

  const updateMovieState = (updates) => {
    setMovieState((currentState) => ({ ...currentState, ...updates }));
  };

  const searchMovies = async (searchTerm) => {
    const normalizedSearchTerm = normalizeMovieSearchTerm(searchTerm);

    if (!normalizedSearchTerm) {
      setError('Please enter a movie title to search.');
      setStatus('');
      return;
    }

    if (!TMDB_API_KEY) {
      setError('TMDB API key is not configured. Add VITE_TMDB_API_KEY to .env.');
      setStatus('');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('');

    try {
      const response = await fetch(
        buildTmdbSearchUrl(normalizedSearchTerm, TMDB_API_KEY),
      );

      if (!response.ok) {
        throw new Error('TMDB request failed.');
      }

      const data = await response.json();
      const results = Array.isArray(data.results)
        ? data.results.slice(0, 8).map(mapTmdbMovieResult)
        : [];

      setMovieState((currentState) => ({
        query: normalizedSearchTerm,
        results,
        selectedMovieId: results[0]?.id ?? null,
        recentSearches: addRecentMovieSearch(
          currentState.recentSearches,
          normalizedSearchTerm,
        ),
      }));
      setStatus(
        results.length
          ? `${results.length} TMDB results loaded for "${normalizedSearchTerm}".`
          : `No TMDB results found for "${normalizedSearchTerm}".`,
      );
    } catch {
      setError('TMDB could not be reached. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMovies(movieState.query);
  };

  const handleClearSearch = () => {
    setMovieState((currentState) => ({
      ...defaultMovieState,
      recentSearches: currentState.recentSearches,
    }));
    setError('');
    setStatus('');
  };

  return (
    <section className="movies-page">
      <article className="panel movie-search-panel">
        <p className="page-kicker">Week 3</p>
        <h2 className="page-title">Search TMDB movies</h2>
        <p className="page-copy">
          Look up movie information from TMDB, then review the saved results on
          this separate route.
        </p>

        <form className="movie-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="movie-search">
            Movie title
          </label>

          <div className="input-row">
            <input
              id="movie-search"
              className="text-input"
              type="search"
              placeholder="Example: Alien"
              value={movieState.query}
              onChange={(event) => {
                updateMovieState({ query: event.target.value });
                if (error) {
                  setError('');
                }
              }}
            />

            <button className="btn btn--primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {movieState.recentSearches.length ? (
          <div className="recent-searches" aria-label="Recent movie searches">
            {movieState.recentSearches.map((searchTerm) => (
              <button
                key={searchTerm}
                className="search-chip"
                type="button"
                onClick={() => searchMovies(searchTerm)}
                disabled={isLoading}
              >
                {searchTerm}
              </button>
            ))}
          </div>
        ) : null}

        {error ? <p className="message message--error">{error}</p> : null}
        {status ? <p className="message message--success">{status}</p> : null}
        <p className="tmdb-attribution">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </article>

      <div className="movie-layout">
        <article className="panel movie-results-panel">
          <div className="list-header">
            <div>
              <p className="page-kicker">TMDB Results</p>
              <h3 className="section-title">Movie matches</h3>
            </div>

            <button
              className="btn btn--secondary"
              type="button"
              onClick={handleClearSearch}
              disabled={!movieState.results.length && !movieState.query}
            >
              Clear
            </button>
          </div>

          {movieState.results.length ? (
            <ul className="movie-grid">
              {movieState.results.map((movie) => {
                const isSelected =
                  selectedMovie && String(selectedMovie.id) === String(movie.id);

                return (
                  <li key={movie.id}>
                    <button
                      className={
                        isSelected ? 'movie-card movie-card--active' : 'movie-card'
                      }
                      type="button"
                      onClick={() => updateMovieState({ selectedMovieId: movie.id })}
                    >
                      <span className="poster-frame">
                        {movie.posterUrl ? (
                          <img src={movie.posterUrl} alt="" loading="lazy" />
                        ) : (
                          <span
                            className="material-symbols-rounded poster-placeholder"
                            aria-hidden="true"
                          >
                            movie
                          </span>
                        )}
                      </span>

                      <span className="movie-card__body">
                        <span className="movie-card__title">{movie.title}</span>
                        <span className="movie-card__meta">
                          {movie.year} | TMDB {movie.rating}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="empty-state">Search TMDB to load movie results.</p>
          )}
        </article>

        <aside className="panel movie-detail-panel" aria-label="Selected movie">
          {selectedMovie ? (
            <>
              <p className="page-kicker">Movie Review</p>
              <h3 className="section-title">{selectedMovie.title}</h3>
              <p className="movie-detail__meta">
                {selectedMovie.year} | TMDB rating {selectedMovie.rating}
              </p>
              <p className="movie-detail__overview">{selectedMovie.overview}</p>
            </>
          ) : (
            <>
              <p className="page-kicker">Movie Review</p>
              <h3 className="section-title">No movie selected</h3>
              <p className="page-copy">
                Selected movie details will remain available after a refresh.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Movies;
