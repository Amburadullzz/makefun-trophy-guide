// The progress board under the masthead.
// One job — say how much of the list is done, by grade, and what is next.

import { el, replace, percent } from './dom.js';
import { isMasked, visibleName } from './spoiler.js';

export function createProgressBoard({ catalog, store, elements }) {
  function render() {
    const total = catalog.trophies.length;
    const done = catalog.trophies.filter((trophy) => store.earned.has(trophy.id)).length;
    const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
    const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
    for (const trophy of catalog.trophies) {
      totals[trophy.grade] = (totals[trophy.grade] || 0) + 1;
      if (store.earned.has(trophy.id)) grades[trophy.grade] = (grades[trophy.grade] || 0) + 1;
    }
    const missable = catalog.trophies.filter((trophy) => trophy.missable);
    const missableDone = missable.filter((trophy) => store.earned.has(trophy.id)).length;
    const remaining = catalog.trophies.filter((trophy) => !store.earned.has(trophy.id));
    const next = remaining.find((trophy) => trophy.grade !== 'platinum') || remaining[0];

    const bar = el('div', { class: 'board-bar' }, el('span'));
    bar.firstChild.style.width = percent(done, total);

    replace(elements.board,
      el('div', {},
        el('div', { class: 'board-count' },
          el('span', { class: 'big', text: String(done) }),
          el('span', { class: 'of', text: `/ ${total} trophies` }),
          el('span', { class: 'pct', text: percent(done, total) })
        ),
        bar,
        el('p', { class: 'board-note', text: 'Saved in this browser (localStorage) · export to a file any time' })
      ),
      el('div', { class: 'tallies' },
        tally('platinum', grades, totals),
        tally('gold', grades, totals),
        tally('silver', grades, totals),
        tally('bronze', grades, totals),
        el('div', { class: 'tally missable' },
          el('span', { class: 'dot' }),
          el('span', { text: 'Missable' }),
          el('b', { text: `${missableDone}/${missable.length}` })
        )
      ),
      el('div', { class: 'board-flags' },
        el('div', {}, el('strong', { text: '28 hidden on PlayStation' }), ' · ', 'no online trophies'),
        el('div', {}, 'Next up: ', next
          ? el('strong', { text: visibleName(next, isMasked(next, store.settings, store.earned)) })
          : el('strong', { text: 'platinum earned' }))
      )
    );
  }

  function tally(grade, grades, totals) {
    return el('div', { class: `tally ${grade}` },
      el('span', { class: 'dot' }),
      el('span', { text: grade[0].toUpperCase() + grade.slice(1) }),
      el('b', { text: `${grades[grade] || 0}/${totals[grade] || 0}` })
    );
  }

  return { render };
}
