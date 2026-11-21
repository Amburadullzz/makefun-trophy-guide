// Boot: load the catalogue, mount the two views and wire the header controls.
// One job — start the app and keep the parts in step. Each view owns its own
// drawing; this file owns the tab switch, the spoiler switch and the transfer
// buttons, and nothing else.

import { el } from './dom.js';
import { loadCatalog } from './catalog.js';
import { ProgressStore } from './store.js';
import { createTrackerView } from './tracker-view.js';
import { createRoadmapView } from './roadmap-view.js';
import { createProgressBoard } from './progress-board.js';
import { downloadSnapshot, readSnapshotFile, applyImported } from './transfer.js';

const elements = {
  board: document.getElementById('progress-board'),
  rail: document.getElementById('filter-rail'),
  list: document.getElementById('trophy-list'),
  listHead: document.getElementById('list-head'),
  detail: document.getElementById('trophy-detail'),
  roadmap: document.getElementById('roadmap-panel'),
  trackerView: document.getElementById('view-tracker'),
  roadmapView: document.getElementById('view-roadmap'),
  tabs: [...document.querySelectorAll('[data-view]')],
  spoiler: document.getElementById('spoiler-toggle'),
  spoilerLabel: document.getElementById('spoiler-label'),
  exportButton: document.getElementById('export-button'),
  importButton: document.getElementById('import-button'),
  importInput: document.getElementById('import-input'),
  resetButton: document.getElementById('reset-button'),
  toastStack: document.getElementById('toast-stack')
};

async function boot() {
  const catalog = await loadCatalog('data');
  if (catalog.issues.length) console.warn('[leonida] catalogue check:', catalog.issues);
  console.info(`[leonida] ${catalog.trophies.length} trophies loaded, ${catalog.roadmap.stages.length} roadmap stages`);

  const store = new ProgressStore();
  const tracker = createTrackerView({ catalog, store, elements });
  const roadmap = createRoadmapView({
    catalog,
    store,
    elements,
    onOpenTrophy: (id) => {
      setView('tracker');
      tracker.select(id);
    }
  });
  const board = createProgressBoard({ catalog, store, elements });

  tracker.mount();
  roadmap.render();
  board.render();
  wireHeader();
  applyView(store.settings.view || 'tracker');

  store.subscribe(() => {
    tracker.refresh();
    roadmap.render();
    board.render();
    syncSpoiler();
    applyView(store.settings.view || 'tracker');
  });

  function wireHeader() {
    for (const tab of elements.tabs) {
      tab.addEventListener('click', () => {
        store.setSetting('view', tab.dataset.view);
      });
    }

    syncSpoiler();
    elements.spoiler.addEventListener('change', () => {
      store.setSetting('spoilerShield', elements.spoiler.checked);
    });

    elements.exportButton.addEventListener('click', () => {
      const result = downloadSnapshot(store, catalog);
      toast(`Exported ${result.count} earned trophies to ${result.filename}`);
    });

    elements.importButton.addEventListener('click', () => elements.importInput.click());
    elements.importInput.addEventListener('change', async () => {
      const file = elements.importInput.files && elements.importInput.files[0];
      if (!file) return;
      try {
        const payload = await readSnapshotFile(file);
        const result = applyImported(store, payload, catalog);
        toast(`Imported ${result.applied} trophies${result.skipped ? `, skipped ${result.skipped} unknown` : ''}`);
      } catch (error) {
        toast(`Import failed: ${error.message}`, true);
      } finally {
        elements.importInput.value = '';
      }
    });

    elements.resetButton.addEventListener('click', () => {
      const count = store.count();
      if (count === 0) {
        toast('Nothing to clear: the checklist is already empty.');
        return;
      }
      store.clearProgress();
      toast(`Cleared ${count} ticks. Settings and filters are unchanged.`);
    });
  }

  function syncSpoiler() {
    elements.spoiler.checked = Boolean(store.settings.spoilerShield);
    const masked = tracker.maskedCount();
    elements.spoilerLabel.textContent = store.settings.spoilerShield
      ? `on — ${masked} story ${masked === 1 ? 'trophy' : 'trophies'} masked`
      : 'off — story trophies shown';
  }

  function applyView(view) {
    const wanted = view === 'roadmap' ? 'roadmap' : 'tracker';
    elements.trackerView.hidden = wanted !== 'tracker';
    elements.roadmapView.hidden = wanted !== 'roadmap';
    for (const tab of elements.tabs) {
      tab.setAttribute('aria-selected', String(tab.dataset.view === wanted));
    }
  }

  // A small window handle so a headless check can drive the same code the
  // buttons drive: tick, export, import, read the store back.
  window.__leonida = {
    catalog,
    store,
    tracker,
    selectTrophy: (id) => {
      setView('tracker');
      tracker.select(id);
    },
    setView,
    exportSnapshot: () => downloadSnapshot(store, catalog),
    importSnapshotText: (text) => applyImported(store, JSON.parse(text), catalog),
    earnedIds: () => [...store.earned].sort()
  };

  function setView(view) {
    store.setSetting('view', view);
  }

  function toast(message, bad = false) {
    const node = el('div', { class: `toast${bad ? ' bad' : ''}`, role: 'status', text: message });
    elements.toastStack.append(node);
    setTimeout(() => node.remove(), 4200);
  }
}

boot().catch((error) => {
  console.error('[leonida] boot failed', error);
  const node = document.getElementById('boot-error');
  if (node) {
    node.hidden = false;
    node.textContent = `The guide could not load its data: ${error.message}. Serve app/ over HTTP rather than opening the file directly.`;
  }
});
