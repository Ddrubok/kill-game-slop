# kill-game-slop

[English](README.md)

**게임의 행동·아트·콘텐츠·표현이 서로 맞물리는지 검토합니다.**

확인된 불일치와 설계 가설을 구분하고, 게임의 개성을 보존하면서 필요한 부분을 수정하는 에이전트 스킬입니다. 반복된 문구, 같은 수치, 혼합된 화풍, 장식용 선택이라는 이유만으로 결함이라고 판정하지 않습니다. 확인된 문제가 없는 검토도 유효합니다.

| 현재 검토 범위 | 예시 |
| --- | --- |
| 행동과 전환 | 이동 중 공격, 중단, 접촉, 피드백, 조작 복귀 |
| UI / HUD와 문구 | 정보 가림, 잘못 표시된 상태, 클릭 영역, 포커스, 복구 안내 |
| 아트와 개체 연속성 | 화면별 동일 캐릭터, 장비 부착, 의도된 변형, 실제 표시 크기의 가독성 |
| 콘텐츠와 서사 | 이름·설명과 실제 효과, 화자의 지식, 세계 상태, 분기 결과 |
| 요청된 전체 게임 검토 | 선택·성장·반복·기능 목적·종결을 살피고 미검토 범위를 명시 |

Unity, Unreal, Godot, Roblox, 웹 게임과 자체 엔진에 적용할 수 있는 검토 절차입니다. 각 엔진과의 연동을 검증했다는 뜻은 아닙니다. 검사기·AI 판별기·실행 의존성을 설치하지 않습니다. 설치 파일 11개 중 필요한 참조만 읽으며, 작은 문구 수정에 전체 게임 검토를 요구하지 않습니다.

## 사용

`$kill-game-slop`과 함께 게임, 자료, 요청 범위를 제시하세요. 검토 요청은 파일을 수정하지 않으며, 명시적인 수정 요청은 해당 범위의 변경을 허용합니다. 보고서는 확인된 결함·가설·선택적 제안·보존할 요소를 구분합니다. 정지 화면만으로 움직임·소리·사람의 선호를 입증하지 않습니다.

**작은 문구 수정**

```text
$kill-game-slop 실제 서버 응답 상태에 맞게 이 대기 문구만 수정해주세요.
다른 언어와 게임 규칙은 유지해주세요.
```

**아트 일관성**

```text
$kill-game-slop 이 캐릭터들의 초상화·장비 변형·플레이 화면을 실제 표시
크기에서 비교해 정체성과 형태의 일관성을 검토해주세요. 의도된 화풍 차이는
보존하고, 선택한 표본과 제외한 그룹을 적어주세요. 파일은 수정하지 마세요.
```

**서사 연속성**

```text
$kill-game-slop 이 대사 분기와 발생 조건·세계 상태를 비교해주세요.
모순과 의도된 반복·믿을 수 없는 화자의 발언을 구분하고, 부족한 근거를
적어주세요. 설정을 새로 만들거나 이야기를 고쳐 쓰지 마세요.
```

**전체 게임 검토**

```text
$kill-game-slop 제공한 빌드의 아트·조작·행동 피드백·선택·성장·서사·복구를
폭넓게 검토해주세요. 대표 사례와 예외 사례를 선정하고, 검토·부분 검토·
미검토·해당 없음 영역을 문제 판정과 구분해주세요. 같은 피해량만 보고
플레이가 같다고 판단하거나 보지 않은 콘텐츠까지 정상이라고 하지 마세요.
```

**행동 검토**

```text
$kill-game-slop 이동과 공격의 진입·접촉·중단·복귀를 함께 검토해주세요.
허용된 이동 공격, 판정 시점, 의도된 과장 표현은 유지하고, 관찰된 불일치와
추정 원인을 구분해주세요. 파일은 수정하지 마세요.
```

