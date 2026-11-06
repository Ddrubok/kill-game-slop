import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { freshDirectory, writeJSON } from '../lib/evidence.mjs';
import { localOrigin } from '../lib/browser-policy.mjs';
import { checkGame, gameSnapshot } from '../lib/environment.mjs';

test('evidence directories and result files cannot be overwritten, even concurrently', async () => {
  const parent = await mkdtemp(path.join(tmpdir(), 'kill-game-guard-'));
  const out = path.join(parent,'run');
  const outcomes = await Promise.allSettled([freshDirectory(out),freshDirectory(out)]);
  assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);
  const file=path.join(out,'results.json');
  await writeJSON(file,{original:true}); const before=await readFile(file);
  await assert.rejects(writeJSON(file,{changed:true}),{code:'EEXIST'});
  await assert.rejects(freshDirectory(out),/Refusing to reuse/);
  assert.deepEqual(await readFile(file),before);
  const checker=fileURLToPath(new URL('../real/promotion-2026-11-05/verify.mjs',import.meta.url));
  const result=spawnSync(process.execPath,[checker,out],{encoding:'utf8',env:{...process.env,GAME_WEB_ROOT:parent,GAME_SOURCE_MANIFEST:''}});
  assert.notEqual(result.status,0);
  assert.match(result.stderr,/Refusing to reuse evidence directory/);
  assert.deepEqual(await readFile(file),before);
});

test('origin parser rejects broad/credential/path allowlists', () => {
  assert.equal(localOrigin('http://127.0.0.1:4567'),'http://127.0.0.1:4567');
  for(const value of ['https://example.com','file:///tmp','http://127.0.0.1:4567/path','http://user:pass@localhost:4567','http://localhost:4567/?token=secret']) assert.throws(()=>localOrigin(value));
});

test('preflight catches changed source and installed dependency versions', async () => {
  const web=await mkdtemp(path.join(tmpdir(),'kill-game-preflight-'));
  const vite=path.join(web,'node_modules','vite');await mkdir(vite,{recursive:true});
  await writeFile(path.join(vite,'package.json'),JSON.stringify({name:'vite',version:'8.1.5'}));
  await writeFile(path.join(web,'main.js'),'export const state=1;');
  const manifest=path.join(tmpdir(),`kill-game-manifest-${Date.now()}.json`);
  await writeJSON(manifest,await gameSnapshot(web));
  assert.equal((await checkGame(web,manifest)).vite,'8.1.5');
  await writeFile(path.join(web,'main.js'),'export const state=2;');
  await assert.rejects(checkGame(web,manifest),/Game files changed/);
  await writeFile(path.join(web,'main.js'),'export const state=1;');
  await writeFile(path.join(vite,'package.json'),JSON.stringify({name:'vite',version:'0.0.0'}));
  await assert.rejects(checkGame(web,manifest),/Installed Vite version changed/);
});
