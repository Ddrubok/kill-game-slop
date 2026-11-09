"""Extract reported usage and raw command records; judgments remain explicit AI review."""
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[2];P=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else R/'evals/runs/2026-11-09-real-routing'
def write(p,v):p.write_bytes((json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode('utf-8'))
m=json.loads((P/'manifest.json').read_text(encoding='utf-8'));assert m['status']=='EXECUTED_NOT_SCORED'
rows=[]
for row in m['runs']:
    d=P/row['id'];events=[json.loads(line) for line in (d/'worker-stdout.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
    turns=[e['usage'] for e in events if e['type']=='turn.completed'];assert turns,row['id']
    errors=[e for e in events if e['type'] in ['error','turn.failed']];assert not errors,errors
    usage={key:sum(t.get(key,0) for t in turns) for key in ['input_tokens','cached_input_tokens','output_tokens']}
    usage['uncached_input_tokens']=usage['input_tokens']-usage['cached_input_tokens']
    usage['total_tokens']=usage['input_tokens']+usage['output_tokens']
    commands=[e['item'] for e in events if e['type']=='item.completed' and e.get('item',{}).get('type')=='command_execution']
    write(d/'commands.json',commands)
    timing=json.loads((d/'timing.json').read_text(encoding='utf-8'));assert timing['exitCode']==0,timing
    changes=json.loads((d/'changes.json').read_text(encoding='utf-8'))
    copy_ok=None
    if row['task']=='copy':
        before=(P/'packet/source/ui-polish-copy.ts').read_text(encoding='utf-8')
        after=(d/'ui-polish-copy.after.ts').read_text(encoding='utf-8')
        assert before.count('Online friendly match')==1
        expected=before.replace('Online friendly match','Online friendly game')
        copy_ok=after==expected and list(changes['changed_inputs'])==['packet/source/ui-polish-copy.ts']
    rows.append({'id':row['id'],'task':row['task'],'condition':row['condition'],**usage,'elapsed_seconds':timing['elapsedSeconds'],'completed_turns':len(turns),'command_count':len(commands),'copy_exact_change':copy_ok,'changed_inputs':changes['changed_inputs'],'new_files_in_reviewed_roots':changes['new_files_in_reviewed_roots']})
write(P/'measurements.json',{'source':'Actual CLI turn.completed usage; elapsed includes runner startup and concurrent scheduling. No prices inferred.','runs':rows})
for row in rows:print(row['id'],row['total_tokens'],round(row['elapsed_seconds'],1),'copy',row['copy_exact_change'])
