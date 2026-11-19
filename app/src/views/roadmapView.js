// The roadmap page: eight stages in the order the descriptions imply, each with its goal, its warning
// and its trophies as chips that open the guide.

import { el, clear, gradeMark } from '../ui/dom.js';
import { stageStats, overallStats } from '../roadmap.js';
import { isRevealed } from '../filters.js';
import { displayName } from '../data.js';

export function renderRoadmap(node, { data, store, onSelect }) {
  clear(node);
  const overall = overallStats(data, store);
  const missables = data.trophies.filter((trophy) => trophy.missable).length;

  node.append(
    el(
      'div',
      { class: 'page-head' },
      el('h2', { class: 'page-head__title' }, 'Roadmap to the platinum'),
      el('p', { class: 'page-head__lede' },
        `Eight stages, built from the official descriptions: chapter gates first, then the ${missables} trophies whose wording ties them to a character's last mission or a single scene, then the free-roam work that never closes. ${overall.earned} of ${overall.total} earned; the point of no return is stage 4.`),
    ),
  );

  for (const stage of data.stages) {
    const stats = stageStats(stage, store);
    const card = el(
      'article',
      { class: 'stage' },
      el(
        'header',
        { class: 'stage__head' },
        el('span', { class: 'stage__num' }, String(stage.id)),
        el('div', {}, el('h3', { class: 'stage__title' }, stage.title), el('p', { class: 'stage__when' }, stage.when)),
        el('span', { class: 'stage__count' }, `${stats.earned}/${stats.total} · ${stats.percent}%`),
      ),
      el(
        'div',
        { class: 'stage__body' },
        el('p', { class: 'stage__goal' }, stage.goal),
        el('p', { class: 'stage__note' }, stage.note),
        el(
          'div',
          { class: 'stage__list' },
          ...stage.trophies.map((trophy) => {
            const revealed = isRevealed(trophy, store);
            const item = el(
              'button',
              {
                type: 'button',
                class: `stage__item${store.isEarned(trophy.id) ? ' is-earned' : ''}`,
                'data-id': trophy.id,
                onclick: () => onSelect(trophy.id),
              },
              gradeMark(trophy.grade),
              displayName(trophy, revealed),
              trophy.missable ? el('span', { class: 'flag' }, 'missable') : null,
            );
            return item;
          }),
        ),
      ),
    );
    node.append(card);
  }
}
