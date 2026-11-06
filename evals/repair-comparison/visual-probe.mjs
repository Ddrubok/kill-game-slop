// Supplemental evidence for all trials, after a pseudo-element blind spot was found in source review.
// Does not change the frozen 64-check result.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {withScene} from './scene.mjs';
const [web,out]=process.argv.slice(2).map(p=>path.resolve(p));
await mkdir(out);
const rows=[];
for(const mode of ['normal','system','local']) {
  await withScene(web,{viewport:{width:320,height:800},reducedMotion:mode==='system'?'reduce':'no-preference'},async({page})=>{
    if(mode==='local')await page.evaluate(()=>__case.motion(true));
    await page.clock.install();await page.clock.pauseAt(new Date(Date.now()+1000));
    await page.evaluate(()=>__case.open());await page.clock.runFor(250);
    const state=()=>{
      const e=document.querySelector('[data-piece-type="Bishop"]');
      return {cssVisible:e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}),bounds:e.getBoundingClientRect().toJSON(),
        pseudo:['::before','::after'].map(p=>{const s=getComputedStyle(e,p);return {pseudo:p,content:s.content,display:s.display,visibility:s.visibility,opacity:s.opacity,color:s.color,fontSize:s.fontSize};})};
    };
    const before=await page.evaluate(state);
    await page.evaluate(()=>document.querySelector('[data-piece-type="Bishop"]').click());
    const after=await page.evaluate(state);
    await writeFile(path.join(out,`${mode}-pending.png`),await page.screenshot(),{flag:'wx'});
    rows.push({mode,before,after});
  });
}
await writeFile(path.join(out,'observations.json'),JSON.stringify({rows,scope:'Supplemental generated-content evidence, not a replacement or automatic override of the frozen score.'},null,2)+'\n',{flag:'wx'});
