# Local component scene
Read UTF-8 files with explicit UTF-8 decoding. Dependencies are already installed; do not run install scripts.
From the workspace root, `node tools/preview.mjs` captures the real promotion module and closes its browser/server.
For your own checks in work/, import `withScene` from `../tools/scene.mjs` and call `await withScene(path.resolve('web'), {viewport:{width:360,height:800},reducedMotion:'reduce'}, async ({page,context,origin,policy,errors}) => { /* Playwright operations */ });`.
The helper opens /scene. Click #open, or use page.evaluate(() => __case.open('owner', 'white')). __case.calls contains callback owner/type pairs; __case.language and __case.motion expose the actual game's language/motion controls. The helper closes its server/browser on return. This is a component harness, not natural full-match play. Its routing blocks other HTTP(S) origins, redirects, WebSockets and service workers; it is not a host/process sandbox.
Playwright is available from tools/node_modules; Vite from web/node_modules. Do not modify linked dependencies. You can inspect your screenshots with the available image-viewing tool.
