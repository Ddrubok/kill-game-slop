// Prepare isolated packets; never launches an agent or copies judge keys/results.
import { readFile, mkdir, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { freshDirectory, writeJSON } from './lib/evidence.mjs';
import { hashFile } from './lib/environment.mjs';
import { writeFile } from 'node:fs/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
const packets={coherence:'evals/gameplay-coherence-2026-11-05/inputs/cases.md',ui:'evals/ui-hud/cases.md',supplemental:'evals/ui-hud/supplemental-cases.md',safety:'evals/security-quality-2026-11-06/inputs.md'};
const [set,output]=process.argv.slice(2);
if(!packets[set]) throw new Error('Usage: node evals/prepare-comparison.mjs coherence|ui|supplemental|safety <new-directory>');
const out=await freshDirectory(output);
const common='Review every case in cases.md using only its supplied evidence. Report by case ID in Korean: judgment, evidence limits, minimal correction or preservation, and checks. Review only; do not edit games. Do not inspect judge keys, other conditions or previous results.';
const conditions={generic:common,brief:common+' Judge demonstrated player costs, preserve art direction, gameplay and accessible signals. Distinguish facts, hypotheses and taste. No confirmed problems is valid; state preservation and verification.',full:common+' Apply skill/SKILL.md and only its relevant linked references.'};
const manifest={created:new Date().toISOString(),set,source:packets[set],status:'PREPARED_NOT_RUN',conditions:{},limits:'Packet preparation is not an agent evaluation. Use fresh conversations under the host permissions; do not launch workers when the project requires solo work.'};
async function hashTree(dir) {
  const files={};
  async function walk(current) {
    for(const item of await readdir(current,{withFileTypes:true})) {
      const file=path.join(current,item.name);
      if(item.isDirectory())await walk(file);else files[path.relative(dir,file).replaceAll('\\','/')]=await hashFile(file);
    }
  }
  await walk(dir);return files;
}
for(const [condition,prompt] of Object.entries(conditions)) {
  const dir=path.join(out,condition);await mkdir(dir);
  await writeFile(path.join(dir,'prompt.txt'),prompt+'\n',{flag:'wx'});
  await writeFile(path.join(dir,'cases.md'),await readFile(path.join(root,packets[set])),{flag:'wx'});
  if(condition==='full')await cp(path.join(root,'skills/kill-game-slop'),path.join(dir,'skill'),{recursive:true,errorOnExist:true,force:false});
  manifest.conditions[condition]={status:'NOT_RUN',files:await hashTree(dir),model:null,settings:null,hostContext:null,started:null,finished:null,inputTokens:null,outputTokens:null,unnecessaryQuestions:null,unnecessaryReads:null,harmfulRepairs:null,missedDefects:null,actualRepairSuccess:null,rawResponse:null,toolTrace:null,scorer:null};
}
await writeJSON(path.join(out,'manifest.json'),manifest);
console.log('Prepared three frozen input packets. No agent has run; do not compare quality from this preparation.');
