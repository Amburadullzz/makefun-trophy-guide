// Check 4: the four screenshots. Each one is a real render of app/ in headless
// Chromium, driven through the app's own controls, then shrunk under the
// competition's 256 KiB cap by tools/optimize-screenshots.py.
//
//   node tools/screenshots.mjs && python3 tools/optimize-screenshots.py
//
// 1-cover.png   the tracker with progress and a guide open
// 2-guide.png   a trophy's guide with its sources, whole panel in view
// 3-roadmap.png the roadmap: stages, progress and missable flags
// 4-filter.png  the filters at work on the missable group

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { openBrowser } from './cdp.mjs';

const PORT = 8141;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const OUT = 'screenshots';

const server = spawn('node', ['serve.ts', '--port', String(PORT)], { stdio: 'ignore' });
let served = '';
for (let attempt = 0; attempt < 80 && !served; attempt += 1) {
  try {
    const response = await fetch(`${ORIGIN}/index.html`);
    if (response.ok) served = await response.text();
  } catch {
    await new Promise((r) => setTimeout(r, 100));
  }
}
if (!/Leonida Ledger/.test(served)) {
  console.log('serve.ts did not answer with this app');
  server.kill('SIGKILL');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const browser = await openBrowser({ width: 1280, height: 900 });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function resize(width, height) {
  await browser.call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await pause(220);
}

async function shoot(name) {
  const buffer = await browser.screenshot();
  writeFileSync(`${OUT}/${name}`, buffer);
  const { size } = statSync(`${OUT}/${name}`);
  console.log(`${name}  ${(size / 1024).toFixed(0)} KiB  ${buffer.length} bytes`);
}

try {
  await browser.goto(`${ORIGIN}/`);
  await pause(600);

  // A believable mid-run save: two chapters in, with a slice of the checklist.
  await browser.evaluate(`
    window.__ledger.store.setEarned([2,3,4,5,8,9,20,21,28,33,35,46,47,54,16]);
    window.__ledger.store.setSpoiler(false);
    window.__ledger.store.setFilter('all');
    window.__ledger.store.openTrophy(14);
    return true;
  `);
  await pause(400);
  await resize(1280, 900);
  await browser.evaluate('document.getElementById("stage").scrollTop = 0; document.getElementById("inspector").scrollTop = 0; return true;');
  await shoot('1-cover.png');

  // One guide, whole: title, official text, the guide, steps, window, sources.
  await resize(1280, 1240);
  await browser.evaluate('window.__ledger.store.openTrophy(41); return true;');
  await pause(300);
  await browser.evaluate('document.getElementById("inspector").scrollTop = 0; return true;');
  await shoot('2-guide.png');

  // The roadmap.
  await resize(1280, 900);
  await browser.evaluate('window.__ledger.store.setView("roadmap"); return true;');
  await pause(400);
  await browser.evaluate('document.getElementById("stage").scrollTop = 0; return true;');
  await shoot('3-roadmap.png');

  // The filters, on the missable group, with spoilers back on.
  await browser.evaluate(`
    window.__ledger.store.setView('tracker');
    window.__ledger.store.setSpoiler(true);
    window.__ledger.store.setFilter('missable');
    window.__ledger.store.openTrophy(28);
    return true;
  `);
  await pause(400);
  await browser.evaluate(`
    document.getElementById('stage').scrollTop = 0;
    const callout = document.querySelector('.callout-danger');
    document.getElementById('inspector').scrollTop = callout.offsetTop - 520;
    return true;
  `);
  await pause(250);
  await shoot('4-filter.png');
} finally {
  await browser.close();
  server.kill('SIGKILL');
}
