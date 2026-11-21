// The catalogue: the trophy data and the rules for finding a subset of it.
// One job — turn app/data/*.json into an indexed, filtered, countable set.

import { money } from './dom.js';

export const GRADES = ['platinum', 'gold', 'silver', 'bronze'];

// The filter rail. `online` is offered even though the launch list has no
// online trophy, so the app can say so rather than hide the question.
export const FILTERS = [
  { id: 'all', label: 'All trophies', test: () => true },
  { id: 'story', label: 'Story', test: (t) => t.kind === 'story' },
  { id: 'missable', label: 'Missable', test: (t) => t.missable === true },
  { id: 'collectibles', label: 'Collectibles', test: (t) => t.kind === 'collectibles' },
  { id: 'activities', label: 'Activities', test: (t) => t.kind === 'activities' },
  { id: 'crime', label: 'Crime & combat', test: (t) => t.kind === 'crime' },
  { id: 'money', label: 'Money & property', test: (t) => t.kind === 'money' },
  { id: 'misc', label: 'Misc & platinum', test: (t) => t.kind === 'misc' },
  { id: 'online', label: 'Online', test: (t) => t.kind === 'online' }
];

// What a trophy's count is counting, for the badge beside the name.
const COUNT_UNITS = {
  'cunning-stunts': 'stunts',
  'master-of-none': 'activity types',
  'the-shootist': 'gold medals',
  'top-fun': 'stations',
  'earn-cash-not-kudos': 'races',
  'one-last-thing': 'challenges',
  'dont-touch-my-deck': 'card sets',
  'you-wainker': 'scans',
  'whip-it-good': 'vehicles',
  'positive-mental-attitude': 'meditations',
  'strangers-freaks': 'strands',
  'this-was-no-boat-accident': 'treasure sets',
  'the-lone-rider': 'jobs',
  'supply-demand': 'cars',
  'fair-game': 'target decks',
  'pest-control': 'gangs',
  'maximum-withdrawal': 'vaults',
  'retail-therapy': 'shops',
  'lets-go-bowling': 'valuables',
  'little-boxes': 'garages',
  'on-the-spot': 'vehicles',
  'dime-on-the-dollar': 'dollars',
  'treat-yo-self': 'dollars',
  'actions-speak-louder': 'actions',
  'gunslinger': 'enemies'
};

export function describeCount(trophy) {
  const count = trophy.count;
  if (!count || typeof count.need !== 'number') return '';
  const unit = COUNT_UNITS[trophy.id] || '';
  if (unit === 'dollars') return money(count.need);
  return `${count.need} / ${count.total}${unit ? ' ' + unit : ''}`;
}

export function countSummary(trophy) {
  const count = trophy.count;
  if (!count) return '';
  const unit = COUNT_UNITS[trophy.id] || 'total';
  if (unit === 'dollars') return money(count.need);
  return `${count.need} of ${count.total} ${unit}`;
}

export async function loadCatalog(root = 'data') {
  const [trophyFile, roadmapFile] = await Promise.all([
    fetchJson(`${root}/trophies.json`),
    fetchJson(`${root}/roadmap.json`)
  ]);
  const trophies = Array.isArray(trophyFile) ? trophyFile : trophyFile.trophies;
  if (!Array.isArray(trophies)) throw new Error('trophies.json has no trophies array');

  const byId = new Map();
  for (const trophy of trophies) {
    if (!trophy.id) trophy.id = slug(trophy.name);
    if (byId.has(trophy.id)) throw new Error(`duplicate trophy id: ${trophy.id}`);
    byId.set(trophy.id, trophy);
  }

  const stages = (roadmapFile.stages || []).map((stage) => ({
    ...stage,
    trophies: (stage.trophies || []).filter((id) => byId.has(id))
  }));

  return {
    trophies,
    byId,
    meta: trophyFile.meta || {},
    roadmap: { ...roadmapFile, stages },
    issues: auditCatalog(trophies, stages)
  };
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.json();
}

function slug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Cheap self-check the app logs once at boot: a missing guide or an unknown
// stage would show up in the console instead of in a silent gap on screen.
export function auditCatalog(trophies, stages) {
  const issues = [];
  const known = new Set(stages.flatMap((stage) => stage.trophies));
  for (const trophy of trophies) {
    if (!String(trophy.name || '').trim()) issues.push(`trophy ${trophy.id} has no name`);
    if (!String(trophy.guide || '').trim()) issues.push(`trophy ${trophy.id} has no guide`);
    if (!GRADES.includes(trophy.grade)) issues.push(`trophy ${trophy.id} has grade ${trophy.grade}`);
    if (!Array.isArray(trophy.sources) || trophy.sources.length === 0) issues.push(`trophy ${trophy.id} cites nothing`);
    if (!known.has(trophy.id)) issues.push(`trophy ${trophy.id} is in no roadmap stage`);
  }
  const counts = tallyGrades(trophies);
  if (trophies.length !== 55) issues.push(`expected 55 trophies, found ${trophies.length}`);
  if (counts.gold.total !== 2 || counts.silver.total !== 6 || counts.bronze.total !== 46) {
    issues.push('grade totals do not match the official 1 / 2 / 6 / 46');
  }
  return issues;
}

export function tallyGrades(trophies) {
  const result = {};
  for (const grade of GRADES) {
    const items = trophies.filter((trophy) => trophy.grade === grade);
    result[grade] = { total: items.length, earned: 0 };
  }
  return result;
}

export function matchesFilter(trophy, filterId) {
  const filter = FILTERS.find((entry) => entry.id === filterId) || FILTERS[0];
  return filter.test(trophy);
}

export function matchesQuery(trophy, query) {
  const needle = String(query || '').trim().toLowerCase();
  if (!needle) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind, trophy.risk]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function selectTrophies(trophies, { filter = 'all', query = '', earned = new Set(), hideEarned = false } = {}) {
  return trophies.filter((trophy) => {
    if (!matchesFilter(trophy, filter)) return false;
    if (hideEarned && earned.has(trophy.id)) return false;
    return matchesQuery(trophy, query);
  });
}

export function progressOf(trophies, earned) {
  const total = trophies.length;
  const done = trophies.filter((trophy) => earned.has(trophy.id)).length;
  const grades = tallyGrades(trophies);
  for (const trophy of trophies) {
    if (earned.has(trophy.id) && grades[trophy.grade]) grades[trophy.grade].earned += 1;
  }
  return { done, total, grades, percent: total ? Math.round((done / total) * 100) : 0 };
}
