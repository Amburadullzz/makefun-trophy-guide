// The middle column: one row per trophy that survives the filters, with the
// checkbox that writes to the progress store.

import { displayName, displayDescription, isMasked } from '../core/spoiler.js';
import { gradeBadge, kindTag, missableTag } from './trophy-parts.js';
import { h, clear } from './dom.js';

export function renderTrackerList(root, state, actions) {
  const rows = state.visibleTrophies.map((trophy) => trophyRow(trophy, state, actions));
  const earnedShown = state.visibleTrophies.filter((t) => state.store.has(t.id)).length;

  clear(root);
  root.append(
    h('div', { class: 'pane-head' },
      h('span', { class: 'pane-title' }, 'Checklist'),
      h('span', { class: 'pane-count', id: 'list-count' },
        earnedShown + ' earned \u00b7 ' + state.visibleTrophies.length + ' listed')
    ),
    h('div', { class: 'list-body', id: 'list-body' },
      rows.length
        ? rows
        : h('div', { class: 'empty-state' },
            h('strong', {}, 'Nothing matches those filters'),
            h('span', {}, 'Clear the search box, or switch the kind back to All trophies.')
          )
    )
  );
}

function trophyRow(trophy, state, actions) {
  const earned = state.store.has(trophy.id);
  const masked = isMasked(trophy, state);
  const selected = state.selectedId === trophy.id;

  const checkbox = h('input', {
    type: 'checkbox',
    class: 'tick',
    checked: earned,
    'data-trophy-id': trophy.id,
    'aria-label': 'Mark ' + (masked ? 'this trophy' : trophy.name) + ' as earned',
    onclick: (event) => {
      event.stopPropagation();
      actions.toggleEarned(trophy.id);
    },
  });

  return h('div', {
    class: 'row' + (earned ? ' is-earned' : '') + (selected ? ' is-selected' : ''),
    role: 'button',
    tabindex: '0',
    'data-row-id': trophy.id,
    'aria-current': selected ? 'true' : 'false',
    onclick: () => actions.select(trophy.id),
    onkeydown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        actions.select(trophy.id);
      }
    },
  },
    checkbox,
    gradeBadge(trophy),
    h('div', { class: 'row-main' },
      h('div', { class: 'row-name' }, displayName(trophy, state)),
      h('div', { class: 'row-desc' }, displayDescription(trophy, state))
    ),
    h('div', { class: 'row-tags' },
      masked ? h('span', { class: 'tag' }, 'spoiler-safe') : null,
      trophy.missable ? missableTag() : null,
      kindTag(trophy)
    )
  );
}
