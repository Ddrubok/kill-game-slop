import { createRequire } from 'node:module';
import { readFile, readdir, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';

export const requireTool = createRequire(new URL('../package.json', import.meta.url));
export function tooling() {
  let playwright;
  try { playwright = requireTool('playwright/package.json').version; }
  catch { throw new Error('Missing maintainer Playwright: run npm ci --prefix evals, then npm exec --prefix evals -- playwright install chromium'); }
  const expected = requireTool('./package.json').devDependencies.playwright;
  assert.equal(playwright, expected, 'Playwright version differs from the maintainer pin; run npm ci --prefix evals');
  return { node: process.version, platform: process.platform, playwright };
}

export async function hashFile(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

export async function sourceFiles(web) {
  const files = {};
  async function visit(dir) {
    for (const item of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
      if (['node_modules', '.git', '.orca', 'dist', '.vite'].includes(item.name)) continue;
      const file = path.join(dir, item.name);
      assert.ok(!item.isSymbolicLink(), `Source symlink requires an isolated ordinary copy: ${file}`);
      if (item.isDirectory()) await visit(file);
      else if (item.isFile()) files[path.relative(web, file).replaceAll('\\', '/')] = await hashFile(file);
    }
  }
  await visit(web);
  assert.ok(Object.keys(files).length, 'Game source directory is empty');
  return files;
}

export async function gameSnapshot(web) {
  web = await realpath(web);
  const gameRequire = createRequire(path.join(web, 'package.json'));
  let vite;
  try { vite = JSON.parse(await readFile(gameRequire.resolve('vite/package.json'), 'utf8')).version; }
  catch { throw new Error('GAME_WEB_ROOT needs the compatible game checkout and its existing Vite dependencies'); }
  let commit = null;
  try {
    const gitOptions = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };
    const gitRoot = path.resolve(execFileSync('git', ['-C', web, 'rev-parse', '--show-toplevel'], gitOptions).trim());
    if ([web, path.dirname(web)].includes(gitRoot)) commit = execFileSync('git', ['-C', web, 'rev-parse', 'HEAD'], gitOptions).trim();
  } catch {}
  // An exported copy has no game Git identity; retain its explicit source metadata instead.
  let provenance = null;
  try { provenance = JSON.parse(await readFile(path.join(web, '..', 'source.json'), 'utf8')); } catch {}
  return { schema: 1, hashAlgorithm: 'SHA-256 raw bytes', gitHeadAtPath: commit, exportedSource: provenance, vite, files: await sourceFiles(web) };
}

export async function checkGame(web, manifestPath) {
  assert.ok(web, 'Set GAME_WEB_ROOT to an isolated compatible game web directory');
  assert.ok(manifestPath, 'Set GAME_SOURCE_MANIFEST to a reviewed source snapshot; create with node evals/preflight.mjs snapshot <web> <new.json>');
  const expected = JSON.parse(await readFile(manifestPath, 'utf8'));
  const actual = await gameSnapshot(web);
  assert.equal(expected.schema, 1, 'Unsupported source manifest');
  assert.equal(actual.vite, expected.vite, 'Installed Vite version changed since the source snapshot');
  assert.deepEqual(actual.files, expected.files, 'Game files changed since the source snapshot');
  assert.equal(actual.gitHeadAtPath, expected.gitHeadAtPath, 'Git revision changed since the source snapshot');
  assert.deepEqual(actual.exportedSource, expected.exportedSource, 'Export provenance changed');
  return { ...tooling(), ...actual, manifestSha256: await hashFile(manifestPath) };
}
