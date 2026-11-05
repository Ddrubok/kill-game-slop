import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const web = path.resolve(process.env.GAME_WEB_ROOT || '');
assert.ok(process.env.GAME_WEB_ROOT, 'Set GAME_WEB_ROOT to an isolated compatible ChessAlkkkaegi web checkout');
const out = path.resolve(process.argv[2]); await mkdir(out, { recursive: true });
const require = createRequire(path.join(path.resolve(process.env.VFX_TOOL_ROOT || web), 'package.json'));
const gameRequire = createRequire(path.join(web, 'package.json'));
const { createServer } = await import(pathToFileURL(gameRequire.resolve('vite')).href);
const { chromium } = require('playwright');
const server = await createServer({ root: web, configFile: false, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] }, cacheDir: path.join(out, 'vite-cache'), logLevel: 'error',
  server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [web, path.dirname(gameRequire.resolve('vite'))] } },
  define: { __POKI_BUILD__: 'false', __CRAZYGAMES_BUILD__: 'false', __PORTABLE_BUILD__: 'false' } });
server.middlewares.use('/skill-case', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/src/style.css"><div id="app"><button id="open">Open promotion</button></div>
  <script type="module">import { openPromotionModal } from '/src/promotion-modal.ts';
  window.calls=[]; window.openCase=()=>openPromotionModal('white-pawn-a7','white',type=>calls.push(type),document.querySelector('#app'));
  document.querySelector('#open').onclick=openCase; window.ready=true;</script>`);
});
await server.listen();
let browser;
const conditions = [], errors = [];
try {
  browser = await chromium.launch({ ...(process.env.VFX_BROWSER_PATH ? { executablePath: process.env.VFX_BROWSER_PATH } : {}), headless: true });
  for (const width of [360, 960]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'no-preference' });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://**', route => route.abort());
    await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/skill-case`);
    await page.waitForFunction(() => window.ready);
    await page.click('#open'); await page.waitForTimeout(220);
    const options = await page.locator('.promotion-piece-card').allTextContents();
    await page.screenshot({ path: path.join(out, `${width}-open.png`) });
    await page.locator('[data-piece-type="Queen"]').dblclick({ delay: 25 });
    await page.waitForTimeout(200);
    const doubleClick = await page.evaluate(() => [...calls]);
    await page.evaluate(() => { calls.length=0; openCase(); }); await page.waitForTimeout(220);
    await page.locator('[data-piece-type="Knight"]').click();
    // New UI owner replaces the old modal while its closing callback is pending.
    await page.evaluate(() => openCase()); await page.waitForTimeout(220);
    const staleClose = await page.evaluate(() => [...calls]);
    const replacementVisible = await page.locator('.promotion-modal-overlay').count() === 1;
    await page.locator('[data-piece-type="Rook"]').click(); await page.waitForTimeout(200);
    const currentChoice = await page.evaluate(() => [...calls]);
    conditions.push({ width, input: 'Browser mouse events; programmatic modal open/replacement', options, doubleClick, staleClose, replacementVisible, currentChoice });
    await page.close();
  }
  const fixed = conditions.every(c => c.doubleClick.join() === 'Queen' && c.staleClose.length === 0 && c.replacementVisible && c.currentChoice.join() === 'Rook' && c.options.length === 4);
  const reduced = await browser.newPage({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
  await reduced.route('https://**', route => route.abort());
  await reduced.goto(`http://127.0.0.1:${server.httpServer.address().port}/skill-case`);
  await reduced.waitForFunction(() => window.ready);
  await reduced.clock.install();
  await reduced.clock.pauseAt(new Date(Date.now() + 1000));
  await reduced.evaluate(() => openCase());
  // The synthetic clock freezes the short closing state for a static capture.
  await reduced.locator('[data-piece-type="Bishop"]').click({ force: true });
  const reducedState = await reduced.evaluate(() => ({
    animation: getComputedStyle(document.querySelector('.promotion-modal-overlay')).animationName,
    disabled: [...document.querySelectorAll('.promotion-piece-card')].filter(b => b.disabled).length,
    selected: document.querySelector('[aria-pressed="true"]')?.getAttribute('data-piece-type') ?? null,
    outline: getComputedStyle(document.querySelector('[data-piece-type="Bishop"]')).outlineStyle,
    callsBeforeClose: [...calls]
  }));
  await reduced.screenshot({ path: path.join(out, '360-selected-reduced.png') });
  await reduced.clock.runFor(121);
  const reducedCalls = await reduced.evaluate(() => [...calls]);
  await reduced.close();
  const report = { date: new Date().toISOString(), browser: browser.version(), conditions, errors, fixed,
    reducedState, reducedCalls, captureTiming: 'Closing-state screenshot uses paused synthetic browser clock; behavioral double-click/replacement checks above use real browser timing.',
    scope: 'Actual game promotion module and CSS in an isolated component harness. Modal creation/replacement invoked by harness; full pawn progression, server and natural match flow NOT RUN.' };
  await writeFile(path.join(out, 'results.json'), JSON.stringify(report, null, 2)+'\n');
  assert.deepEqual(errors, []);
  if (process.argv.includes('--expect-broken')) assert.equal(fixed, false);
  else {
    assert.equal(fixed, true);
    assert.equal(reducedState.animation, 'none'); assert.equal(reducedState.disabled, 4);
    assert.equal(reducedState.selected, 'Bishop'); assert.equal(reducedState.outline, 'solid');
    assert.deepEqual(reducedState.callsBeforeClose, []); assert.deepEqual(reducedCalls, ['Bishop']);
  }
  console.log(JSON.stringify(report));
} finally { await browser?.close(); await server.close(); }
