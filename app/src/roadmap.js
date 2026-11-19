// The roadmap's arithmetic: how far a stage is, what to do next, and whether the platinum is still
// reachable. Pure functions over the data and the store, so the views stay presentational.

import { roadmapOrder } from './data.js';

export function stageStats(stage, store) {
  const total = stage.trophies.length;
  const earned = stage.trophies.filter((trophy) => store.isEarned(trophy.id)).length;
  return { earned, total, percent: total === 0 ? 0 : Math.round((earned / total) * 100) };
}

export function overallStats(data, store) {
  const total = data.trophies.length;
  const earned = data.trophies.filter((trophy) => store.isEarned(trophy.id)).length;
  return {
    earned,
    total,
    percent: total === 0 ? 0 : Math.round((earned / total) * 100),
    platinum: store.isEarned(1),
  };
}

/** The first trophy still open in roadmap order — the one line the checklist leads with. */
export function nextUp(data, store) {
  const open = roadmapOrder(data).filter((trophy) => !store.isEarned(trophy.id));
  return open[0] ?? null;
}

/** Every trophy whose official description ties it to a closing window, in the order they close. */
export function missableList(data) {
  return data.trophies
    .filter((trophy) => trophy.missable)
    .sort((a, b) => a.stage - b.stage || a.id - b.id);
}

/** The stage a trophy belongs to, for the drawer's "where in the run" line. */
export function stageOf(data, trophy) {
  return data.stages.find((stage) => stage.id === trophy.stage) ?? null;
}