[예시 문서](docs/examples.ko.md)에서 변경 전후의 판단을 설명합니다. [bettermakegame](https://github.com/Ddrubok/bettermakegame)은 더 넓은 UI·정체성 대안을 지원하는 선택 사항입니다. 두 스킬 모두 상대 스킬 설치 없이 허용된 범위의 수정을 할 수 있습니다.

## 설치

`skills/kill-game-slop` 폴더 전체를 에이전트의 스킬 경로에 복사하세요. 저장소를 내려받은 뒤 그 안에서 실행합니다.

```bash
mkdir -p ~/.codex/skills
cp -r skills/kill-game-slop ~/.codex/skills/
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$HOME/.codex/skills" | Out-Null
Copy-Item -Recurse skills/kill-game-slop "$HOME/.codex/skills/"
```

기존 사본의 사용자 수정 사항을 비교한 뒤 교체하세요. 다른 환경에서는 `SKILL.md`와 연결된 참조를 읽게 할 수 있으며, 자동 발견과 호출 방식은 호스트에 따라 다릅니다. `game-ui-craft`는 이전 Roblox 중심 이름입니다.

## 검증 기록과 한계

- [2026-11-09 실제 게임·참조 선택 예비 평가](evals/runs/2026-11-09-real-routing/report.ko.md): 고정 게임 하나에서 새 세션 8개를 실행하고 새 코스메틱 표본과 기존 승급 대조 사례를 구분했습니다. 문구·아트·전체 검토는 참조를 각각 1·2·4개 읽었습니다. 이미지 첨부 비교에서 전체 스킬은 짧은 지침보다 총 토큰이 5.2% 더 들었고 정확도·절감 우위는 입증하지 못했습니다.
- [2026-11-09 아트·콘텐츠 예비 평가](evals/art-content-2026-11-09/README.ko.md): 직접 만든 이미지·데이터와 AI 예비 평가 1회입니다. 기준 9개 충족은 게임 9개 검증을 뜻하지 않습니다. 공개된 Windows 기록에서는 브라우저 테스트 3개를 포함해 검사 도구 테스트 10개가 통과했습니다. 기록 무결성과 게임 진단 정확도는 별개입니다.
- [2026-11-06 당시 버전: 실제 수정 비교](evals/runs/2026-11-06-repair-comparison/report.ko.md): 이미 살펴본 게임 구성요소 하나를 네 조건에서 세 번씩 실행했습니다. **2026-11-06 당시 버전**의 결과이며, 아트·콘텐츠 확장 이후 최신 스킬의 측정값이 아닙니다.
- [2026-11-06 당시 버전: 합성 사례 비교](evals/runs/2026-11-06-comparison-utf8/report.ko.md): 일반 요청·짧은 지침·전체 스킬을 각각 한 번 AI로 채점했고 모두 26개 기준을 충족했습니다. 일반적인 정확도 우위는 입증되지 않았습니다.

과거 결과와 한계는 [날짜별 개발 이력](docs/history.ko.md), 입력과 채점 방식은 [평가 절차](evals/README.ko.md), 재실행 방법은 [유지보수 안내](evals/MAINTENANCE.ko.md)에 있습니다. 작은 표본으로 사람의 선호·재미·네이티브 엔진 호환성·안정적인 토큰 및 시간 절감을 입증할 수는 없습니다.

## 참조 경로

[SKILL.md](skills/kill-game-slop/SKILL.md)에서 시작해 작업에 필요한 참조만 읽습니다. [표현](skills/kill-game-slop/references/presentation-checks.md), [행동 일관성](skills/kill-game-slop/references/gameplay-coherence.md), [아트·콘텐츠](skills/kill-game-slop/references/art-content-coherence.md), [전체 게임 범위](skills/kill-game-slop/references/whole-game-review.md), [에디터 수정](skills/kill-game-slop/references/editor-specs.md), [실행 증거](skills/kill-game-slop/references/runtime-checks.md), [선택적 인계](skills/kill-game-slop/references/skill-handoff.md)로 나뉩니다.

독자용 안내와 보고서는 영어 `.md`와 한국어 `.ko.md`를 제공하며 같은 언어로 연결합니다. 설치용 에이전트 지침은 공통 영어 참조를 사용합니다. 실험 원문은 [문서 언어 정책](evals/README.ko.md#문서-언어와-원본-기록)에 따라 원래 언어를 보존합니다.

## 라이선스

[MIT](LICENSE). [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop)의 정리 철학에서 영감을 받았으며, 원본 코드를 포함하지 않고 독립적으로 개발했습니다.
