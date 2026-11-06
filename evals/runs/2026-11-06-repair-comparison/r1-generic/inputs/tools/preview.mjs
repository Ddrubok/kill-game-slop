import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {withScene} from './scene.mjs';
await mkdir('work',{recursive:true});
await withScene(path.resolve('web'),{},async({page,browserVersion})=>{
  await page.click('#open');await page.waitForTimeout(250);
  const file=path.resolve('work',`preview-${Date.now()}.png`);
  await writeFile(file,await page.screenshot(),{flag:'wx'});
  console.log(JSON.stringify({browserVersion,file}));
});
