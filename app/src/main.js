// Boot: load the trophy file, restore the saved progress, build the sidebar
// once, then re-render the stage and the guide panel on every state change.

import { loadTrophyData } from './data.js';
import { createStore } from './store.js';
import { selectVisible } from './filters.js';
import { createSidebar } from './views/toolbar.js';
import { renderChecklist } from './views/checklist.js';
import { renderDetail } from './views/detail.js';
import { renderRoadmap } from './views/roadmapView.js';
import { renderMissables } from './views/missablesView.js';
import { createToast } from './views/savePanel.js';

async function boot() {
  const workspace = document.getElementById('workspace');
  const stage = document.getElementById('stage');
  const inspector = document.getElementById('inspector');
  const sidebarHost = document.getElementById('sidebar');
  const tabsHost = document.getElementById('tabs');
  const meter = document.getElementById('topbar-meter');

  let data;
  try {
    data = await loadTrophyData();
  } catch (error) {
    stage.append(Object.assign(document.createElement('p'), {
      className: 'empty',
      textContent: `Could not read data/trophies.json — ${error.message}`,
    }));
    return;
  }

  const store = createStore(new Set(data.trophies.map((trophy) => trophy.id)));
  const toast = createToast(document.body);
  const ctx = { data, store, state: store.getState(), visible: [], toast };

  const sidebar = createSidebar(ctx);
  sidebarHost.append(sidebar.element);

  const tabButtons = [...tabsHost.querySelectorAll('.tab')];
  for (const button of tabButtons) {
    button.addEventListener('click', () => store.setView(button.dataset.view));
  }

  function render() {
    const state = store.getState();
    ctx.state = state;
    ctx.visible = selectVisible(data.trophies, state);

    sidebar.update(state);

    for (const button of tabButtons) {
      button.setAttribute('aria-selected', String(button.dataset.view === state.view));
    }

    const earnedCount = state.earned.size;
    meter.replaceChildren(
      Object.assign(document.createElement('span'), {
        textContent: `${earnedCount}/${data.trophies.length} earned · ${data.trophies.length - earnedCount} to go`,
      }),
    );

    if (state.view === 'tracker') {
      workspace.classList.remove('no-inspector');
      renderChecklist(stage, ctx);
      renderDetail(inspector, ctx);
    } else if (state.view === 'roadmap') {
      workspace.classList.add('no-inspector');
      renderRoadmap(stage, ctx);
    } else {
      workspace.classList.add('no-inspector');
      renderMissables(stage, ctx);
    }
  }

  store.subscribe(render);
  render();

  // "/" jumps to the search box, Escape closes the open guide.
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault();
      document.getElementById('trophy-search')?.focus();
    }
    if (event.key === 'Escape' && store.getState().openId) store.openTrophy(null);
  });

  // A small handle for debugging and for the headless checks.
  window.__ledger = { data, store, render };
}

boot();
