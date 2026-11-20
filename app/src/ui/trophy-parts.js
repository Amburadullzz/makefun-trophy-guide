// Small shared pieces of the trophy UI: the grade square, the tag chip and the
// pill used in the roadmap.

import { gradeLetter, gradeLabel } from '../core/trophy-data.js';
import { KIND_LABELS } from '../core/trophy-filter.js';
import { h } from './dom.js';

export function gradeBadge(trophy, extraClass = '') {
  return h('span', {
    class: 'grade grade--' + trophy.grade + (extraClass ? ' ' + extraClass : ''),
    title: gradeLabel(trophy.grade) + ' trophy',
    'aria-label': gradeLabel(trophy.grade),
  }, gradeLetter(trophy.grade));
}

export function kindTag(trophy) {
  return h('span', { class: 'tag tag--kind' }, KIND_LABELS[trophy.kind] || trophy.kind);
}

export function missableTag() {
  return h('span', { class: 'tag tag--missable', title: 'Can be missed: read the guide for the window' }, 'missable');
}

export function trophyPill(trophy, earned, onSelect) {
  return h('button', {
    type: 'button',
    class: 'trophy-pill' + (earned ? ' is-earned' : ''),
    'data-trophy-id': trophy.id,
    title: trophy.name,
    onclick: () => onSelect(trophy.id),
  },
    gradeBadge(trophy),
    h('span', {}, trophy.name),
    trophy.missable ? h('span', { class: 'pill-missable', title: 'Missable' }) : null
  );
}
