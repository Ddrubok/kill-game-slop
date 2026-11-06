"""Archive completed, unselected outputs; prepare trace and source-change records."""
from pathlib import Path
from collections import Counter
import difflib,hashlib,json,os,shutil

ROOT=Path(__file__).resolve().parents[2]
PUB=ROOT/'evals/runs/2026-11-06-repair-comparison'
manifest=json.loads((PUB/'manifest.json').read_text(encoding='utf-8'))
assert manifest['status']=='EXECUTED_NOT_SCORED'
baseline=ROOT/'.orca/repair-comparison-20261106/baseline/web'
expected=json.loads((PUB/'game-input.json').read_text(encoding='utf-8'))['files']
sha=lambda data:hashlib.sha256(data).hexdigest()
def write(p,value):p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def copy(source,dest):dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
all_metrics=[]
for row in manifest['runs']:
    workspace=Path(row['workspace']);dest=PUB/row['id'];dest.mkdir()
    runs=list((workspace/'.orca/runs').glob('*/0-sol'))
    assert len(runs)==1,(row['id'],runs)
    run=runs[0]
    for source,target in [('stdout.json','worker-stdout.jsonl'),('stderr.log','worker-stderr.log'),('response.md','worker-response.md'),('result.json','worker-result.json'),('task.json','worker-task.json')]:
        if (run/source).exists():copy(run/source,dest/target)
    for source,target in [('.orca/timing.json','timing.json'),('.orca/tasks/task.json','dispatch-task.json'),('prompt.txt','prompt.txt')]:copy(workspace/source,dest/target)
    for name in row['inputs']:
        if name.startswith(('tools/','skill/')):copy(workspace/name,dest/'inputs'/name)
    protected=[]
    for name,digest in row['inputs'].items():
        if not (workspace/name).is_file() or sha((workspace/name).read_bytes())!=digest:protected.append(name)
    events=[json.loads(line) for line in (dest/'worker-stdout.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
    usage=[e['usage'] for e in events if e['type']=='turn.completed']
    messages=[e['item']['text'] for e in events if e['type']=='item.completed' and e.get('item',{}).get('type')=='agent_message']
    (dest/'final-response.md').write_text(messages[-1] if messages else '',encoding='utf-8')
    commands=[e['item'] for e in events if e['type']=='item.completed' and e.get('item',{}).get('type')=='command_execution']
    write(dest/'tool-commands.json',[{k:v for k,v in c.items() if k!='aggregated_output'} for c in commands])
    write(dest/'event-types.json',dict(Counter(e.get('item',{}).get('type') for e in events if e['type']=='item.completed')))
    timing=json.loads((dest/'timing.json').read_text(encoding='utf-8'))
    metrics={k:row[k] for k in ['id','condition','repeat']}
    metrics.update({k:sum(u.get(k,0) for u in usage) if usage else None for k in ['input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens']})
    metrics['uncached_input_tokens']=metrics['input_tokens']-metrics['cached_input_tokens'] if usage else None
    metrics['total_tokens']=metrics['input_tokens']+metrics['output_tokens'] if usage else None
    metrics.update(elapsedSeconds=timing['elapsedSeconds'],commandCount=len(commands),failedCommands=sum(c.get('exit_code',0)!=0 for c in commands),protectedInputChanges=protected,exitCode=timing['exitCode'])
    task=json.loads((dest/'worker-task.json').read_text(encoding='utf-8'))
    prefix=['ORCA_WORKER: You are a '+task['model']+' worker reporting to Codex GPT-6 Astra.','Project directory: '+task['cwd'],'Read applicable project instructions. You are a worker, not a coordinator.','Do not invoke orchestration.mjs, launch other agents, or delegate work.','Only modify files explicitly assigned below; otherwise return analysis or a proposed patch.','Preserve other agents edits. Do not commit, push, publish or change settings.','Return findings/changes, checks actually run, and remaining blockers.','',task['prompt']]
    (dest/'delivered-prompt.txt').write_text('\n'.join(prefix),encoding='utf-8')
    actual={}
    for directory,dirs,files in os.walk(workspace/'web',followlinks=False):
        dirs[:]=[d for d in dirs if d not in ['node_modules','.git','.orca','dist','.vite']]
        for name in files:
            p=Path(directory)/name;actual[p.relative_to(workspace/'web').as_posix()]=sha(p.read_bytes())
    changes=[];patch=[];added=removed=0
    for name in sorted(set(expected)|set(actual)):
        if expected.get(name)==actual.get(name):continue
        before=(baseline/name).read_bytes() if name in expected else b''
        after=(workspace/'web'/name).read_bytes() if name in actual else b''
        changes.append({'path':'web/'+name,'before':expected.get(name),'after':actual.get(name)})
        if name in actual:copy(workspace/'web'/name,dest/'edited/web'/name)
        lines=list(difflib.unified_diff(before.decode('utf-8').splitlines(True),after.decode('utf-8').splitlines(True),fromfile='a/web/'+name,tofile='b/web/'+name))
        added+=sum(s.startswith('+') and not s.startswith('+++') for s in lines)
        removed+=sum(s.startswith('-') and not s.startswith('---') for s in lines)
        patch.extend(lines)
    (dest/'repair.patch').write_bytes(''.join(patch).encode('utf-8'))
    write(dest/'source-changes.json',changes)
    artifacts={}
    for directory,dirs,files in os.walk(workspace/'work',followlinks=False):
        dirs[:]=[d for d in dirs if d not in ['node_modules','vite-cache','.vite']]
        for name in files:
            p=Path(directory)/name
            if p.suffix=='.tsbuildinfo':continue
            relative=p.relative_to(workspace).as_posix()
            archived=relative+('.txt' if p.suffix in ['.mjs','.js','.ts','.py','.ps1'] else '')
            if p.suffix=='.json':
                try:json.loads(p.read_text(encoding='utf-8-sig'))
                except (ValueError,UnicodeError):archived+='.txt'
            copy(p,dest/archived);artifacts[relative]={'archivedAs':archived,'sha256':sha(p.read_bytes())}
    write(dest/'work-artifacts.json',artifacts)
    metrics.update(changedFiles=len(changes),addedLines=added,removedLines=removed)
    write(dest/'metrics.json',metrics);all_metrics.append(metrics)
    print(row['id'],'tokens',metrics['total_tokens'],'commands',metrics['commandCount'],'changed',[c['path'] for c in changes],flush=True)
write(PUB/'measurements.json',all_metrics)
