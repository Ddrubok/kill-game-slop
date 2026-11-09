"""Fresh visual recheck: same art tasks/rubric, explicitly attached packet PNGs.

The first CLI traces do not expose image-view events. Preserve that limitation;
do not overwrite the first runs or change the rubric after observing answers.
"""
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib,json,os,shutil,subprocess,time
R=Path(__file__).resolve().parents[2];BASE=R/'evals/runs/2026-11-09-real-routing'
P=BASE/'visual-recheck';W=R/'.orca/real-routing-images-20261109'
RUNNER=Path('C:/Users/DooBokWie/.agents/skills/astra-team/scripts/orchestration.mjs')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes((json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode('utf-8'))
assert not W.exists() and not P.exists(),'Use new output paths'
W.mkdir(parents=True);P.mkdir(parents=True)
wrapper=(BASE/'codex-entry.mjs').read_text(encoding='utf-8')
images=['packet/cosmetics/cosmetics-380.png','packet/cosmetics/cosmetics-960.png','packet/promotion/360-open.png','packet/promotion/360-selected-reduced.png']
wrapper=wrapper.replace("'--ignore-user-config'",','.join(repr(x) for pair in [('-i',i) for i in images] for x in pair)+",'--ignore-user-config'")
(P/'codex-entry.mjs').write_bytes(wrapper.encode('utf-8'))
rows=[]
for condition in ['generic','brief','full']:
    name='art-'+condition;cwd=W/name;cwd.mkdir();subprocess.run(['git','init','--quiet',str(cwd)],check=True)
    shutil.copytree(BASE/'packet',cwd/'packet');(cwd/'work').mkdir()
    if condition=='full':shutil.copytree(BASE/'runtime',cwd/'skill')
    shutil.copyfile(BASE/name/'prompt.txt',cwd/'prompt.txt')
    task=json.loads((BASE/name/'dispatch-task.json').read_text(encoding='utf-8'));write(cwd/'.orca/tasks/task.json',task)
    inputs={p.relative_to(cwd).as_posix():sha(p) for p in cwd.rglob('*') if p.is_file() and '.git' not in p.relative_to(cwd).parts}
    write(P/name/'inputs.json',inputs);shutil.copyfile(cwd/'prompt.txt',P/name/'prompt.txt');write(P/name/'dispatch-task.json',task)
    rows.append({'id':name,'task':'art','condition':condition,'workspace':str(cwd),'inputs':inputs})
write(P/'manifest.json',{'status':'PREPARED_NOT_RUN','prepared_at':datetime.now(timezone.utc).isoformat(),'model':'gpt-6-sol','reasoning':'medium','runs':rows,'attached_images':{i:sha(BASE/i) for i in images},'runner_sha256':sha(RUNNER),'wrapper_sha256':sha(P/'codex-entry.mjs'),'rubric_sha256':sha(BASE/'rubric.json'),'source_sha256':sha(Path(__file__)),'reason':'Fresh recheck with explicit CLI image attachment; first trace image-view events unavailable. Same rubric and art prompts; results kept separate.'})
env=dict(os.environ,ORCA_CODEX=str(P/'codex-entry.mjs'),PYTHONUTF8='1')
def run(row):
    cwd=Path(row['workspace']);out=P/row['id']
    for name,expected in row['inputs'].items():assert sha(cwd/name)==expected
    start=time.monotonic();started=datetime.now(timezone.utc).isoformat()
    result=subprocess.run(['node',str(RUNNER),'batch','.orca/tasks/task.json','--team','sol','--cwd',str(cwd),'--max-workers','1'],cwd=cwd,env=env,capture_output=True)
    (out/'dispatch-stdout.log').write_bytes(result.stdout);(out/'dispatch-stderr.log').write_bytes(result.stderr)
    timing={'id':row['id'],'exitCode':result.returncode,'started':started,'finished':datetime.now(timezone.utc).isoformat(),'elapsedSeconds':time.monotonic()-start};write(out/'timing.json',timing)
    for name,alias in [('stdout.json','worker-stdout.jsonl'),('stderr.log','worker-stderr.log'),('response.md','final-response.md'),('result.json','worker-result.json'),('task.json','worker-task.json')]:
        paths=list((cwd/'.orca/runs').glob('*/0-sol/'+name));assert len(paths)==1,(row['id'],name)
        (out/alias).write_bytes(paths[0].read_bytes())
    changes={name:sha(cwd/name) if (cwd/name).exists() else None for name,expected in row['inputs'].items() if not (cwd/name).exists() or sha(cwd/name)!=expected}
    extras=[p.relative_to(cwd).as_posix() for folder in ['packet','skill','work'] if (cwd/folder).exists() for p in (cwd/folder).rglob('*') if p.is_file() and p.relative_to(cwd).as_posix() not in row['inputs']]
    write(out/'changes.json',{'changed_inputs':changes,'new_files_in_reviewed_roots':extras,'scope':'Observed file trees and trace, not OS isolation.'})
    return timing
m=json.loads((P/'manifest.json').read_text(encoding='utf-8'));m['status']='RUNNING';write(P/'manifest.json',m)
results=[]
with ThreadPoolExecutor(max_workers=3) as pool:
    for f in as_completed([pool.submit(run,row) for row in rows]):
        result=f.result();results.append(result);write(P/'execution-summary.json',results);print(result['id'],result['exitCode'],round(result['elapsedSeconds'],1),flush=True)
m['status']='EXECUTED_NOT_SCORED';write(P/'manifest.json',m)
