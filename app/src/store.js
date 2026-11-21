// Progress and preferences, kept in localStorage.
// One job — hold the earned set and the view settings, and tell the views when
// either changes. Nothing here touches the DOM.

export const PROGRESS_KEY = 'leonida-legend/progress/v1';
export const SETTINGS_KEY = 'leonida-legend/settings/v1';
export const SNAPSHOT_FORMAT = 'leonida-legend/progress';

const DEFAULT_SETTINGS = {
  spoilerShield: true,
  filter: 'all',
  query: '',
  hideEarned: false,
  view: 'tracker'
};

export class ProgressStore {
  constructor(storage) {
    this.storage = storage || safeStorage();
    this.earned = new Set(readEarned(this.storage));
    this.settings = { ...DEFAULT_SETTINGS, ...readSettings(this.storage) };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(reason) {
    for (const listener of this.listeners) listener(reason, this);
  }

  isEarned(id) {
    return this.earned.has(id);
  }

  count() {
    return this.earned.size;
  }

  toggle(id) {
    if (this.earned.has(id)) this.earned.delete(id);
    else this.earned.add(id);
    this.saveProgress();
    this.notify('progress');
    return this.earned.has(id);
  }

  setEarned(id, value) {
    if (value) this.earned.add(id);
    else this.earned.delete(id);
    this.saveProgress();
    this.notify('progress');
  }

  clearProgress() {
    this.earned.clear();
    this.saveProgress();
    this.notify('progress');
  }

  setSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.notify('settings');
  }

  saveProgress() {
    writeJson(this.storage, PROGRESS_KEY, { earned: [...this.earned].sort(), savedAt: new Date().toISOString() });
  }

  saveSettings() {
    writeJson(this.storage, SETTINGS_KEY, this.settings);
  }

  // A plain object for export and for the tests: the earned ids in catalogue
  // order when a catalogue is given, alphabetical otherwise.
  snapshot(idsInOrder) {
    const ids = idsInOrder ? idsInOrder.filter((id) => this.earned.has(id)) : [...this.earned].sort();
    return {
      format: SNAPSHOT_FORMAT,
      version: 1,
      game: 'Grand Theft Auto VI',
      platform: 'PlayStation 5',
      exportedAt: new Date().toISOString(),
      count: ids.length,
      earned: ids
    };
  }

  // Replace the earned set with a snapshot's ids. `known` drops ids this
  // build of the guide does not carry, so an old file cannot invent trophies.
  applySnapshot(payload, known) {
    if (!payload || !Array.isArray(payload.earned)) throw new Error('no earned list in that file');
    const ids = payload.earned.filter((id) => typeof id === 'string');
    const usable = known ? ids.filter((id) => known.has(id)) : ids;
    this.earned = new Set(usable);
    this.saveProgress();
    this.notify('progress');
    return { applied: usable.length, skipped: ids.length - usable.length };
  }
}

function readEarned(storage) {
  const raw = readJson(storage, PROGRESS_KEY);
  if (!raw || !Array.isArray(raw.earned)) return [];
  return raw.earned.filter((id) => typeof id === 'string');
}

function readSettings(storage) {
  const raw = readJson(storage, SETTINGS_KEY);
  return raw && typeof raw === 'object' ? raw : {};
}

function readJson(storage, key) {
  try {
    const text = storage.getItem(key);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // A full or blocked store must not stop the guide from working: the
    // session keeps its state in memory and the export button still writes a file.
  }
}

function safeStorage() {
  try {
    const probe = '__leonida_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    const memory = new Map();
    return {
      getItem: (key) => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: (key) => memory.delete(key)
    };
  }
}
