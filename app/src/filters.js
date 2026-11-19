// The filter rail's rules, kept out of the DOM: one state object, one predicate, and the spoiler
// rule that decides whether a trophy's name may be read.

import { KIND_LABELS } from './data.js';

export function createFilters() {
  return { kind: 'all', grade: 'all', missable: false, unearned: false, query: '' };
}

/** A story trophy stays covered until it is earned, and only while spoiler mode is on. */
export function isRevealed(trophy, store) {
  if (!store.spoilerOn()) return true;
  if (!trophy.spoiler) return true;
  return store.isEarned(trophy.id);
}

export function matches(trophy, filters, store) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.missable && !trophy.missable) return false;
  if (filters.unearned && store.isEarned(trophy.id)) return false;
  if (filters.query) {
    const needle = filters.query.toLowerCase();
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${KIND_LABELS[trophy.kind] ?? ''}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function applyFilters(trophies, filters, store) {
  return trophies.filter((trophy) => matches(trophy, filters, store));
}

/** How many trophies each kind holds, for the chip counters. */
export function countByKind(trophies) {
  const counts = { all: trophies.length };
  for (const trophy of trophies) counts[trophy.kind] = (counts[trophy.kind] ?? 0) + 1;
  return counts;
}
