// The sources page: the whole citation list in one place, plus what this guide does and does not claim.

import { el, clear } from '../ui/dom.js';

/** The URL without its scheme, for display; the href keeps the whole thing. */
function shortUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '');
}

export function renderSources(node, { data }) {
  clear(node);
  const counts = data.totals;

  node.append(
    el(
      'div',
      { class: 'page-head' },
      el('h2', { class: 'page-head__title' }, 'Where every fact comes from'),
      el('p', { class: 'page-head__lede' },
        `Three sources, cited under every trophy: the official list for the wording, PlayStation's own counter for a number the description leaves out, and this entry's reading of the description for the method. Nothing is copied: the descriptions are quoted because they are the trophy, and every guide below them is written for this app.`),
      el('p', { class: 'page-head__lede' },
        `${counts.total} trophies: ${counts.byGrade.platinum} platinum, ${counts.byGrade.gold} gold, ${counts.byGrade.silver} silver, ${counts.byGrade.bronze} bronze. No online trophies in the list, so the kind filter has no online group.`),
    ),
  );

  for (const source of data.sources) {
    node.append(
      el(
        'article',
        { class: 'source-card' },
        el('p', { class: 'source-card__kind' }, source.kind),
        el('h3', { class: 'source-card__name' }, source.name),
        source.url
          ? el('p', { class: 'source-card__url' }, el('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer', title: source.url }, shortUrl(source.url)))
          : el('p', { class: 'source-card__url' }, 'written for this entry, no link'),
        el('p', { class: 'source-card__covers' }, source.covers),
      ),
    );
  }

  node.append(
    el(
      'div',
      { class: 'page-head' },
      el('h2', { class: 'page-head__title', style: 'font-size:16px;margin-top:14px' }, 'What this guide does not claim'),
      el('p', { class: 'page-head__lede' },
        'It was not playtested. Where a description names a place — Ocean Beach, VCIA, the Kolt & Associates alley — the guide names it too. Where a description names no place, the guide gives the method and says plainly that the spot is not pinned down, rather than inventing coordinates. A step that could not be cited was left out.'),
      el('p', { class: 'page-head__lede' },
        'The look is this entry\'s own: no Rockstar logo, no box art, no screenshot of the game. The marks, the palette and the layout were drawn here.'),
    ),
  );
}
