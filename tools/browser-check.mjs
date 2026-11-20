// Checks 2 and 3: the app boots with no console error, the tracker renders,
// a checkbox toggles and survives a reload, and a progress file exports,
// clears and imports back with the same trophies ticked.
//
//   node tools/browser-check.mjs
//
// It serves app/ with serve.ts, drives headless Chromium over CDP, and prints
// one PASS/FAIL line per assertion plus the console and request logs it used.

import { spawn } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { openBrowser, waitFor } from './cdp.mjs';

const PORT = 8140;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const results = [];

function check(label, ok, detail = '') {
  results.push({ label, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
}

const server = spawn('node', ['serve.ts', '--port', String(PORT)], { stdio: ['ignore', 'ignore', 'pipe'] });
let serverError = '';
server.stderr.on('data', (chunk) => { serverError += chunk.toString(); });

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
  console.log(`FAIL  serve.ts is not answering with this app on ${ORIGIN}${serverError ? ` (${serverError.trim()})` : ''}`);
  server.kill('SIGKILL');
  process.exit(1);
}

const browser = await openBrowser();
const downloadDir = mkdtempSync(join(tmpdir(), 'ledger-downloads-'));

try {
  await browser.goto(`${ORIGIN}/`);

  // The first render: 55 rows, the sidebar and the meter.
  let rows = 0;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    rows = await browser.evaluate('return document.querySelectorAll(".rows .row").length');
    if (rows === 55) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  check('the tracker renders all 55 rows', rows === 55, `${rows} rows`);
  if (rows !== 55) {
    console.log('  debug href:', await browser.evaluate('return location.href'));
    console.log('  debug readyState:', await browser.evaluate('return document.readyState'));
    console.log('  debug body:', (await browser.evaluate('return document.body.innerText')).slice(0, 200));
    console.log('  debug errors:', JSON.stringify(browser.consoleErrors));
  }

  const chips = await browser.evaluate('return document.querySelectorAll(".filter").length');
  check('the kind filters are drawn', chips === 10, `${chips} filters`);

  const spoilerHidden = await browser.evaluate(`
    const rows = [...document.querySelectorAll('.rows .row')];
    const story = rows.find((row) => row.dataset.id === '3');
    return story ? story.querySelector('.row-name').textContent : '';
  `);
  check('the spoiler setting hides a story trophy name', /Hidden story trophy/.test(spoilerHidden), spoilerHidden.trim());

  // Toggle one checkbox and read the saved state back.
  await browser.evaluate(`
    const box = document.querySelector('.rows .row[data-id="2"] .check');
    box.click();
    return box.getAttribute('aria-checked');
  `);
  const afterToggle = await browser.evaluate(`
    return {
      checked: document.querySelector('.rows .row[data-id="2"] .check').getAttribute('aria-checked'),
      stored: JSON.parse(localStorage.getItem('leonida-ledger/v1') || '{}').earned,
    };
  `);
  check('a checkbox toggles and is written to localStorage',
    afterToggle.checked === 'true' && Array.isArray(afterToggle.stored) && afterToggle.stored.includes(2),
    `aria-checked=${afterToggle.checked}, localStorage earned=[${afterToggle.stored}]`);

  // Reload and confirm the tick came back.
  await browser.goto(`${ORIGIN}/`);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const ready = await browser.evaluate('return document.querySelectorAll(".rows .row").length');
    if (ready === 55) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const afterReload = await browser.evaluate(`
    return document.querySelector('.rows .row[data-id="2"] .check').getAttribute('aria-checked');
  `);
  check('the tick survives a reload', afterReload === 'true', `aria-checked=${afterReload}`);

  // Check three trophies, export, wipe, import, compare.
  await browser.evaluate(`
    for (const id of [2, 14, 28]) {
      const box = document.querySelector('.rows .row[data-id="' + id + '"] .check');
      if (box.getAttribute('aria-checked') === 'false') box.click();
    }
    return true;
  `);
  await browser.call('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir });
  await browser.evaluate(`
    [...document.querySelectorAll('.btn')].find((b) => b.textContent.includes('Export progress')).click();
    return true;
  `);
  await waitFor(() => readdirSync(downloadDir).some((name) => name.endsWith('.json')), { label: 'export file' });
  const exportName = readdirSync(downloadDir).find((name) => name.endsWith('.json'));
  const exported = JSON.parse(readFileSync(join(downloadDir, exportName), 'utf8'));
  check('export writes a file with the three ticked ids',
    JSON.stringify(exported.earned) === '[2,14,28]', `${exportName}: earned=${JSON.stringify(exported.earned)}`);

  await browser.evaluate('localStorage.clear(); return true;');
  await browser.goto(`${ORIGIN}/`);
  await new Promise((r) => setTimeout(r, 400));
  const afterClear = await browser.evaluate('return document.querySelectorAll(".check[aria-checked=\\"true\\"]").length');
  check('clearing storage leaves nothing ticked', afterClear === 0, `${afterClear} ticked`);

  const doc = await browser.call('DOM.getDocument', { depth: -1 });
  const { nodeId } = await browser.call('DOM.querySelector', { nodeId: doc.root.nodeId, selector: 'input[type=file]' });
  await browser.call('DOM.setFileInputFiles', { files: [resolve(downloadDir, exportName)], nodeId });
  let imported = [];
  for (let attempt = 0; attempt < 60; attempt += 1) {
    imported = await browser.evaluate(`
      return [...document.querySelectorAll('.check[aria-checked="true"]')]
        .map((box) => box.closest('.row').dataset.id);
    `);
    if (imported.length === 3) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  check('import restores the same three trophies',
    JSON.stringify(imported.sort()) === '["14","2","28"]', `ticked=${JSON.stringify(imported)}`);

  // Everything but the app's own files is cut off at the browser: any request
  // that is not this origin fails as if the machine had no network at all.
  await browser.call('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  browser.on(async (packet) => {
    if (packet.method !== 'Fetch.requestPaused') return;
    const { requestId, request } = packet.params;
    const allowed = request.url.startsWith(ORIGIN) || request.url.startsWith('data:');
    try {
      if (allowed) await browser.call('Fetch.continueRequest', { requestId });
      else await browser.call('Fetch.failRequest', { requestId, errorReason: 'InternetDisconnected' });
    } catch { /* the request already went away */ }
  });
  await browser.goto(`${ORIGIN}/`);
  let offlineRows = 0;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    offlineRows = await browser.evaluate('return document.querySelectorAll(".rows .row").length');
    if (offlineRows === 55) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const offlineTicks = await browser.evaluate(`
    return document.querySelectorAll('.check[aria-checked="true"]').length;
  `);
  check('with every outside request cut off the app still boots with progress intact',
    offlineRows === 55 && offlineTicks === 3, `${offlineRows} rows, ${offlineTicks} ticked offline`);
  await browser.call('Fetch.disable');

  const local = browser.requests.every((url) => url.startsWith(ORIGIN) || url.startsWith('data:') || url === 'about:blank');
  check('every request the page made was to the app itself', local,
    `${browser.requests.length} requests, all on ${ORIGIN}`);

  check('no console error during the run', browser.consoleErrors.length === 0,
    browser.consoleErrors.length ? browser.consoleErrors.join(' | ') : 'console clean');
} finally {
  await browser.close();
  server.kill('SIGKILL');
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
