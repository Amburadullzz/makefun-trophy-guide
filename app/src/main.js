// Boots the app: loads the data, builds the state, wires the header controls
// and redraws the views whenever something changes.

import { loadGuideData } from './core/trophy-data.js';
import { createProgressStore } from './core/progress-store.js';
import { createSettingsStore } from './core/settings-store.js';
import { emptyFilters, applyFilters } from './core/trophy-filter.js';
import { downloadProgress, readProgressFile, applyImportedProgress } from './core/progress-transfer.js';
import { renderProgressHeader } from './ui/progress-header.js';
import { renderFilterRail } from './ui/filter-rail.js';
import { renderTrackerList } from './ui/tracker-list.js';
import { renderGuidePanel } from './ui/guide-panel.js';
import { renderRoadmap } from './ui/roadmap-view.js';
import { renderAbout } from './ui/about-view.js';
import { showToast } from './ui/toast.js';
import { byId } from './ui/dom.js';

const state = {
  data: null,
  store: null,
  settings: null,
  filters: emptyFilters(),
  selectedId: null,
  view: 'tracker',
  peeked: new Set(),
  visibleTrophies: [],
};

const actions = {
  toggleEarned(id) {
    const now = state.store.toggle(id);
    const trophy = state.data.byId.get(id);
    renderAll();
    if (trophy) showToast((now ? 'Earned: ' : 'Unmarked: ') + trophy.name, 1800);
  },
  select(id) {
    state.selectedId = id;
    renderList();
    renderGuide();
    revealRow(id);
  },
  openTrophy(id) {
    state.selectedId = id;
    state.peeked.add(id);
    showView('tracker');
    renderTracker();
    revealRow(id);
  },
  setKind(kind) {
    state.filters.kind = kind;
    renderTracker();
  },
  setMissableOnly(on) {
    state.filters.missableOnly = on;
    renderTracker();
  },
  setUnearnedOnly(on) {
    state.filters.unearnedOnly = on;
    renderTracker();
  },
  setQuery(query) {
    state.filters.query = query;
    renderList();
    const count = byId('rail-count');
    if (count) count.textContent = state.visibleTrophies.length + ' shown';
  },
  setSpoilerSafe(on) {
    if (state.settings.spoilerSafe === Boolean(on)) return;
    state.settings.setSpoilerSafe(on);
    // keep the header switch in step when the setting is changed from code
    const toggle = byId('spoiler-toggle');
    if (toggle) toggle.checked = Boolean(on);
    renderAll();
    showToast(on ? 'Spoiler-safe is on: story trophies are masked.' : 'Spoiler-safe is off.', 2400);
  },
  peek(id) {
    state.peeked.add(id);
    renderGuide();
  },
  clearProgress() {
    state.store.clear();
    renderAll();
    showToast('Progress cleared. Export first next time if you wanted a copy.', 3000);
  },
  exportProgress() {
    const result = downloadProgress(state.store, state.data);
    showToast('Exported ' + state.store.count() + ' earned to ' + result.filename, 3200);
  },
  async importProgress(file) {
    try {
      const parsed = await readProgressFile(file);
      const result = applyImportedProgress(parsed, state.data, state.store);
      renderAll();
      showToast('Imported ' + result.applied + ' earned' + (result.skipped ? ', ' + result.skipped + ' name(s) not in this list' : '') + '.', 3600);
    } catch (error) {
      showToast('Import failed: ' + error.message, 4000);
    }
  },
};

function computeVisible() {
  state.visibleTrophies = applyFilters(state.data.trophies, state.filters, (id) => state.store.has(id));
}

function renderList() {
  computeVisible();
  const body = byId('list-body');
  const keepScroll = body ? body.scrollTop : 0;
  renderTrackerList(byId('tracker-list'), state, actions);
  const fresh = byId('list-body');
  if (fresh) fresh.scrollTop = keepScroll;
}

function renderGuide() {
  const body = byId('guide-body');
  const keepScroll = body ? body.scrollTop : 0;
  renderGuidePanel(byId('guide-pane'), state, actions);
  const fresh = byId('guide-body');
  if (fresh) fresh.scrollTop = keepScroll;
}

/** Scrolls the checklist just enough to show a row the reader asked for. */
function revealRow(id) {
  const row = document.querySelector('[data-row-id="' + id + '"]');
  const body = byId('list-body');
  if (!row || !body) return;
  const rowBox = row.getBoundingClientRect();
  const bodyBox = body.getBoundingClientRect();
  if (rowBox.top < bodyBox.top || rowBox.bottom > bodyBox.bottom) {
    row.scrollIntoView({ block: 'center' });
  }
}

function renderTracker() {
  computeVisible();
  renderFilterRail(byId('filter-rail'), state, actions);
  renderTrackerList(byId('tracker-list'), state, actions);
  renderGuidePanel(byId('guide-pane'), state, actions);
  renderProgressHeader(state);
}

function renderAll() {
  computeVisible();
  renderProgressHeader(state);
  renderTracker();
  renderRoadmap(byId('view-roadmap'), state, actions);
  renderAbout(byId('view-about'), state);
}

function showView(name) {
  state.view = name;
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== 'view-' + name;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    const active = tab.dataset.view === name;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  }
}

function wireHeader() {
  byId('btn-export').addEventListener('click', () => actions.exportProgress());
  const input = byId('import-input');
  byId('btn-import').addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (file) actions.importProgress(file);
    input.value = '';
  });
  const spoiler = byId('spoiler-toggle');
  spoiler.checked = state.settings.spoilerSafe;
  spoiler.addEventListener('change', () => actions.setSpoilerSafe(spoiler.checked));

  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
      const search = byId('filter-search');
      if (search) {
        event.preventDefault();
        search.focus();
      }
    }
  });
}

function firstSelection() {
  const firstUnearned = state.data.trophies.find((t) => !state.store.has(t.id));
  return (firstUnearned || state.data.trophies[0]).id;
}

async function boot() {
  state.store = createProgressStore();
  state.settings = createSettingsStore();
  state.data = await loadGuideData();
  state.selectedId = firstSelection();

  wireHeader();
  showView('tracker');
  renderAll();

  // A handle for the checks in tools/: the same state the UI renders from.
  window.leonidaLedger = { state, actions, renderAll, ready: true };
  document.documentElement.dataset.ready = 'true';
}

boot().catch((error) => {
  const main = byId('main');
  if (main) {
    main.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'empty-state';
    box.textContent = 'The guide could not start: ' + error.message;
    main.append(box);
  }
  console.error(error);
});
