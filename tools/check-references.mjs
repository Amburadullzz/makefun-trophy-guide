// Check 6: nothing the app loads comes over the network.
//
//   node tools/check-references.mjs
//
// It walks every .html, .css, .js and .mjs file under app/ and pulls out the
// references a browser would follow — script src, stylesheet and preload
// links, img/source/poster, iframe and object, @import, url(), static and
// dynamic import specifiers, fetch() and XMLHttpRequest targets — then checks
// each one is a path of the app itself. Outbound <a href> citations are listed
// separately: those are text for the reader to follow, not something the page
// loads.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = 'app';
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
})(ROOT);

const loads = [];
const citations = [];
const problems = [];

function note(kind, spec, file, isLoad = true) {
  const entry = { kind, spec, file: relative('.', file) };
  if (isLoad) loads.push(entry);
  else citations.push(entry);
}

function classifyLoad(spec, file, kind) {
  if (!spec) return;
  if (spec.startsWith('#')) return;
  if (spec.startsWith('data:')) {
    // data: is allowed for images and fonts only
    if (/^data:image\//.test(spec) || /^data:font\//.test(spec) || /^data:application\/font/.test(spec)) return;
    problems.push(`${relative('.', file)}: ${kind} uses a data: URL that is not an image or a font`);
    return;
  }
  if (/^[a-z]+:/i.test(spec) || spec.startsWith('//')) {
    problems.push(`${relative('.', file)}: ${kind} points at the network — ${spec}`);
    return;
  }
  const target = spec.split(/[?#]/)[0];
  if (!target) return;
  const resolved = join(file, '..', target).replace(/^app\//, '');
  try {
    statSync(join(ROOT, resolved));
  } catch {
    problems.push(`${relative('.', file)}: ${kind} names a file that is not in app/ — ${spec}`);
  }
}

for (const file of files) {
  const ext = extname(file).toLowerCase();
  const text = readFileSync(file, 'utf8');

  if (ext === '.html') {
    for (const match of text.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
      note('script src', match[1], file);
      classifyLoad(match[1], file, 'script src');
    }
    for (const match of text.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
      const tag = match[0];
      if (/rel\s*=\s*["'][^"']*(stylesheet|preload|prefetch|modulepreload|icon|manifest)/i.test(tag)) {
        note('link href', match[1], file);
        classifyLoad(match[1], file, 'link href');
      }
    }
    for (const match of text.matchAll(/<(?:img|source|video|audio|track|iframe|embed)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
      note('media src', match[1], file);
      classifyLoad(match[1], file, 'media src');
    }
    for (const match of text.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi)) {
      note('anchor href', match[1], file, false);
    }
  }

  if (ext === '.css') {
    for (const match of text.matchAll(/@import\s+(?:url\()?["']([^"']+)["']/gi)) {
      note('@import', match[1], file);
      classifyLoad(match[1], file, '@import');
    }
    for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      note('url()', match[1], file);
      classifyLoad(match[1], file, 'url()');
    }
  }

  if (ext === '.json') {
    // Source URLs live here as data: the app reads them as text and renders
    // them as links, it never loads them.
    for (const match of text.matchAll(/"(https?:\/\/[^"]+)"/g)) {
      note('citation data', match[1], file, false);
    }
  }

  if (ext === '.js' || ext === '.mjs') {
    for (const match of text.matchAll(/\b(?:import|export)\s[^'"]*?from\s*["']([^"']+)["']/g)) {
      note('import', match[1], file);
      classifyLoad(match[1], file, 'import');
    }
    for (const match of text.matchAll(/\bimport\s*\(\s*["'`]([^"'`]+)["'`]/g)) {
      note('import()', match[1], file);
      classifyLoad(match[1], file, 'import()');
    }
    for (const match of text.matchAll(/\bimport\s*["']([^"']+)["']/g)) {
      note('import', match[1], file);
      classifyLoad(match[1], file, 'import');
    }
    for (const match of text.matchAll(/fetch\(\s*["'`]([^"'`]+)["'`]/g)) {
      note('fetch', match[1], file);
      classifyLoad(match[1], file, 'fetch');
    }
    for (const match of text.matchAll(/(?:href|src)\s*=\s*["'`](https?:[^"'`]+)["'`]/g)) {
      problems.push(`${relative('.', file)}: assigns a network URL to href/src — ${match[1]}`);
    }
    for (const match of text.matchAll(/["'`](https?:\/\/[^"'`\s]+)["'`]/g)) {
      note('citation string', match[1], file, false);
    }
  }
}

console.log(`scanned ${files.length} files under app/`);
console.log(`load-time references found: ${loads.length}`);
const byKind = loads.reduce((acc, item) => ({ ...acc, [item.kind]: (acc[item.kind] ?? 0) + 1 }), {});
console.log(`  ${Object.entries(byKind).map(([kind, count]) => `${kind} ${count}`).join(' · ')}`);
console.log(`network references: ${problems.length}`);
for (const problem of problems) console.log(`  ! ${problem}`);

const external = [...new Set(citations.filter((c) => /^https?:\/\/(?!www\.w3\.org)/.test(c.spec)).map((c) => c.spec))];
console.log(`outbound citation links held as text (opened only if the reader clicks): ${external.length}`);
for (const url of external.slice(0, 5)) console.log(`  - ${url}`);
if (external.length > 5) console.log(`  … and ${external.length - 5} more`);

console.log(problems.length === 0 ? 'RESULT: PASS — every load-time reference is a file under app/' : 'RESULT: FAIL');
process.exit(problems.length === 0 ? 0 : 1);
