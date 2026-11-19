// The save-file modal: one dialog for both directions. Export fills the box with the progress file and
// offers it as a download; import takes a pasted box or a chosen file and replaces the saved progress.

export function createSaveModal({ store, onChange }) {
  const modal = document.getElementById('save-modal');
  const title = document.getElementById('save-modal-title');
  const intro = document.getElementById('save-modal-intro');
  const text = document.getElementById('save-text');
  const action = document.getElementById('save-action');
  const download = document.getElementById('download-link');
  const reset = document.getElementById('reset-progress');
  const note = document.getElementById('save-note');
  const closeButton = document.getElementById('close-modal');

  let mode = 'export';
  let objectUrl = null;

  const filePicker = document.createElement('input');
  filePicker.type = 'file';
  filePicker.accept = 'application/json,.json';
  filePicker.className = 'visually-hidden';
  filePicker.id = 'import-file';
  text.after(filePicker);

  function setNote(message, isError = false) {
    note.textContent = message;
    note.classList.toggle('is-error', isError);
  }

  function open(nextMode) {
    mode = nextMode;
    setNote('');
    modal.hidden = false;
    if (mode === 'export') {
      title.textContent = 'Export progress';
      intro.textContent = 'This is your progress file: the trophies you have ticked and the counters you have filled. Keep it, or paste it into the same box on another machine.';
      text.value = store.exportText();
      text.readOnly = true;
      action.hidden = true;
      download.hidden = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(new Blob([text.value], { type: 'application/json' }));
      download.href = objectUrl;
    } else {
      title.textContent = 'Import progress';
      intro.textContent = 'Paste a progress file below, or choose the file you exported. Importing replaces what this browser has saved.';
      text.value = '';
      text.readOnly = false;
      action.hidden = false;
      download.hidden = true;
      text.focus();
    }
  }

  function close() {
    modal.hidden = true;
  }

  action.addEventListener('click', () => {
    const result = store.importText(text.value);
    if (!result.ok) {
      setNote(result.error, true);
      return;
    }
    setNote(`Imported ${result.count} earned ${result.count === 1 ? 'trophy' : 'trophies'}${result.ignored ? `, ignored ${result.ignored} unknown id${result.ignored === 1 ? '' : 's'}` : ''}.`);
    onChange();
    setTimeout(close, 900);
  });

  reset.addEventListener('click', () => {
    store.reset();
    onChange();
    setNote('Progress cleared. Nothing is ticked.');
    if (mode === 'export') text.value = store.exportText();
  });

  filePicker.addEventListener('change', async () => {
    const file = filePicker.files?.[0];
    if (!file) return;
    text.value = await file.text();
    setNote(`Loaded ${file.name}. Press Import to use it.`);
  });

  closeButton.addEventListener('click', close);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });

  return { open, close };
}
