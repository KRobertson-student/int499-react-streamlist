import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createStreamEntry,
  filterEntries,
  normalizeTitle,
} from './streamListUtils.js';

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
