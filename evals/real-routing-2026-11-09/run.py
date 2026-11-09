"""Run the frozen evaluator sessions via the shared Sol runner; preserve raw traces."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib,json,os,subprocess,time
R=Path(__file__).resolve().parents[2];P=R/'evals/runs/2026-11-09-real-routing'
runner=Path('C:/Users/DooBokWie/.agents/skills/astra-team/scripts/orchestration.mjs')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,v):p.write_bytes((json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode('utf-8'))
m=json.loads((P/'manifest.json').read_text(encoding='utf-8'));assert m['status']=='PREPARED_NOT_RUN'
assert sha(runner)==m['runner_sha256'] and sha(P/'codex-entry.mjs')==m['wrapper_sha256']
write(P/'grading-frozen.json',{'at':datetime.now(timezone.utc).isoformat(),'rubric_sha256':sha(P/'rubric.json'),'protocol_sha256':sha(P/'protocol.md'),'prepare_sha256':sha(R/'evals/real-routing-2026-11-09/prepare.py'),'run_sha256':sha(Path(__file__))})
env=dict(os.environ,ORCA_CODEX=str(P/'codex-entry.mjs'),PYTHONUTF8='1')
def run(row):
    cwd=Path(row['workspace']);out=P/row['id']
    for name,expected in row['inputs'].items():assert sha(cwd/name)==expected,(row['id'],name)
    start=time.monotonic();started=datetime.now(timezone.utc).isoformat()
    result=subprocess.run(['node',str(runner),'batch','.orca/tasks/task.json','--team','sol','--cwd',str(cwd),'--max-workers','1'],cwd=cwd,env=env,capture_output=True)
    (out/'dispatch-stdout.log').write_bytes(result.stdout);(out/'dispatch-stderr.log').write_bytes(result.stderr)
    timing={'id':row['id'],'exitCode':result.returncode,'started':started,'finished':datetime.now(timezone.utc).isoformat(),'elapsedSeconds':time.monotonic()-start};write(out/'timing.json',timing)
    for name,alias in [('stdout.json','worker-stdout.jsonl'),('stderr.log','worker-stderr.log'),('response.md','final-response.md'),('result.json','worker-result.json'),('task.json','worker-task.json')]:
        paths=list((cwd/'.orca/runs').glob('*/0-sol/'+name));assert len(paths)==1,(row['id'],name,paths)
        (out/alias).write_bytes(paths[0].read_bytes())
    changes={name:sha(cwd/name) if (cwd/name).exists() else None for name,expected in row['inputs'].items() if not (cwd/name).exists() or sha(cwd/name)!=expected}
    extras=[p.relative_to(cwd).as_posix() for folder in ['packet','skill','work'] if (cwd/folder).exists() for p in (cwd/folder).rglob('*') if p.is_file() and p.relative_to(cwd).as_posix() not in row['inputs']]
    write(out/'changes.json',{'changed_inputs':changes,'new_files_in_reviewed_roots':extras,'scope':'Observed file trees and trace, not OS isolation.'})
    if row['task']=='copy':(out/'ui-polish-copy.after.ts').write_bytes((cwd/'packet/source/ui-polish-copy.ts').read_bytes())
    return timing
m['status']='RUNNING';write(P/'manifest.json',m)
results=[]
with ThreadPoolExecutor(max_workers=3) as pool:
    for f in as_completed([pool.submit(run,row) for row in m['runs']]):
        result=f.result();results.append(result);write(P/'execution-summary.json',results)
        print(result['id'],result['exitCode'],round(result['elapsedSeconds'],1),flush=True)
m['status']='EXECUTED_NOT_SCORED';write(P/'manifest.json',m)
