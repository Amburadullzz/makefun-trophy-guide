// The checklist: one row per trophy in official order, with its grade, kind, missable flag and PSN
// counter, plus the "next up" line that always names the next thing in roadmap order.

import { el, clear, gradeMark, kindLabel } from '../ui/dom.js';
import { applyFilters, isRevealed } from '../filters.js';
import { displayName, displayDescription } from '../data.js';
import { nextUp, stageOf } from '../roadmap.js';

function targetLabel(trophy, store) {
  if (!trophy.target) return null;
  const count = store.counterFor(trophy.id);
  return el('span', { class: 'target' }, el('b', {}, String(count)), `/${trophy.target.count} `, trophy.target.unit);
}

function row(trophy, { store, selectedId, onSelect, onToggle }) {
  const revealed = isRevealed(trophy, store);
  const earned = store.isEarned(trophy.id);

  const checkbox = el('input', {
    class: 'trophy__check',
    type: 'checkbox',
    'data-id': trophy.id,
    'aria-label': `Mark ${revealed ? trophy.name : 'this story trophy'} as earned`,
  });
  checkbox.checked = earned;
  checkbox.addEventListener('click', (event) => event.stopPropagation());
  checkbox.addEventListener('change', () => onToggle(trophy.id, checkbox.checked));

  const item = el(
    'li',
    {
      class: `trophy${earned ? ' is-earned' : ''}${selectedId === trophy.id ? ' is-open' : ''}`,
      'data-id': trophy.id,
      tabindex: '0',
      role: 'button',
      'aria-pressed': selectedId === trophy.id ? 'true' : 'false',
    },
    checkbox,
    gradeMark(trophy.grade),
    el(
      'div',
      { class: 'trophy__body' },
      el('div', { class: 'trophy__name' }, displayName(trophy, revealed)),
      el('div', { class: 'trophy__desc' }, displayDescription(trophy, revealed)),
    ),
    el(
      'div',
      { class: 'trophy__meta' },
      !revealed ? el('span', { class: 'lock' }, 'hidden') : null,
      kindLabel(trophy.kind, { story: 'story', missions: 'strand', collectibles: 'collect', activities: 'activity', jobs: 'job', combat: 'combat', world: 'one-off', completion: '100%', platinum: 'platinum' }),
      trophy.missable ? el('span', { class: 'flag' }, 'missable') : null,
      targetLabel(trophy, store),
    ),
  );

  item.addEventListener('click', () => onSelect(trophy.id));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(trophy.id);
    }
  });
  return item;
}

export function renderChecklist(refs, context) {
  const { data, store, filters, selectedId, onSelect, onToggle } = context;
  const visible = applyFilters(data.trophies, filters, store);

  clear(refs.list);
  for (const trophy of visible) refs.list.append(row(trophy, { store, selectedId, onSelect, onToggle }));

  refs.title.textContent = filters.query || filters.kind !== 'all' || filters.grade !== 'all' || filters.missable || filters.unearned
    ? 'Filtered trophies'
    : 'All trophies';
  refs.count.textContent = `${visible.length} shown · ${store.earnedCount()} of ${data.totals.all} earned`;
  refs.empty.hidden = visible.length > 0;
  renderNextUp(refs.nextUp, data, store, onSelect, filters);
}

/** The one-line planner above the list. Hidden while a filter is on, where it would contradict the view. */
function renderNextUp(node, data, store, onSelect, filters) {
  clear(node);
  const filtered = filters.kind !== 'all' || filters.grade !== 'all' || filters.missable || filters.unearned || filters.query;
  const next = nextUp(data, store);
  if (filtered || !next) {
    node.hidden = true;
    return;
  }
  node.hidden = false;
  const stage = stageOf(data, next);
  node.append(
    el('span', { class: 'next-up__label' }, 'Next up'),
    el('span', { class: 'next-up__name' }, next.name),
    el('span', { class: 'next-up__meta' }, `${stage ? stage.title : 'Free roam'} · ${next.grade}`),
    el('a', { class: 'next-up__link', href: '#/checklist', onclick: (event) => { event.preventDefault(); onSelect(next.id); } }, 'Open the guide →'),
  );
}
