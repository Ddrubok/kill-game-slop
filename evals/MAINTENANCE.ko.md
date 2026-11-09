# 유지보수 검사

[English](MAINTENANCE.md)

설치용 `skills/kill-game-slop/`는 텍스트·메타데이터·라이선스 11개 파일을 유지합니다. Node 의존성, TLS 테스트 자료와 브라우저 자동화는 `evals/`에만 있습니다. 저장소 루트에서 Node 22 이상으로 실행하세요.

```sh
node evals/check.mjs
npm ci --prefix evals --ignore-scripts
npm exec --prefix evals -- playwright install chromium
npm test --prefix evals
node evals/preflight.mjs tools
```

첫 명령은 Markdown 로컬 대상(외부 URL·앵커 제외), JSON, JavaScript 문법, 현재 실행 지침 스냅샷, 과거 증거, 고정된 비교·재검토 v2·실제 수정 비교의 아카이브 해시를 검사합니다. 원문 작업자 답변은 세션 로컬 링크를 유지하므로 경로를 해석하는 대신 해시로 바이트를 확인합니다. 검사기는 해시를 다시 쓰지 않습니다. 새 실행에는 새 기록을 만드세요. 해시는 실수·손실을 감지하며 자료와 해시를 함께 바꿀 수 있는 공격자를 인증하지 않습니다. 브라우저 테스트는 정확한 origin, HTTP/HTTPS 리디렉션, 팝업, WS/WSS, Service Worker 등록, 더미 정보 제외, 배타적 파일 생성, 소스·버전 변경, 표시 측정을 다룹니다. 이는 검사기 테스트이며 스킬 효과 측정이 아닙니다. `tests/fixtures/`의 localhost TLS 인증서·개인키는 외부 용도가 없는 공개 테스트 자격정보입니다.

공통 정책은 새 컨텍스트를 만들고 Service Worker와 모든 WebSocket을 차단하며, 정확한 HTTP(S) origin만 리디렉션 없이 요청하고 모든 리디렉션을 거부합니다. Vite HMR도 의도적으로 비활성화됩니다. 거부 기록에는 origin만 남기고 원본 URL 경로·쿼리, 헤더, 본문, 예외 메시지는 제외합니다. Playwright 라우팅은 Node·Vite·WebRTC·DNS·추측성 TCP 연결·호스트를 격리하지 않습니다. 신뢰할 수 없는 실행 파일에는 호스트 격리를 사용하세요. HTTP 요청이 차단돼도 브라우저가 추측성 TCP 연결을 열 수 있으므로 `externalNetwork: blocked`라고 표시하지 마세요.

기본 명령은 현재 지침 스냅샷과 16개 파일의 [아트·콘텐츠 증거 아카이브](art-content-2026-11-09/README.ko.md)도 검사합니다. 전달된 예비 평가와 로컬 재실행은 별도 기록으로 유지합니다. `node evals/art-content-2026-11-09/replay-fixtures.mjs`는 의도적으로 잘못된 대사를 포함한 제공 함수의 출력을 재현하며, 에이전트 효과 시험이 아닙니다. 새 출력은 고정된 아카이브 밖에 저장하세요.

## 실제 게임 재실행

검토한 별도 게임 `web/` 트리와 기존 의존성을 제공합니다. 전체 게임 검사에는 추적된 `public/` 자산과 진입 스크립트 전체가 필요하며 예전 승급 전용 export로는 부족합니다. 검사기는 프로젝트 Vite 설정과 package 스크립트를 우회하지만 게임 클라이언트와 Vite는 실행하므로 소스를 먼저 확인하세요. 운영 로그인이나 기존 브라우저 프로필을 사용하지 마세요.

각 소스 변형을 실행하기 전에 게임 web 폴더 밖에 새 manifest를 만듭니다.

```sh
node evals/preflight.mjs snapshot /isolated/game/web /new/source-manifest.json
node evals/preflight.mjs check /isolated/game/web /new/source-manifest.json
```

