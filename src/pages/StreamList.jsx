import { useEffect, useState } from 'react';
import {
  createStreamEntry,
  filterEntries,
  hasDuplicateTitle,
  loadStreamEntries,
  normalizeTitle,
  saveStreamEntries,
} from '../streamListUtils.js';

const initialEntries = [
  createStreamEntry('Stranger Things', 1),
  { ...createStreamEntry('The Bear', 2), isComplete: true },
  createStreamEntry('Abbott Elementary', 3),
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'complete', label: 'Complete' },
];

const icons = {
  check: 'check',
  edit: 'edit',
  trash: 'delete',
  x: 'close',
};

const FILTER_STORAGE_KEY = 'streamlist_filter';
const TITLE_DRAFT_STORAGE_KEY = 'streamlist_title_draft';

function getBrowserStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function loadStoredString(key, fallbackValue) {
  const storage = getBrowserStorage();

  if (!storage) {
    return fallbackValue;
  }

  try {
    return storage.getItem(key) || fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function saveStoredString(key, value) {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value);
  } catch {
    // Browsers can block localStorage in private or restricted contexts.
  }
}

function loadStoredFilter() {
  const savedFilter = loadStoredString(FILTER_STORAGE_KEY, 'all');

  return filterOptions.some((option) => option.value === savedFilter)
    ? savedFilter
    : 'all';
}

function IconButton({ label, icon, variant = 'neutral', ...props }) {
  return (
    <button
      className={`icon-btn icon-btn--${variant}`}
      type="button"
      aria-label={label}
      title={label}
      {...props}
    >
      <span className="material-symbols-rounded" aria-hidden="true">
        {icons[icon]}
      </span>
    </button>
  );
}

