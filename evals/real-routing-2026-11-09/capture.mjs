// Capture actual game modules in an injected component scene, not a natural match.
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {restrictedContext} from '../lib/browser-policy.mjs';
const [source,output]=process.argv.slice(2);
if(!source||!output)throw new Error('Usage: node capture.mjs ABSOLUTE_WEB ABSOLUTE_NEW_OUTPUT');
const web=path.resolve(source),out=path.resolve(output);
await mkdir(out); // Exclusive new evidence directory.
const require=createRequire(import.meta.url),gameRequire=createRequire(path.join(web,'package.json'));
const {createServer}=await import(pathToFileURL(gameRequire.resolve('vite')).href);
const {chromium}=require('playwright');
const server=await createServer({root:web,configFile:false,appType:'custom',optimizeDeps:{noDiscovery:true,entries:[]},cacheDir:path.join(out,'cache'),logLevel:'error',server:{host:'127.0.0.1',port:0,hmr:false,fs:{allow:[web,path.dirname(gameRequire.resolve('vite'))]}},define:{__POKI_BUILD__:'false',__CRAZYGAMES_BUILD__:'false',__PORTABLE_BUILD__:'false'}});
server.middlewares.use('/scene',(req,res)=>{res.setHeader('Content-Type','text/html');res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:16px;background:#26313b;color:white;font:16px sans-serif}.row{height:160px}.player-banner{position:relative!important}</style><div id="cards"></div><script type="module">
import {createCosmeticCardElements,updateCosmeticCard} from '/src/cosmetics-view.ts';
import {getCosmeticsCopy} from '/src/cosmetics-copy.ts';
import {I18nManager} from '/src/i18n.ts';
import '/src/player-banner.css';
I18nManager.setLanguage('en');
window.samples=[
{id:'classic',banner:'classic',frame:'frame:classic-gold',badge:'badge:mastery-m02',badgeFrame:'badgeFrame:gold',title:'title:explorer',titleFrame:'titleFrame:gold'},
{id:'cosmic',banner:'banner_cosmic_knight',frame:'frame:classic-gold',badge:'badge:mastery-m02',badgeFrame:'badgeFrame:gold',title:'title:explorer',titleFrame:'titleFrame:gold'},
{id:'no-title',banner:'forest',frame:null,badge:null,badgeFrame:'badgeFrame:gold',title:null,titleFrame:'titleFrame:gold'}];
for(const sample of samples){const row=document.createElement('div');row.className='row';row.textContent=sample.id;const card=document.createElement('div');card.className='player-banner';card.id=sample.id;card.innerHTML='<div class="player-banner-text"><strong class="player-banner-name">Player</strong><span class="player-banner-detail">Preview</span></div>';row.append(card);document.querySelector('#cards').append(row);updateCosmeticCard(createCosmeticCardElements(card),sample);}
window.copy=Object.fromEntries(['ko','en','ja','zh-CN','de','fr','es','ru','pt-BR'].map(lang=>[lang,getCosmeticsCopy(lang)]));window.ready=true;
</script>`);});
let browser;
try{
  await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
  browser=await chromium.launch({headless:true});
  const {context,policy}=await restrictedContext(browser,origin,{viewport:{width:380,height:540}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/scene');await page.waitForFunction(()=>window.ready);
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));await page.waitForTimeout(300);
  const views=[];
  for(const width of [380,960]){
    await page.setViewportSize({width,height:540});await page.screenshot({path:path.join(out,`cosmetics-${width}.png`)});
    views.push(await page.evaluate(()=>({width:innerWidth,rendered:[...document.querySelectorAll('.player-banner')].map(c=>({id:c.id,title:c.querySelector('.pb-title-plate').textContent,titleDisplay:getComputedStyle(c.querySelector('.pb-title-plate')).display,badgeHidden:c.querySelector('.pb-layer-badge').hidden,badgeFrameHidden:c.querySelector('.pb-layer-badgeframe').hidden}))})));
  }
  const data=await page.evaluate(()=>({samples,copy}));
  await writeFile(path.join(out,'observations.json'),JSON.stringify({capturedAt:new Date().toISOString(),browser:browser.version(),views,scope:'Actual cosmetics module and CSS; injected loadouts and minimal host markup, no account or full match. No audio, animation clip, narrative branches or art bible supplied.',errors,...data},null,2)+'\n');
  if(errors.length)throw new Error(errors.join('\n'));
}finally{try{await browser?.close();}finally{await server.close();}}
