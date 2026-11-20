// Export and import of the progress file. Export writes a small JSON document
// through a Blob download; import reads the same shape back and replaces the
// earned set. Neither touches the network.

import { buildExport, parseImport } from '../store.js';

/** Download the current progress as a JSON file. */
export function exportProgress(state, trophyCount) {
  const { fileName, text } = buildExport(state, trophyCount);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return fileName;
}

/** Read a picked file and apply its earned set. */
export async function importProgressFromFile(file, store, toast) {
  try {
    const text = await file.text();
    const ids = parseImport(text);
    store.setEarned(ids);
    toast(`Imported ${ids.length} earned troph${ids.length === 1 ? 'y' : 'ies'}`);
  } catch (error) {
    toast(`Import failed: ${error.message}`);
  }
}

/** A short-lived message at the bottom of the screen. */
export function createToast(host) {
  let timer = null;
  return (message) => {
    host.querySelector('.toast')?.remove();
    const node = document.createElement('div');
    node.className = 'toast';
    node.setAttribute('role', 'status');
    node.textContent = message;
    host.append(node);
    clearTimeout(timer);
    timer = setTimeout(() => node.remove(), 2600);
  };
}
