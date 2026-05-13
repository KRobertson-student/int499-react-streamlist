import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addRecentMovieSearch,
  buildTmdbSearchUrl,
  createStreamEntry,
  filterEntries,
  hasDuplicateTitle,
  loadStreamEntries,
  mapTmdbMovieResult,
  normalizeTitle,
  saveStreamEntries,
} from './streamListUtils.js';

function createMemoryStorage(initialValues = {}) {
  const values = new Map(Object.entries(initialValues));

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

test('normalizeTitle trims extra user input spacing', () => {
  assert.equal(normalizeTitle('  Severance  '), 'Severance');
});

test('createStreamEntry creates a visible active entry', () => {
  const entry = createStreamEntry('  The Bear  ', 7);

  assert.deepEqual(entry, {
    id: 7,
    title: 'The Bear',
    isComplete: false,
  });
});

test('createStreamEntry generates unique ids for rapid entries', () => {
  const originalDateNow = Date.now;
  Date.now = () => 1000;

  try {
    const firstEntry = createStreamEntry('Severance');
    const secondEntry = createStreamEntry('The Studio');

    assert.notEqual(firstEntry.id, secondEntry.id);
  } finally {
    Date.now = originalDateNow;
  }
});

test('filterEntries returns entries for the requested status view', () => {
  const entries = [
    { id: 1, title: 'Abbott Elementary', isComplete: false },
    { id: 2, title: 'The Last of Us', isComplete: true },
  ];

  assert.deepEqual(filterEntries(entries, 'active'), [entries[0]]);
  assert.deepEqual(filterEntries(entries, 'complete'), [entries[1]]);
  assert.deepEqual(filterEntries(entries, 'all'), entries);
});

test('hasDuplicateTitle finds duplicate titles regardless of spacing or case', () => {
  const entries = [
    { id: 1, title: 'The Bear', isComplete: false },
    { id: 2, title: 'Severance', isComplete: false },
  ];

  assert.equal(hasDuplicateTitle(entries, '  the bear  '), true);
  assert.equal(hasDuplicateTitle(entries, 'Abbott Elementary'), false);
});

test('hasDuplicateTitle ignores the entry currently being edited', () => {
  const entries = [
    { id: 1, title: 'The Bear', isComplete: false },
    { id: 2, title: 'Severance', isComplete: false },
  ];

  assert.equal(hasDuplicateTitle(entries, 'the bear', 1), false);
  assert.equal(hasDuplicateTitle(entries, 'the bear', 2), true);
});

test('loadStreamEntries restores valid entries from localStorage', () => {
  const savedEntries = [
    { id: 'saved-1', title: 'Severance', isComplete: false },
    { id: 'saved-2', title: 'The Bear', isComplete: true },
  ];
  const storage = createMemoryStorage({
    streamlist_entries: JSON.stringify(savedEntries),
  });

  assert.deepEqual(loadStreamEntries(storage, []), savedEntries);
});

test('loadStreamEntries falls back when localStorage data is invalid', () => {
  const fallbackEntries = [
    { id: 'fallback-1', title: 'Abbott Elementary', isComplete: false },
  ];
  const storage = createMemoryStorage({
    streamlist_entries: JSON.stringify([{ id: '', title: '', isComplete: 'no' }]),
  });

  assert.deepEqual(loadStreamEntries(storage, fallbackEntries), fallbackEntries);
});

test('saveStreamEntries stores entries as JSON for refresh persistence', () => {
  const storage = createMemoryStorage();
  const entries = [{ id: 'entry-1', title: 'The Studio', isComplete: false }];

  saveStreamEntries(storage, entries);

  assert.equal(storage.getItem('streamlist_entries'), JSON.stringify(entries));
});

test('buildTmdbSearchUrl encodes the search term and API key', () => {
  const url = buildTmdbSearchUrl('Alien: Romulus', 'abc 123');

  assert.equal(
    url,
    'https://api.themoviedb.org/3/search/movie?api_key=abc+123&query=Alien%3A+Romulus&include_adult=false&language=en-US&page=1',
  );
});

test('mapTmdbMovieResult keeps the movie fields the UI displays', () => {
  const movie = mapTmdbMovieResult({
    id: 945961,
    title: 'Alien: Romulus',
    release_date: '2024-08-13',
    overview: 'A group of young space colonizers...',
    poster_path: '/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    vote_average: 7.2,
  });

  assert.deepEqual(movie, {
    id: 945961,
    title: 'Alien: Romulus',
    year: '2024',
    overview: 'A group of young space colonizers...',
    posterUrl: 'https://image.tmdb.org/t/p/w342/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    rating: '7.2',
  });
});

test('mapTmdbMovieResult handles missing optional movie fields', () => {
  const movie = mapTmdbMovieResult({
    id: 1,
    title: '',
    name: 'Untitled Result',
    overview: '',
  });

  assert.deepEqual(movie, {
    id: 1,
    title: 'Untitled Result',
    year: 'Release year unavailable',
    overview: 'No overview is available from TMDB yet.',
    posterUrl: '',
    rating: 'NR',
  });
});

test('addRecentMovieSearch deduplicates and limits saved search terms', () => {
  const searches = addRecentMovieSearch(
    ['Alien', 'Severance', 'The Bear', 'Dune', 'Sinners'],
    '  dune  ',
  );

  assert.deepEqual(searches, ['dune', 'Alien', 'Severance', 'The Bear', 'Sinners']);
});
