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
const font = (weight) => pathToFileURL(join(root, `src/assets/fonts/iosevka-${weight}.woff2`)).href;
const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const template = (t) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Iosevka'; font-weight: 400; src: url('${font(400)}') format('woff2'); }
  @font-face { font-family: 'Iosevka'; font-weight: 700; src: url('${font(700)}') format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px 88px;
    background-color: #0b0a14;
    background-image:
      radial-gradient(3px 3px at 88% 18%, #e8e6f5 50%, transparent 51%),
      radial-gradient(2px 2px at 79% 36%, #9a97b8 50%, transparent 51%),
      radial-gradient(4px 4px at 93% 54%, #f2b66d 50%, transparent 51%),
      radial-gradient(2px 2px at 84% 74%, #9a97b8 50%, transparent 51%),
      radial-gradient(3px 3px at 96% 86%, #8b7cf6 50%, transparent 51%);
    background-repeat: no-repeat;
    font-family: 'Iosevka', monospace; color: #e8e6f5;
    border-bottom: 8px solid #8b7cf6;
  }
  .brand { font-size: 32px; font-weight: 700; letter-spacing: 0.04em; }
  .eyebrow { font-size: 30px; color: #5ec8c0; margin-bottom: 28px; }
  h1 { font-size: 76px; font-weight: 700; line-height: 1.1; max-width: 22ch; }
  .author { font-size: 30px; color: #9a97b8; }
</style></head><body>
  <p class="brand">${escape(t.nav.brand)}</p>
  <div><p class="eyebrow">${escape(t.hero.eyebrow)}</p><h1>${escape(t.hero.title)}</h1></div>
  <p class="author">${escape(site.author)}</p>
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
    // Espera a que cargue la página nueva y su fuente: sin Iosevka la imagen
    // sale con la de respaldo.
    const { result } = await send('Runtime.evaluate', {
      expression: `new Promise((resolve) => {
        const ready = () => location.href === ${JSON.stringify(url)} && document.readyState === 'complete';
        const wait = () => (ready() ? document.fonts.ready.then(() => resolve(document.fonts.check('700 76px Iosevka'))) : setTimeout(wait, 50));
        wait();
      })`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (!result.value) throw new Error(`Iosevka no cargó en ${lang}.html`);
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
