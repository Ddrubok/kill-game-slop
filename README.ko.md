# kill-game-slop

[English](README.md)

**Slop은 지우고, 게임의 개성은 남깁니다.**

복잡한 HUD, 상투적인 튜토리얼, 실제 상태와 다른 안내, 플레이를 가리는 효과를 다듬는 에이전트 스킬입니다. 무엇이 플레이를 방해하는지 확인한 뒤 필요한 부분만 고칩니다.

Unity·Unreal·Godot·Roblox·웹·자체 엔진에서 검토 기준으로 사용할 수 있습니다. 각 엔진과의 연동을 검증한 도구는 아니며, 스캐너나 AI 판별기를 설치하지 않습니다.

| 이전 | 수정 |
| --- | --- |
| 서버가 받기도 전에 “선택 확정!” | “선택 접수 완료 · 마감 전 변경 가능” |
| 적 표시만큼 밝게 빛나는 모든 패널 | 패널 강조를 줄이고 적 표시는 유지 |
| 게임에 잘 어울리고 읽기 쉬운 픽셀 장식 | 그대로 유지 |

설명을 위한 예제입니다. [판단 근거와 확인 항목](docs/examples.md)도 함께 제공합니다.

## 핵심 정돈 영역

- **UI / HUD 시각 계층 구조**: 불필요한 배지 및 장식적 요소를 줄이고 필수 게임플레이 정보를 직관적으로 전달하도록 정리합니다.
- **텍스트 및 내러티브**: 반복적인 튜토리얼 문구, 상투적인 안내문, 장황한 시스템 메시지를 톤앤매너에 맞게 간결하게 다듬습니다.
- **시각적 가독성**: 배경과 전경의 시각적 분리, 과도한 이펙트 및 파티클 중첩 완화, 교전 및 이동 시 타깃 실루엣 식별성을 개선합니다.
- **모션 및 오디오 절제**: 어지러움을 유발하는 과도한 카메라 흔들림, 강한 블룸 효과, 빈번한 고음역 효과음을 정돈합니다.
- **원작성 및 무결성 보존**: 의도된 아트 스타일, 게임 밸런스, 접근성 지원, 서버 권한 기반 네트워크 규칙을 훼손하지 않습니다.

## 설치 방법

`kill-game-slop`은 `skills/kill-game-slop/SKILL.md` 파일에 정의된 이식 가능한 마크다운 스킬 패키지입니다.

Codex 및 호환 에이전트 환경에서 다음과 같이 설치할 수 있습니다:

1. `skills/kill-game-slop` 디렉터리를 에이전트 스킬 경로로 복사합니다:
   ```bash
   mkdir -p ~/.codex/skills
   cp -r skills/kill-game-slop ~/.codex/skills/
   ```
2. 다른 에이전트에서는 폴더 전체를 보존하고 `SKILL.md`와 연결된 참고 파일을 읽도록 지정합니다. 자동 탐색과 호출 문법은 사용하는 도구에 따라 다릅니다.

저장소를 다운로드한 뒤 해당 폴더에서 복사 명령을 실행하세요. Windows PowerShell에서는:

```powershell
New-Item -ItemType Directory -Force "$HOME/.codex/skills" | Out-Null
Copy-Item -Recurse skills/kill-game-slop "$HOME/.codex/skills/"
```

기존 설치가 있다면 개인 수정 내용을 비교한 뒤 교체하세요. 이 스킬은 Roblox용으로 시작한 `game-ui-craft`의 후속 버전입니다.

## 사용법 및 호출 예시

`$kill-game-slop` 명령과 함께 게임 장르, 화면 상황, UI 구조 또는 기획 문서를 제공하여 호출합니다.

### 프롬프트 예시

- **아레나 슈터 (Arena Shooter)**
  ```text
  $kill-game-slop 빠른 템포의 SF 아레나 슈터 HUD를 검토해주세요. 무기 밸런스는 유지하되, 화면 중앙을 가리는 과도한 피격 마커와 화면 흔들림을 줄이고 난전 상황에서도 타깃 실루엣이 선명하게 보이도록 정리해주세요.
  ```

- **힐링 모바일 농장 게임 (Cozy Mobile Farm)**
  ```text
  $kill-game-slop 힐링 농장 시뮬레이션의 상점 UI와 튜토리얼 대화를 검토해주세요. 따뜻한 파스텔톤 아트는 유지하면서, 반복적인 알림 텍스트를 줄이고 과도하게 요란한 보상 사운드 효과를 차분하게 다듬어주세요.
  ```

- **픽셀 아트 로그라이크 (Pixel-Art Roguelike)**
  ```text
  $kill-game-slop 2D 픽셀 아트 던전 로그라이크의 화면 연출을 정리해주세요. 마법 시전 시 파티클 중첩 현상을 완화하고, 적 스프라이트와 배경 타일 간의 대비를 높여 픽셀 아트 스타일을 해치지 않고 시각적 가독성을 개선해주세요.
  ```

## 예시 문서

구체적인 디자인 전후 비교 분석 및 시나리오 예시는 [docs/examples.md](docs/examples.md)를 확인하세요.

설치되는 스킬에는 필요한 상황에서만 읽는 참고 문서가 포함됩니다.

- [프레젠테이션 검증](skills/kill-game-slop/references/presentation-checks.md): 구체적인 증상, 정상적인 반례, 동일 조건의 전후 화면 확인 절차
- [에디터 편집 명세](skills/kill-game-slop/references/editor-specs.md): 정확한 대상 지정, 참조 보존, 제안·적용·검증 상태 구분

자동 탐색을 위한 사용 조건은 description에 작성하며, 실제 호출 지원은 에이전트 환경에 따라 다릅니다. 비표준 triggers·file_patterns 필드에 의존하지 않습니다. [Agent Skills 규격](https://agentskills.io/specification)을 참고하세요.

## 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다. [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop)의 정리 철학에서 영감을 받았으나, 게임 프레젠테이션 디자인 워크플로에 맞춰 독립적으로 개발되었으며 업스트림 코드를 포함하지 않습니다.
