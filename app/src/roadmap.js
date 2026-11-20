// The roadmap: the seven stages in app/data/trophies.json, each with the
// trophies the official descriptions put in it, plus live progress for the
// stage cards.

/** Attach each stage's trophies and progress to the stage definitions. */
export function buildRoadmap(data, state) {
  const stages = data.stages.length
    ? data.stages
    : [{ id: 'all', order: 1, title: 'Every trophy', when: '', goal: '', trophies: data.trophies.map((t) => t.id) }];

  return stages
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((stage) => {
      const trophies = (stage.trophies ?? [])
        .map((id) => data.byId.get(id))
        .filter(Boolean);
      const earned = trophies.filter((trophy) => state.earned.has(trophy.id)).length;
      return { ...stage, trophies, earned, total: trophies.length };
    });
}

/** The next unearned trophy in roadmap order — what the tracker suggests next. */
export function nextUp(data, state) {
  for (const stage of buildRoadmap(data, state)) {
    const open = stage.trophies.find((trophy) => !state.earned.has(trophy.id));
    if (open) return { stage, trophy: open };
  }
  return null;
}
