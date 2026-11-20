// The one user setting: whether story trophies are masked until earned.
// It is persisted next to the progress so the app reopens the way you left it.

const SETTINGS_KEY = 'leonida-ledger/settings/v1';

export function createSettingsStore() {
  let state = { spoilerSafe: false };

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.spoilerSafe === 'boolean') state.spoilerSafe = parsed.spoilerSafe;
    }
  } catch {
    /* defaults are fine */
  }

  return {
    get spoilerSafe() {
      return state.spoilerSafe;
    },
    setSpoilerSafe(on) {
      state = { ...state, spoilerSafe: Boolean(on) };
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    },
  };
}
