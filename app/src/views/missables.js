// The missables page: every flag with the words in the official description that put it there, so a
// reader can check the reasoning instead of taking the flag on trust.

import { el, clear, gradeMark } from '../ui/dom.js';
import { missableList, stageOf } from '../roadmap.js';
import { isRevealed } from '../filters.js';
import { displayName, displayDescription } from '../data.js';

export function renderMissables(node, { data, store, onSelect }) {
  clear(node);
  const list = missableList(data);

  node.append(
    el(
      'div',
      { class: 'page-head' },
      el('h2', { class: 'page-head__title' }, `Missable trophies — ${list.length} of ${data.totals.all}`),
      el('p', { class: 'page-head__lede' },
        'A flag goes on a trophy only when the official description itself ties it to something that closes. Three wordings do that: a final mission for a named character, a unique target, and a single scene or choice. Everything else is left unflagged, because free roam keeps it open after the credits.'),
      el('p', { class: 'page-head__lede' },
        'Each entry below quotes the description and names the phrase that decided the flag. Where a flag is a reading rather than a certainty, the entry says so.'),
    ),
  );

  for (const trophy of list) {
    const stage = stageOf(data, trophy);
    const revealed = isRevealed(trophy, store);
    node.append(
      el(
        'article',
        { class: 'missable', 'data-id': trophy.id },
        el(
          'div',
          { class: 'missable__top' },
          gradeMark(trophy.grade),
          el('h3', { class: 'missable__name' }, displayName(trophy, revealed)),
          store.isEarned(trophy.id) ? el('span', { class: 'kind', style: 'color:#4fd6ae;border-color:#4fd6ae' }, 'earned') : null,
          el('button', { type: 'button', class: 'button button--ghost', style: 'margin-left:auto', onclick: () => onSelect(trophy.id) }, 'Guide'),
        ),
        el('p', { class: 'missable__desc' }, `“${displayDescription(trophy, revealed)}”`),
        el('p', { class: 'missable__reason' }, el('b', {}, 'Why it closes: '), trophy.missableReason),
        el('p', { class: 'missable__where' }, `stage ${trophy.stage} · ${stage ? stage.title : 'free roam'} · ${trophy.kind}`),
      ),
    );
  }
}
