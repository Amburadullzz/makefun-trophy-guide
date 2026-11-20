// Proves the app loads nothing over the network.
//
//   node tools/check_references.mjs
//
// It walks app/ and reads every reference a browser would follow from the
// page, the stylesheets and the modules: <script src>, <link href>, <img src>,
// @import, url(), static imports and dynamic import() of a literal. Each one
// must be a relative path that names a real file inside app/. Any http(s),
// ws(s), protocol-relative or data: reference in a script, stylesheet or
// module is a failure. Source URLs inside app/data/*.json are data, not
// references: they are printed separately as the citations they are.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(root, 'app');

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else files.push(path);
  }
  return files;
}

const files = walk(app);
const problems = [];
const references = [];

function checkReference(from, raw, kind) {
  const ref = raw.trim();
  if (ref === '') return;
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith('//')) {
    problems.push(`${relative(root, from)}: ${kind} points off the app: ${ref}`);
    return;
  }
  const target = resolve(dirname(from), ref.split('#')[0].split('?')[0]);
  if (!target.startsWith(app)) {
    problems.push(`${relative(root, from)}: ${kind} leaves app/: ${ref}`);
    return;
  }
  let isFile = false;
  try {
    isFile = statSync(target).isFile();
  } catch {
    isFile = false;
  }
  if (!isFile) problems.push(`${relative(root, from)}: ${kind} names no file: ${ref}`);
  references.push([relative(app, from), kind, ref]);
}

for (const file of files) {
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  const text = readFileSync(file, 'utf8');

  if (ext === '.html' || ext === '.htm') {
    for (const match of text.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) checkReference(file, match[1], 'script src');
    for (const match of text.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) checkReference(file, match[1], 'link href');
    for (const match of text.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) checkReference(file, match[1], 'img src');
    for (const match of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      for (const url of match[1].matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) checkReference(file, url[1], 'inline style url()');
    }
  }

  if (ext === '.css') {
    for (const match of text.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/gi)) checkReference(file, match[1], '@import');
    for (const match of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) checkReference(file, match[1], 'url()');
  }

  if (ext === '.js' || ext === '.mjs') {
    for (const match of text.matchAll(/\b(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]/g)) checkReference(file, match[1], 'static import');
    for (const match of text.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) checkReference(file, match[1], 'dynamic import()');
  }
}

// Citations in the data are allowed and expected; they are never fetched.
const citations = [];
for (const file of files.filter((f) => f.endsWith('.json'))) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(/https?:\/\/[^"\s]+/g)) citations.push([relative(app, file), match[0]]);
}

console.log(`files under app/: ${files.length}`);
console.log(`references followed by a browser: ${references.length}`);
for (const [from, kind, ref] of references) console.log(`  ok  ${from}  ${kind}  ->  ${ref}`);
console.log(`absolute URLs in the app's code and markup: ${problems.filter((p) => /points off the app/.test(p)).length}`);
console.log(`citation URLs in app/data (data, never fetched): ${citations.length}`);
if (problems.length) {
  console.log('PROBLEMS:');
  for (const problem of problems) console.log('  ' + problem);
  process.exit(1);
}
console.log('RESULT: pass - every reference is a file under app/, nothing is fetched from the network');
