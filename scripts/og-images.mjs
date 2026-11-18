// Genera la imagen para compartir en redes (P-15), una por idioma:
// public/og/es.png y public/og/en.png, de 1200×630.
// Usa los textos del hero de src/i18n/*.json: si cambian, vuelve a ejecutar
// `node scripts/og-images.mjs`. Requiere Google Chrome (o CHROME_PATH).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { locales, site } from '../src/site.ts';

const root = resolve(import.meta.dirname, '..');
const chrome =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const font = (file) => pathToFileURL(join(root, `src/assets/fonts/${file}.woff2`)).href;
const photo = pathToFileURL(join(root, 'src/assets/jorge.jpg')).href;
const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const template = (t) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Figtree'; font-weight: 800; src: url('${font('figtree-latin-800-normal')}') format('woff2'); }
  @font-face { font-family: 'Atkinson Hyperlegible'; font-weight: 700; src: url('${font('atkinson-hyperlegible-latin-700-normal')}') format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    display: flex; align-items: center; gap: 64px;
    padding: 72px 88px;
    background: #fbf8f3; color: #1f2421;
    font-family: 'Atkinson Hyperlegible', sans-serif;
    border-bottom: 12px solid #0f5e57;
  }
  .text { flex: 1; display: flex; flex-direction: column; gap: 28px; }
  .brand { font-family: 'Figtree', sans-serif; font-size: 34px; font-weight: 800; color: #0f5e57; }
  .eyebrow { font-size: 26px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0f5e57; }
  h1 { font-family: 'Figtree', sans-serif; font-size: 72px; font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; }
  img { width: 300px; height: 300px; border-radius: 50%; border: 10px solid #e8f1ee; object-fit: cover; flex: 0 0 auto; }
</style></head><body>
  <div class="text">
    <p class="brand">${escape(site.brand)}</p>
    <p class="eyebrow">${escape(t.hero.eyebrow)}</p>
    <h1>${escape(t.hero.title)}</h1>
  </div>
  <img src="${photo}" alt="">
</body></html>`;

const outDir = join(root, 'public/og');
mkdirSync(outDir, { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'og-'));

// Chrome sin interfaz, controlado por el protocolo de DevTools: el modo
// `--screenshot` guarda la imagen pero el proceso no termina.
const browser = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--remote-debugging-port=0',
  `--user-data-dir=${join(work, 'profile')}`,
  'about:blank',
], { stdio: 'ignore' });

try {
  const send = await connect(join(work, 'profile/DevToolsActivePort'));
  await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });

  for (const lang of locales) {
    const t = JSON.parse(readFileSync(join(root, `src/i18n/${lang}.json`), 'utf8'));
    const page = join(work, `${lang}.html`);
    writeFileSync(page, template(t));
    const url = pathToFileURL(page).href;
    await send('Page.navigate', { url });
    // Espera a que cargue la página nueva y su fuente: sin Figtree la imagen
    // sale con la de respaldo.
    const { result } = await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const ready = () => location.href === ${JSON.stringify(url)} && document.readyState === 'complete';
        const wait = () => (ready() ? document.fonts.ready.then(() => resolve(document.fonts.check('800 72px Figtree'))) : setTimeout(wait, 50));
        wait();
      })`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (!result.value) throw new Error(`Figtree no cargó en ${lang}.html`);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(outDir, `${lang}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`public/og/${lang}.png`);
  }
} finally {
  browser.kill();
  rmSync(work, { recursive: true, force: true });
}

/** Se conecta a la pestaña de Chrome y devuelve una función para enviar comandos. */
async function connect(portFile) {
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 100));
  const port = readFileSync(portFile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message);
  };
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      pending.set(++id, (message) => (message.error ? reject(new Error(message.error.message)) : resolve(message.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });
}