function StreamList() {
  const [title, setTitle] = useState(() =>
    loadStoredString(TITLE_DRAFT_STORAGE_KEY, ''),
  );
  const [entries, setEntries] = useState(() =>
    loadStreamEntries(getBrowserStorage(), initialEntries),
  );
  const [filter, setFilter] = useState(loadStoredFilter);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    saveStreamEntries(getBrowserStorage(), entries);
  }, [entries]);

  useEffect(() => {
    saveStoredString(FILTER_STORAGE_KEY, filter);
  }, [filter]);

  useEffect(() => {
    saveStoredString(TITLE_DRAFT_STORAGE_KEY, title);
  }, [title]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = normalizeTitle(title);

    if (!trimmedTitle) {
      setError('Please enter a movie or TV show title.');
      setStatus('');
      return;
    }

    if (hasDuplicateTitle(entries, trimmedTitle)) {
      console.warn('[StreamList] Duplicate entry blocked:', trimmedTitle);
      setError(`"${trimmedTitle}" is already in your StreamList.`);
      setStatus('');
      return;
    }

    const entry = createStreamEntry(trimmedTitle);

    console.log('[StreamList] New user entry:', trimmedTitle);

    setEntries((currentEntries) => [entry, ...currentEntries]);
    setStatus(`"${trimmedTitle}" was added to your StreamList.`);
    setTitle('');
    setError('');
  };

  const visibleEntries = filterEntries(entries, filter);
  const completeCount = entries.filter((entry) => entry.isComplete).length;
  const activeCount = entries.length - completeCount;

  const handleToggleComplete = (id) => {
    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === id ? { ...entry, isComplete: !entry.isComplete } : entry,
      ),
    );
    setStatus('');
  };

  const handleDelete = (id) => {
    const entryToDelete = entries.find((entry) => entry.id === id);

    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== id),
    );

    console.log(
      '[StreamList] Deleted entry:',
      entryToDelete ? entryToDelete.title : id,
    );

    setStatus(
      entryToDelete ? `"${entryToDelete.title}" was removed from your list.` : '',
    );
    setError('');
  };

  const startEditing = (entry) => {
    setEditingId(entry.id);
    setEditingTitle(entry.title);
    setError('');
    setStatus('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
    setError('');
  };

  const saveEdit = (id) => {
    const updatedTitle = normalizeTitle(editingTitle);

    if (!updatedTitle) {
      setError('Edited titles cannot be blank.');
      return;
    }

    if (hasDuplicateTitle(entries, updatedTitle, id)) {
      console.warn('[StreamList] Duplicate edit blocked:', updatedTitle);
      setError(`"${updatedTitle}" is already in your StreamList.`);
      setStatus('');
      return;
    }

    console.log('[StreamList] Updated entry:', updatedTitle);

    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === id ? { ...entry, title: updatedTitle } : entry,
      ),
    );

    setEditingId(null);
    setEditingTitle('');
    setStatus(`"${updatedTitle}" was updated.`);
    setError('');
  };

  return (
    <section className="streamlist-page">
      <article className="panel">
        <p className="page-kicker">Week 2</p>
        <h2 className="page-title">Build your StreamList</h2>
        <p className="page-copy">
          Add movies and shows, then edit, remove, or complete each title as your
          watch plan changes. Your saved titles stay available after a refresh.
        </p>

        <form className="stream-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="stream-title">
            Movie or TV show title
          </label>

          <div className="input-row">
            <input
              id="stream-title"
              className="text-input"
              type="text"
              placeholder="Example: Stranger Things"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) {
                  setError('');
                }
              }}
            />

            <button className="btn btn--primary" type="submit">
              Submit
            </button>
          </div>
        </form>

        <p className="helper-text">
          {entries.length} saved titles. {activeCount} active. {completeCount}{' '}
          complete.
        </p>

        {error ? <p className="message message--error">{error}</p> : null}
        {status ? <p className="message message--success">{status}</p> : null}
      </article>

      <article className="panel list-panel">
        <div className="list-header">
          <div>
            <p className="page-kicker">Visibility</p>
            <h3 className="section-title">StreamList entries</h3>
          </div>

          <div className="filter-tabs" aria-label="Filter StreamList entries">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={
                  filter === option.value
                    ? 'filter-tab filter-tab--active'
                    : 'filter-tab'
                }
                type="button"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {visibleEntries.length ? (
          <ul className="entry-list">
            {visibleEntries.map((entry) => {
              const isEditing = editingId === entry.id;

              return (
                <li
                  className={
                    entry.isComplete
                      ? 'entry-row entry-row--complete'
                      : 'entry-row'
                  }
                  key={entry.id}
                >
                  {isEditing ? (
                    <form
                      className="edit-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveEdit(entry.id);
                      }}
                    >
                      <input
                        className="text-input"
                        type="text"
                        aria-label={`Edit ${entry.title}`}
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                      />
                      <button className="btn btn--primary" type="submit">
                        Save
                      </button>
                      <IconButton
                        label="Cancel edit"
                        icon="x"
                        onClick={cancelEditing}
                      />
                    </form>
                  ) : (
                    <>
                      <button
                        className="entry-status"
                        type="button"
                        aria-label={
                          entry.isComplete
                            ? `Mark ${entry.title} active`
                            : `Mark ${entry.title} complete`
                        }
                        title={
                          entry.isComplete ? 'Mark active' : 'Mark complete'
                        }
                        onClick={() => handleToggleComplete(entry.id)}
                      >
                        <span
                          className="material-symbols-rounded"
                          aria-hidden="true"
                        >
                          {entry.isComplete
                            ? icons.check
                            : 'radio_button_unchecked'}
                        </span>
                      </button>

                      <span className="entry-title">{entry.title}</span>

                      <div className="entry-actions">
                        <IconButton
                          label={`Edit ${entry.title}`}
                          icon="edit"
                          onClick={() => startEditing(entry)}
                        />
                        <IconButton
                          label={`Delete ${entry.title}`}
                          icon="trash"
                          variant="danger"
                          onClick={() => handleDelete(entry.id)}
                        />
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="empty-state">No titles match this view.</p>
        )}
      </article>
    </section>
  );
}

export default StreamList;
