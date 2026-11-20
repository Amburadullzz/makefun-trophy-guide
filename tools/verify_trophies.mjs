// Checks app/data/trophies.json against the official PlayStation list.
//
//   node tools/verify_trophies.mjs [path-to-official.json]
//
// The official file is the one the competition kit ships (the 55 trophies with
// their PlayStation names, descriptions and grades). Without an argument the
// script looks for it where the kit keeps it. It prints the count, the grade
// tally, the name diff in both directions, and any entry whose guide is blank.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const DEFAULT_OFFICIAL = '/data/workspace/makefun/kits/tg-kit/starter/app/data/trophies.json';

function load(path) {
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  return Array.isArray(doc) ? doc : doc.trophies;
}

// The gate compares names with curly quotes, dashes, the ellipsis and runs of
// white space set aside, so this check does the same before calling a name equal.
export function normaliseName(name) {
  return String(name)
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

const officialPath = resolve(process.argv[2] ?? DEFAULT_OFFICIAL);
if (!existsSync(officialPath)) {
  console.error('official list not found: ' + officialPath);
  console.error('pass the path as the first argument, e.g. node tools/verify_trophies.mjs <kit>/starter/app/data/trophies.json');
  process.exit(2);
}

const official = load(officialPath);
const mine = load(join(root, 'app', 'data', 'trophies.json'));

const byNormalised = new Map(official.map((t) => [normaliseName(t.name), t]));
const seen = new Map();
for (const trophy of mine) {
  const key = normaliseName(trophy.name);
  seen.set(key, (seen.get(key) || 0) + 1);
}

const missing = official.filter((t) => !seen.has(normaliseName(t.name))).map((t) => t.name);
const extra = mine.filter((t) => !byNormalised.has(normaliseName(t.name))).map((t) => t.name);
const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([name]) => name);
const blankGuides = mine.filter((t) => typeof t.guide !== 'string' || t.guide.trim() === '').map((t) => t.name);
const mismatched = [];
for (const trophy of mine) {
  const ref = byNormalised.get(normaliseName(trophy.name));
  if (!ref) continue;
  if (ref.description !== trophy.description) mismatched.push(trophy.name + ' (description)');
  if (ref.grade !== trophy.grade) mismatched.push(trophy.name + ' (grade)');
}

const grades = mine.reduce((acc, t) => ((acc[t.grade] = (acc[t.grade] || 0) + 1), acc), {});
const sourcesCount = mine.filter((t) => Array.isArray(t.sources) && t.sources.length > 0).length;
const missable = mine.filter((t) => t.missable === true);

console.log('official list: ' + officialPath);
console.log('trophies in app/data/trophies.json: ' + mine.length + ' (official: ' + official.length + ')');
console.log('grades: ' + ['platinum', 'gold', 'silver', 'bronze'].map((g) => g + ' ' + (grades[g] || 0)).join(', '));
console.log('missing from mine: ' + (missing.length ? missing.join(' | ') : 'none'));
console.log('in mine but not official: ' + (extra.length ? extra.join(' | ') : 'none'));
console.log('duplicated names: ' + (duplicates.length ? duplicates.join(' | ') : 'none'));
console.log('blank guides: ' + (blankGuides.length ? blankGuides.join(' | ') : 'none'));
console.log('description/grade mismatches: ' + (mismatched.length ? mismatched.join(' | ') : 'none'));
console.log('trophies with at least one source: ' + sourcesCount + '/' + mine.length);
console.log('missable: ' + missable.map((t) => t.name).join(' | '));

const ok = mine.length === official.length && missing.length === 0 && extra.length === 0 &&
  duplicates.length === 0 && blankGuides.length === 0 && mismatched.length === 0;
console.log(ok ? 'RESULT: pass - the file holds exactly the official 55, each with a guide' : 'RESULT: fail');
process.exit(ok ? 0 : 1);
