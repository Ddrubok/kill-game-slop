// Run against a local Vite dev server. This observes real runtime objects without changing game state.
import { chromium } from '../../.orca/ui-check/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const pass = process.argv[2] ?? 'recheck';
assert.match(pass, /^[a-z-]+$/);
const out = new URL(`./${pass}/`, import.meta.url);
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({channel:'msedge',headless:true});
const results = {pass,started:new Date().toISOString(),browser:browser.version(),externalNetwork:'blocked',instrumentation:'Playwright response interception adds a getter for actual runtime objects; no game state or clock mutation',conditions:[]};
try {
 for (const [width,height,touch] of [[360,800,true],[320,568,true],[1280,800,false]]) {
  const row={width,height,input:touch?'emulated touch':'mouse',language:'ko',captures:[],errors:[]};results.conditions.push(row);
  const context=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch,deviceScaleFactor:1,locale:'ko-KR'});
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());
   if(url.hostname!=='127.0.0.1')return route.abort();
   if(url.pathname==='/src/main.ts'){
    const response=await route.fetch();const source=await response.text();const marker='setMainMenuReady(menuRuntime, true);';
    assert.ok(source.includes(marker),'observation point exists');
    return route.fulfill({response,body:source.replace(marker,'globalThis.__presentationQA = () => ({sceneRuntime, inputRuntime, aimRuntime, aimParametersRuntime, turnRuntime});'+marker)});
   }
   return route.continue();
  });
  const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>row.errors.push(e.message));
  const act=async locator=>touch?locator.tap():locator.click();
  const settle=async()=>{
   await page.waitForFunction(()=>globalThis.__presentationQA?.().inputRuntime.cameraTransition===null);
   await page.waitForTimeout(180);
  };
  const state=()=>page.evaluate(()=>{
   const r=globalThis.__presentationQA();
   const visible=e=>{const box=e.getBoundingClientRect();return !!box.width&&!!box.height&&getComputedStyle(e).visibility!=='hidden';};
   return {selected:r.aimRuntime.selectedPieceId,phase:r.turnRuntime.phase,side:r.turnRuntime.currentSide,mode:r.inputRuntime.mode,previewVisible:visible(r.aimParametersRuntime.root),redDot:r.aimParametersRuntime.redDot.visible,feedback:r.aimParametersRuntime.feedback.textContent,actionBarVisible:visible(document.querySelector('.strike-action-bar')),strikePanelVisible:!!document.querySelector('.strike-point-panel')&&visible(document.querySelector('.strike-point-panel')),buttons:[...document.querySelectorAll('.strike-action-bar button')].filter(visible).map(e=>({text:e.innerText,action:e.dataset.action,pressed:e.getAttribute('aria-pressed'),bounds:e.getBoundingClientRect().toJSON()})),text:document.body.innerText};
  });
  const cap=async name=>{await settle();const s=await state();const path=`${width}-${name}.png`;await page.screenshot({path:fileURLToPath(new URL(path,out))});row.captures.push({name,path,...s});return s;};
  const select=async id=>{
   await settle();
   const point=await page.evaluate(id=>{const r=globalThis.__presentationQA(),m=r.sceneRuntime.pieceMeshes.get(id);m.geometry.computeBoundingBox();const p=m.geometry.boundingBox.getCenter(m.position.clone()).applyMatrix4(m.matrixWorld).project(r.sceneRuntime.camera);const rect=r.sceneRuntime.renderer.domElement.getBoundingClientRect();return{x:rect.x+(p.x+1)*rect.width/2,y:rect.y+(1-p.y)*rect.height/2,visible:m.visible};},id);
   assert.ok(point.visible);
   if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
   await settle();
   assert.equal((await state()).selected,id,'selection follows the actual pointer input');
  };
  try {
   await page.goto('http://127.0.0.1:5236/');await page.locator('#btn-guest-submit').waitFor({timeout:30000});
   await page.locator('#guest-nickname-input').fill('SelectionQA');await act(page.locator('#btn-guest-submit'));await page.locator('#menu-profile-btn').waitFor();
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
   await page.locator('#menu-profile-btn').waitFor();
   await act(page.getByRole('button',{name:/^2인 대전/}));await act(page.getByRole('button',{name:'대전 시작',exact:true}));
   await page.waitForFunction(()=>globalThis.__presentationQA?.().turnRuntime.phase==='ready');
   s=await cap('reentry');assert.equal(s.selected,null);assert.equal(s.actionBarVisible,false);assert.equal(s.previewVisible,false);
   for(const c of row.captures)for(const b of c.buttons){assert.ok(b.bounds.x>=0&&b.bounds.y>=0&&b.bounds.right<=width+1&&b.bounds.bottom<=height+1,'visible action buttons fit viewport');}
   assert.deepEqual(row.errors,[]);row.status='passed';
  }catch(e){row.status='failed';row.error=e.stack;await page.screenshot({path:fileURLToPath(new URL(`${width}-failure.png`,out))}).catch(()=>{});process.exitCode=1;}
  await context.close();console.log(width,row.status,row.error?.split('\n')[0]??'');
 }
}finally{results.finished=new Date().toISOString();await fs.writeFile(new URL('results.json',out),JSON.stringify(results,null,2));await browser.close();}
