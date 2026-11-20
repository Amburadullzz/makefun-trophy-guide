// A very small Chrome DevTools Protocol client, enough to drive headless
// Chromium from Node without a package: launch, attach, evaluate, screenshot.
// Node 22 ships a global WebSocket, so nothing has to be installed.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME_PATH ?? 'chromium';

/** Wait until a predicate holds, polling every 50 ms. */
export function waitFor(predicate, { timeout = 15000, label = 'condition' } = {}) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      let value;
      try {
        value = predicate();
      } catch (error) {
        reject(error);
        return;
      }
      if (value) return resolve(value);
      if (Date.now() - started > timeout) return reject(new Error(`timed out waiting for ${label}`));
      setTimeout(tick, 50);
    };
    tick();
  });
}

/** Launch headless Chromium and return a client bound to one page. */
export async function openBrowser({ width = 1280, height = 800 } = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'ledger-chrome-'));
  const child = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-sandbox',
    '--disable-gpu',
    '--hide-scrollbars',
    '--disable-extensions',
    '--no-first-run',
    '--force-device-scale-factor=1',
    `--window-size=${width},${height}`,
    'about:blank',
  ], { stdio: 'ignore' });

  const portFile = join(profile, 'DevToolsActivePort');
  await waitFor(() => existsSync(portFile), { label: 'DevToolsActivePort' });
  const [port] = readFileSync(portFile, 'utf8').split('\n');
  const versionUrl = `http://127.0.0.1:${port}/json/version`;
  const version = await (await fetch(versionUrl)).json();

  const socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const events = [];
  const listeners = new Set();

  socket.addEventListener('message', (message) => {
    const packet = JSON.parse(message.data);
    if (packet.id && pending.has(packet.id)) {
      const { resolve, reject } = pending.get(packet.id);
      pending.delete(packet.id);
      if (packet.error) reject(new Error(`${packet.error.message} (${packet.error.code})`));
      else resolve(packet.result);
      return;
    }
    if (packet.method) {
      events.push(packet);
      for (const listener of listeners) listener(packet);
    }
  });

  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);

  await call('Page.enable');
  await call('Runtime.enable');
  await call('Log.enable');
  await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });

  const consoleErrors = [];
  const requests = [];
  listeners.add((packet) => {
    if (packet.sessionId !== sessionId) return;
    if (packet.method === 'Runtime.consoleAPICalled' && packet.params.type === 'error') {
      consoleErrors.push(packet.params.args.map((arg) => arg.value ?? arg.description).join(' '));
    }
    if (packet.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(packet.params.exceptionDetails.exception?.description ?? packet.params.exceptionDetails.text);
    }
    if (packet.method === 'Log.entryAdded' && ['error', 'warning'].includes(packet.params.entry.level)) {
      if (packet.params.entry.level === 'error') consoleErrors.push(packet.params.entry.text);
    }
    if (packet.method === 'Network.requestWillBeSent') requests.push(packet.params.request.url);
  });

  /** Evaluate an expression in the page and return its JSON value. */
  async function evaluate(expression) {
    const result = await call('Runtime.evaluate', {
      expression: `(() => { ${expression} })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    }
    return result.result.value;
  }

  /** Navigate and wait for the load event plus a settled first render. */
  async function goto(url) {
    await call('Page.navigate', { url });
    await waitFor(() => events.some((packet) => packet.method === 'Page.loadEventFired'), { label: 'load event' });
    events.length = 0;
  }

  /** Capture the viewport as a PNG buffer. */
  async function screenshot() {
    const { data } = await call('Page.captureScreenshot', { format: 'png', fromSurface: true });
    return Buffer.from(data, 'base64');
  }

  /** Subscribe to protocol events; returns an unsubscribe function. */
  function on(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  async function close() {
    try { socket.close(); } catch { /* already gone */ }
    child.kill('SIGKILL');
    rmSync(profile, { recursive: true, force: true });
  }

  return { call, evaluate, goto, screenshot, close, on, consoleErrors, requests, events };
}
