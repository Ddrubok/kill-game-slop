import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { restrictedContext } from '../lib/browser-policy.mjs';
const require = createRequire(import.meta.url);

// Executes the supplied real module in a local component scene, not a full match.
export async function withScene(web, options, inspect) {
  const gameRequire=createRequire(path.join(web,'package.json'));
  const {createServer}=await import(pathToFileURL(gameRequire.resolve('vite')).href);
  const {chromium}=require('playwright');
  const server=await createServer({root:web,configFile:false,appType:'custom',
    optimizeDeps:{noDiscovery:true,entries:[]},cacheDir:path.join(web,'../work/vite-cache'),logLevel:'error',
    server:{host:'127.0.0.1',port:0,hmr:false,fs:{allow:[web,path.dirname(gameRequire.resolve('vite'))]}},
    define:{__POKI_BUILD__:'false',__CRAZYGAMES_BUILD__:'false',__PORTABLE_BUILD__:'false'}});
  server.middlewares.use('/scene',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/src/style.css"><div id="app"><button id="open">Open promotion</button></div>
      <script type="module">
      import {openPromotionModal,PROMOTION_PIECE_OPTIONS} from '/src/promotion-modal.ts';
      import {I18nManager} from '/src/i18n.ts';
      import {setMotionReduced} from '/src/ui-motion.ts';
      window.__case={calls:[],options:PROMOTION_PIECE_OPTIONS,language:I18nManager,motion:setMotionReduced,
        open(owner='current',side='white'){openPromotionModal('white-pawn-a7',side,type=>__case.calls.push({owner,type}),document.querySelector('#app'));}};
      document.querySelector('#open').onclick=()=>__case.open();window.ready=true;
      </script>`);
  });
  let browser;
  try {
    await server.listen();
    const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
    browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
    const {context,policy}=await restrictedContext(browser,origin,{viewport:{width:360,height:800},...options});
    const page=await context.newPage();page.setDefaultTimeout(5000);
    const errors=[];page.on('pageerror',()=>errors.push('pageerror'));
    await page.goto(origin+'/scene');await page.waitForFunction(()=>window.ready);
    return await inspect({page,context,origin,policy,errors,browserVersion:browser.version()});
  } finally {try{await browser?.close();}finally{await server.close();}}
}
