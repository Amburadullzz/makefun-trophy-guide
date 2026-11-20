// Progress state: what is earned, which filter is on, whether spoilers are
// hidden, and which guide is open. Everything that must survive a reload is
// written to localStorage; export and import move the earned set as a file.

export const STORAGE_KEY = 'leonida-ledger/v1';

const DEFAULT_STATE = {
  earned: new Set(),
  spoiler: true,
  filter: 'all',
  query: '',
  view: 'tracker',
  openId: null,
};

/** Read the saved snapshot, tolerating a missing or corrupt entry. */
function readSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return saved && typeof saved === 'object' ? saved : null;
  } catch {
    return null;
  }
}

/** Persist the durable half of the state; a full quota must not break the app. */
function writeSavedState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      earned: [...state.earned].sort((a, b) => a - b),
      spoiler: state.spoiler,
      filter: state.filter,
      view: state.view,
    }));
  } catch {
    /* storage unavailable: the session still works, it just will not persist */
  }
}

/** A one-file backup of the earned set, with a timestamp for the filename. */
export function buildExport(state, trophyCount) {
  const earned = [...state.earned].sort((a, b) => a - b);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return {
    fileName: `leonida-ledger-progress-${stamp}.json`,
    text: JSON.stringify({
      app: 'leonida-ledger',
      game: 'Grand Theft Auto VI',
      platform: 'PlayStation 5',
      exportedAt: new Date().toISOString(),
      earnedCount: earned.length,
      total: trophyCount,
      earned,
    }, null, 2),
  };
}

/** Parse an imported file: accept the export shape or a bare id array. */
export function parseImport(text) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed?.earned;
  if (!Array.isArray(list)) throw new Error('no "earned" list in this file');
  const ids = [...new Set(list.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  return ids;
}

/** Create the store and its subscriptions. */
export function createStore(validIds) {
  const saved = readSavedState();
  const state = { ...DEFAULT_STATE, earned: new Set() };

  if (saved) {
    if (Array.isArray(saved.earned)) {
      for (const id of saved.earned) {
        if (validIds.has(Number(id))) state.earned.add(Number(id));
      }
    }
    if (typeof saved.spoiler === 'boolean') state.spoiler = saved.spoiler;
    if (typeof saved.filter === 'string') state.filter = saved.filter;
    if (['tracker', 'roadmap', 'missables'].includes(saved.view)) state.view = saved.view;
  }

  const listeners = new Set();
  const notify = () => {
    writeSavedState(state);
    for (const listener of listeners) listener(state);
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    toggleEarned(id) {
      if (state.earned.has(id)) state.earned.delete(id);
      else state.earned.add(id);
      notify();
    },
    setEarned(ids) {
      state.earned = new Set(ids.filter((id) => validIds.has(id)));
      notify();
    },
    clearEarned() {
      state.earned = new Set();
      notify();
    },
    setSpoiler(hidden) {
      state.spoiler = Boolean(hidden);
      notify();
    },
    setFilter(filter) {
      state.filter = filter;
      notify();
    },
    setQuery(query) {
      state.query = query;
      notify();
    },
    setView(view) {
      state.view = view;
      notify();
    },
    openTrophy(id) {
      state.openId = id;
      notify();
    },
    isEarned: (id) => state.earned.has(id),
  };
}
