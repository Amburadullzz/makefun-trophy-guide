// The left rail: a search box, the kind filters with their earned/total
// counts, the two flag filters, and the reset control.

import { KIND_FILTERS, tallyByKind } from '../core/trophy-filter.js';
import { h, clear } from './dom.js';

export function renderFilterRail(root, state, actions) {
  const tally = tallyByKind(state.data.trophies, (id) => state.store.has(id));
  const shown = state.visibleTrophies.length;
  const missableTotal = state.data.trophies.filter((t) => t.missable).length;
  const unearnedTotal = state.data.trophies.length - state.store.count();

  clear(root);
  root.append(
    h('div', { class: 'pane-head' },
      h('span', { class: 'pane-title' }, 'Filters'),
      h('span', { class: 'pane-count', id: 'rail-count' }, shown + ' shown')
    ),
    h('div', { class: 'rail-body' },
      h('label', { class: 'search-box' },
        h('span', { class: 'search-icon', 'aria-hidden': 'true' }, '\u2315'),
        h('input', {
          type: 'search',
          id: 'filter-search',
          placeholder: 'Find a trophy or place',
          value: state.filters.query,
          'aria-label': 'Search trophies',
          oninput: (event) => actions.setQuery(event.target.value),
        })
      ),
      h('div', { class: 'rail-section' },
        h('p', { class: 'rail-label' }, 'Kind'),
        h('div', { class: 'chip-list', role: 'group', 'aria-label': 'Filter by kind' },
          KIND_FILTERS.map((kind) => {
            const bucket = tally.get(kind.id);
            return h('button', {
              type: 'button',
              class: 'chip' + (state.filters.kind === kind.id ? ' is-active' : ''),
              'data-kind': kind.id,
              'aria-pressed': state.filters.kind === kind.id,
              onclick: () => actions.setKind(kind.id),
            },
              h('span', { class: 'chip-label' },
                kind.dot ? h('span', { class: 'chip-dot chip-dot--' + kind.dot }) : null,
                kind.label
              ),
              h('span', { class: 'chip-count' }, bucket.earned + '/' + bucket.total)
            );
          })
        )
      ),
      h('div', { class: 'rail-section' },
        h('p', { class: 'rail-label' }, 'Show only'),
        h('div', { class: 'chip-list' },
          h('button', {
            type: 'button',
            class: 'chip' + (state.filters.missableOnly ? ' is-active' : ''),
            'data-flag': 'missable',
            'aria-pressed': state.filters.missableOnly,
            onclick: () => actions.setMissableOnly(!state.filters.missableOnly),
          },
            h('span', { class: 'chip-label' },
              h('span', { class: 'chip-dot chip-dot--missable' }),
              'Missable'
            ),
            h('span', { class: 'chip-count' }, String(missableTotal))
          ),
          h('button', {
            type: 'button',
            class: 'chip' + (state.filters.unearnedOnly ? ' is-active' : ''),
            'data-flag': 'unearned',
            'aria-pressed': state.filters.unearnedOnly,
            onclick: () => actions.setUnearnedOnly(!state.filters.unearnedOnly),
          },
            h('span', { class: 'chip-label' },
              h('span', { class: 'chip-dot' }),
              'Not earned yet'
            ),
            h('span', { class: 'chip-count' }, String(unearnedTotal))
          )
        )
      ),
      h('p', { class: 'rail-note' },
        state.data.counts.online === 0
          ? 'No online trophies: this list is single-player only.'
          : state.data.counts.online + ' online trophies in this list.'
      )
    ),
    h('div', { class: 'rail-footer' },
      h('button', {
        type: 'button',
        class: 'btn btn--ghost',
        id: 'btn-reset',
        onclick: () => actions.clearProgress(),
      }, 'Clear progress')
    )
  );
}
