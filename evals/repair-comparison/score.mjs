// Hidden from workers; frozen before any repair session starts.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {isDeepStrictEqual as equal} from 'node:util';
import {withScene} from './scene.mjs';
const [webArg,outArg,baselineArg]=process.argv.slice(2);
const web=path.resolve(webArg),out=path.resolve(outArg);
await mkdir(out); // Never overwrite a previous judgement.
const expected=baselineArg?JSON.parse(await readFile(baselineArg,'utf8')):null;
const checks=[],observations=[];
const check=(name,actual,wanted)=>checks.push({name,passed:equal(actual,wanted),actual,expected:wanted});
const capture=async(page,name)=>writeFile(path.join(out,name+'.png'),await page.screenshot(),{flag:'wx'});
const calls=page=>page.evaluate(()=>structuredClone(__case.calls));
const open=(page,owner='current')=>page.evaluate(owner=>{__case.calls.length=0;__case.open(owner);},owner);
const choose=(page,type)=>page.evaluate(type=>document.querySelector(`[data-piece-type="${type}"]`).click(),type);
const options=()=>[...document.querySelectorAll('.promotion-piece-card')].map(e=>({type:e.dataset.pieceType,text:e.textContent.replace(/\s+/g,' ').trim()}));
const motion=()=>{const s=getComputedStyle(document.querySelector('.promotion-modal-overlay'));return {name:s.animationName,duration:s.animationDuration};};
const languages=['ko','en','ja','zh-CN','de','fr','es','ru','pt-BR'];
const localized={};
for(const width of [360,960]) {
  try {await withScene(web,{viewport:{width,height:800}},async({page,errors,policy,browserVersion})=>{
    await page.click('#open');await page.waitForTimeout(250);
    check(`${width}: four choices`,await page.locator('.promotion-piece-card').count(),4);
    await capture(page,`${width}-open`);
    const animation=await page.evaluate(motion);
    check(`${width}: normal entry animation retained`,animation.name!=='none'&&parseFloat(animation.duration)>0,true);
    await page.locator('[data-piece-type="Queen"]').dblclick({delay:25});await page.waitForTimeout(180);
    check(`${width}: rapid input dispatches once`,await calls(page),[{owner:'current',type:'Queen'}]);
    await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
    await open(page,'obsolete');await choose(page,'Knight');
    await page.evaluate(()=>__case.open('replacement'));await page.clock.runFor(121);
    check(`${width}: replaced owner cancelled`,await calls(page),[]);
    check(`${width}: one replacement modal`,await page.locator('.promotion-modal-overlay').count(),1);
    await choose(page,'Rook');await page.clock.runFor(119);
    check(`${width}: no callback before original delay`,await calls(page),[]);
    await page.clock.runFor(2);
    check(`${width}: replacement choice at original delay`,await calls(page),[{owner:'replacement',type:'Rook'}]);
    await open(page,'removed');await choose(page,'Bishop');
    await page.evaluate(()=>document.querySelector('.promotion-modal-overlay').remove());await page.clock.runFor(121);
    check(`${width}: removed owner cancelled`,await calls(page),[]);
    await open(page,'keyboard');await page.locator('[data-piece-type="Knight"]').focus();
    await page.keyboard.press('Enter');await page.clock.runFor(121);
    check(`${width}: keyboard selection retained`,await calls(page),[{owner:'keyboard',type:'Knight'}]);
    for(const language of languages) {
      await page.evaluate(language=>{__case.language.setLanguage(language);__case.open('locale');},language);
      const value=await page.evaluate(options);
      if(width===360)localized[language]=value;
      if(expected)check(`${width}: preserve ${language} choices/copy`,value,expected[language]);
    }
    check(`${width}: page/routing errors`,errors.length+policy.failures,0);
    observations.push({width,browserVersion,policy});
  });}catch(error){checks.push({name:`${width}: execution`,passed:false,error:String(error.message).slice(0,500)});}
}
for(const mode of ['normal','system','local']) {
  try {await withScene(web,{viewport:{width:320,height:800},reducedMotion:mode==='system'?'reduce':'no-preference'},async({page,errors,policy})=>{
    if(mode==='local')await page.evaluate(()=>__case.motion(true));
    await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
    await open(page);
    const entry=await page.evaluate(motion);
    if(mode!=='normal')check(`${mode}: reduced entry`,entry.name==='none'||parseFloat(entry.duration)===0,true);
    await page.clock.runFor(250);
    const fits=await page.locator('.promotion-piece-card').evaluateAll(elements=>elements.every(e=>{const b=e.getBoundingClientRect();const hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return b.width>0&&b.height>0&&b.left>=0&&b.top>=0&&b.right<=innerWidth+1&&b.bottom<=innerHeight+1&&(hit===e||e.contains(hit));}));
    check(`${mode}: 320px choices fit and receive pointer`,fits,true);
    const visual=()=>{const b=document.querySelector('[data-piece-type="Bishop"]'),s=getComputedStyle(b);return ['backgroundColor','borderColor','borderWidth','boxShadow','outlineStyle','outlineWidth'].map(k=>s[k]);};
    const before=await page.evaluate(visual);
    await choose(page,'Bishop');
    const selected=await page.locator('.promotion-piece-card').evaluateAll(elements=>({
      chosen:elements.filter(e=>e.getAttribute('aria-pressed')==='true'||e.getAttribute('aria-selected')==='true').map(e=>e.dataset.pieceType),
      disabled:elements.filter(e=>e.disabled||e.getAttribute('aria-disabled')==='true').length,
    }));
    check(`${mode}: accessible pending choice`,selected.chosen,['Bishop']);
    check(`${mode}: pending controls marked unavailable`,selected.disabled,4);
    check(`${mode}: visible pending cue`,equal(before,await page.evaluate(visual)),false);
    const closing=await page.evaluate(motion);
    check(`${mode}: closing motion preference`,closing.name==='none'||parseFloat(closing.duration)===0,mode!=='normal');
    await capture(page,`${mode}-pending`);
    await page.clock.runFor(119);check(`${mode}: delay preserved`,await calls(page),[]);
    await page.clock.runFor(2);check(`${mode}: one completed choice`,await calls(page),[{owner:'current',type:'Bishop'}]);
    check(`${mode}: page/routing errors`,errors.length+policy.failures,0);
  });}catch(error){checks.push({name:`${mode}: execution`,passed:false,error:String(error.message).slice(0,500)});}
}
if(!expected)await writeFile(path.join(out,'localized-baseline.json'),JSON.stringify(localized,null,2)+'\n',{flag:'wx'});
const report={passed:checks.every(c=>c.passed),passedChecks:checks.filter(c=>c.passed).length,totalChecks:checks.length,checks,observations,
  scope:'Real source/component repair, mouse/keyboard plus explicit lifecycle calls and paused-clock timing. Not full-match play, independent human quality or a security attack benchmark.'};
await writeFile(path.join(out,'score.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({passed:report.passed,passedChecks:report.passedChecks,totalChecks:checks.length,failed:checks.filter(c=>!c.passed).map(c=>c.name),output:out}));
process.exitCode=report.passed?0:1;
