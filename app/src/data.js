// Loads app/data/trophies.json once and hands the rest of the app an indexed view of it:
// trophies by id, by kind, by roadmap stage, plus the labels the filters and rows use.

export const KIND_LABELS = {
  story: 'Story',
  missions: 'Strands',
  collectibles: 'Collectibles',
  activities: 'Activities',
  jobs: 'Jobs',
  combat: 'Combat',
  world: 'One-offs',
  completion: 'Completion',
  platinum: 'Platinum',
};

/** Kinds in the order the filter rail shows them. `online` is present but empty: the list has none. */
export const KIND_ORDER = ['story', 'missions', 'collectibles', 'activities', 'jobs', 'combat', 'world', 'completion', 'platinum'];

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export async function loadTrophyData() {
  const response = await fetch('data/trophies.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const raw = await response.json();
  const trophies = raw.trophies ?? raw;
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));

  const stages = (raw.stages ?? []).map((stage) => ({
    ...stage,
    trophies: stage.trophies.map((id) => byId.get(id)).filter(Boolean),
  }));

  const kinds = KIND_ORDER.filter((kind) => trophies.some((trophy) => trophy.kind === kind));

  return {
    game: raw.game,
    platform: raw.platform,
    counts: raw.counts,
    sources: raw.sources ?? [],
    trophies,
    byId,
    stages,
    kinds,
    totals: {
      all: trophies.length,
      missable: trophies.filter((trophy) => trophy.missable).length,
      spoiler: trophies.filter((trophy) => trophy.spoiler).length,
      online: trophies.filter((trophy) => trophy.kind === 'online').length,
      byGrade: Object.fromEntries(
        GRADE_ORDER.map((grade) => [grade, trophies.filter((trophy) => trophy.grade === grade).length]),
      ),
    },
  };
}

/** The order a player should meet them in: roadmap stage first, then the official list order. */
export function roadmapOrder(data) {
  return [...data.trophies].sort((a, b) => a.stage - b.stage || a.id - b.id);
}

/** What to show for a trophy whose name the spoiler setting hides. */
export function displayName(trophy, revealed) {
  return revealed ? trophy.name : 'Hidden story trophy';
}

export function displayDescription(trophy, revealed) {
  return revealed ? trophy.description : 'A story trophy. Its name and description stay hidden until it is earned.';
}
