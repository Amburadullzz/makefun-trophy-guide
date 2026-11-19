// Boot and wiring. Loads the data once, owns the small amount of UI state (which view, which trophy is
// open, whether a covered guide has been forced open), and re-renders on every change.

import { loadTrophyData, KIND_LABELS, KIND_ORDER, GRADE_ORDER } from './data.js';
import { createProgressStore } from './store.js';
import { createFilters, isRevealed, countByKind } from './filters.js';
import { overallStats } from './roadmap.js';
import { renderChecklist } from './views/checklist.js';
import { renderDrawer } from './views/detail.js';
import { renderRoadmap } from './views/roadmapView.js';
import { renderMissables } from './views/missables.js';
import { renderSources } from './views/sources.js';
import { createSaveModal } from './views/saveModal.js';
import { el, clear } from './ui/dom.js';

const VIEWS = ['checklist', 'roadmap', 'missables', 'sources'];

const refs = {
  earnedCount: document.getElementById('earned-count'),
  platinumState: document.getElementById('platinum-state'),
  progressFill: document.getElementById('progress-fill'),
  progressRail: document.getElementById('progress-rail'),
  shell: document.querySelector('.shell'),
  drawer: document.getElementById('drawer'),
  list: document.getElementById('trophy-list'),
  title: document.getElementById('list-title'),
  count: document.getElementById('list-count'),
  empty: document.getElementById('empty-state'),
  nextUp: document.getElementById('next-up'),
  kindFilters: document.getElementById('kind-filters'),
  gradeFilters: document.getElementById('grade-filters'),
  gradeTally: document.getElementById('grade-tally'),
  search: document.getElementById('search'),
  onlyMissable: document.getElementById('only-missable'),
  onlyUnearned: document.getElementById('only-unearned'),
  spoiler: document.getElementById('spoiler-mode'),
  missableTotal: document.getElementById('missable-total'),
  viewChecklist: document.getElementById('view-checklist'),
  viewRoadmap: document.getElementById('view-roadmap'),
  viewMissables: document.getElementById('view-missables'),
  viewSources: document.getElementById('view-sources'),
};

const ui = {
  view: 'checklist',
  selectedId: null,
  filters: createFilters(),
  /** Story trophies the reader chose to uncover by hand while spoiler mode is on. */
  uncovered: new Set(),
};

let data;
let store;
let saveModal;

/** The spoiler rule plus the reader's per-trophy override. */
function revealed(trophy) {
  return isRevealed(trophy, store) || ui.uncovered.has(trophy.id);
}

function currentView() {
  const name = (location.hash.replace('#/', '') || 'checklist').split('?')[0];
  return VIEWS.includes(name) ? name : 'checklist';
}

function toggleEarned(id, earned) {
  store.setEarned(id, earned);
  render();
}

function openTrophy(id) {
  ui.selectedId = ui.selectedId === id ? null : id;
  render();
}

function renderTabs() {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.tab === ui.view);
    tab.setAttribute('aria-current', tab.dataset.tab === ui.view ? 'page' : 'false');
  }
}

function renderHeader() {
  const overall = overallStats(data, store);
  refs.earnedCount.textContent = String(overall.earned);
  refs.platinumState.textContent = overall.platinum ? 'platinum earned' : `${overall.total - overall.earned} to go`;
  refs.platinumState.classList.toggle('is-earned', overall.platinum);
  refs.progressFill.style.width = `${overall.percent}%`;
  refs.progressRail.setAttribute('aria-label', `${overall.earned} of ${overall.total} trophies earned, ${overall.percent} per cent`);
}

