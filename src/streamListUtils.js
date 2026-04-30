export function normalizeTitle(value) {
  return value.trim();
}

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
