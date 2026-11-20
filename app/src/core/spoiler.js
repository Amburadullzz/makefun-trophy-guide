// Whether a trophy's name and description may be shown right now. A story
// trophy is masked while the spoiler setting is on, until it is earned or the
// reader asks to peek at that one entry.

export const MASKED_NAME = 'Hidden story trophy';
export const MASKED_DESCRIPTION = 'Earn it to read the name and description.';

export function isMasked(trophy, state) {
  if (!state.settings.spoilerSafe) return false;
  if (!trophy.spoiler) return false;
  if (state.store.has(trophy.id)) return false;
  return !state.peeked.has(trophy.id);
}

export function displayName(trophy, state) {
  return isMasked(trophy, state) ? MASKED_NAME : trophy.name;
}

export function displayDescription(trophy, state) {
  return isMasked(trophy, state) ? MASKED_DESCRIPTION : trophy.description;
}
