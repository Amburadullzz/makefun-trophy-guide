// Hand the entry in.
//
// The guide itself is app/ — plain static files that a browser opens at
// app/index.html with no build step and no network. This program is the
// packing step the competition asks for: it puts app/ and screenshots/ into
// the output directory ($MAKEFUN_OUTPUT_DIR, else /output) and writes
// dossier.json there with the vendored make.fun library, so the judge has the
// screenshots, the first-load bytes and an outline of the source.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// vendor/makefun-frontend.ts stays byte for byte as the kit ships it: the
// scorer rebuilds dossier.json with its own copy and compares the two.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, 'app');
const SHOTS = join(HERE, 'screenshots');

// The caps the scorer applies. They only shape the dossier's text budget and
// refuse what the gate would refuse anyway, so a local run fails loudly here
// instead of at grading time.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648
};

function destination() {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return resolve(fromEnv && fromEnv.trim() ? fromEnv.trim() : '/output');
}

function copyTree(from, to) {
  if (!existsSync(from)) return 0;
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
  return countFiles(to);
}

function countFiles(root) {
  let files = 0;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) files += countFiles(full);
    else if (entry.isFile()) files += 1;
  }
  return files;
}

function main() {
  if (!existsSync(join(APP, 'index.html'))) {
    throw new Error(`app/index.html is missing under ${APP}`);
  }
  const out = destination();
  mkdirSync(out, { recursive: true });

  const appFiles = copyTree(APP, join(out, 'app'));
  const shotFiles = copyTree(SHOTS, join(out, 'screenshots'));

  const dossier = buildDossier(out, DOSSIER_CAPS);
  writeFileSync(join(out, 'dossier.json'), dossier);

  const kb = (bytes) => (bytes / 1024).toFixed(1) + ' KiB';
  console.log(`wrote ${join(out, 'dossier.json')} (${kb(dossier.length)})`);
  console.log(`app: ${appFiles} files · screenshots: ${shotFiles}`);
}

main();
