"""Summarize observed trials without changing criteria or selecting favorable runs."""
from pathlib import Path
from statistics import median,mean
import csv,json,re

ROOT=Path(__file__).resolve().parents[2]
PUB=ROOT/'evals/runs/2026-11-06-repair-comparison'
rows=json.loads((PUB/'measurements.json').read_text(encoding='utf-8'))
overrides=json.loads((PUB/'adjudication.json').read_text(encoding='utf-8'))['overrides']
case_rows=[]
for row in rows:
    folder=PUB/row['id']
    score=json.loads((folder/'judge/score.json').read_text(encoding='utf-8'))
    commands=json.loads((folder/'tool-commands.json').read_text(encoding='utf-8'))
    changes=json.loads((folder/'source-changes.json').read_text(encoding='utf-8'))
    events=[json.loads(line) for line in (folder/'worker-stdout.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
    workspace=Path(json.loads((folder/'worker-task.json').read_text(encoding='utf-8'))['cwd'])
    outside=[{'item':e['item']['id'],**change} for e in events if e['type']=='item.completed' and e.get('item',{}).get('type')=='file_change' for change in e['item']['changes'] if not Path(change['path']).is_relative_to(workspace)]
    reads=[c['command'] for c in commands if re.search(r'Get-Content|ReadAllText|read_text|readFile',c['command'],re.I) and re.search(r'skill[/\\]+(?:SKILL\.md|references[/\\]+[\w-]+\.md)',c['command'],re.I)]
    files=sorted({p for c in reads for p in re.findall(r'skill[/\\]+(?:SKILL\.md|references[/\\]+[\w-]+\.md)',c,re.I)})
    parent_git=[c['command'] for c in commands if re.search(r'\bgit\s+(?:status|diff|rev-parse|ls-files)',c['command'])]
    audit={'protectedInputChanges':row['protectedInputChanges'],'sourceChangesOutsideSrc':[c['path'] for c in changes if not c['path'].startswith('web/src/')],'reportedFileChangesOutsideWorkspace':outside,
      'parentGitMetadataCommands':parent_git,'skillReadCalls':reads,'skillReadFiles':files,
      'limits':'Command-string read extraction; parent Git metadata was accessible because workspaces were not separate Git roots. Review complete traces for content access. This is not a filesystem isolation or security claim.'}
    (folder/'trace-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    row.update(functionalPass=score['passed'] and score['totalChecks']==64,passedChecks=score['passedChecks'],totalChecks=score['totalChecks'],skillReadCalls=len(reads),skillReadFiles=len(files),parentGitMetadataCalls=len(parent_git))
    accepted=[]
    for c in score['checks']:
        correction=next((o for o in overrides if o['trial']==row['id'] and o['check']==c['name']),None)
        if correction:assert c['passed']==correction['machinePassed']
        passed=correction['adjudicatedPassed'] if correction else c['passed'];accepted.append(passed)
        case_rows.append({'trial':row['id'],'condition':row['condition'],'repeat':row['repeat'],'check':c['name'],'machinePassed':c['passed'],'adjudicatedPassed':passed,'actual':json.dumps(c.get('actual'),ensure_ascii=False),'expected':json.dumps(c.get('expected'),ensure_ascii=False),'error':c.get('error','')})
    row.update(adjudicatedPass=all(accepted) and len(accepted)==64,adjudicatedPassedChecks=sum(accepted))
    row.update(observedWriteScopePass=not(outside or row['protectedInputChanges'] or audit['sourceChangesOutsideSrc']),outsideWorkspaceFileChanges=len(outside))
    row['qualifiedRepairPass']=row['adjudicatedPass'] and row['observedWriteScopePass']
    (folder/'metrics.json').write_text(json.dumps(row,indent=2)+'\n',encoding='utf-8')
summary={}
measures=['input_tokens','cached_input_tokens','uncached_input_tokens','output_tokens','reasoning_output_tokens','total_tokens','elapsedSeconds','commandCount','skillReadCalls','skillReadFiles','addedLines','removedLines']
for condition in ['generic','brief','full_previous','full_current']:
    group=[r for r in rows if r['condition']==condition]
    summary[condition]={'trials':len(group),'machinePasses':sum(r['functionalPass'] for r in group),'adjudicatedPasses':sum(r['adjudicatedPass'] for r in group),'observedWriteScopePasses':sum(r['observedWriteScopePass'] for r in group),'qualifiedRepairPasses':sum(r['qualifiedRepairPass'] for r in group),'median':{k:median(r[k] for r in group) for k in measures},'mean':{k:mean(r[k] for r in group) for k in measures}}
comparisons={}
for baseline in ['generic','brief','full_previous']:
    comparisons['full_current_vs_'+baseline]={k:100*(summary['full_current']['median'][k]/summary[baseline]['median'][k]-1) if summary[baseline]['median'][k] else None for k in measures}
result={'summary':summary,'currentMedianPercentChange':comparisons,'trials':rows,'statisticalScope':'Descriptive only: three repeats of one known real component task; no confidence or significance claim. Negative percentage means lower than the named denominator.'}
(PUB/'results.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
with (PUB/'trials.csv').open('w',encoding='utf-8-sig',newline='') as f:
    fields=['id','condition','repeat','functionalPass','adjudicatedPass','observedWriteScopePass','qualifiedRepairPass','passedChecks','adjudicatedPassedChecks','totalChecks',*measures,'parentGitMetadataCalls','outsideWorkspaceFileChanges','changedFiles','exitCode']
    writer=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');writer.writeheader();writer.writerows(rows)
with (PUB/'case-scores.csv').open('w',encoding='utf-8-sig',newline='') as f:
    writer=csv.DictWriter(f,fieldnames=list(case_rows[0]));writer.writeheader();writer.writerows(case_rows)
print(json.dumps({'summary':summary,'comparisons':comparisons},indent=2))
