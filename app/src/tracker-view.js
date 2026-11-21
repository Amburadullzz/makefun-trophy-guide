// The tracker view: the filter rail, the checklist and the guide panel.
// One job — draw the current subset of trophies and let a reader tick them.

import { el, replace, clear, percent } from './dom.js';
import { FILTERS, describeCount, selectTrophies, progressOf } from './catalog.js';
import { isMasked, visibleName, visibleDescription, MASKED_GUIDE, maskedCount } from './spoiler.js';

const KIND_LABEL = {
  story: 'story',
  activities: 'activity',
  collectibles: 'collectible',
  crime: 'crime',
  money: 'money',
  misc: 'misc',
  online: 'online'
};

export function createTrackerView({ catalog, store, elements }) {
  let selectedId = null;
  let rows = [];
  const chipNodes = new Map();
  let searchInput = null;
  let hideEarnedBox = null;
  let listHead = null;

  function masked(trophy) {
    return isMasked(trophy, store.settings, store.earned);
  }

  function visibleRows() {
    rows = selectTrophies(catalog.trophies, {
      filter: store.settings.filter,
      query: store.settings.query,
      earned: store.earned,
      hideEarned: store.settings.hideEarned
    });
    return rows;
  }

  function mountRail() {
    const chips = FILTERS.map((filter) => {
      const node = el('button', {
        class: 'chip',
        type: 'button',
        'aria-pressed': String(store.settings.filter === filter.id),
        onclick: () => store.setSetting('filter', filter.id)
      },
        el('span', { text: filter.label }),
        el('span', { class: 'n', text: '0' })
      );
      chipNodes.set(filter.id, node);
      return node;
    });

    searchInput = el('input', {
      type: 'search',
      id: 'trophy-search',
      placeholder: 'Search trophies',
      autocomplete: 'off',
      'aria-label': 'Search trophies',
      value: store.settings.query
    });
    searchInput.addEventListener('input', () => {
      store.setSetting('query', searchInput.value);
    });

    hideEarnedBox = el('input', { type: 'checkbox', checked: store.settings.hideEarned });
    hideEarnedBox.addEventListener('change', () => store.setSetting('hideEarned', hideEarnedBox.checked));

    replace(elements.rail,
      el('h2', {}, 'Filters'),
      el('div', { class: 'chips' }, chips),
      el('div', { class: 'rule' }),
      el('label', { class: 'search-box', for: 'trophy-search' }, el('span', { text: '⌕' }), searchInput),
      el('label', { class: 'check-row' }, hideEarnedBox, 'Hide earned'),
      el('div', { class: 'rule' }),
      el('p', { class: 'board-note' },
        'Story trophies stay masked while the spoiler shield is on. Missable is a cross-cut: it overlaps the other filters. Progress is saved in this browser.')
    );
  }

  function refreshRail() {
    const counts = new Map();
    for (const filter of FILTERS) {
      const items = catalog.trophies.filter((trophy) => filter.test(trophy));
      const earned = items.filter((trophy) => store.earned.has(trophy.id)).length;
      counts.set(filter.id, { total: items.length, earned });
    }
    for (const [id, node] of chipNodes) {
      const info = counts.get(id);
      node.setAttribute('aria-pressed', String(store.settings.filter === id));
      node.classList.toggle('is-empty', info.total === 0);
      const badge = node.querySelector('.n');
      badge.textContent = info.total === 0 ? 'none' : `${info.earned}/${info.total}`;
    }
    if (searchInput && document.activeElement !== searchInput && searchInput.value !== store.settings.query) {
      searchInput.value = store.settings.query;
    }
    if (hideEarnedBox) hideEarnedBox.checked = Boolean(store.settings.hideEarned);
  }

  function renderList() {
    const list = visibleRows();
    const earnedInView = list.filter((trophy) => store.earned.has(trophy.id)).length;

    clear(elements.list);
    if (list.length === 0) {
      elements.list.append(
        el('p', { class: 'detail-empty', style: 'padding:18px 16px' },
          store.settings.filter === 'online'
            ? 'The launch list has no online trophies: the platinum needs none, and the story, activities, collectibles and robberies all sit in single-player.'
            : 'No trophy matches that filter and search.')
      );
    } else {
      const fragment = document.createDocumentFragment();
      for (const trophy of list) fragment.append(rowFor(trophy));
      elements.list.append(fragment);
    }

    replace(listHead,
      el('strong', { text: `${list.length} shown` }),
      el('span', { text: `${store.earned.size} of ${catalog.trophies.length} earned (${percent(store.earned.size, catalog.trophies.length)}) · ${earnedInView} in this view` })
    );
  }

  function rowFor(trophy) {
    const done = store.earned.has(trophy.id);
    const isMaskedRow = masked(trophy);
    const count = describeCount(trophy);

    const tick = el('span', {
      class: 'tick',
      role: 'checkbox',
      'aria-checked': String(done),
      'aria-label': `Mark ${isMaskedRow ? 'this story trophy' : trophy.name} as earned`,
      text: done ? '✓' : ''
    });

    const title = el('div', { class: 'row-title' },
      el('span', { class: 'row-name', text: visibleName(trophy, isMaskedRow) }),
      el('span', { class: `grade-pill ${trophy.grade}`, text: trophy.grade }),
      trophy.missable ? el('span', { class: 'tag missable', text: 'missable' }) : null,
      trophy.risk && !trophy.missable ? el('span', { class: 'tag risk', text: trophy.risk }) : null,
      done ? el('span', { class: 'tag done', text: 'earned' }) : null
    );

    const row = el('li', {
      class: `row${done ? ' is-done' : ''}`,
      role: 'option',
      tabindex: '0',
      'aria-selected': String(trophy.id === selectedId),
      'data-id': trophy.id,
      onclick: (event) => {
        if (event.target.closest('.tick')) return;
        select(trophy.id);
      },
      onkeydown: (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          select(trophy.id);
        } else if (event.key === ' ') {
          event.preventDefault();
          store.toggle(trophy.id);
        }
      }
    },
      tick,
      el('div', { class: 'row-main' },
        title,
        el('p', { class: 'row-desc', text: visibleDescription(trophy, isMaskedRow) })
      ),
      el('div', { class: 'row-meta' },
        el('span', { class: 'tag', text: KIND_LABEL[trophy.kind] || trophy.kind }),
        count ? el('span', { class: 'count-badge', text: count }) : null
      )
    );

    tick.addEventListener('click', (event) => {
      event.stopPropagation();
      store.toggle(trophy.id);
    });

    return row;
  }

  function renderDetail() {
    const trophy = catalog.byId.get(selectedId) || rows[0] || catalog.trophies[0];
    if (!trophy) {
      replace(elements.detail, el('p', { class: 'detail-empty', text: 'No trophy selected.' }));
      return;
    }
    if (trophy.id !== selectedId) selectedId = trophy.id;
    const isMaskedTrophy = masked(trophy);
    const done = store.earned.has(trophy.id);
    const stage = catalog.roadmap.stages.find((entry) => entry.trophies.includes(trophy.id));

    const badges = [
      el('span', { class: `grade-pill ${trophy.grade}`, text: trophy.grade }),
      el('span', { class: 'tag', text: KIND_LABEL[trophy.kind] || trophy.kind }),
      trophy.hidden ? el('span', { class: 'tag', text: 'hidden on PSN' }) : null,
      trophy.missable ? el('span', { class: 'tag missable', text: 'missable' }) : null,
      stage ? el('span', { class: 'tag', text: `stage ${stage.number}` }) : null
    ].filter(Boolean);

    const sources = (trophy.sources || []).map((source) =>
      el('li', {},
        source.url
          ? el('a', { href: source.url, target: '_blank', rel: 'noopener noreferrer', text: source.name })
          : el('span', { text: source.name })
      )
    );

    replace(elements.detail,
      el('div', { class: 'detail-top' },
        el('div', {},
          el('h2', { class: 'detail-title', text: visibleName(trophy, isMaskedTrophy) }),
          el('p', { class: 'detail-desc', text: `“${visibleDescription(trophy, isMaskedTrophy)}”` })
        )
      ),
      el('div', { class: 'detail-badges' }, badges),
      trophy.missable && trophy.missableReason
        ? el('div', { class: 'callout' },
            el('strong', {}, 'Missable — do it before it closes'),
            trophy.missableReason)
        : null,
      trophy.risk && !trophy.missable
        ? el('div', { class: 'callout risk' }, el('strong', {}, 'Plan around this'), trophy.risk + '.')
        : null,
      el('div', { class: 'guide-text' },
        el('p', { text: isMaskedTrophy ? MASKED_GUIDE : trophy.guide })
      ),
      !isMaskedTrophy && Array.isArray(trophy.steps) && trophy.steps.length
        ? el('ol', { class: 'steps' }, trophy.steps.map((step) => el('li', { text: step })))
        : null,
      el('div', { class: 'sources' },
        el('h3', {}, `Sources — ${(trophy.sources || []).length} cited`),
        el('ul', {}, sources),
        el('p', { class: 'board-note', text: 'Links open in a new tab only when followed; the app itself loads nothing.' })
      ),
      el('div', { class: 'detail-foot' },
        el('button', {
          class: `btn ${done ? '' : 'primary'}`,
          type: 'button',
          onclick: () => store.toggle(trophy.id)
        }, done ? 'Earned — tap to undo' : 'Mark as earned'),
        isMaskedTrophy
          ? el('button', {
              class: 'btn ghost',
              type: 'button',
              onclick: () => store.setSetting('spoilerShield', false)
            }, 'Show spoilers')
          : null
      )
    );
  }

  function select(id) {
    if (!catalog.byId.has(id)) return;
    selectedId = id;
    for (const node of elements.list.querySelectorAll('.row')) {
      node.setAttribute('aria-selected', String(node.dataset.id === id));
    }
    renderDetail();
  }

  function refresh() {
    refreshRail();
    renderList();
    renderDetail();
  }

  function mount() {
    listHead = el('div', { class: 'list-head' });
    elements.listHead.replaceWith(listHead);
    mountRail();
    selectedId = selectedId || catalog.trophies[0]?.id || null;
    refresh();
  }

  return {
    mount,
    refresh,
    select,
    get selectedId() {
      return selectedId;
    },
    maskedCount() {
      return maskedCount(catalog.trophies, store.settings, store.earned);
    },
    progress() {
      return progressOf(catalog.trophies, store.earned);
    }
  };
}
