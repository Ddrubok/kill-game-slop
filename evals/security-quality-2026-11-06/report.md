# 보안·품질 검토 반영 — 2026-11-06

후속: 사용자의 비교 요청으로 [독립 세션 비교](../runs/2026-11-06-comparison-utf8/report.md)를 실행했다. C·U/V·안전 26개 사례에서 일반·짧은·전체 조건이 모두 기준을 충족했으며 전체 조건의 정확도 우위는 확인되지 않았다. 아래 NOT RUN 표기는 그 요청 전 작업 시점의 기록이다. 사람 평가·실제 수정 비교·별도 handoff 묶음은 여전히 미실행이다.

검토 기준 `4301ce7341c9e816578bc627eca97fb3372bbd9a`에서 로컬 수정했다. 현재 스킬은 [9개 파일의 LF 정규화 SHA-256](snapshot.json)으로 식별한다. 원본 게임 저장소는 수정하지 않고, `974cb39bcc716815aee79117f4f710b367454050`의 `web/`를 별도 추출하여 검사했다. 승급 수리 패치는 그 복사본에만 적용했다.

## 지적 사항별 처리

| 항목 | 반영 및 실제 확인 | 남은 범위 |
| --- | --- | --- |
| F01 통신 정책 | 두 검사기에 공통 BrowserContext 정책 적용. 정확한 로컬 origin만 허용, 모든 WS/WSS·Service Worker·HTTP 리디렉션 차단. 로컬 HTTP/HTTPS 서버와 브라우저로 정상 요청·다른 포트/호스트·팝업·리디렉션·소켓을 검사 | 브라우저 요청 라우팅이며 Node·Vite·OS 격리가 아님. 실제 외부 유출이 있었음을 뜻하지 않음 |
| F02 증거 덮어쓰기 | 기존 출력 폴더는 브라우저 시작 전 실패. JSON과 PNG 모두 배타적 생성. 동시 폴더 생성, JSON 재저장, 캡처 재저장 및 실제 승급 실행기 경로 재사용 거부 검사 통과 | 과거 증거 71개 내용 보존 확인 |
| H01 자료 속 명령 | 소스 주석·로그·UI·캡처·문서에 섞인 지시를 실행 권한으로 취급하지 않는 규칙과 낯선 test/build 스크립트 확인 추가 | 가짜 로그·이미지 전사·소스 지시를 포함한 입력 준비. 새 에이전트의 실제 방어 행동 평가는 NOT RUN |
| H02 범위·민감정보 | 로컬/테스트 환경 우선, 기존 권한 존중, 실결제·공개 게시·운영 보상 변경과 리뷰 권한 구분. 전체 DOM 텍스트 및 자유 형식 피드백 수집 제거. 필요한 상태·버튼 필드만 기록 | 더미 계정·토큰·채팅이 JSON에 없고 캡처의 지정 영역이 불투명하게 마스킹됨을 실제 브라우저 검사. 다른 게임의 개인정보 요소는 별도 확인 필요 |
| Q01 최신 행동 평가 | 두 실제 게임 검사기를 재실행하고 체스 첫 실행 연습/메뉴 진입 경로 수정 | C·U/V·handoff의 새 독립 에이전트 평가와 사람 평가는 미실행. 검사기의 성공과 스킬의 진단 능력은 별개 |
| Q02 추가 가치·비용 | 일반/짧은/전체 조건에 동일 입력을 복사하고 full에만 스킬을 포함하는 준비 명령 추가. 정답·이전 응답 제외, 해시·모델·토큰·시간·불필요한 읽기/질문·위험한 수정 필드를 분리 | 비교는 PREPARED_NOT_RUN. 새 정확도·속도·비용 우위 주장 없음 |
| Q03 반복 검증 | 정적 검사, 브라우저/출력 회귀 검사, 소스·Vite·Playwright 사전 점검, 실제 게임 검사, 비교 자료 준비를 별도 명령으로 제공 | 설치용 스킬은 텍스트/메타데이터/라이선스 9개 유지. 유지보수 의존성은 evals에만 있음 |

## 실행 결과

