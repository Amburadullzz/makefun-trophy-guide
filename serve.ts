// A static file server for app/, so the guide can be opened in a desktop
// browser without a build step: `node serve.ts` (optionally `--port 9000`).
// It answers only with regular files inside app/, guesses the MIME type from
// the extension, and sends no cache headers, which keeps reloads honest.

import { createReadStream, promises as fs } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(join(dirname(fileURLToPath(import.meta.url)), 'app'));

const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2']
]);

function portFromArgv(argv) {
  const at = argv.findIndex((arg) => arg === '--port' || arg === '-p');
  const raw = at === -1 ? argv.find((arg) => /^\d+$/.test(arg)) : argv[at + 1];
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : 8080;
}

async function resolveFile(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.endsWith('/') ? decoded + 'index.html' : decoded;
  const target = resolve(join(APP_ROOT, normalize(relative)));
  if (target !== APP_ROOT && !target.startsWith(APP_ROOT + sep)) return null;
  try {
    const stat = await fs.stat(target);
    return stat.isFile() ? { target, size: stat.size } : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let found;
  try {
    found = await resolveFile(url.pathname);
  } catch {
    response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('bad request');
    return;
  }
  if (!found) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found');
    return;
  }
  response.writeHead(200, {
    'content-type': CONTENT_TYPES.get(extname(found.target).toLowerCase()) ?? 'application/octet-stream',
    'content-length': found.size,
    'cache-control': 'no-store'
  });
  createReadStream(found.target).pipe(response);
});

server.listen(portFromArgv(process.argv.slice(2)), '127.0.0.1', () => {
  const { port } = server.address();
  console.log(`serving app/ at http://localhost:${port}`);
});
