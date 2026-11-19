// Progress that survives a reload: the earned set and the per-trophy counters live in localStorage,
// and the same state is what the export file carries: one store, one key, one place to look.

const STORAGE_KEY = 'platinum-coast:progress/v1';
const FILE_APP = 'platinum-coast';
const FILE_VERSION = 1;

function emptyState() {
  return { earned: [], counters: {}, spoiler: false, updatedAt: new Date().toISOString() };
}

/** Accepts anything that was in storage or a file, and returns the shape the app expects. */
function normalize(raw) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  const earned = Array.isArray(raw) ? raw : raw.earned;
  if (Array.isArray(earned)) {
    state.earned = [...new Set(earned.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
  }
  if (raw.counters && typeof raw.counters === 'object') {
    for (const [id, value] of Object.entries(raw.counters)) {
      const count = Math.max(0, Math.floor(Number(value)));
      if (Number.isInteger(Number(id)) && Number.isFinite(count) && count > 0) state.counters[id] = count;
    }
  }
  if (typeof raw.spoiler === 'boolean') state.spoiler = raw.spoiler;
  return state;
}

export function createProgressStore(knownIds) {
  let state = readFromStorage();

  function readFromStorage() {
    try {
      return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
    } catch {
      return emptyState();
    }
  }

  function commit() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* A browser that refuses storage still works for this session; the file export is the fallback. */
    }
  }

  return {
    earnedIds() {
      return [...state.earned].sort((a, b) => a - b);
    },

    earnedCount() {
      return state.earned.length;
    },

    isEarned(id) {
      return state.earned.includes(id);
    },

    setEarned(id, earned) {
      const has = state.earned.includes(id);
      if (earned && !has) state.earned.push(id);
      if (!earned && has) state.earned = state.earned.filter((other) => other !== id);
      commit();
    },

    counterFor(id) {
      return state.counters[id] ?? 0;
    },

    setCounter(id, value) {
      const count = Math.max(0, Math.floor(Number(value) || 0));
      if (count === 0) delete state.counters[id];
      else state.counters[id] = count;
      commit();
    },

    spoilerOn() {
      return state.spoiler;
    },

    setSpoiler(on) {
      state.spoiler = Boolean(on);
      commit();
    },

    /** The text the Export button puts in the modal and in the downloaded file. */
    exportText() {
      const file = {
        app: FILE_APP,
        version: FILE_VERSION,
        exportedAt: new Date().toISOString(),
        earned: this.earnedIds(),
        counters: state.counters,
      };
      return JSON.stringify(file, null, 2);
    },

    /** Reads an exported file back. Returns how many trophies it restored, or an error to show. */
    importText(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { ok: false, error: 'That is not valid JSON. Paste the file the app exported.' };
      }
      const earned = Array.isArray(parsed) ? parsed : parsed?.earned;
      if (!Array.isArray(earned)) {
        return { ok: false, error: 'No "earned" list in that file. Use a file this app exported.' };
      }
      const next = normalize(parsed);
      const unknown = next.earned.filter((id) => !knownIds.has(id));
      next.earned = next.earned.filter((id) => knownIds.has(id));
      state = { ...next, updatedAt: new Date().toISOString() };
      commit();
      return {
        ok: true,
        count: next.earned.length,
        ignored: unknown.length,
      };
    },

    reset() {
      state = emptyState();
      commit();
    },
  };
}
