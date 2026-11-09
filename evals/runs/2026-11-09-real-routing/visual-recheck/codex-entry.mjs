import { spawn } from 'node:child_process';
import path from 'node:path';
const cli=path.join(process.env.APPDATA,'npm','node_modules','@openai','codex','bin','codex.js');
const [command,...args]=process.argv.slice(2);
if(command!=='exec')throw new Error('Evaluation entry supports exec only');
const child=spawn(process.execPath,[cli,command,'-i','packet/cosmetics/cosmetics-380.png','-i','packet/cosmetics/cosmetics-960.png','-i','packet/promotion/360-open.png','-i','packet/promotion/360-selected-reduced.png','--ignore-user-config','--disable','apps','--disable','skill_search','-c','skills.include_instructions=false','-c','skills.bundled.enabled=false','-c','web_search="disabled"',...args],{stdio:'inherit',windowsHide:true});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
