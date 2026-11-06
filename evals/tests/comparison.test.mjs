import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
test('comparison preparation keeps equivalent inputs, excludes keys, and never claims a run',async()=>{
  const parent=await mkdtemp(path.join(tmpdir(),'kill-game-packets-'));
  const out=path.join(parent,'comparison');
  const script=fileURLToPath(new URL('../prepare-comparison.mjs',import.meta.url));
  const result=spawnSync(process.execPath,[script,'coherence',out],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const manifest=JSON.parse(await readFile(path.join(out,'manifest.json'),'utf8'));
  assert.equal(manifest.status,'PREPARED_NOT_RUN');
  const inputs=[];
  for(const condition of ['generic','brief','full']){
    const dir=path.join(out,condition);
    inputs.push(await readFile(path.join(dir,'cases.md'),'utf8'));
    assert.deepEqual((await readdir(dir)).sort(),condition==='full'?['cases.md','prompt.txt','skill']:['cases.md','prompt.txt']);
    assert.equal(manifest.conditions[condition].status,'NOT_RUN');
    assert.equal(manifest.conditions[condition].inputTokens,null);
    for(const file of Object.keys(manifest.conditions[condition].files)) assert.doesNotMatch(file,/judge|rubric|results|response/);
  }
  assert.ok(inputs.every(input=>input===inputs[0]));
  const before=await readFile(path.join(out,'manifest.json'));
  assert.notEqual(spawnSync(process.execPath,[script,'coherence',out]).status,0);
  assert.deepEqual(await readFile(path.join(out,'manifest.json')),before);
});
