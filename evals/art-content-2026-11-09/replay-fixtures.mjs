// Reproduce the supplied calibration's function outputs, not agent or game performance.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { attack } from './inputs/combat.mjs';
import { bridgeKeeper, storyteller } from './inputs/dialogue.mjs';

const data = JSON.parse(await readFile(new URL('./inputs/defense.json', import.meta.url), 'utf8'));
const attacks = data.encounters.flatMap(encounter => data.units.map(unit => ({
  encounter: encounter.id, unit: unit.id, results: attack(unit, encounter.enemies),
})));
assert.deepEqual(attacks.map(row => row.results), [
  [{ id: 'boat-a', damage: 10, slow: 0 }], [],
  [{ id: 'boat-b', damage: 10, slow: 0 }],
  ['boat-b','boat-c','boat-d'].map(id => ({ id, damage: 10, slow: 0.5 })),
]);
const dialogue = { closed: bridgeKeeper({ bridgeOpen: false }), open: bridgeKeeper({ bridgeOpen: true }), boast: storyteller() };
// The unchanged input intentionally contains this contradiction; a pass reproduces it.
assert.equal(dialogue.closed, 'The bridge is still closed. Bring the key.');
assert.equal(dialogue.open, dialogue.closed);
assert.equal(dialogue.boast, 'I built this whole harbor in a single afternoon!');
assert.equal(data.album.combatBonus, 0);
console.log(JSON.stringify({ status: 'passed', node: process.version, platform: process.platform,
  attacks, dialogue, album: data.album,
  scope: 'Four attack calls, two bridge-state calls and one storyteller call on supplied fixtures. No new agent review, game playthrough, repair or skill-effectiveness measurement.' }, null, 2));
