// The roadmap view: the seven stages in order, each with the trophies the
// official descriptions put in it, and the sources the order rests on.

import { el, mount } from '../ui/dom.js';
import { buildRoadmap } from '../roadmap.js';

function stageCard(stage, ctx) {
  const { store, state } = ctx;
  const chips = stage.trophies.map((trophy) => {
    const earned = state.earned.has(trophy.id);
    const classes = ['stage-chip', earned ? 'is-earned' : '', trophy.missable ? 'is-missable' : ''].filter(Boolean).join(' ');
    return el('button', {
      class: classes,
      type: 'button',
      title: trophy.description,
      onclick: () => store.openTrophy(trophy.id),
    }, trophy.name);
  });

  return el('article', { class: 'stage-card' }, [
    el('header', { class: 'stage-head' }, [
      el('div', { class: 'stage-num' }, String(stage.order)),
      el('div', {}, [
        el('h3', { class: 'stage-title' }, stage.title),
        el('div', { class: 'stage-when' }, stage.when),
      ]),
      el('div', { class: 'stage-count' }, `${stage.earned}/${stage.total}`),
    ]),
    el('div', { class: 'stage-body' }, [
      el('p', { class: 'stage-goal' }, stage.goal),
      el('div', { class: 'stage-chips' }, chips),
    ]),
  ]);
}

/** Draw the roadmap page. */
export function renderRoadmap(container, ctx) {
  const { data, state } = ctx;
  const stages = buildRoadmap(data, state);
  const total = stages.reduce((sum, stage) => sum + stage.total, 0);
  const earned = stages.reduce((sum, stage) => sum + stage.earned, 0);

  const intro = el('div', { class: 'panel' }, [
    el('h2', {}, 'The order to earn them in'),
    el('p', {}, `${stages.length} stages, ${total} trophies, ${earned} earned. The order is read off the official descriptions: twelve trophies name a chapter or a mission and unlock on their own, the rest name a count, a character's last job or a place. Chapter and mission counts come from the published mission list; the collectible and activity counts come from the 100% checklist.`),
    el('p', {}, 'Nothing here is missable except the Chapter 1 meditation in stage 1 — see the Missables tab. Story missions cannot be replayed, so keep a manual save at the start and end of each chapter.'),
    el('div', { class: 'legend' }, [
      el('span', { class: 'stage-chip is-earned' }, 'earned'),
      el('span', { class: 'stage-chip' }, 'still open'),
      el('span', { class: 'stage-chip is-missable' }, 'missable'),
      el('span', { class: 'legend-note' }, 'Click any chip to read that trophy\u2019s guide.'),
    ]),
  ]);

  mount(container, [
    intro,
    el('div', { class: 'roadmap' }, stages.map((stage) => stageCard(stage, ctx))),
  ]);
}
