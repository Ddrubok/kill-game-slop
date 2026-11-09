"""Freeze five fresh evaluator workspaces. No game project edits or agent launch."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, shutil, subprocess
R=Path(__file__).resolve().parents[2]
P=R/'evals/runs/2026-11-09-real-routing'
W=R/'.orca/real-routing-20261109'
S=R/'.orca/validation/chess-full/web'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,value):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_bytes((json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode('utf-8'))
def text(p,value):
    p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(value.encode('utf-8'))
assert not W.exists() and not (P/'manifest.json').exists(), 'Use fresh paths; do not overwrite evidence'
W.mkdir(parents=True);P.mkdir(parents=True,exist_ok=True)
source_names=['cosmetics-copy.ts','cosmetics.ts','cosmetics-view.ts','cosmetics-view.css','player-banner.ts','player-banner.css','ui-polish-copy.ts','banner-theme.ts']
expected=json.loads((R/'.orca/validation/chess-full-source.json').read_text(encoding='utf-8'))['files']
for name in source_names:
    assert sha(S/'src'/name)==expected['src/'+name],name
    dest=P/'packet/source'/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(S/'src'/name,dest)
for name in ['cosmetics-380.png','cosmetics-960.png','observations.json']:
    dest=P/'packet/cosmetics'/name;dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(R/'.orca/cosmetics-capture-20261109-v3'/name,dest)
for name in ['360-open.png','360-selected-reduced.png']:
    dest=P/'packet/promotion'/name;dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(R/'evals/real/promotion-2026-11-05/before'/name,dest)
old=json.loads((R/'evals/real/promotion-2026-11-05/before/results.json').read_text(encoding='utf-8'))
old.pop('fixed') # Omit the historical evaluator verdict; keep all observed values.
write(P/'packet/promotion/observations.json',old)
text(P/'packet/context.txt','''Game: ChessAlkkkaegi; frozen source commit 974cb39bcc716815aee79117f4f710b367454050, not a claim about today's live release.
source/ contains unchanged real game files. cosmetics/ contains new captures of its actual shared view, text functions and CSS at 380 and 960 pixels. Three loadouts were injected into minimal host markup; labels Player/Preview are harness labels. No account was used, no unlock was granted or persisted, no natural match was played. Two themes share the same badge/title; a third loadout has empty badge/title with frame IDs retained. Capture generator is not part of the game. Other languages, themes, rare states and a full match are not visually covered. observations.json includes actual getCosmeticsCopy output for nine locales, not a design brief.
promotion/ contains historical 2026-11-05 observations of the actual promotion component, a previously examined control. These are old frozen observations, not a fresh reproduction or a newly discovered bug. The modal takes one choice, then delivers it after 120 ms; cancelled/replaced owners must not deliver a new choice. Reduced motion is supported. Double-click/replacement records use actual browser mouse events with injected modal opening; the closing screenshot uses a paused synthetic clock. Selection/abilities are not new art samples.
No art bible, audio playback, animation clip, narrative branches, late-game play, account/server behavior or player preference data is available. Source logic is evidence of implementation, not proof of artistic intent. Review only the material present. Do not fetch extra material or execute game modules; supplied source/captures are sufficient for this bounded review. Read files as UTF-8.
''')
write(P/'runtime-snapshot.json',{'captured_at':datetime.now(timezone.utc).isoformat(),'runtime_sha256_lf':{p.relative_to(R/'skills/kill-game-slop').as_posix():hashlib.sha256(p.read_text(encoding='utf-8').encode('utf-8')).hexdigest() for p in sorted((R/'skills/kill-game-slop').rglob('*')) if p.is_file()}})
shutil.copytree(R/'skills/kill-game-slop',P/'runtime')
write(P/'provenance.json',{'repository':'Ddrubok/ChessAlkkkaegi','commit':'974cb39bcc716815aee79117f4f710b367454050','new_samples':'cosmetic cards, effective unlock copy, theme/state variants','previously_reviewed_control':'promotion 2026-11-05; not a novel defect','transformation':'Historical promotion results copied with only fixed verdict removed. Source files copied unchanged. Cosmetics captures use actual modules/CSS and injected loadouts/minimal host markup.','source_sha256':{name:sha(S/'src'/name) for name in source_names},'capture_source_sha256':sha(R/'evals/real-routing-2026-11-09/capture.mjs')})
common='''packet/context.txt를 먼저 읽고, 제공된 실제 게임의 아트·콘텐츠·상태 표현을 검토해주세요. 이미지와 실제 표시 문구를 소스와 비교하고 필요한 개선 사항을 한국어로 보고해주세요. 파일을 수정하지 마세요. 이 자료를 이용한 제한적인 검토이며 외부 자료를 가져오거나 게임을 실행하지 마세요.\n'''
brief="Judge demonstrated player costs, preserve the game's art direction, gameplay and accessible signals. Distinguish observed facts from hypotheses and optional taste proposals. No confirmed problems is valid; state what to preserve and what you would verify.\n"
copy='''packet/source/ui-polish-copy.ts에서 영어(en) friendlyTitle만 "Online friendly match"에서 "Online friendly game"으로 수정해주세요. 다른 값과 언어는 유지해주세요. 이 파일만 수정하고 결과를 한국어로 짧게 알려주세요. 외부 자료와 게임 실행은 필요하지 않습니다.\n'''
whole='''packet/context.txt를 먼저 읽고, 제공된 실제 게임 자료로 전체 게임의 일관성을 폭넓게 검토해주세요. 아트·정보·행동 피드백·선택·성장·서사·기능 목적·복구를 다뤄주세요. 제공되지 않은 영역은 그 사실을 밝혀주세요. 한국어로 보고하고 파일은 수정하지 마세요. 외부 자료를 가져오거나 게임을 실행하지 마세요.\n'''
rows=[]
for task,condition in [('art','generic'),('art','brief'),('art','full'),('copy','full'),('whole','full')]:
    name=f'{task}-{condition}';cwd=W/name;cwd.mkdir()
    subprocess.run(['git','init','--quiet',str(cwd)],check=True) # Own Git root prevents parent-tree enumeration.
    shutil.copytree(P/'packet',cwd/'packet');(cwd/'work').mkdir()
    prompt={'art':common,'copy':copy,'whole':whole}[task]
    if condition=='brief':prompt+=brief
    if condition=='full':
        shutil.copytree(P/'runtime',cwd/'skill');prompt+='\nApply the supplied skill/SKILL.md and relevant linked references.\n'
    text(cwd/'prompt.txt',prompt)
    dispatch='''The user requested fresh comparison and reference-routing measurements. This is an authorized evaluator session, not development delegation. Work only in this isolated Git root. Read prompt.txt as UTF-8. You may read packet/ and the supplied skill/ if present. Only copy tasks may change packet/source/ui-polish-copy.ts; all other tasks are read-only. Temporary notes may go in work/. Do not inspect parent/sibling directories, installed skills, evaluation reports or judge keys. No delegation, Internet, installation, commits or publishing. Report actual observations and limits.'''
    write(cwd/'.orca/tasks/task.json',[{'worker':'sol','prompt':dispatch}])
    files={p.relative_to(cwd).as_posix():sha(p) for p in cwd.rglob('*') if p.is_file() and '.git' not in p.relative_to(cwd).parts}
    write(P/name/'inputs.json',files);text(P/name/'prompt.txt',prompt);write(P/name/'dispatch-task.json',[{'worker':'sol','prompt':dispatch}])
    rows.append({'id':name,'task':task,'condition':condition,'workspace':str(cwd),'inputs':files})
shutil.copyfile(R/'evals/runs/2026-11-06-repair-comparison/codex-entry.mjs',P/'codex-entry.mjs')
runner=Path('C:/Users/DooBokWie/.agents/skills/astra-team/scripts/orchestration.mjs')
write(P/'manifest.json',{'status':'PREPARED_NOT_RUN','prepared_at':datetime.now(timezone.utc).isoformat(),'model':'gpt-6-sol','reasoning':'medium','runs':rows,'runner_sha256':sha(runner),'wrapper_sha256':sha(P/'codex-entry.mjs')})
print('Prepared 5 fresh sessions, 3 art conditions and 3 full-skill scopes with art-full shared.')
