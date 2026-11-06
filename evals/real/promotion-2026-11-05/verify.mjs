import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { restrictedContext } from '../../lib/browser-policy.mjs';
import { freshDirectory, writeJSON, screenshot } from '../../lib/evidence.mjs';
import { requireTool, checkGame } from '../../lib/environment.mjs';
import { promotionChecks } from './expectations.mjs';
const web = path.resolve(process.env.GAME_WEB_ROOT || '');
assert.ok(process.env.GAME_WEB_ROOT, 'Set GAME_WEB_ROOT to an isolated compatible ChessAlkkkaegi web checkout');
const out = await freshDirectory(process.argv[2]);
const environment = await checkGame(web, process.env.GAME_SOURCE_MANIFEST);
const expected = JSON.parse(await readFile(new URL('./source.json', import.meta.url), 'utf8'));
const expectBroken = process.argv.includes('--expect-broken');
const variant = expectBroken ? 'before_sha256_lf' : 'after_sha256_lf';
for (const [file, hashes] of Object.entries(expected.files)) {
  const source = await readFile(path.join(web, file.replace(/^web\//, '')), 'utf8');
  assert.equal(createHash('sha256').update(source.replaceAll('\r\n', '\n')).digest('hex'), hashes[variant], `Incompatible promotion fixture: ${file}`);
}
const gameRequire = createRequire(path.join(web, 'package.json'));
const { createServer } = await import(pathToFileURL(gameRequire.resolve('vite')).href);
const { chromium } = requireTool('playwright');
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
let browser;
const conditions = [], errors = [], networkPolicies = [];
try {
  await server.listen();
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath = process.env.BROWSER_PATH || process.env.VFX_BROWSER_PATH;
  browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true });
  for (const width of [360, 960]) {
    const { context, policy } = await restrictedContext(browser, origin, { viewport: { width, height: 800 }, reducedMotion: 'no-preference' });
    networkPolicies.push(policy);
    const page = await context.newPage();
    page.on('pageerror', () => errors.push('pageerror; message omitted'));
    await page.goto(`${origin}/skill-case`);
    await page.waitForFunction(() => window.ready);
    await page.click('#open'); await page.waitForTimeout(220);
    const options = await page.locator('.promotion-piece-card').allTextContents();
    await screenshot(page, path.join(out, `${width}-open.png`));
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
    await context.close();
  }
  const { context: reducedContext, policy: reducedPolicy } = await restrictedContext(browser, origin, { viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
  networkPolicies.push(reducedPolicy);
  const reduced = await reducedContext.newPage();
  reduced.on('pageerror', () => errors.push('pageerror; message omitted'));
  await reduced.goto(`${origin}/skill-case`);
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
  await screenshot(reduced, path.join(out, '360-selected-reduced.png'));
  await reduced.clock.runFor(121);
  const reducedCalls = await reduced.evaluate(() => [...calls]);
  await reducedContext.close();
  const observed = { conditions, reducedState, reducedCalls };
  const expectedChecks = promotionChecks(observed, expectBroken);
  const fixed = promotionChecks(observed).every(c => c.passed);
  const report = { date: new Date().toISOString(), browser: browser.version(), environment, networkPolicies, conditions, errors, fixed,
    expectedOutcome: expectBroken ? 'known defects reproduced' : 'repaired behavior', expectedChecks,
    reducedState, reducedCalls, captureTiming: 'Closing-state screenshot uses paused synthetic browser clock; behavioral double-click/replacement checks above use real browser timing.',
    scope: 'Actual game promotion module and CSS in an isolated component harness. Modal creation/replacement invoked by harness; full pawn progression, server and natural match flow NOT RUN.' };
  await writeJSON(path.join(out, 'results.json'), report);
  assert.deepEqual(errors, []);
  assert.ok(networkPolicies.every(p => p.failures === 0), 'Browser policy encountered request/transform failures');
  assert.deepEqual(expectedChecks.filter(c => !c.passed), [], 'Unexpected promotion result');
  console.log(JSON.stringify({ fixed, expectedOutcome: report.expectedOutcome, conditions: conditions.length, browser: report.browser, output: out }));
} finally { try { await browser?.close(); } finally { await server.close(); } }
