"""Run the frozen 12-session experiment through the unchanged shared Astra runner."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib,json,os,random,subprocess,time

ROOT=Path(__file__).resolve().parents[2]
PUBLIC=ROOT/'evals/runs/2026-11-06-repair-comparison'
RUNNER=Path('C:/Users/DooBokWie/.agents/skills/astra-team/scripts/orchestration.mjs')
manifest=json.loads((PUBLIC/'manifest.json').read_text(encoding='utf-8'))
assert manifest['status']=='PREPARED_NOT_RUN'
frozen=json.loads((PUBLIC/'execution-inputs.json').read_text(encoding='utf-8'))
for name,expected in frozen['coordinatorFiles'].items():
    assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==expected,name
assert hashlib.sha256(RUNNER.read_bytes()).hexdigest()==frozen['sharedRunnerSha256']
env=dict(os.environ,ORCA_CODEX=str(PUBLIC/'codex-entry.mjs'),PYTHONUTF8='1')
results=[]

def run(row):
    cwd=Path(row['workspace'])
    for name,expected in row['inputs'].items():
        assert hashlib.sha256((cwd/name).read_bytes()).hexdigest()==expected,(row['id'],name)
    started=datetime.now(timezone.utc).isoformat();start=time.monotonic()
    result=subprocess.run(['node',str(RUNNER),'batch','.orca/tasks/task.json','--team','sol','--cwd',str(cwd),'--max-workers','1'],cwd=cwd,env=env,capture_output=True)
    (cwd/'.orca/dispatch-stdout.log').write_bytes(result.stdout)
    (cwd/'.orca/dispatch-stderr.log').write_bytes(result.stderr)
    timing={'id':row['id'],'condition':row['condition'],'repeat':row['repeat'],'exitCode':result.returncode,'started':started,'finished':datetime.now(timezone.utc).isoformat(),'elapsedSeconds':time.monotonic()-start}
    (cwd/'.orca/timing.json').write_text(json.dumps(timing,indent=2)+'\n',encoding='utf-8')
    return timing

manifest['status']='RUNNING'
(PUBLIC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
rng=random.Random(20261106)
for repeat in range(1,4):
    batch=[r for r in manifest['runs'] if r['repeat']==repeat];rng.shuffle(batch)
    print('Starting repeat',repeat,':',','.join(r['condition'] for r in batch),flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        for future in as_completed([pool.submit(run,r) for r in batch]):
            result=future.result();results.append(result)
            temp=PUBLIC/'execution-summary.tmp'
            temp.write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8');temp.replace(PUBLIC/'execution-summary.json')
            print(result['id'],'exit',result['exitCode'],'seconds',round(result['elapsedSeconds'],2),flush=True)
manifest['status']='EXECUTED_NOT_SCORED'
(PUBLIC/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
