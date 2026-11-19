// Hands the entry in: copies the static guide (app/) and the screenshots beside this file into the output
// directory, then writes dossier.json from them with the kit's vendored buildDossier. Node 22, standard
// library only, no build step: app/ is already the finished site.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// MAKEFUN_OUTPUT_DIR stands in for the grader's /output. The limits passed to buildDossier are the
// competition's own (163,840 bytes of dossier text, 4 screenshots of at most 256 KiB, app/ at most 993
// files and 48 MiB); a run that would break one fails here rather than at the gate.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repository = fileURLToPath(new URL('.', import.meta.url));

/** The output directory: the grader's /output, or MAKEFUN_OUTPUT_DIR when run by hand. */
function outputDirectory(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
}

/** app/ is the whole guide: plain files, served as they are. */
function copyGuide(out: string): void {
  cpSync(join(repository, 'app'), join(out, 'app'), { recursive: true });
}

/** The screenshots the judge sees first: the cover is the first by name. */
function copyScreenshots(out: string): void {
  const from = join(repository, 'screenshots');
  if (!existsSync(from)) return;
  cpSync(from, join(out, 'screenshots'), { recursive: true });
}

/** dossier.json: the screenshots sheet plus the outline of the guide's source, as the kit computes it. */
function writeDossier(out: string): number {
  const dossier = buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(out, 'dossier.json'), dossier);
  return dossier.length;
}

const out = outputDirectory();
mkdirSync(out, { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
copyGuide(out);
copyScreenshots(out);
const bytes = writeDossier(out);

console.log(`entry written to ${out}`);
console.log(`  app/        copied from ${join(repository, 'app')}`);
console.log(`  screenshots/ copied, dossier.json ${bytes} bytes`);
