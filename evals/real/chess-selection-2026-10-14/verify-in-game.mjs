// Runs only a pinned local game copy, with a fresh guest context per condition.
import { createRequire } from 'node:module';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { restrictedContext } from '../../lib/browser-policy.mjs';
import { freshDirectory, writeJSON, screenshot, selectionState } from '../../lib/evidence.mjs';
import { requireTool, checkGame } from '../../lib/environment.mjs';
const pass = process.argv[2] ?? ('recheck-' + Date.now());
assert.match(pass, /^[a-z0-9-]+$/);
const out = await freshDirectory(fileURLToPath(new URL(`./rechecks/${pass}/`, import.meta.url)));
const environment = await checkGame(process.env.GAME_WEB_ROOT, process.env.GAME_SOURCE_MANIFEST);
const web = path.resolve(process.env.GAME_WEB_ROOT);
const gameRequire = createRequire(path.join(web, 'package.json'));
const { createServer } = await import(pathToFileURL(gameRequire.resolve('vite')).href);
const { chromium } = requireTool('playwright');
const server = await createServer({ root: web, configFile: false, cacheDir: path.join(out, 'vite-cache'), logLevel: 'error',
  server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [web, path.dirname(gameRequire.resolve('vite'))] } },
  define: { __POKI_BUILD__: 'false', __CRAZYGAMES_BUILD__: 'false', __PORTABLE_BUILD__: 'false' } });
