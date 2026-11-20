// The filter rules, kept apart from the views so the same test can be run over
// any trophy list: kind, the missable flag, "not earned yet", and free text.

export const KIND_FILTERS = [
  { id: 'all', label: 'All trophies', dot: null },
  { id: 'story', label: 'Story', dot: 'story' },
  { id: 'activities', label: 'Activities', dot: 'activities' },
  { id: 'collectibles', label: 'Collectibles', dot: 'collectibles' },
  { id: 'meta', label: 'Platinum & 100%', dot: 'meta' },
  { id: 'online', label: 'Online', dot: 'online' },
];

export const KIND_LABELS = {
  story: 'story',
  activities: 'activity',
  collectibles: 'collectible',
  meta: 'meta',
  online: 'online',
};

export function emptyFilters() {
  return { kind: 'all', missableOnly: false, unearnedOnly: false, query: '' };
}

export function matchesFilters(trophy, filters, isEarned) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.unearnedOnly && isEarned(trophy.id)) return false;
  const query = filters.query.trim().toLowerCase();
  if (!query) return true;
  return [trophy.name, trophy.description, trophy.chapter, trophy.roadmap]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

export function applyFilters(trophies, filters, isEarned) {
  return trophies.filter((trophy) => matchesFilters(trophy, filters, isEarned));
}

export function tallyByKind(trophies, isEarned) {
  const tally = new Map(KIND_FILTERS.map((kind) => [kind.id, { total: 0, earned: 0 }]));
  for (const trophy of trophies) {
    const all = tally.get('all');
    all.total += 1;
    if (isEarned(trophy.id)) all.earned += 1;
    const bucket = tally.get(trophy.kind);
    if (bucket) {
      bucket.total += 1;
      if (isEarned(trophy.id)) bucket.earned += 1;
    }
  }
  return tally;
}
