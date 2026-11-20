// The missables page: the one trophy whose window really closes, the hidden
// trophies with no confirmed method, and the chapter gates behind everything
// else, each with the reason it is or is not safe.

import { el, mount } from '../ui/dom.js';
import { displayName } from '../spoiler.js';

function riskCard(trophy, ctx, tone) {
  const { store } = ctx;
  return el('article', { class: 'missable-card' }, [
    el('div', { class: 'guide-kicker' }, [
      el('span', { class: `grade grade-${trophy.grade}` }, trophy.grade),
      el('span', { class: tone === 'danger' ? 'tag tag-missable' : 'tag tag-unsolved' },
        tone === 'danger' ? 'Missable' : 'No method yet'),
    ]),
    el('h3', {}, displayName(trophy, ctx.state)),
    el('p', { class: 'list-sub' }, trophy.description),
    el('p', { class: 'why' }, trophy.missableReason ?? ''),
    el('p', { class: 'when' }, trophy.window ?? ''),
    el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn btn-ghost', type: 'button', onclick: () => store.openTrophy(trophy.id) },
        'Open the guide'),
    ]),
  ]);
}

/** Draw the missables page. */
export function renderMissables(container, ctx) {
  const { data, state } = ctx;
  const missable = data.trophies.filter((trophy) => trophy.missable);
  const unsolved = data.trophies.filter((trophy) => trophy.status === 'unsolved');

  const intro = el('div', { class: 'panel' }, [
    el('h2', {}, 'What can be missed'),
    el('p', {}, 'One trophy has a window that closes: the Chapter 1 meditation that counts towards Positive Mental Attitude. Four hidden trophies had no confirmed unlock method when this list was frozen, so they are flagged at risk and deserve a manual save before you experiment. Everything else stays open after the credits.'),
    el('p', {}, 'Story missions cannot be replayed in GTA VI, but the twelve story trophies unlock automatically as their mission ends, so the only cost of a late chapter is a trophy you already have.'),
  ]);

  mount(container, [
    intro,
    el('h3', { class: 'list-title', style: 'margin-bottom:10px' }, 'Closes for good'),
    el('div', { class: 'missable-grid' }, missable.map((trophy) => riskCard(trophy, ctx, 'danger'))),
    el('h3', { class: 'list-title', style: 'margin:22px 0 10px' }, 'No confirmed method yet'),
    el('div', { class: 'missable-grid' }, unsolved.map((trophy) => riskCard(trophy, ctx, 'warn'))),
  ]);
}
