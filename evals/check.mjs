// Package/static integrity checks. Does not score agent behavior or game quality.
import { readdir, readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../', import.meta.url));
const files = [];
async function visit(dir) {
  for (const item of await readdir(dir,{withFileTypes:true})) {
    if (['.git','.orca','node_modules','rechecks'].includes(item.name)) continue;
    const file=path.join(dir,item.name);
    if(item.isDirectory()) await visit(file); else files.push(file);
  }
}
await visit(root);
let json=0, links=0, scripts=0;
for(const file of files) {
  if(file.endsWith('.json')) { JSON.parse(await readFile(file,'utf8')); json++; }
  if(file.endsWith('.mjs')) { execFileSync(process.execPath,['--check',file],{stdio:'pipe'}); scripts++; }
  // Raw worker answers retain session-local paths; validate their frozen bytes, not those links.
  const archivedAnswer=file.startsWith(path.join(root,'evals','runs')+path.sep)&&['final-response.md','worker-response.md'].includes(path.basename(file));
  if(file.endsWith('.md')&&!archivedAnswer) {
    const text=await readFile(file,'utf8');
    for(const match of text.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const target=match[1].replace(/^<|>$/g,'').split('#')[0];
      if(!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
      const resolved=path.resolve(path.dirname(file),decodeURIComponent(target));
      assert.ok((await stat(resolved).catch(()=>null)),`Missing local link: ${path.relative(root,file)} -> ${target}`); links++;
    }
  }
}
const skill=path.join(root,'skills','kill-game-slop');
const runtime=files.filter(f=>f.startsWith(skill+path.sep));
assert.equal(runtime.length,9,'Installed package must remain the nine instruction/metadata/license files');
assert.ok(runtime.every(f=>/\.(md|yaml)$/.test(f)||path.basename(f)==='LICENSE'),'Executable added to installed package');
const snapshot=JSON.parse(await readFile(new URL('./review-v2-2026-11-06/snapshot.json',import.meta.url),'utf8'));
assert.deepEqual(Object.keys(snapshot.runtime_sha256_lf).sort(),runtime.map(f=>path.relative(skill,f).replaceAll('\\','/')).sort());
for(const [file,expected] of Object.entries(snapshot.runtime_sha256_lf)) {
  const text=(await readFile(path.join(skill,file),'utf8')).replaceAll('\r\n','\n');
  assert.equal(createHash('sha256').update(text).digest('hex'),expected,`Current runtime snapshot mismatch: ${file}`);
}
const record=new URL('./security-quality-2026-11-06/',import.meta.url);
const evidence=JSON.parse(await readFile(new URL('evidence-hashes.json',record),'utf8'));
for(const [file,expected] of Object.entries(evidence)) assert.equal(createHash('sha256').update(await readFile(new URL(file,record))).digest('hex'),expected,`Evidence changed: ${file}`);
const historical=JSON.parse(await readFile(new URL('historical-artifacts.json',record),'utf8'));
for(const [file,expected] of Object.entries(historical.files)) {
  let bytes=await readFile(path.join(root,file));
  if(!file.endsWith('.png'))bytes=Buffer.from(bytes.toString('utf8').replaceAll('\r\n','\n'));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),expected,`Historical evidence changed: ${file}`);
}
const archives={};
for(const [name,directory,count] of [['Comparison','runs/2026-11-06-comparison-utf8/',74],['Review v2','review-v2-2026-11-06/',43],['Repair comparison','runs/2026-11-06-repair-comparison/',551]]) {
  const base=new URL(directory,import.meta.url);
  const hashes=JSON.parse(await readFile(new URL('artifact-sha256.json',base),'utf8'));
  assert.equal(Object.keys(hashes).length,count,`${name} archive must retain all ${count} entries`);
  for(const [file,expected] of Object.entries(hashes)) assert.equal(createHash('sha256').update(await readFile(new URL(file,base))).digest('hex'),expected,`${name} evidence changed: ${file}`);
  archives[name]=Object.keys(hashes).length;
}
console.log(JSON.stringify({status:'passed',json,localLinks:links,scripts,runtimeFiles:runtime.length,evidenceFiles:Object.keys(evidence).length,historicalFiles:Object.keys(historical.files).length,archives,scope:'Static integrity only; external URLs/anchors and behavior are not checked'}));