- `npm test --prefix evals`: 6개 테스트 통과. Node 22.18.0, Playwright 1.62.1, Chromium 151.0.7922.34, Windows. 정확한 origin·HTTP/HTTPS·다른 loopback 포트와 host·팝업·리디렉션·WS/WSS·Service Worker, JSON 최소 수집·마스킹 픽셀·파일 보존·비교 입력 분리·소스/Vite 버전 변경 거부를 확인했다.
- 브라우저 정책 검사에서 거부 서버의 HTTP/HTTPS 요청과 WebSocket upgrade 수는 0이었다. 초기 Edge 156 실행은 팝업의 추측성 TCP 연결 1회를 관측했다. 최종 Chromium 실행에서는 0회였지만, TCP/DNS/WebRTC 및 Node 통신 차단을 보장하지 않는다. 로그에 이 한계를 명시했고 과도한 `externalNetwork: blocked` 표기를 제거했다.
- 승급 모달: [원본 결과](evidence/promotion-before/results.json)는 두 화면에서 기존 결함을 재현하며 `fixed:false`, `--expect-broken` 검사 통과. [수리 후 결과](evidence/promotion-after/results.json)는 `fixed:true`; 한 번만 선택 전달, 이전 모달의 지연 콜백 차단, 현재 선택 유지, reduced-motion 정적 표시와 원래 120 ms 콜백을 확인했다. 360·960px 실제 마우스 이벤트를 사용했고, reduced-motion 캡처만 합성 시계를 사용했다.
- 체스 선택: [실행 결과](evidence/selection/results.json)에서 360×800·320×568 터치 에뮬레이션과 1280×800 마우스의 3조건 모두 통과. 미선택→선택→타점→조준→재선택→해제→메뉴/재진입, 총 21개 캡처와 상태 단언을 남겼다. 실제 표시된 연습 건너뛰기/메뉴 버튼을 눌렀으며 상태·선택·시계를 주입하지 않았다. 관찰용 getter만 응답에 삽입했다.
- 제한된 시각 확인: [360px 선택](evidence/selection/360-selected.png)과 [승급 reduced-motion 선택](evidence/promotion-after/360-selected-reduced.png)을 직접 열어 확인했다. 모든 캡처를 시각적으로 검토했다고 주장하지 않는다.
- 스킬 `quick_validate.py` 통과. [정적 검사 결과](validation.json)는 문법·로컬 링크·JSON·스냅샷 검사를 별도로 기록한다. [과거 자료 71개](historical-artifacts.json)는 PNG 원본 바이트, 텍스트 LF 정규화 내용이 기준 커밋과 동일했다.

초기 체스 실행은 실패했다. [시도 1](evidence/selection-attempt-01.json)은 승급 구성요소용 export의 빠진 진입 스크립트/자산 때문이었다. 완전한 게임 소스를 추출한 [시도 2](evidence/selection-attempt-02.json), [시도 3](evidence/selection-attempt-03.json), [시도 4](evidence/selection-attempt-04.json)는 예전 게스트 폼/프로필 ID를 기다렸다. 실제 화면에서 첫 실행 연습 장면과 변경된 메뉴를 확인하고, 보이는 연습 건너뛰기 및 2인 대전 컨트롤을 사용하는 것으로 수정한 다음 성공했다. 과거 결과로 새 실행 실패를 대체하지 않았다.

## 평가 상태와 재현

[재실행 명령](../MAINTENANCE.md), [검증 코드](../tests/browser.test.mjs), [증거 해시](evidence-hashes.json)를 함께 보관한다. 준비된 C·U·V·안전 입력의 조건별 파일 해시는 각각 [C](coherence-prepared-manifest.json), [U](ui-prepared-manifest.json), [V](supplemental-prepared-manifest.json), [안전](safety-prepared-manifest.json)에 있다. 새 에이전트의 원문 답변·모델 ID·토큰·시간·판정은 없으며 null/NOT_RUN으로 남겼다. 준비 명령은 에이전트를 시작하지 않는다.

이 저장소의 상위 `C:/Users/DooBokWie/orca/projects/Default/AGENTS.md`는 Astra 단독 작업을 지정하고 별도 요청 없이는 작업자/하위 에이전트를 시작하지 않도록 한다. 따라서 이번에는 독립 에이전트 비교를 실행하지 않았다. 작성자의 사례 재독이나 정적 검사로 그 공백을 채우지 않았다. 향후 허용된 새 세션의 동일 조건 비교와 별도 실제 소스/영상 과제, 사람의 일부 결과 검토가 필요하다.

새 규칙의 행동 효과, 네이티브 엔진, 실제 모바일 기기, 오디오/햅틱, 온라인 매치, 사람의 이해·선호·재미는 검증하지 않았다. 이번 확인 범위는 지침 보강, 유지보수 코드의 회귀 검사와 명시한 로컬 게임 경로다.