let browser;
const results = {pass,started:new Date().toISOString(),environment,networkPolicies:[],instrumentation:'Response transformation adds runtime getters; pointer/touch input in a fresh local guest session; no state or clock injection',conditions:[]};
try {
 await server.listen();
 const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
 browser = await chromium.launch({...(process.env.BROWSER_PATH ? {executablePath:process.env.BROWSER_PATH} : {}),headless:true});
 results.browser = browser.version();
 for (const [width,height,touch] of [[360,800,true],[320,568,true],[1280,800,false]]) {
  const row={width,height,input:touch?'emulated touch':'mouse',language:'ko',captures:[],errors:[]};results.conditions.push(row);
  const {context,policy}=await restrictedContext(browser,origin,{viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1,locale:'ko-KR'},async(url,response)=>{
   if(url.pathname==='/src/main.ts'){
    const source=await response.text();const marker='setMainMenuReady(menuRuntime, true);';
    assert.ok(source.includes(marker),'observation point exists');
    return source.replace(marker,'globalThis.__presentationQA = () => ({sceneRuntime, inputRuntime, aimRuntime, aimParametersRuntime, turnRuntime});'+marker);
   }
  });
  results.networkPolicies.push(policy);
  const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',()=>row.errors.push('pageerror; message omitted'));
  const act=async locator=>touch?locator.tap():locator.click();
  const settle=async()=>{
   await page.waitForFunction(()=>globalThis.__presentationQA?.().inputRuntime.cameraTransition===null);
   await page.waitForTimeout(180);
  };
  const state=()=>page.evaluate(selectionState);
  let stage='startup';
  const cap=async name=>{stage=name;await settle();const s=await state();const file=`${width}-${name}.png`;
   await screenshot(page,path.join(out,file),{mask:[page.locator('#menu-profile-btn, #menu-account-btn, #guest-nickname-input, [data-private], [data-chat], .chat-panel')]});
   row.captures.push({name,path:file,...s});return s;};
  const select=async id=>{
   await settle();
   const point=await page.evaluate(id=>{const r=globalThis.__presentationQA(),m=r.sceneRuntime.pieceMeshes.get(id);m.geometry.computeBoundingBox();const p=m.geometry.boundingBox.getCenter(m.position.clone()).applyMatrix4(m.matrixWorld).project(r.sceneRuntime.camera);const rect=r.sceneRuntime.renderer.domElement.getBoundingClientRect();return{x:rect.x+(p.x+1)*rect.width/2,y:rect.y+(1-p.y)*rect.height/2,visible:m.visible};},id);
   assert.ok(point.visible);
   if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
   await settle();
   assert.equal((await state()).selected,id,'selection follows the actual pointer input');
  };
  try {
   await page.goto(origin);
   const skipPractice=page.getByRole('button',{name:'연습 건너뛰기',exact:true});
   const localMatch=page.getByRole('button',{name:/^2인 대전/});
   await page.locator('#btn-guest-submit:visible').or(localMatch).or(skipPractice).first().waitFor({timeout:30000});
   if(await skipPractice.isVisible()){
    await act(skipPractice);row.onboarding='Skipped first-run practice through its visible control';
   }
   await page.locator('#btn-guest-submit:visible').or(localMatch).first().waitFor({timeout:15000});
   if(await page.locator('#btn-guest-submit').isVisible()){
    row.entryRoute='local guest form';
    await page.locator('#guest-nickname-input').fill('SelectionQA');await act(page.locator('#btn-guest-submit'));
   }else row.entryRoute='automatic local guest menu in this source version';
   await localMatch.waitFor();stage='start match';
   await act(page.getByRole('button',{name:/^2인 대전/}));await act(page.getByRole('button',{name:'대전 시작',exact:true}));
   await page.waitForFunction(()=>globalThis.__presentationQA?.().turnRuntime.phase==='ready');
   let s=await cap('unselected');assert.equal(s.selected,null);assert.equal(s.previewVisible,false);assert.equal(s.actionBarVisible,false);
   await select('white-pawn-c2');s=await cap('selected');assert.equal(s.previewVisible,true);assert.equal(s.redDot,true);assert.equal(s.buttons.find(x=>x.action==='launch').pressed,'true');
   await act(page.locator('[data-action="strike"]'));s=await cap('strike');assert.equal(s.selected,'white-pawn-c2');assert.equal(s.strikePanelVisible,true);assert.equal(s.buttons.find(x=>x.action==='strike').pressed,'true');
   await act(page.locator('[data-action="launch"]'));s=await cap('aim');assert.equal(s.strikePanelVisible,false);assert.equal(s.buttons.find(x=>x.action==='launch').pressed,'true');
   await select('white-pawn-f2');s=await cap('reselected');assert.equal(s.selected,'white-pawn-f2');assert.equal(s.previewVisible,true);
   const rect=await page.locator('.game-canvas').boundingBox();
   if(touch)await page.touchscreen.tap(rect.x+rect.width-12,rect.y+12);else await page.mouse.click(rect.x+rect.width-12,rect.y+12);
   s=await cap('cleared');assert.equal(s.selected,null);assert.equal(s.previewVisible,false);assert.equal(s.redDot,false);assert.equal(s.actionBarVisible,false);
   await act(page.getByRole('button',{name:'메뉴로',exact:true}));
   const confirm=page.locator('[data-menu-confirm]');if(await confirm.isVisible())await act(confirm);
   await localMatch.waitFor();
   await act(page.getByRole('button',{name:/^2인 대전/}));await act(page.getByRole('button',{name:'대전 시작',exact:true}));
   await page.waitForFunction(()=>globalThis.__presentationQA?.().turnRuntime.phase==='ready');
   s=await cap('reentry');assert.equal(s.selected,null);assert.equal(s.actionBarVisible,false);assert.equal(s.previewVisible,false);
   for(const c of row.captures)for(const b of c.buttons){assert.ok(b.bounds.x>=0&&b.bounds.y>=0&&b.bounds.right<=width+1&&b.bounds.bottom<=height+1,'visible action buttons fit viewport');}
   assert.deepEqual(row.errors,[]);assert.equal(policy.failures,0,'No routing failures');row.status='passed';
  }catch(e){row.status='failed';row.error={name:e.name,stage};process.exitCode=1;}
  await context.close();console.log(width,row.status,row.error?.stage??'');
 }
}finally{
 results.finished=new Date().toISOString();
 try{await writeJSON(path.join(out,'results.json'),results);}
 finally{try{await browser?.close();}finally{await server.close();}}
}
