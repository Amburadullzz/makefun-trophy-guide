// Filtering and search. A trophy matches a kind filter by its `kind`, and the
// missable filter by being flagged missable or carrying no confirmed method.

export const FILTERS = [
  { id: 'all', label: 'All trophies' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable & at risk' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'activities', label: 'Activities' },
  { id: 'crime', label: 'Crime & police' },
  { id: 'money', label: 'Money & property' },
  { id: 'strangers', label: 'Strangers' },
  { id: 'secrets', label: 'Secrets' },
  { id: 'online', label: 'Online' },
];

export const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  strangers: 'Strangers',
  collectibles: 'Collectibles',
  activities: 'Activities',
  crime: 'Crime',
  money: 'Money',
  secrets: 'Secrets',
  online: 'Online',
};

/** True when a trophy passes the kind/missable filter. */
export function matchesFilter(trophy, filterId) {
  if (filterId === 'all') return true;
  if (filterId === 'missable') return Boolean(trophy.missable) || trophy.status === 'unsolved';
  return trophy.kind === filterId;
}

/** True when a trophy matches the search box (name, description, guide, target). */
export function matchesQuery(trophy, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [trophy.name, trophy.description, trophy.guide, trophy.target, trophy.window]
    .filter(Boolean)
    .some((field) => String(field).toLowerCase().includes(needle));
}

/** The visible list for the current filter and search, in official order. */
export function selectVisible(trophies, { filter, query }) {
  return trophies.filter((trophy) => matchesFilter(trophy, filter) && matchesQuery(trophy, query));
}

/** How many trophies each filter holds, for the sidebar counts. */
export function countByFilter(trophies) {
  const counts = {};
  for (const filter of FILTERS) {
    counts[filter.id] = trophies.filter((trophy) => matchesFilter(trophy, filter.id)).length;
  }
  return counts;
}