function renderFilters() {
  const kindCounts = countByKind(data.trophies);
  clear(refs.kindFilters);
  const kinds = ['all', ...KIND_ORDER.filter((kind) => data.kinds.includes(kind))];
  for (const kind of kinds) {
    const count = kind === 'all' ? data.totals.all : kindCounts[kind] ?? 0;
    refs.kindFilters.append(
      el(
        'button',
        {
          type: 'button',
          class: `chip${ui.filters.kind === kind ? ' is-on' : ''}`,
          'data-kind': kind,
          'aria-pressed': ui.filters.kind === kind ? 'true' : 'false',
          onclick: () => {
            ui.filters.kind = kind;
            render();
          },
        },
        kind === 'all' ? 'Everything' : KIND_LABELS[kind],
        el('span', { class: 'chip__count' }, String(count)),
      ),
    );
  }

  clear(refs.gradeFilters);
  for (const grade of ['all', ...GRADE_ORDER]) {
    const count = grade === 'all' ? data.totals.all : data.totals.byGrade[grade];
    refs.gradeFilters.append(
      el(
        'button',
        {
          type: 'button',
          class: `chip${ui.filters.grade === grade ? ' is-on' : ''}`,
          'data-grade': grade,
          'aria-pressed': ui.filters.grade === grade ? 'true' : 'false',
          onclick: () => {
            ui.filters.grade = grade;
            render();
          },
        },
        grade === 'all' ? 'Any' : grade[0].toUpperCase() + grade.slice(1),
        el('span', { class: 'chip__count' }, String(count)),
      ),
    );
  }

  clear(refs.gradeTally);
  for (const grade of GRADE_ORDER) {
    const total = data.totals.byGrade[grade];
    const earned = data.trophies.filter((trophy) => trophy.grade === grade && store.isEarned(trophy.id)).length;
    refs.gradeTally.append(el('li', {}, el('span', {}, grade), el('b', {}, `${earned}/${total}`)));
  }

  refs.missableTotal.textContent = String(data.totals.missable);
  refs.onlyMissable.checked = ui.filters.missable;
  refs.onlyUnearned.checked = ui.filters.unearned;
  refs.spoiler.checked = store.spoilerOn();
}

function renderViews() {
  const show = (node, on) => {
    node.hidden = !on;
  };
  show(refs.viewChecklist, ui.view === 'checklist');
  show(refs.viewRoadmap, ui.view === 'roadmap');
  show(refs.viewMissables, ui.view === 'missables');
  show(refs.viewSources, ui.view === 'sources');

  if (ui.view === 'checklist') {
    renderChecklist(refs, {
      data,
      store,
      filters: ui.filters,
      selectedId: ui.selectedId,
      onSelect: openTrophy,
      onToggle: toggleEarned,
    });
  }
  if (ui.view === 'roadmap') renderRoadmap(refs.viewRoadmap, { data, store, onSelect: openTrophy });
  if (ui.view === 'missables') renderMissables(refs.viewMissables, { data, store, onSelect: openTrophy });
  if (ui.view === 'sources') renderSources(refs.viewSources, { data });
}

function renderDrawerPane() {
  const trophy = ui.selectedId ? data.byId.get(ui.selectedId) : null;
  refs.drawer.hidden = !trophy;
  refs.shell.classList.toggle('has-drawer', Boolean(trophy));
  if (!trophy) {
    clear(refs.drawer);
    return;
  }
  renderDrawer(refs.drawer, {
    trophy,
    data,
    store,
    revealed: revealed(trophy),
    onClose: () => {
      ui.selectedId = null;
      render();
    },
    onToggle: toggleEarned,
    onCounter: (count) => {
      store.setCounter(trophy.id, count);
      if (trophy.target && count >= trophy.target.count) store.setEarned(trophy.id, true);
      render();
    },
    onReveal: () => {
      ui.uncovered.add(trophy.id);
      render();
    },
  });
}

function render() {
  const scroll = document.querySelector('.main').scrollTop;
  ui.view = currentView();
  renderTabs();
  renderHeader();
  renderFilters();
  renderViews();
  renderDrawerPane();
  document.querySelector('.main').scrollTop = scroll;
}

function wireControls() {
  let timer = null;
  refs.search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      ui.filters.query = refs.search.value.trim();
      render();
    }, 120);
  });
  refs.onlyMissable.addEventListener('change', () => {
    ui.filters.missable = refs.onlyMissable.checked;
    render();
  });
  refs.onlyUnearned.addEventListener('change', () => {
    ui.filters.unearned = refs.onlyUnearned.checked;
    render();
  });
  refs.spoiler.addEventListener('change', () => {
    store.setSpoiler(refs.spoiler.checked);
    render();
  });
  document.getElementById('open-export').addEventListener('click', () => saveModal.open('export'));
  document.getElementById('open-import').addEventListener('click', () => saveModal.open('import'));
  window.addEventListener('hashchange', render);
}

async function boot() {
  data = await loadTrophyData();
  store = createProgressStore(new Set(data.trophies.map((trophy) => trophy.id)));
  saveModal = createSaveModal({ store, onChange: render });
  wireControls();
  render();
}

boot().catch((error) => {
  document.body.prepend(el('p', { class: 'empty' }, `The guide could not start: ${error.message}`));
});
