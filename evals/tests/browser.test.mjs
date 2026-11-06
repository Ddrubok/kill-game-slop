import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { readFile, mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { restrictedContext } from '../lib/browser-policy.mjs';
import { screenshot, selectionState, writeJSON } from '../lib/evidence.mjs';
import { requireTool, tooling } from '../lib/environment.mjs';

async function listen(server, protocol = 'http') {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return `${protocol}://127.0.0.1:${server.address().port}`;
}
const closeServer = server => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); });

test('real browser: exact origin, redirects, popups, HTTPS, sockets and service workers', async () => {
  tooling();
  const { chromium } = requireTool('playwright');
  let deniedHits = 0, deniedConnections = 0, upgrades = 0, swHits = 0;
  const denied = http.createServer((req,res) => { deniedHits++; res.end('DENIED'); });
  denied.on('connection', () => deniedConnections++);
  denied.on('upgrade', (req,socket) => { upgrades++; socket.destroy(); });
  const tls = https.createServer({
    key: await readFile(new URL('./fixtures/localhost-key.pem', import.meta.url)),
    cert: await readFile(new URL('./fixtures/localhost-cert.pem', import.meta.url)),
  }, (req,res) => { deniedHits++; res.end('DENIED'); });
  tls.on('connection', () => deniedConnections++);
  tls.on('upgrade', (req,socket) => { upgrades++; socket.destroy(); });
  const foreign = await listen(denied), secure = await listen(tls, 'https');
  const allowed = http.createServer((req,res) => {
    if (req.url === '/redirect') { res.writeHead(302, { location: `${foreign}/redirected?token=DUMMY_SECRET` }); return res.end(); }
    if (req.url === '/local-redirect') { res.writeHead(302, { location: '/ok' }); return res.end(); }
    if (req.url === '/sw.js') { swHits++; res.setHeader('content-type','text/javascript'); return res.end('self.addEventListener("fetch",()=>{})'); }
    res.setHeader('content-type', 'text/html'); res.end('<!doctype html><body>allowed game</body>');
  });
  allowed.on('upgrade', (req,socket) => { upgrades++; socket.destroy(); });
  const origin = await listen(allowed);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    const { context, policy } = await restrictedContext(browser, origin, { ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(origin);
    assert.equal(await page.locator('body').textContent(), 'allowed game');
    assert.equal(await page.evaluate(() => fetch('/ok').then(r => r.ok)), true);
    const blocked = await page.evaluate(async ({ foreign, secure, origin }) => {
      const urls = [foreign + '/private/DUMMY_SECRET?token=DUMMY_SECRET', secure + '/private', origin.replace('127.0.0.1','localhost') + '/private', '/redirect', '/local-redirect'];
      return Promise.all(urls.map(url => fetch(url).then(() => false, () => true)));
    }, { foreign, secure, origin });
    assert.deepEqual(blocked, [true,true,true,true,true]);
    const sockets = [origin.replace('http:', 'ws:'), foreign.replace('http:', 'ws:'), secure.replace('https:', 'wss:')];
    await page.evaluate(urls => Promise.all(urls.map(url => new Promise((resolve,reject) => {
      const timer = setTimeout(() => reject(new Error('Socket policy did not close')), 5000);
      const ws = new WebSocket(url + '/socket?token=DUMMY_SECRET');
      ws.onclose = ws.onerror = () => { clearTimeout(timer); resolve(); };
    }))), sockets);
    const sw = await page.evaluate(async () => {
      try { await navigator.serviceWorker.register('/sw.js'); } catch {}
      return (await navigator.serviceWorker.getRegistrations()).length;
    });
    assert.equal(sw, 0); assert.equal(swHits, 0);
    const popupPromise = context.waitForEvent('page');
    await page.evaluate(url => window.open(url), foreign + '/popup');
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded').catch(() => {});
    assert.ok(policy.denied.some(x => x.origin === foreign && x.kind === 'request'));
    assert.ok(policy.denied.some(x => x.origin === secure && x.kind === 'request'));
    assert.equal(policy.denied.filter(x => x.kind === 'websocket').length, 3);
    assert.equal(policy.denied.filter(x => x.kind === 'redirect').length, 2);
    assert.equal(deniedHits, 0); assert.equal(upgrades, 0);
    assert.equal(JSON.stringify(policy).includes('DUMMY_SECRET'), false);
    assert.equal(policy.failures, 0);
    await context.close();
    console.log(`Browser ${browser.version()}: denied HTTP/HTTPS requests=${deniedHits}, upgrades=${upgrades}, speculative TCP connections=${deniedConnections} (outside routing guarantee)`);
  } finally {
    await browser?.close();
    await Promise.all([closeServer(allowed),closeServer(denied),closeServer(tls)]);
  }
});

test('collector excludes dummy account/chat data; screenshots are exclusive writes', async () => {
  const { chromium } = requireTool('playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const out = await mkdtemp(path.join(tmpdir(), 'kill-game-evidence-'));
  try {
    const page = await browser.newPage();
    await page.setContent('<div data-private>DUMMY_TOKEN dummy@example.invalid chat-private</div><div id="preview">aim</div><div class="strike-action-bar"><button data-action="launch" aria-pressed="true">Launch</button></div>');
    await page.evaluate(() => {
      globalThis.__presentationQA = () => ({ aimRuntime: { selectedPieceId: 'pawn' }, turnRuntime: { phase: 'ready', currentSide: 'white' }, inputRuntime: { mode: 'aim' }, aimParametersRuntime: { root: document.querySelector('#preview'), redDot: { visible: true }, feedback: { textContent: 'DUMMY_TOKEN' } } });
    });
    const state = await page.evaluate(selectionState);
    assert.equal(state.selected, 'pawn');
    assert.equal(state.buttons[0].pressed, 'true');
    assert.doesNotMatch(JSON.stringify(state), /DUMMY|dummy@|chat-private/);
    const file = path.join(out, 'capture.png');
    await screenshot(page,file,{mask:[page.locator('[data-private]')]});
    const before = await readFile(file);
    await page.locator('[data-private]').evaluate(e => { e.style.width='600px';e.style.height='20px'; });
    const clipped = await page.screenshot({mask:[page.locator('[data-private]')],clip:await page.locator('[data-private]').boundingBox()});
    const fullyMasked = await page.evaluate(data => new Promise(resolve => {
      const img=new Image();img.onload=()=>{
        const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
        const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
        const pixels=ctx.getImageData(0,0,img.width,img.height).data;
        let masked=true;
        for(let i=0;i<pixels.length;i+=4) if(pixels[i]!==255 || pixels[i+1]!==0 || pixels[i+2]!==255 || pixels[i+3]!==255) masked=false;
        resolve(masked);
      };img.src='data:image/png;base64,'+data;
    }),clipped.toString('base64'));
    assert.equal(fullyMasked,true,'Saved private-region pixels are an opaque mask');
    await assert.rejects(screenshot(page,file), {code:'EEXIST'});
    assert.deepEqual(await readFile(file), before);
    assert.deepEqual(await readdir(out), ['capture.png']);
  } finally { await browser.close(); }
});

test('presentation distinguishes CSS, viewport and clipping; occlusion still needs rendered evidence', async () => {
  const { chromium } = requireTool('playwright');
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const out = await mkdtemp(path.join(tmpdir(), 'kill-game-presentation-'));
  const rows = [], green = [0,160,0], white = [255,255,255];
  try {
    const page = await browser.newPage({ viewport: { width: 200, height: 120 } });
    for (const [name,parentStyle,style,cover,layout,css,inViewport,ratio,pixels] of [
      ['normal','','',false,true,true,true,1,[green,green]],
      ['transparent','','opacity:0',false,true,false,true,1,[white,white]],
      ['outside','','transform:translateX(4000px)',false,true,true,false,0,[white,white]],
      ['parent-transparent','opacity:0','',false,true,false,true,1,[white,white]],
      ['parent-hidden','visibility:hidden','',false,true,false,true,1,[white,white]],
      ['parent-no-layout','display:none','',false,false,false,false,0,[white,white]],
      ['partial-clip','width:40px;overflow:hidden','',false,true,true,true,0.5,[green,white]],
      ['full-clip','overflow:hidden','transform:translateX(100px)',false,true,true,true,0,[white,white]],
      ['covered','','',true,true,true,true,1,[white,white]],
    ]) {
      await page.setContent(`<style>body{margin:0;background:white}#parent{position:absolute;left:20px;top:20px;width:80px;height:60px}#preview{width:80px;height:60px;background:rgb(0,160,0)}</style><div id="parent" style="${parentStyle}"><div id="preview" style="${style}"></div></div>${cover?'<div style="position:absolute;inset:0;background:white"></div>':''}`);
      await page.evaluate(() => { globalThis.__presentationQA=()=>({aimRuntime:{selectedPieceId:'pawn'},turnRuntime:{phase:'ready',currentSide:'white'},inputRuntime:{mode:'aim'},aimParametersRuntime:{root:document.querySelector('#preview'),redDot:{visible:true}}}); });
      const state = await page.evaluate(selectionState);
      assert.deepEqual(state.preview,{hasLayoutBox:layout,cssVisible:css,intersectsViewport:inViewport,clippedViewportRatio:ratio},name);
      const file=path.join(out,`${name}.png`);await screenshot(page,file);
      const sampledPixels=await page.evaluate(data=>new Promise(resolve=>{
        const img=new Image();img.onload=()=>{
          const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;
          const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
          resolve([[30,30],[90,70]].map(([x,y])=>[...ctx.getImageData(x,y,1,1).data].slice(0,3)));
        };img.src='data:image/png;base64,'+data;
      }),(await readFile(file)).toString('base64'));
      assert.deepEqual(sampledPixels,pixels,name);
      rows.push({name,...state.preview,sampledPixels});
    }
    await writeJSON(path.join(out,'results.json'),{browser:browser.version(),rows,scope:'Native DOM measurements and two fixture screenshot pixels. Covered elements deliberately retain CSS/intersection success; no universal visibility or operability claim.'});
    console.log(`Presentation fixtures: ${out}`);
  } finally { await browser.close(); }
});
