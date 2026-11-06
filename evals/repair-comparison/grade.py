"""Run frozen hidden checks, then separate visual probes, on every completed output."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
from datetime import datetime,timezone
import hashlib,json,subprocess

ROOT=Path(__file__).resolve().parents[2]
PUB=ROOT/'evals/runs/2026-11-06-repair-comparison'
manifest=json.loads((PUB/'manifest.json').read_text(encoding='utf-8'))
assert manifest['status']=='EXECUTED_NOT_SCORED'
frozen=json.loads((PUB/'execution-inputs.json').read_text(encoding='utf-8'))
for name,digest in frozen['coordinatorFiles'].items():assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest,name
record={'started':datetime.now(timezone.utc).isoformat(),'frozenCheckerUnchanged':True,'supplementalFiles':{name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in ['evals/repair-comparison/visual-probe.mjs','evals/runs/2026-11-06-repair-comparison/adjudication-plan.md']}}
(PUB/'grading-start.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
def grade(row):
    dest=PUB/row['id'];web=Path(row['workspace'])/'web'
    result=subprocess.run(['node',str(ROOT/'evals/repair-comparison/score.mjs'),str(web),str(dest/'judge'),str(PUB/'localized-baseline.json')],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    (dest/'judge-process.json').write_text(json.dumps({'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr},indent=2)+'\n',encoding='utf-8')
    score=json.loads((dest/'judge/score.json').read_text(encoding='utf-8'))
    probe=subprocess.run(['node',str(ROOT/'evals/repair-comparison/visual-probe.mjs'),str(web),str(dest/'visual-review')],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    (dest/'visual-process.json').write_text(json.dumps({'exitCode':probe.returncode,'stdout':probe.stdout,'stderr':probe.stderr},indent=2)+'\n',encoding='utf-8')
    return row['id'],score['passedChecks'],score['totalChecks'],[c['name'] for c in score['checks'] if not c['passed']],probe.returncode
with ThreadPoolExecutor(max_workers=4) as pool:
    for future in as_completed([pool.submit(grade,row) for row in manifest['runs']]):print(*future.result(),flush=True)
manifest['status']='SCORED_PENDING_AUDIT'
(PUB/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
