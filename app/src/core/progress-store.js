// Progress lives in localStorage under one key, as a list of trophy ids.
// Every write is synchronous, so a reload always sees the latest state; if the
// browser refuses storage (private mode, file://), the store keeps working in
// memory for the session instead of throwing.

const STORAGE_KEY = 'leonida-ledger/progress/v1';
const FORMAT_VERSION = 1;

function readStoredIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return [];
    return parsed.earned.filter((id) => Number.isInteger(id));
  } catch {
    return [];
  }
}

export function createProgressStore() {
  const earned = new Set(readStoredIds());
  const listeners = new Set();

  function persist() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: FORMAT_VERSION, earned: [...earned].sort((a, b) => a - b), updatedAt: new Date().toISOString() })
      );
    } catch {
      /* storage unavailable: keep the in-memory copy */
    }
    for (const listener of listeners) listener();
  }

  return {
    storageKey: STORAGE_KEY,
    has(id) {
      return earned.has(id);
    },
    count() {
      return earned.size;
    },
    ids() {
      return [...earned].sort((a, b) => a - b);
    },
    set(id, on) {
      if (on) earned.add(id);
      else earned.delete(id);
      persist();
    },
    toggle(id) {
      const next = !earned.has(id);
      this.set(id, next);
      return next;
    },
    replace(ids) {
      earned.clear();
      for (const id of ids) earned.add(id);
      persist();
    },
    clear() {
      earned.clear();
      persist();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
