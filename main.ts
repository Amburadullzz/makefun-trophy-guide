// Hands the entry in.
//
// The guide itself is plain static files in app/ (opened at app/index.html, no
// build step, nothing fetched from the network) plus the screenshots in
// screenshots/. This program stages both into the output directory the grader
// reads and writes dossier.json beside them with the kit's own library, so the
// judge's outline of the source matches what the scorer recomputes.
//
//   node main.ts                                  # writes to /output
//   MAKEFUN_OUTPUT_DIR=out node main.ts           # writes to ./out
//   node main.ts --out out --quiet                # same, with flags
//
// The two runs the grader makes must produce identical bytes, so nothing here
// depends on time, ordering of a directory listing or randomness.

import { Buffer } from 'node:buffer';
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

/** The directory this file lives in: the root of the entry. */
const entryRoot = dirname(fileURLToPath(import.meta.url));

/** Caps the scorer applies; mirrored here so a refusal happens before upload. */
const DOSSIER_LIMITS = {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  app_max_files: 993,
  app_max_bytes: 50_331_648,
};

/** What the program was asked to do, from argv and the environment. */
interface RunOptions {
  outputDir: string;
  quiet: boolean;
}

function parseArgs(argv: string[], env: NodeJS.ProcessEnv): RunOptions {
  let outputDir = env.MAKEFUN_OUTPUT_DIR && env.MAKEFUN_OUTPUT_DIR.trim() !== ''
    ? env.MAKEFUN_OUTPUT_DIR.trim()
    : '/output';
  let quiet = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--out' || arg === '--output-dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('-')) throw new Error(arg + ' needs a directory');
      outputDir = value;
      index += 1;
    } else if (arg.startsWith('--out=')) {
      outputDir = arg.slice('--out='.length);
    } else if (arg === '--quiet' || arg === '-q') {
      quiet = true;
    } else if (arg === '--help' || arg === '-h') {
      throw new Error('usage: node main.ts [--out <dir>] [--quiet]');
    } else {
      throw new Error('unknown argument: ' + arg);
    }
  }
  return { outputDir: resolve(outputDir), quiet };
}

/** Fails early, and with a readable message, if the entry is not where it should be. */
function checkEntryLayout(root: string): void {
  const required = [join(root, 'app', 'index.html'), join(root, 'app', 'data', 'trophies.json')];
  for (const path of required) {
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new Error('missing file in the entry: ' + path);
    }
  }
}

function countTree(dir: string): number {
  let total = 1;
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    total += statSync(path).isDirectory() ? countTree(path) : 1;
  }
  return total;
}

/** Replaces a previous copy, so a second run never leaves stale files behind. */
function stageFolder(from: string, to: string): void {
  if (!existsSync(from)) return;
  rmSync(to, { recursive: true, force: true });
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from).sort()) {
    const source = join(from, name);
    const target = join(to, name);
    if (statSync(source).isDirectory()) stageFolder(source, target);
    else copyFileSync(source, target);
  }
}

function main(): void {
  const options = parseArgs(process.argv.slice(2), process.env);
  checkEntryLayout(entryRoot);

  mkdirSync(options.outputDir, { recursive: true });
  stageFolder(join(entryRoot, 'app'), join(options.outputDir, 'app'));
  stageFolder(join(entryRoot, 'screenshots'), join(options.outputDir, 'screenshots'));

  const dossier = buildDossier(options.outputDir, DOSSIER_LIMITS);
  writeFileSync(join(options.outputDir, 'dossier.json'), dossier);

  if (!options.quiet) {
    const dossierText = typeof dossier === 'string' ? dossier : Buffer.from(dossier).toString('utf8');
    const parsed = JSON.parse(dossierText) as { text?: string };
    const totals = (parsed.text ?? '')
      .split('\n')
      .find((line) => line.startsWith('Totals:')) ?? 'Totals: (the library reported none)';
    console.log('staged app/ and screenshots/ into ' + options.outputDir);
    console.log('app/ holds ' + countTree(join(entryRoot, 'app')) + ' files and directories');
    console.log(totals);
  }
}

main();
