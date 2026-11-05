# Feedback repairs / 피드백 수정

2026-11-05. Neutral EN/KO review examples replace prompts that assumed excessive effects. Korean discovery phrases and optional Codex metadata were added; activation rates are unmeasured. Conditional engine/human verification moved out of SKILL.md while retaining scope, judgment, provenance and preservation rules. UI/control findings can now be received by bettermakegame through its general finding contract, without requiring a VFX brief. Findings can also go directly to game-vfx.

문제를 전제한 영문·한국어 예시를 고치고 한국어 탐색 문구·선택적인 Codex 정보를 추가했습니다. 자동 호출률은 측정하지 않았습니다. 엔진·사람 검증의 상세 설명은 조건부 문서로 옮겼으며 범위·판단·출처·보존 원칙을 유지했습니다. UI·조작 발견 사항도 bettermakegame의 공통 수신 규칙으로 넘길 수 있고 game-vfx에 직접 전달할 수도 있습니다.

The old nine-test fixture failed to cover higher-revision resurrection after completion and meaningful world-write detection. Its published snapshot at `e8a68bd` is retained with that limitation. We reran the corrected online-impact fixture at bettermakegame `fd3c15df5cbbd9226003233e573af67cf8da0c85`: **13 tests passed**. The new source/test hashes and this runtime's hashes are in the [snapshot](feedback-repair-2026-11-05-snapshot.json). This is fixture evidence, not a successful handoff or skill comparison.

이전 9개 검사의 누락을 과거 기록에 명시했습니다. bettermakegame의 수정된 공통 예제 13개를 다시 실행해 통과했으며 원본·검사·이번 실행 지침의 해시는 별도 스냅샷에 남깁니다. 스킬 전달이나 성능 비교를 통과했다는 뜻은 아닙니다.

The historical chess checker's `.orca` import was replaced with normal Node resolution or optional `PLAYWRIGHT_ROOT` (parent of `node_modules`). `BROWSER_PATH` optionally selects a Chromium executable; Edge remains the default. New runs use a fresh `rechecks/` directory and refuse to overwrite existing results. Run `node verify-in-game.mjs unique-run-name` only with the original compatible ChessAlkkkaegi project and local server at `http://127.0.0.1:5236/`. It retains its historical source interception and fixture assumptions; arbitrary game revisions are not supported. **Only JavaScript syntax was checked; the changed launcher was NOT RUN against the game.** Prior captures/results are untouched.

체스 검사기의 비공개 경로를 제거하고 기존 Playwright/선택적 브라우저 경로를 받을 수 있게 했습니다. 재실행은 새 `rechecks/` 폴더만 사용하며 기존 결과를 덮어쓰지 않습니다. 원래 호환되는 게임 소스와 5236 포트의 로컬 서버가 필요합니다. 과거 소스 계측과 예제 가정은 남아 있으며 모든 게임 버전을 지원하지 않습니다. 이번에는 JS 문법만 검사했고 실제 게임 재실행은 미실행입니다. 기존 캡처·결과는 보존했습니다.

Static metadata, links and whitespace checks are recorded in [results](feedback-repair-2026-11-05-results.json). Handoff criteria, U/V comparisons, actual repair benefit, human playtests and cross-host activation remain **NOT RUN**. Historical ties and preservation-only Chess outcomes are unchanged. A shorter entrypoint is not evidence of faster or better decisions.

메타데이터·링크·공백 검사 결과는 별도 기록합니다. 전달 행동·U/V·실제 수리 효과·사람 테스트·호스트별 자동 활성화는 미실행입니다. 과거 동점 결과와 체스 보존 사례도 그대로 유지합니다. 진입 문서 축약만으로 속도나 판단 개선을 주장하지 않습니다.
