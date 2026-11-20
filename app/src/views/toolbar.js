// The sidebar: search, kind filters with live counts, the platinum meter, the
// spoiler switch and the export / import buttons. Built once; update() only
// rewrites the numbers and pressed states so the search box keeps its focus.

import { el } from '../ui/dom.js';
import { FILTERS, countByFilter } from '../filters.js';

import { exportProgress, importProgressFromFile } from './savePanel.js';
import { nextUp } from '../roadmap.js';

export function createSidebar(ctx) {
  const { data, store } = ctx;

  const searchInput = el('input', {
    type: 'search',
    id: 'trophy-search',
    placeholder: 'Search trophies',
    autocomplete: 'off',
    'aria-label': 'Search trophies',
  });
  searchInput.addEventListener('input', () => store.setQuery(searchInput.value));

  const filterButtons = new Map();
  const filterList = el('div', { class: 'filters', role: 'group', 'aria-label': 'Filter trophies' },
    FILTERS.map((filter) => {
      const count = el('span', { class: 'count' }, '0');
      const button = el('button', {
        class: 'filter',
        type: 'button',
        'aria-pressed': 'false',
        dataset: { filter: filter.id },
        onclick: () => store.setFilter(filter.id),
      }, [el('span', {}, filter.label), count]);
      filterButtons.set(filter.id, { button, count });
      return button;
    }));

  const progressCount = el('strong', {}, '0');
  const progressTotal = el('span', {}, `/ ${data.trophies.length} trophies`);
  const progressBar = el('i', { style: 'width:0%' });
  const progressNote = el('p', { class: 'progress-note' }, '');
  const nextButton = el('button', { class: 'next-up', type: 'button' }, '');
  nextButton.addEventListener('click', () => {
    const next = nextUp(data, store.getState());
    if (next) store.openTrophy(next.trophy.id);
  });

  const spoilerSwitch = el('button', {
    class: 'switch',
    type: 'button',
    role: 'switch',
    'aria-checked': 'true',
    'aria-label': 'Hide story trophy names until earned',
    onclick: () => store.setSpoiler(!store.getState().spoiler),
  });

  const exportButton = el('button', {
    class: 'btn btn-primary',
    type: 'button',
    onclick: () => exportProgress(store.getState(), data.trophies.length),
  }, 'Export progress');

  const fileInput = el('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only' });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    await importProgressFromFile(file, store, ctx.toast);
    fileInput.value = '';
  });

  const importButton = el('button', {
    class: 'btn',
    type: 'button',
    onclick: () => fileInput.click(),
  }, 'Import');

  const element = el('div', {}, [
    el('div', { class: 'side-block' }, [
      el('div', { class: 'side-title' }, ['Find']),
      el('div', { class: 'search' }, [
        el('span', { class: 'search-icon', 'aria-hidden': 'true' }, '⌕'),
        searchInput,
      ]),
    ]),
    el('div', { class: 'side-block' }, [
      el('div', { class: 'side-title' }, ['Filter by kind']),
      filterList,
      el('p', { class: 'filter-note' }, 'Kind counts add up to 55; the missable row cuts across them.'),
    ]),
    el('div', { class: 'side-block' }, [
      el('div', { class: 'side-title' }, ['Platinum progress']),
      el('div', { class: 'progress-card' }, [
        el('div', { class: 'progress-figure' }, [progressCount, progressTotal]),
        el('div', { class: 'bar' }, [progressBar]),
        progressNote,
        nextButton,
      ]),
    ]),
    el('div', { class: 'side-block' }, [
      el('div', { class: 'side-title' }, ['Spoilers']),
      el('div', { class: 'switch-row' }, [
        el('span', {}, ['Hide story names']),
        spoilerSwitch,
      ]),
    ]),
    el('div', { class: 'side-block' }, [
      el('div', { class: 'side-title' }, ['Save file']),
      el('div', { class: 'btn-row' }, [exportButton, importButton, fileInput]),
    ]),
  ]);

  /** Refresh counts, pressed states and the meter for the current state. */
  function update(state) {
    const counts = countByFilter(data.trophies);
    for (const [id, { button, count }] of filterButtons) {
      button.setAttribute('aria-pressed', String(state.filter === id));
      count.textContent = String(counts[id] ?? 0);
    }
    if (searchInput.value !== state.query) searchInput.value = state.query;
    spoilerSwitch.setAttribute('aria-checked', String(state.spoiler));

    const earned = data.trophies.filter((trophy) => state.earned.has(trophy.id)).length;
    const total = data.trophies.length;
    progressCount.textContent = String(earned);
    progressTotal.textContent = `/ ${total} earned`;
    progressBar.style.width = `${Math.round((earned / total) * 100)}%`;
    const next = nextUp(data, state);
    nextButton.textContent = next ? `Next up · ${next.trophy.name}` : 'Everything is done';
    nextButton.hidden = !next;
    progressNote.textContent = earned === total
      ? 'Every trophy earned — the platinum is yours.'
      : `${total - earned} to go. The platinum lands with the 54th. Progress saves in this browser.`;
  }

  return { element, update };
}
