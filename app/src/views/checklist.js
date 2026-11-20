// The tracker list: one row per visible trophy with its checkbox, official
// name and description, grade and flags. Clicking the text opens the guide.

import { el, mount, checkIcon } from '../ui/dom.js';
import { FILTERS, KIND_LABELS } from '../filters.js';
import { displayName, displayDescription, isHidden } from '../spoiler.js';

function gradeBadge(grade) {
  return el('span', { class: `grade grade-${grade}` }, grade);
}

function flagTags(trophy) {
  const tags = [];
  if (trophy.missable) tags.push(el('span', { class: 'tag tag-missable' }, 'Missable'));
  if (trophy.status === 'unsolved') tags.push(el('span', { class: 'tag tag-unsolved' }, 'No method yet'));
  return tags;
}

function trophyRow(trophy, ctx) {
  const { store, state } = ctx;
  const earned = state.earned.has(trophy.id);
  const hidden = isHidden(trophy, state);

  const check = el('button', {
    class: 'check',
    type: 'button',
    role: 'checkbox',
    'aria-checked': String(earned),
    'aria-label': `${earned ? 'Uncheck' : 'Check'} ${trophy.name}`,
    onclick: (event) => {
      event.stopPropagation();
      store.toggleEarned(trophy.id);
    },
  }, [checkIcon()]);

  const openButton = el('button', {
    class: 'row-main',
    type: 'button',
    'aria-label': `Open the guide for ${hidden ? 'this hidden story trophy' : trophy.name}`,
    onclick: () => store.openTrophy(trophy.id),
  }, [
    el('span', {
      class: 'row-name',
      title: trophy.name.includes('*') ? 'The asterisks are PlayStation\u2019s own censoring of the official name.' : null,
    }, [
      hidden ? el('span', {}, displayName(trophy, state)) : trophy.name,
      hidden ? el('span', { class: 'tag tag-window' }, 'Hidden') : null,
    ]),
    el('span', { class: 'row-desc' }, displayDescription(trophy, state)),
  ]);

  return el('div', {
    class: ['row', earned ? 'is-earned' : '', state.openId === trophy.id ? 'is-open' : ''].filter(Boolean).join(' '),
    dataset: { id: String(trophy.id) },
  }, [
    check,
    openButton,
    el('div', { class: 'row-meta' }, [
      trophy.kind === 'platinum' ? null : el('span', { class: 'tag tag-kind' }, KIND_LABELS[trophy.kind] ?? trophy.kind),
      ...flagTags(trophy),
      gradeBadge(trophy.grade),
    ]),
  ]);
}

/** Draw the whole list for the current filter and search. */
export function renderChecklist(container, ctx) {
  const { data, state, visible } = ctx;
  const filterLabel = FILTERS.find((f) => f.id === state.filter)?.label ?? 'All trophies';
  const earnedHere = visible.filter((trophy) => state.earned.has(trophy.id)).length;

  const head = el('div', { class: 'list-head' }, [
    el('div', {}, [
      el('h1', { class: 'list-title' }, filterLabel),
      el('p', { class: 'list-sub' },
        `${visible.length} shown · ${earnedHere} earned · ${data.trophies.length} in the official list`),
    ]),
    el('div', { class: 'list-sub' },
      state.spoiler ? 'Spoilers on: story names hidden until earned' : 'Spoilers off: all names shown'),
  ]);

  if (visible.length === 0) {
    mount(container, [
      head,
      el('div', { class: 'empty' }, [
        el('strong', {}, state.filter === 'online' ? 'No online trophies' : 'Nothing matches'),
        state.filter === 'online'
          ? 'GTA VI shipped without an online mode, so the official list has no online trophies — nothing to tick here.'
          : 'Try another kind filter, or clear the search box.',
      ]),
    ]);
    return;
  }

  mount(container, [head, el('div', { class: 'rows' }, visible.map((trophy) => trophyRow(trophy, ctx)))]);
}
