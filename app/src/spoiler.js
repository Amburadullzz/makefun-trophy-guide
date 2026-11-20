// The spoiler setting. With it on, a story trophy keeps its name and
// description hidden until it is earned — in the list, the guide and search
// results alike. Guides for other kinds are never hidden.

/** True when this trophy's name and description must stay hidden. */
export function isHidden(trophy, state) {
  if (!state.spoiler) return false;
  if (state.earned.has(trophy.id)) return false;
  return trophy.kind === 'story' || trophy.kind === 'platinum';
}

/** The name to show: the official one, or a placeholder that still says where. */
export function displayName(trophy, state) {
  if (!isHidden(trophy, state)) return trophy.name;
  return trophy.kind === 'platinum' ? 'Platinum trophy — hidden' : 'Hidden story trophy';
}

/** The description to show, blanked while hidden. */
export function displayDescription(trophy, state) {
  if (!isHidden(trophy, state)) return trophy.description;
  return trophy.window ? `Hidden until earned · ${trophy.window}` : 'Hidden until earned.';
}

/** A local, unpersisted reveal for one trophy, used by the guide's peek button. */
const peeked = new Set();

export function peek(id) {
  peeked.add(id);
}

export function isPeeked(id) {
  return peeked.has(id);
}
