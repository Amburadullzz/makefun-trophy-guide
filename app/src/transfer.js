// Export and import of the progress file.
// One job — turn the store into a JSON file the reader can keep, and read one
// back. The file is written with a Blob URL and read with FileReader, so
// neither direction asks the network for anything.

import { SNAPSHOT_FORMAT } from './store.js';

export function buildSnapshot(store, catalog) {
  const order = catalog ? catalog.trophies.map((trophy) => trophy.id) : null;
  return store.snapshot(order);
}

export function snapshotFilename(now = new Date()) {
  const stamp = now.toISOString().slice(0, 10);
  return `leonida-legend-progress-${stamp}.json`;
}

export function downloadSnapshot(store, catalog) {
  const payload = buildSnapshot(store, catalog);
  const blob = new Blob([JSON.stringify(payload, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = snapshotFilename();
  link.rel = 'noopener';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { filename: link.download, count: payload.count };
}

export function parseSnapshotText(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('that file is not JSON');
  }
  if (!payload || typeof payload !== 'object') throw new Error('that file holds no progress object');
  if (payload.format && payload.format !== SNAPSHOT_FORMAT) {
    throw new Error(`that file is a ${payload.format} file, not ${SNAPSHOT_FORMAT}`);
  }
  if (!Array.isArray(payload.earned)) throw new Error('that file has no earned list');
  return payload;
}

export async function readSnapshotFile(file) {
  const text = await file.text();
  return parseSnapshotText(text);
}

export function applyImported(store, payload, catalog) {
  const known = catalog ? new Set(catalog.trophies.map((trophy) => trophy.id)) : null;
  return store.applySnapshot(payload, known);
}
