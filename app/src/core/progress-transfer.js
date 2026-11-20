// Export writes a JSON file through a Blob URL, so it needs no server and no
// network; import reads the same shape back and matches trophies by name, which
// survives any renumbering of the data file.

const EXPORT_APP = 'leonida-ledger';
const EXPORT_VERSION = 1;

export function buildProgressExport(store, data) {
  const earned = store.ids().map((id) => {
    const trophy = data.byId.get(id);
    return { id, name: trophy ? trophy.name : String(id), grade: trophy ? trophy.grade : null };
  });
  return {
    app: EXPORT_APP,
    version: EXPORT_VERSION,
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    exportedAt: new Date().toISOString(),
    earnedCount: earned.length,
    total: data.trophies.length,
    earned,
  };
}

export function serializeProgress(store, data) {
  return JSON.stringify(buildProgressExport(store, data), null, 2);
}

export function exportFilename(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10);
  return 'leonida-ledger-progress-' + stamp + '.json';
}

export function downloadProgress(store, data) {
  const text = serializeProgress(store, data);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = exportFilename();
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return { filename: anchor.download, bytes: text.length };
}

export async function readProgressFile(file) {
  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not JSON.');
  }
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('No "earned" list in that file.');
  return {
    names: list.map((entry) => (typeof entry === 'string' ? entry : entry && entry.name)).filter(Boolean),
    ids: list.map((entry) => (entry && Number.isInteger(entry.id) ? entry.id : null)).filter((id) => id !== null),
    exportedAt: parsed && parsed.exportedAt ? parsed.exportedAt : null,
  };
}

export function applyImportedProgress(parsed, data, store) {
  const resolved = new Set();
  let skipped = 0;
  for (const name of parsed.names) {
    const trophy = data.byName.get(name);
    if (trophy) resolved.add(trophy.id);
    else skipped += 1;
  }
  if (resolved.size === 0 && parsed.ids.length) {
    for (const id of parsed.ids) {
      if (data.byId.has(id)) resolved.add(id);
    }
  }
  store.replace([...resolved]);
  return { applied: resolved.size, skipped };
}
