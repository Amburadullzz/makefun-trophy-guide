// The trophy file: one fetch of app/data/trophies.json, then lookups and counts
// that the views share. Nothing here reaches outside app/.

const DATA_PATH = 'data/trophies.json';

/** Load and index app/data/trophies.json. */
export async function loadTrophyData() {
  const response = await fetch(DATA_PATH, { cache: 'no-store' });
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const raw = await response.json();
  const trophies = Array.isArray(raw) ? raw : raw.trophies;
  if (!Array.isArray(trophies) || trophies.length === 0) {
    throw new Error('trophies.json: no "trophies" array');
  }
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));
  const byStage = new Map();
  for (const trophy of trophies) {
    if (!byStage.has(trophy.stage)) byStage.set(trophy.stage, []);
    byStage.get(trophy.stage).push(trophy);
  }
  return {
    meta: Array.isArray(raw) ? {} : raw,
    trophies,
    byId,
    byStage,
    stages: (Array.isArray(raw) ? [] : raw.stages) ?? [],
    counts: countGrades(trophies),
  };
}

/** Grade tally, checked against the official 1 / 2 / 6 / 46 split. */
export function countGrades(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    if (counts[trophy.grade] !== undefined) counts[trophy.grade] += 1;
  }
  return counts;
}