`GAME_WEB_ROOT`와 `GAME_SOURCE_MANIFEST`를 위 경로로 지정합니다. `BROWSER_PATH`로 기존 Chromium 실행 파일을 선택할 수 있으며, 지정하지 않으면 설치된 Playwright Chromium을 사용합니다. 결과에 실제 브라우저 버전을 기록합니다. Playwright는 고정된 유지보수 패키지와 일치해야 하고 Vite·소스 바이트·추적된 lockfile·Git/export 식별 정보는 시작 시 검토한 manifest와 일치해야 합니다. manifest는 제공된 파일을 고정할 뿐 export 주장이나 설치된 모든 게임 의존성과 lockfile의 일치를 인증하지 않습니다. 예상하지 못한 변경을 숨기려고 manifest를 갱신하지 마세요.

```sh
node evals/real/promotion-2026-11-05/verify.mjs evals/real/promotion-2026-11-05/rechecks/new-before --expect-broken
node evals/real/promotion-2026-11-05/verify.mjs evals/real/promotion-2026-11-05/rechecks/new-after
node evals/real/chess-selection-2026-10-14/verify-in-game.mjs new-selection-run
```

승급 검사기는 `source.json`에 있는 과거 소스 두 개의 해시도 확인합니다. `--expect-broken`에는 원본을, 이후 변형에는 제공된 수리 패치를 사용합니다. 선택 검사기는 자체 loopback 서버를 시작하며 5236 포트가 열려 있다고 가정하지 않습니다. getter·선택자 누락, 자료 변경, 시작 실패는 재실행 실패·차단이며 새 게임 결함 진단이 아닙니다. 새 출력 폴더가 필수이고 JSON·캡처는 배타적으로 생성합니다. 실패한 실행도 진단을 위해 보관하세요. 선택 수집기는 상태·버튼 필드를 남기고 더미 게스트를 사용하며 알려진 계정·채팅 영역을 마스킹합니다. 다른 장면에 적용하려면 선택자와 캡처 범위를 검토해야 합니다.

`--expect-broken`은 두 화면 크기에서 정확한 중복·오래된 콜백 패턴과 별도 reduced-motion 패턴을 요구합니다. 콜백 누락이나 예상 밖 선택은 실패합니다. 선택 결과는 `hasLayoutBox`, 조상 투명도·가시성을 포함한 `cssVisible`, 경계 상자의 `intersectsViewport`, 브라우저의 `clippedViewportRatio`를 구분합니다. 이 값만으로 가독성·다른 요소에 의한 가림·조작 가능성을 입증하지 않습니다. 캡처와 실제 포인터·터치 결과도 확인하세요. [재검토 v2와 재실행 기록](review-v2-2026-11-06/report.ko.md)을 참고하세요.

## 에이전트 비교

```sh
node evals/prepare-comparison.mjs coherence /new/comparison-directory
```

`coherence`, `ui`, `supplemental`, `safety` 중 하나를 선택합니다. 명령은 generic·brief·full 입력을 고정하고 full에만 실행 지침을 주며, 채점 기준·과거 결과를 제외하고 해시와 빈 측정 필드를 기록합니다. 에이전트는 시작하지 않습니다. [비교 절차](README.ko.md), 호스트·프로젝트의 위임 규칙과 기존 권한을 따르세요. 각 새 세션에는 해당 폴더만 제공합니다. 채점 전에 원문 답변과 도구 기록을 보존합니다. 노출되지 않은 모델 ID·토큰·시간·수리 성공은 추정하지 말고 null과 이유를 남깁니다.

해로운 변경, 놓친 결함, 불필요한 질문·읽기, 실제 과제 성공, 토큰, 시간은 각각 측정합니다. 텍스트 자료만으로 구현 성공을 입증할 수 없습니다. 작성한 판단 예시와 미지의 소스·영상 과제·사람 검토를 구분합니다. 자료 준비나 재독은 완료된 비교가 아닙니다. [당시 보고서](security-quality-2026-11-06/report.ko.md)에 실제 실행한 범위를 기록했습니다.

이후 [실제 수정 실험](runs/2026-11-06-repair-comparison/report.ko.md)은 소스 수정, 고정된 브라우저 채점, 원문 사용량과 별도 시각 판정 보정을 포함합니다. `repair-comparison/`은 그 실험의 스크립트이며 `npm test`가 실행하지 않습니다. 준비·실행기가 날짜별 경로를 참조하므로 새 실험에는 새 비공개·공개 경로와 새 고정 입력이 필요합니다. 기존 기록을 덮어쓰지 마세요. 작업자 패치와 검사 스크립트는 증거이며 게임 변경에 대한 자동 승인이 아닙니다.
