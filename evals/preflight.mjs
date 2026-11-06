import { gameSnapshot, tooling, checkGame } from './lib/environment.mjs';
import { writeJSON } from './lib/evidence.mjs';
const [mode, web, manifest] = process.argv.slice(2);
try {
  if (mode === 'snapshot' && web && manifest) {
    await writeJSON(manifest, await gameSnapshot(web));
    console.log('Source snapshot created. This pins supplied files; it does not establish their safety or provenance.');
  } else if (mode === 'check' && web && manifest) {
    const result = await checkGame(web, manifest);
    console.log(JSON.stringify({ node: result.node, playwright: result.playwright, vite: result.vite, files: Object.keys(result.files).length }));
  } else if (mode === 'tools') console.log(JSON.stringify(tooling()));
  else throw new Error('Usage: node evals/preflight.mjs tools | snapshot <web> <new.json> | check <web> <manifest.json>');
} catch (error) { console.error(error.message); process.exitCode = 1; }
