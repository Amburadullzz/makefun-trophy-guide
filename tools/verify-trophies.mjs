// Check 1: every one of the 55 official trophies is present, with the official
// name, description and grade, and nothing is in the file that the official
// list does not hold.
//
//   node tools/verify-trophies.mjs [official.json]
//
// The default official file is the kit starter's frozen copy of the PlayStation
// list (the same 55 names the competition rules point at).

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OFFICIAL = process.argv[2] ?? '/data/workspace/makefun/kits/tg-kit/starter/app/data/trophies.json';
const OURS = resolve('app/data/trophies.json');

// The rules compare names with case, curly quotes, dashes and whitespace set
// aside; do the same so a typographic difference is not reported as a diff.
function fold(text) {
  return String(text)
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014\u2015\u2212]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const official = JSON.parse(readFileSync(OFFICIAL, 'utf8'));
const ours = JSON.parse(readFileSync(OURS, 'utf8'));
const officialList = (Array.isArray(official) ? official : official.trophies);
const ourList = (Array.isArray(ours) ? ours : ours.trophies);

const ourNames = new Set(ourList.map((t) => fold(t.name)));
const officialNames = new Set(officialList.map((t) => fold(t.name)));

const missing = officialList.filter((t) => !ourNames.has(fold(t.name)));
const extra = ourList.filter((t) => !officialNames.has(fold(t.name)));

const fieldDiffs = [];
for (const source of officialList) {
  const mine = ourList.find((t) => fold(t.name) === fold(source.name));
  if (!mine) continue;
  for (const field of ['description', 'grade']) {
    if (fold(mine[field] ?? '') !== fold(source[field] ?? '')) {
      fieldDiffs.push(`${source.name}: ${field} "${mine[field]}" != official "${source[field]}"`);
    }
  }
  if (typeof mine.guide !== 'string' || mine.guide.trim().length < 40) {
    fieldDiffs.push(`${source.name}: guide missing or shorter than 40 characters`);
  }
}

const grades = ourList.reduce((acc, t) => ({ ...acc, [t.grade]: (acc[t.grade] ?? 0) + 1 }), {});

console.log(`official trophies : ${officialList.length}`);
console.log(`app/data/trophies.json : ${ourList.length}`);
console.log(`grades : ${JSON.stringify(grades)}`);
console.log(`missing from our file  : ${missing.length}${missing.length ? ' -> ' + missing.map((t) => t.name).join(' | ') : ''}`);
console.log(`in our file, not official : ${extra.length}${extra.length ? ' -> ' + extra.map((t) => t.name).join(' | ') : ''}`);
console.log(`name/description/grade/guide diffs : ${fieldDiffs.length}`);
for (const line of fieldDiffs) console.log(`  - ${line}`);

const ok = missing.length === 0 && extra.length === 0 && fieldDiffs.length === 0 && ourList.length === officialList.length;
console.log(ok ? 'RESULT: PASS — 55 of 55, no extras, no field differences' : 'RESULT: FAIL');
process.exit(ok ? 0 : 1);
