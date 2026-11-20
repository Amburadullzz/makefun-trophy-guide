// Reads the two data files the app ships with and answers the questions the
// views ask about them: what a trophy's grade letter is, which stage it sits in.

const DATA_FILES = {
  trophies: 'data/trophies.json',
  roadmap: 'data/roadmap.json',
};

export async function loadGuideData() {
  const [trophyDoc, roadmapDoc] = await Promise.all([
    readJson(DATA_FILES.trophies),
    readJson(DATA_FILES.roadmap),
  ]);
  const trophies = (trophyDoc.trophies || trophyDoc).slice().sort((a, b) => a.id - b.id);
  const roadmap = {
    stages: (roadmapDoc.stages || []).slice().sort((a, b) => a.order - b.order),
    pointsOfNoReturn: roadmapDoc.pointsOfNoReturn || [],
    notes: roadmapDoc.notes || {},
  };
  return {
    trophies,
    roadmap,
    counts: trophyDoc.counts || countGrades(trophies),
    byId: new Map(trophies.map((t) => [t.id, t])),
    byName: new Map(trophies.map((t) => [t.name, t])),
  };
}

async function readJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not read ' + path + ' (' + response.status + ')');
  return response.json();
}

export function countGrades(trophies) {
  const counts = { total: trophies.length, platinum: 0, gold: 0, silver: 0, bronze: 0, online: 0 };
  for (const trophy of trophies) {
    if (counts[trophy.grade] !== undefined) counts[trophy.grade] += 1;
    if (trophy.kind === 'online') counts.online += 1;
  }
  return counts;
}

const GRADE_LETTERS = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

export function gradeLetter(grade) {
  return GRADE_LETTERS[grade] || '?';
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function stagesOf(data, trophyId) {
  return data.roadmap.stages.filter((stage) => stage.trophies.includes(trophyId));
}
