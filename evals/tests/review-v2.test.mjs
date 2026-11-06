import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, writeFile, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { promotionChecks } from '../real/promotion-2026-11-05/expectations.mjs';

test('default check rejects changed or missing comparison answers, results, logs and scores', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const copy = await mkdtemp(path.join(tmpdir(), 'kill-game-integrity-'));
  await cp(root, copy, { recursive: true, filter: file => !path.relative(root,file).split(path.sep).some(p => ['.git','.orca','node_modules','rechecks'].includes(p)) });
  const run = () => spawnSync(process.execPath, [path.join(copy,'evals/check.mjs')], { encoding: 'utf8' });
  const baseline = run(); assert.equal(baseline.status, 0, baseline.stderr);
  const archive = path.join(copy,'evals/runs/2026-11-06-comparison-utf8');
  for (const name of ['full/final-response.md','results.json','full/worker-stdout.jsonl','case-scores.csv']) {
    const file = path.join(archive,name), original = await readFile(file);
    try {
      // Trailing whitespace keeps JSON valid, so this exercises the hash check.
      await writeFile(file, Buffer.concat([original,Buffer.from('\n ')]));
      const changed = run(); assert.notEqual(changed.status,0); assert.match(changed.stderr,/Comparison evidence changed/);
      await unlink(file);
      const missing = run(); assert.notEqual(missing.status,0); assert.match(missing.stderr,/ENOENT|Missing local link/);
    } finally { await writeFile(file,original); }
  }
});

test('promotion signatures reject lost callbacks, wrong choices, mixed viewports and reduced-motion drift', async () => {
  for (const [variant, broken] of [['before',true],['after',false]]) {
    const original = JSON.parse(await readFile(new URL(`../security-quality-2026-11-06/evidence/promotion-${variant}/results.json`,import.meta.url),'utf8'));
    const passes = data => promotionChecks(data,broken).every(c => c.passed);
    assert.equal(passes(original),true);
    for (const mutate of [
      d => { for (const c of d.conditions) { c.doubleClick=[];c.staleClose=[];c.currentChoice=[]; } d.reducedCalls=[]; },
      d => { d.conditions[0].currentChoice=['Bishop']; },
      d => { d.conditions[1].doubleClick=[]; },
      d => { d.conditions.pop(); },
      d => { d.reducedState.animation='unexpected'; },
      d => { d.reducedCalls=[]; },
    ]) {
      const changed=structuredClone(original);mutate(changed);assert.equal(passes(changed),false);
    }
  }
});
